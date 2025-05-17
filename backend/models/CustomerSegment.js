import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: String,
  url: String, // You can update this if you want to store file paths or links
}, { _id: false });

const customerSegmentSchema = new mongoose.Schema({
  segmentationName: { type: String, required: true },
  attributes: {
    Country: [String],
    Industry: [String],
    CompanySize: [String],
    Turnover: [String],
    CustomerType: [String],
    LeadStage: [String],
  },
  description: String,
  externalURL: String,
  documents: [documentSchema],
}, { timestamps: true });

export default mongoose.model('CustomerSegment', customerSegmentSchema, 'customer_segments');