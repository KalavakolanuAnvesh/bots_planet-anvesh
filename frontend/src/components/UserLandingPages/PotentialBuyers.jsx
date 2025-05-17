import React from 'react';
import { Paper, Typography, Grid, TextField, FormControl, FormLabel, Select } from '@mui/material';

const PotentialBuyers = () => (
  <Paper elevation={3} sx={{ p: 3, m: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Potential Buyers</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}><FormLabel>Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Company Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Email</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Budget</FormLabel><TextField fullWidth type="number" /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Timeline to Purchase</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Product Need/Fit</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Decision Maker</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Requested Demo</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Purchase Readiness</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
    </Grid>
  </Paper>
);

export default PotentialBuyers; 