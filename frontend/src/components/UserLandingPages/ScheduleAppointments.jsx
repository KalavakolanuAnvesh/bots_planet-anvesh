import React from 'react';
import { Paper, Typography, Grid, TextField, FormControl, FormLabel, Select } from '@mui/material';

const ScheduleAppointments = () => (
  <Paper elevation={3} sx={{ p: 3, m: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Schedule Appointments</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}><FormLabel>Customer Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Product/Service</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Preferred Date</FormLabel><TextField fullWidth type="date" /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Preferred Time</FormLabel><TextField fullWidth type="time" /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Meeting Type</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Duration (minutes)</FormLabel><TextField fullWidth type="number" /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Location/Meeting Link</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={8}><FormLabel>Notes</FormLabel><TextField fullWidth multiline rows={2} /></Grid>
    </Grid>
  </Paper>
);

export default ScheduleAppointments; 