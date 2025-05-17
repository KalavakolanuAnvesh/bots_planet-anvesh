import express from 'express';
import Subscription from '../models/SubscriptionModel.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate subscription ID
const generateSubscriptionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'SUB-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Helper function to calculate next billing date
const calculateNextBillingDate = (billingCycle) => {
  const date = new Date();
  if (billingCycle === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (billingCycle === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date;
};

// Create new subscription
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      customerId,
      botsSubscribed,
      billingCycle
    } = req.body;

    // Generate subscription ID
    let subscriptionId;
    do {
      subscriptionId = generateSubscriptionId();
    } while (await Subscription.exists({ subscriptionId }));

    // Calculate next billing date
    const nextBillingDate = calculateNextBillingDate(billingCycle);

    const subscription = new Subscription({
      subscriptionId,
      customerId,
      botsSubscribed,
      billingCycle,
      nextBillingDate,
      startDate: new Date()
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(400).json({ message: 'Failed to create subscription', error: error.message });
  }
});

// Get all subscriptions
router.get('/', verifyToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
});

// Get subscription by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ subscriptionId: req.params.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscription' });
  }
});

// Get subscriptions by customer ID
router.get('/customer/:customerId', verifyToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ customerId: req.params.customerId });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer subscriptions' });
  }
});

// Update subscription
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { subscriptionId: req.params.id },
      req.body,
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update subscription' });
  }
});

// Cancel subscription
router.post('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ subscriptionId: req.params.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    subscription.endDate = new Date();
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully', subscription });
  } catch (error) {
    res.status(400).json({ message: 'Failed to cancel subscription' });
  }
});

// Renew subscription
router.post('/:id/renew', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ subscriptionId: req.params.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'active';
    subscription.endDate = null;
    subscription.nextBillingDate = calculateNextBillingDate(subscription.billingCycle);
    await subscription.save();

    res.json({ message: 'Subscription renewed successfully', subscription });
  } catch (error) {
    res.status(400).json({ message: 'Failed to renew subscription' });
  }
});

// Delete subscription
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ subscriptionId: req.params.id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subscription' });
  }
});

export default router; 