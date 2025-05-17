import React from 'react';
import { Paper, Typography, Grid, TextField, FormControl, FormLabel, Select } from '@mui/material';

const PotentialCustomers = () => (
  <Paper elevation={3} sx={{ p: 3, m: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Potential Customers</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}><FormLabel>Contact Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Company Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Email</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Contact Method</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Product Page Visited</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Time Spent on Site (min)</FormLabel><TextField fullWidth type="number" /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Interest Level</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Engagement Channel</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Last Contact Date</FormLabel><TextField fullWidth type="date" /></Grid>
    </Grid>
  </Paper>
);

export default PotentialCustomers; 