import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
 
const Step2AdminProfile = ({ onNext, onBack, data }) => {
  const [form, setForm] = useState({
    adminName: data.adminName || '',
    role: data.role || '',
    corporateEmail: data.corporateEmail || '',
    password: data.password || '',
    confirmPassword: data.confirmPassword || '',
  });
  const [error, setError] = useState('');
 
  const validatePassword = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
   
    return hasSpecialChar && hasNumber && hasCapital && hasMinLength;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.adminName || !form.role || !form.corporateEmail || !form.password || !form.confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
 
    if (!validatePassword(form.password)) {
      setError('Password must contain at least one special character, one number, one capital letter, and be at least 8 characters long.');
      return;
    }
 
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
 
    setError('');
    onNext(form);
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Admin Profile Setup</Typography>
      <TextField
        label="Admin Name"
        name="adminName"
        value={form.adminName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Role/Title"
        name="role"
        value={form.role}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Corporate Email"
        name="corporateEmail"
        type="email"
        value={form.corporateEmail}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        helperText="Must contain at least one special character, one number, one capital letter, and be at least 8 characters long"
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </form>
  );
};
 
export default Step2AdminProfile;