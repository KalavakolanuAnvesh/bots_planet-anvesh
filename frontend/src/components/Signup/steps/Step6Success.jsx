import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios'

const Step6Success = ({ data }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const didRunRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (didRunRef.current) return;        // <-- prevent 2nd run in StrictMode
    didRunRef.current = true;
        
    const completeSignup = async () => {
      try {
        const registrationData = {
          adminName: data.adminName,
          orgName: data.orgName,
          industry: data.industry,
          orgSize: data.companySize,
          location: data.location,
          adminEmail: data.corporateEmail,
          password: data.password
        }
        
        // Register the user
        const response = await axios.post('http://localhost:5000/api/auth/register', registrationData);
        console.log('Registration response:', response.data);

        // Wait a moment before attempting login
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Log the user in
        await login(registrationData.adminEmail, registrationData.password);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Signup failed:', error);
        let errorMessage = 'Failed to complete registration. ';
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage += error.response.data?.message || 'Please try again.';
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage += error.message || 'Please try again.';
        }
        
        setError(errorMessage);
      }
    };

    completeSignup();
  }, [data, login, navigate]);

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Completing Your Registration
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 2 }}>
        Please wait while we set up your account...
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Step6Success; 