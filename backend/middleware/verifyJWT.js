import jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).send("Forbidden");
    req.user = decoded;
    next();
  });
}

export default verifyJWT;
