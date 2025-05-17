import React from "react";
import "../styles/LandingPage.css";
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing">
      <Box className="hero-section">
        <Typography variant="h1" className="hero-title">
          Transform Your Business with AI-Powered Bots
        </Typography>
        <Typography variant="h5" className="hero-subtitle">
          Automate your sales, marketing, and customer support with intelligent bots that drive growth and efficiency.
        </Typography>
        <Box className="hero-buttons">
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            className="primary-button"
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/solutions"
            variant="outlined"
            className="secondary-button"
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Box className="features-section">
        <Typography variant="h3" className="section-title">
          Why Choose Bots Planet?
        </Typography>
        <Grid container spacing={4} className="features">
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <Typography variant="h4" className="feature-title">Intelligent Automation</Typography>
                <Typography variant="body1" className="feature-description">
                  Our AI-powered bots understand context, learn from interactions, and provide personalized responses to drive better results.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <Typography variant="h4" className="feature-title">Seamless Integration</Typography>
                <Typography variant="body1" className="feature-description">
                  Easily integrate our bots with your existing tools and platforms to create a unified workflow.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="feature-card">
              <CardContent>
                <Typography variant="h4" className="feature-title">Advanced Analytics</Typography>
                <Typography variant="body1" className="feature-description">
                  Get detailed insights and reports to optimize your bot performance and make data-driven decisions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box className="cta-section">
        <Typography variant="h3" className="cta-title">
          Ready to Transform Your Business?
        </Typography>
        <Typography variant="h6" className="cta-subtitle">
          Join thousands of businesses already using Bots Planet to drive growth and efficiency.
        </Typography>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          className="cta-button"
        >
          Start Your Free Trial
        </Button>
      </Box>
    </div>
  );
};

export default LandingPage;
