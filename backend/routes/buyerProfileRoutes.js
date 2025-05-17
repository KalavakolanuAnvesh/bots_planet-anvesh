import express from 'express';
import BuyerProfile from '../models/BuyerProfile.js';

const router = express.Router();

// GET all buyer profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await BuyerProfile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buyer profiles' });
  }
});

// POST new buyer profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new BuyerProfile(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ error: 'Failed to save buyer profile', details: error.message });
  }
});

// PUT update existing buyer profile
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = await BuyerProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update buyer profile' });
  }
});

// DELETE buyer profile
router.delete('/:id', async (req, res) => {
  try {
    await BuyerProfile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Buyer profile deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete buyer profile' });
  }
});

export default router;