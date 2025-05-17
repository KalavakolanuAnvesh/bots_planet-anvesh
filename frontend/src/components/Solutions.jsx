import React from "react";
import "../styles/Solutions.css";
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const Solutions = () => {
  return (
    <Box className="solutions">
      <Typography variant="h3" className="solutions-title">
        Our Solutions
      </Typography>
      <Typography variant="h6" className="solutions-subtitle">
        Discover how our bots can transform your business
      </Typography>

      <Grid container spacing={4} className="solutions-grid">
        <Grid item xs={12} md={6}>
          <Card className="solution-card">
            <CardContent>
              <Typography variant="h4" className="solution-title">Sales Automation</Typography>
              <Typography variant="body1" className="solution-description">
                Automate your sales process with intelligent bots that qualify leads, schedule meetings, and close deals.
              </Typography>
              <ul className="solution-features">
                <li>Lead Qualification</li>
                <li>Meeting Scheduling</li>
                <li>Follow-up Automation</li>
                <li>Sales Analytics</li>
              </ul>
              <Button variant="contained" className="solution-button">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="solution-card">
            <CardContent>
              <Typography variant="h4" className="solution-title">Customer Support</Typography>
              <Typography variant="body1" className="solution-description">
                Provide 24/7 customer support with AI-powered bots that understand and resolve customer queries instantly.
              </Typography>
              <ul className="solution-features">
                <li>24/7 Support</li>
                <li>Instant Responses</li>
                <li>Ticket Management</li>
                <li>Customer Analytics</li>
              </ul>
              <Button variant="contained" className="solution-button">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="solution-card">
            <CardContent>
              <Typography variant="h4" className="solution-title">Marketing Automation</Typography>
              <Typography variant="body1" className="solution-description">
                Streamline your marketing efforts with bots that engage prospects and nurture leads through the sales funnel.
              </Typography>
              <ul className="solution-features">
                <li>Campaign Automation</li>
                <li>Lead Nurturing</li>
                <li>Content Distribution</li>
                <li>ROI Tracking</li>
              </ul>
              <Button variant="contained" className="solution-button">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="solution-card">
            <CardContent>
              <Typography variant="h4" className="solution-title">HR & Recruitment</Typography>
              <Typography variant="body1" className="solution-description">
                Simplify your HR processes with bots that handle recruitment, onboarding, and employee engagement.
              </Typography>
              <ul className="solution-features">
                <li>Candidate Screening</li>
                <li>Interview Scheduling</li>
                <li>Onboarding Automation</li>
                <li>Employee Engagement</li>
              </ul>
              <Button variant="contained" className="solution-button">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Solutions;

