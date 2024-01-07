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
import { useCreateUserMutation } from "./api/usersapi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUserEmail } from "./api/userSlice";

// Signup component
const Signup = () => {
  // Redux hooks
  const dispatch = useDispatch();

  // Next.js router hook
  const router = useRouter();

  // Form state and error handling
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // API hooks
  const [createUser] = useCreateUserMutation();

  // State to track whether the success notification has been shown
  const [notificationShown, setNotificationShown] = useState(false);

  // Toast functions
  const successful = () => toast("SignUp Successful!");
  const failed = () => toast.error("Please check your credentials.");

  // Validation function for email format
  const validateEmail = (inputEmail) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(inputEmail);
  };

  // Reset form and error states
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
  };

  // Handle the signup process
  const handleSignup = async () => {
    // Your existing form validation logic
    if (formData.firstName.trim() === "") {
      setFirstNameError(true);
      return;
    }

    if (formData.lastName.trim() === "") {
      setLastNameError(true);
      return;
    }

    if (formData.email.trim() === "" || !validateEmail(formData.email)) {
      setEmailError(true);
      return;
    }

    if (formData.password.trim().length < 6) {
      setPasswordError(true);
      return;
    }

    try {
      // API call to create a user
      await createUser(formData);

      // Dispatch the user email to Redux store
      dispatch(setUserEmail(formData.email));

      // Show success toast only if it hasn't been shown before
      if (!notificationShown) {
        successful();
        setNotificationShown(true);
      }

      // Reset form and navigate to the notes page
      resetForm();
      router.push("/notes");
    } catch (error) {
      // Show error toast and log the error
      failed();
      console.error("Signup failed:", error);
      // Handle the error 
    }
  };

  // Render the component
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '97vh',
        backgroundImage: 'url("/sticky.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <ToastContainer />
      <Paper
        elevation={5}
        style={{ padding: "20px", width: 500,height:"90%", textAlign: "center",borderTop:"5px solid #e74c3c" }}
      >
        <Typography variant="h4" sx={{ mt: 1, color: "#e74c3c", fontWeight:"bold"}}>
          STICKY
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: "#e74c3c" }}>
           Sign Up
        </Typography>
        {/* Textfield for First Name */}
        <TextField
          required
          label="First Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.firstName}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              firstName: e.target.value,
            }));
            setFirstNameError(false);
          }}
          error={firstNameError}
          helperText={firstNameError ? "First Name is required" : ""}
        />
        {/* Textfield for Last Name */}
        <TextField
          required
          label="Last Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.lastName}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              lastName: e.target.value,
            }));
            setLastNameError(false);
          }}
          error={lastNameError}
          helperText={lastNameError ? "Last Name is required" : ""}
        />
        {/* Textfield for Email */}
        <TextField
          required
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              email: e.target.value,
            }));
            setEmailError(false);
          }}
          error={emailError}
          helperText={emailError ? "Enter a valid email address" : ""}
        />
        {/* Textfield for Password */}
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              password: e.target.value,
            }));
            setPasswordError(false);
          }}
          error={passwordError}
          helperText={
            passwordError ? "Password must be at least 6 characters" : ""
          }
        />
        {/* Signup Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          style={{ marginTop: "10px", width: "50%" }}
        >
          Signup
        </Button>
        {/* Login Link */}
        <Typography variant="body2" sx={{ marginTop: "10px" }}>
          Already have an account? <Link href="/">Login</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Signup;
