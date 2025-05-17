import express from 'express';
import CustomerSegment from '../models/CustomerSegment.js';

const router = express.Router();

// GET all segments
router.get('/', async (req, res) => {
  try {
    const segments = await CustomerSegment.find();
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
});

// POST new segment
router.post('/', async (req, res) => {
  console.log('Received data:', req.body); // Log the incoming data
  try {
    // If you want to support file uploads, use multer middleware here
    const newSegment = new CustomerSegment(req.body);
    const savedSegment = await newSegment.save();
    res.status(201).json(savedSegment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to save segment', details: error.message });
  }
});

// PUT update existing segment
router.put('/:id', async (req, res) => {
  try {
    const updatedSegment = await CustomerSegment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSegment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update segment' });
  }
});

// DELETE segment (optional)
router.delete('/:id', async (req, res) => {
  try {
    await CustomerSegment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Segment deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete segment' });
  }
});

export default router;
