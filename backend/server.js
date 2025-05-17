import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectToDB from './config/dbConfig.js';
import authRoutes from './routes/authRoutes.js';
import botRoutes from './routes/botRoutes.js';
import customerSegmentRoutes from './routes/customerSegmentRoutes.js';
import buyerProfileRoutes from './routes/buyerProfileRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { verifyToken } from './middleware/auth.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection (direct)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devuser:Hasman123@salesbotdatacluster.gsbt1qx.mongodb.net/bots_planet_data?retryWrites=true&w=majority&appName=SalesBotDataCluster';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/customer-segments', customerSegmentRoutes);
app.use('/api/buyer-profiles', buyerProfileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', verifyToken, userRoutes);

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting the server...\n>>${err}`);
  } else {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  }
});