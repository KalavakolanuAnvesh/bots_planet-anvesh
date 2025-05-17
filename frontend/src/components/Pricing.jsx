import React from "react";
import "../styles/Pricing.css";
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const Pricing = () => {
  return (
    <Box className="pricing">
      <Typography variant="h3" className="pricing-title">
        Our Pricing Plans
      </Typography>
      <Typography variant="h6" className="pricing-subtitle">
        Choose the perfect plan for your business
      </Typography>

      <Grid container spacing={4} className="pricing-cards">
        <Grid item xs={12} md={4}>
          <Card className="pricing-card">
            <CardContent>
              <Typography variant="h4" className="plan-title">Starter</Typography>
              <Typography variant="h3" className="plan-price">$9<small>/month</small></Typography>
              <ul className="plan-features">
                <li>1 Sales Bot</li>
                <li>Email Support</li>
                <li>Basic Analytics</li>
                <li>5,000 Messages/Month</li>
                <li>Basic Customization</li>
              </ul>
              <Button variant="contained" className="plan-button">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="pricing-card featured">
            <CardContent>
              <Typography variant="h4" className="plan-title">Professional</Typography>
              <Typography variant="h3" className="plan-price">$29<small>/month</small></Typography>
              <ul className="plan-features">
                <li>5 Sales Bots</li>
                <li>Priority Support</li>
                <li>Advanced Analytics</li>
                <li>20,000 Messages/Month</li>
                <li>Full Customization</li>
              </ul>
              <Button variant="contained" className="plan-button">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="pricing-card">
            <CardContent>
              <Typography variant="h4" className="plan-title">Enterprise</Typography>
              <Typography variant="h3" className="plan-price">Custom</Typography>
              <ul className="plan-features">
                <li>Unlimited Bots</li>
                <li>Dedicated Manager</li>
                <li>Custom Integrations</li>
                <li>Unlimited Messages</li>
                <li>White Label Option</li>
              </ul>
              <Button variant="contained" className="plan-button">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Pricing;
