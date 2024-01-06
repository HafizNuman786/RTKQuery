import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import { useGetUsersQuery } from "./api/usersapi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUserEmail } from "./api/userSlice";

// LoginPage component
const LoginPage = () => {
  // Redux hooks
  const dispatch = useDispatch();

  // Local state for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Local state for email and password errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Next.js router hook
  const router = useRouter();

  // Query hook for fetching users
  const { isLoading, isError, isSuccess, data, error } = useGetUsersQuery();

  // Function to validate email format
  const validateEmail = (inputEmail) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(inputEmail);
  };

  // Toast functions
  const successful = () => toast("Login successful!");
  const failed = () => toast.error("Please check your credentials.");

  // Function to handle login
  const handleLogin = () => {
    // Basic form validation
    if (email.trim() === "" || !validateEmail(email) || password.trim().length < 6) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }

    // Check loading state
    if (isLoading) {
      return; // Handle loading state
    }

    // Check for errors during data fetching
    if (isError) {
      toast.error(`Error: ${error.message}`); // Handle error state
      return;
    }

    // Check if data fetching is successful
    if (isSuccess) {
      // Find user with the provided email
      const userWithEmail = data.find((user) => user.email === email);
      
      // Dispatch user email to Redux store
      dispatch(setUserEmail(email));

      // If user with email not found
      if (!userWithEmail) {
        toast.error("User with this email not found"); // Handle user not found
        return;
      }

      // Validate password
      const isValidPassword = userWithEmail.password === password;

      if (isValidPassword) {
        // Reset form, clear errors, navigate to notes page, and show success toast
        setEmail("");
        setPassword("");
        setEmailError(false);
        setPasswordError(false);
        router.push("/notes");
        successful(); // Show success toast
      } else {
        setPasswordError(true);
        failed(); // Show failed login toast
      }
    }
  };

  // Render the component
  return (
    <Grid
      sx={{
        height: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <ToastContainer />
      <Paper
        elevation={5}
        style={{ padding: "20px", width: 600, textAlign: "center" }}
      >
        <Typography variant="h6" sx={{ mt: 2, color: "#2196F3" }}>
          RTK APP Login
        </Typography>
        {/* Textfield for Email */}
        <TextField
          sx={{ width: "70%" }}
          required
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(false);
          }}
          error={emailError}
          helperText={emailError ? "Enter a valid email address" : ""}
        />
        {/* Textfield for Password */}
        <TextField
          sx={{ width: "70%" }}
          required
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          error={passwordError}
          helperText={
            passwordError ? "Password must be at least 6 characters" : ""
          }
        />
        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginTop: "20px", width: "50%" }}
        >
          Login
        </Button>
        {/* Signup Link */}
        <Typography variant="body1" sx={{ marginTop: "10px" }}>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
