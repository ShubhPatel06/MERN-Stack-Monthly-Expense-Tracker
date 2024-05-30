// import Joi from "joi";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";

export const signup = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(200).email().required(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send("User with that email already exists!");
    }

    const { username, email, password } = req.body;

    user = new User({
      username,
      email,
      password,
    });

    user.password = bcrypt.hashSync(user.password, 10);

    await user.save();

    res.status(201).json("User created successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const signin = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().min(3).max(200).email().required(),
    password: Joi.string().min(6).max(200).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send("User does not exist!");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid Password!");
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        _id: decoded.id,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { id: foundUser._id, username: foundUser.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

export const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json("User has been logged out!");
};
