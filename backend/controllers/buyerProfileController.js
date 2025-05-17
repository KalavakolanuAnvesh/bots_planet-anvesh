import BuyerProfile from '../models/BuyerProfile.js';

// Create a new buyer profile
export const createProfile = async (req, res) => {
  try {
    const profile = new BuyerProfile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all buyer profiles
export const getProfiles = async (req, res) => {
  try {
    const profiles = await BuyerProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single buyer profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await BuyerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a buyer profile
export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await BuyerProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile) return res.status(404).json({ error: 'Profile not found' });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a buyer profile
export const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await BuyerProfile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ error: 'Profile not found' });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};