import React from 'react';
import { Paper, Typography, Grid, TextField, FormControl, FormLabel, Select, MenuItem, Switch, FormControlLabel } from '@mui/material';

const ConversationTemplates = () => (
  <Paper elevation={3} sx={{ p: 3, m: 3 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Conversation Templates</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}><FormLabel>Template Name</FormLabel><TextField fullWidth /></Grid>
      <Grid item xs={12} md={4}><FormLabel>Type</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Trigger Event</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Language</FormLabel><FormControl fullWidth><Select displayEmpty /></FormControl></Grid>
      <Grid item xs={12} md={4}><FormLabel>Last Updated Date</FormLabel><TextField fullWidth type="date" /></Grid>
      <Grid item xs={12} md={8}><FormLabel>Script/Message</FormLabel><TextField fullWidth multiline rows={2} /></Grid>
      <Grid item xs={12} md={4}><FormControlLabel control={<Switch />} label="Active" /></Grid>
    </Grid>
  </Paper>
);

export default ConversationTemplates; 