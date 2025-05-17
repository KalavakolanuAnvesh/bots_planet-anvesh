import React from 'react';
import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';

const Step4Preview = ({ onNext, onBack, data }) => {
  const { orgName, industry, companySize, location } = data;
  const { adminName, role, corporateEmail } = data;
  const { selectedBots, botQuantities } = data;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Preview of Entered Data</Typography>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Organization Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Organization Name:</strong> {orgName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Industry:</strong> {industry}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Company Size:</strong> {companySize}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Location:</strong> {location}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Admin Profile Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Admin Name:</strong> {adminName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Role/Title:</strong> {role}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Corporate Email:</strong> {corporateEmail}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Selected Bots</Typography>
        {selectedBots && selectedBots.length > 0 ? (
          selectedBots.map((bot) => (
            <Box key={bot} mb={1}>
              <Typography variant="body2"><strong>{bot}</strong> - Quantity: {botQuantities[bot] || 1}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No bots selected.</Typography>
        )}
      </Paper>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" color="primary" onClick={onNext}>Proceed to Payment</Button>
      </Box>
    </Box>
  );
};

export default Step4Preview; 