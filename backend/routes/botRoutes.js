// filepath: c:\Users\svcs\bots_planet\backend\routes\botRoutes.js
import express from 'express';
import Bot from '../models/BotModel.js';

const router = express.Router();

// Get all bots
router.get('/', async (req, res) => {
    try {
        const bots = await Bot.find();
        res.status(200).json(bots);
    } catch (error) {
        console.error('Error fetching bots:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;