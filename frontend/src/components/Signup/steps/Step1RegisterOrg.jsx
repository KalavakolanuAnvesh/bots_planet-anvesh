import React, { useState } from 'react';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
 
const industries = ['Technology', 'Finance', 'Healthcare', 'Education'];
const companySizes = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
const locations = ['USA', 'UK', 'India', 'Germany'];
 
const Step1RegisterOrg = ({ onNext, data }) => {
  const [form, setForm] = useState({
    orgName: data.orgName || '',
    industry: data.industry || '',
    companySize: data.companySize || '',
    location: data.location || '',
    terms: false,
  });
  const [error, setError] = useState('');
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.orgName || !form.industry || !form.companySize || !form.location || !form.terms) {
      setError('Please fill all fields and agree to the terms.');
      return;
    }
    setError('');
    onNext(form);
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Register your Organization</Typography>
      <TextField
        label="Organization Name"
        name="orgName"
        value={form.orgName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label="Industry"
        name="industry"
        value={form.industry}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {industries.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Company Size"
        name="companySize"
        value={form.companySize}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {companySizes.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {locations.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={<Checkbox name="terms" checked={form.terms} onChange={handleChange} />}
        label="I agree to the Terms & Conditions"
      />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Continue
        </Button>
      </Box>
    </form>
  );
};
 
export default Step1RegisterOrg;