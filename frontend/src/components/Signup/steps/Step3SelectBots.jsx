import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Checkbox, FormControlLabel, Alert, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const apiToDashboardKey = {
  "BOT-1G09": "sales",                // Inside Sales Bot
  "BOT-GSY3": "content",              // Content Creation Bot
  "BOT-456T": "marketing"             // Marketing Bot
};

const Step3SelectBots = ({ onNext, onBack, data }) => {
    const [bots, setBots] = useState([]);
    const [selected, setSelected] = useState(data.selectedBots || []);
    const [quantities, setQuantities] = useState(data.botQuantities || {});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBots = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bots');
                setBots(response.data);
            } catch (error) {
                console.error('Error fetching bots:', error);
            }
        };
        fetchBots();
    }, []);

    const handleSelect = (botId) => {
        setSelected((prev) => {
            const newSelected = prev.includes(botId)
                ? prev.filter((id) => id !== botId)
                : [...prev, botId];
            return newSelected;
        });

        setQuantities((prev) => {
            if (!selected.includes(botId)) {
                // Add default quantity for the newly selected bot
                return { ...prev, [botId]: 1 };
            } else {
                // Remove quantity for the deselected bot
                const newQuantities = { ...prev };
                delete newQuantities[botId];
                return newQuantities;
            }
        });
    };

    const handleQuantityChange = (botId, value) => {
        if (value >= 1) {
            setQuantities((prev) => ({ ...prev, [botId]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selected.length === 0) {
            setError('Please select at least one bot.');
            return;
        }
        setError('');
        // Map selected bot IDs to Dashboard keys
        const mappedSelected = selected.map(id => apiToDashboardKey[id] || id);
        const mappedQuantities = {};
        Object.keys(quantities).forEach(id => {
            const mappedId = apiToDashboardKey[id] || id;
            mappedQuantities[mappedId] = quantities[id];
        });
        // Clear old data and save new selection to localStorage
        localStorage.removeItem('selectedBotsData');
        localStorage.setItem(
            'selectedBotsData',
            JSON.stringify({ selectedBots: mappedSelected, botQuantities: mappedQuantities })
        );
        onNext({ selectedBots: mappedSelected, botQuantities: mappedQuantities });
    };

    const total = selected.reduce((sum, botId) => {
        const bot = bots.find((b) => b.botId === botId);
        const quantity = quantities[botId] || 1;
        return sum + (bot ? bot.cost * quantity : 0);
    }, 0);

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Select Bots</Typography>
            <Grid container spacing={2}>
                {bots.map((bot) => (
                    <Grid item xs={12} sm={6} key={bot.botId}>
                        <Card
                            variant={selected.includes(bot.botId) ? 'elevation' : 'outlined'}
                            sx={{
                                borderColor: selected.includes(bot.botId) ? 'primary.main' : 'grey.300',
                                boxShadow: selected.includes(bot.botId) ? 4 : 0,
                            }}
                        >
                            <CardContent>
                                <FormControlLabel
                                    control={<Checkbox checked={selected.includes(bot.botId)} onChange={() => handleSelect(bot.botId)} />}
                                    label={<Typography variant="subtitle1" fontWeight={600}>{bot.botName}</Typography>}
                                />
                                <Typography variant="body2" color="text.secondary">${bot.cost}/month</Typography>
                                {bot.trial && <Typography variant="caption" color="success.main">Trial available</Typography>}
                                {!bot.trial && <Typography variant="caption" color="warning.main">No free trial</Typography>}
                                {selected.includes(bot.botId) && (
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <IconButton size="small" onClick={() => handleQuantityChange(bot.botId, (quantities[bot.botId] || 1) - 1)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={quantities[bot.botId] || 1}
                                            onChange={(e) => handleQuantityChange(bot.botId, parseInt(e.target.value))}
                                            inputProps={{ min: 1 }}
                                            sx={{ width: '60px', mx: 1 }}
                                        />
                                        <IconButton size="small" onClick={() => handleQuantityChange(bot.botId, (quantities[bot.botId] || 1) + 1)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box mt={2}>
                <Typography variant="subtitle2">Pricing Summary: <b>${total}/month</b></Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onBack}>Back</Button>
                <Button type="submit" variant="contained" color="primary">Proceed to Payment</Button>
            </Box>
        </form>
    );
};

export default Step3SelectBots;