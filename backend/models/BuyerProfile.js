import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
}, { _id: false });

const buyerProfileSchema = new mongoose.Schema({
  profileName: { type: String, required: false }, // Optional, add if you want to name the profile
  attributes: {
    Country: [String],
    BuyerType: [String],
    Designation: [String],
    // Add more fields as needed for your app
  },
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.Mixed,
    default: 'bot'
  },
  documents: [documentSchema], // Optional, for file uploads/links
}, { timestamps: true });

export default mongoose.model('BuyerProfile', buyerProfileSchema, 'buyer_profiles');