import mongoose from 'mongoose';

const botSubscriptionSchema = new mongoose.Schema({
  botId: {
    type: String,
    required: true
  },
  botName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true,
    ref: 'customers'
  },
  botsSubscribed: [botSubscriptionSchema],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  latestInvoiceId: {
    type: String,
    default: null
  }
}, { timestamps: true }); // This adds createdAt and updatedAt fields

export default mongoose.model('subscriptions', subscriptionSchema, 'subscriptions'); 