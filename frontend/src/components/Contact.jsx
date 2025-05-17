import React from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, TextField, Button, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../styles/Contact.css';

const Contact = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields');
      return;
    }
    // Simulate form submission
    setSuccess('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
    setError('');
  };

  return (
    <Box className="contact-page">
      <Typography variant="h3" className="contact-title">
        Contact Us
      </Typography>
      <Typography variant="h6" className="contact-subtitle">
        Get in touch with our team
      </Typography>

      <Grid container spacing={4} className="contact-grid">
        <Grid item xs={12} md={3}>
          <Card className="contact-card">
            <CardContent>
              <IconButton className="contact-icon">
                <EmailIcon />
              </IconButton>
              <Typography variant="h6">Email Us</Typography>
              <Typography variant="body1">support@botsplanet.com</Typography>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                href="mailto:support@botsplanet.com"
                className="contact-button"
              >
                Send Email
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="contact-card">
            <CardContent>
              <IconButton className="contact-icon">
                <PhoneIcon />
              </IconButton>
              <Typography variant="h6">Call Us</Typography>
              <Typography variant="body1">+1 (555) 123-4567</Typography>
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                href="tel:+15551234567"
                className="contact-button"
              >
                Call Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="contact-card">
            <CardContent>
              <IconButton className="contact-icon">
                <LocationOnIcon />
              </IconButton>
              <Typography variant="h6">Visit Us</Typography>
              <Typography variant="body1">
                123 Innovation Drive<br />
                Tech City, TC 12345<br />
                United States
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                href="https://maps.google.com"
                target="_blank"
                className="contact-button"
              >
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="contact-card">
            <CardContent>
              <IconButton className="contact-icon">
                <LinkedInIcon />
              </IconButton>
              <Typography variant="h6">Follow Us</Typography>
              <Typography variant="body1">Connect on LinkedIn</Typography>
              <Button
                variant="outlined"
                startIcon={<LinkedInIcon />}
                href="https://linkedin.com/company/botsplanet"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button"
              >
                Connect
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="contact-form-container">
        <Typography variant="h4" className="form-title">
          Send us a Message
        </Typography>
        <form onSubmit={handleSubmit} className="contact-form">
          <TextField
            label="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Your Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Your Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            className="submit-button"
            fullWidth
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Contact;
