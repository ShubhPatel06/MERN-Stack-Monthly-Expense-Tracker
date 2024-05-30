import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { blue } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignupMutation } from "../../redux/api/authApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [signup, { isLoading, isSuccess, isError, error }] =
    useSignupMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Created");
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/signin");
    }

    if (isError) {
      toast.error(error?.data);
    }
  }, [isSuccess, isError, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(formData);
    } catch (error) {
      toast.error(error?.data);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: blue[600] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username "
            name="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <PulseLoader color="#fff" /> : "Sign Up"}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to="/signin" style={{ color: blue[600] }}>
              <Typography sx={{ "&:hover": { textDecoration: "underline" } }}>
                Already have an account? Sign In
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
