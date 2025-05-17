import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import ReCAPTCHA from "react-google-recaptcha";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState("");  // Changed for consistency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!captchaValue) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetIdentifier) {
      setError("Please enter your Email or User ID.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Password reset instructions sent! (Demo)");
      setShowForgotPassword(false);
      setResetIdentifier("");
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      <Paper elevation={3} className="login-form">
        {!showForgotPassword ? (
          <>
            <Typography variant="h4" className="login-title">
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
              Sign in to continue to Bots Planet
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address or User ID"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                className="login-input"
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                className="login-input"
              />
              <Box className="captcha-container">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={(value) => setCaptchaValue(value)}
                />
              </Box>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="login-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
              <Box mt={2} textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setShowForgotPassword(true)}
                  className="forgot-password-link"
                >
                  Forgot Password?
                </Link>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{" "}
                  <Link component={RouterLink} to="/signup" className="signup-link">
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h4" className="login-title">
              Reset Password
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
              Enter your Email or User ID to receive reset instructions
            </Typography>
            <form onSubmit={handleForgotPassword}>
              <TextField
                label="Email Address or User ID"
                value={resetIdentifier}
                onChange={(e) => setResetIdentifier(e.target.value)}
                fullWidth
                margin="normal"
                required
                className="login-input"
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="login-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Send Reset Instructions"}
              </Button>
              <Box mt={2} textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setShowForgotPassword(false)}
                  className="back-to-login-link"
                >
                  Back to Login
                </Link>
              </Box>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Login;
