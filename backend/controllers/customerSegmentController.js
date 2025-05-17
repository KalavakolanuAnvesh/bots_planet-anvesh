import CustomerSegment from '../models/CustomerSegment.js';


// Create a new customer segment
export const createSegment = async (req, res) => {
  try {
    const segment = new CustomerSegment(req.body);
    await segment.save();
    res.status(201).json(segment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all customer segments
export const getSegments = async (req, res) => {
  try {
    const segments = await CustomerSegment.find();
    res.status(200).json(segments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single customer segment by ID
export const getSegmentById = async (req, res) => {
  try {
    const segment = await CustomerSegment.findById(req.params.id);
    if (!segment) return res.status(404).json({ error: 'Segment not found' });
    res.status(200).json(segment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer segment
export const updateSegment = async (req, res) => {
  try {
    const updatedSegment = await CustomerSegment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSegment) return res.status(404).json({ error: 'Segment not found' });
    res.status(200).json(updatedSegment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer segment
export const deleteSegment = async (req, res) => {
  try {
    const deletedSegment = await CustomerSegment.findByIdAndDelete(req.params.id);
    if (!deletedSegment) return res.status(404).json({ error: 'Segment not found' });
    res.status(200).json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
