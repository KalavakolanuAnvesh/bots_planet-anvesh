import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Radio, RadioGroup, Alert, Card, CardContent, Grid } from '@mui/material';
 
const paymentOptions = [
  { key: 'debit', label: 'Debit Card' },
  { key: 'credit', label: 'Credit Card' },
];
 
const Step5Payment = ({ onNext, onBack, data }) => {
  const [billing, setBilling] = useState(data.billing || 'monthly');
  const [autoRenew, setAutoRenew] = useState(data.autoRenew || false);
  const [paymentType, setPaymentType] = useState('debit');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
 
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };
 
  const validateCard = () => {
    const cardNumberValid = /^\d{16}$/.test(card.number.replace(/\s/g, ''));
    const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.expiry);
    const cvvValid = /^\d{3}$/.test(card.cvv);
    return cardNumberValid && expiryValid && cvvValid;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCard()) {
      setError('Please enter valid card details.');
      return;
    }
    setError('');
    onNext({ billing, autoRenew, paymentType, card });
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>Payment / Subscription</Typography>
      <RadioGroup
        row
        value={billing}
        onChange={(e) => setBilling(e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
        <FormControlLabel value="annual" control={<Radio />} label="Annual" />
      </RadioGroup>
      <FormControlLabel
        control={<Switch checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} />}
        label="Enable auto-renew"
        sx={{ mb: 2 }}
      />
      <Typography variant="subtitle2" gutterBottom>Payment Method</Typography>
      <Grid container spacing={2} mb={2}>
        {paymentOptions.map((option) => (
          <Grid item xs={6} key={option.key}>
            <Card
              variant={paymentType === option.key ? 'elevation' : 'outlined'}
              sx={{ cursor: 'pointer', borderColor: paymentType === option.key ? 'primary.main' : 'grey.300', boxShadow: paymentType === option.key ? 4 : 0 }}
              onClick={() => setPaymentType(option.key)}
            >
              <CardContent>
                <Typography variant="subtitle1" align="center">{option.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mb={2}>
        <TextField
          label="Card Number"
          name="number"
          value={card.number}
          onChange={handleCardChange}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 16 }}
          placeholder="1234 5678 9012 3456"
        />
        <Box display="flex" gap={2}>
          <TextField
            label="Expiry (MM/YY)"
            name="expiry"
            value={card.expiry}
            onChange={handleCardChange}
            margin="normal"
            inputProps={{ maxLength: 5 }}
            placeholder="MM/YY"
            sx={{ flex: 1 }}
          />
          <TextField
            label="CVV"
            name="cvv"
            value={card.cvv}
            onChange={handleCardChange}
            margin="normal"
            inputProps={{ maxLength: 3 }}
            placeholder="123"
            sx={{ flex: 1 }}
            type="password"
          />
        </Box>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button type="submit" variant="contained" color="primary">Pay & Subscribe</Button>
      </Box>
    </form>
  );
};
 
export default Step5Payment;