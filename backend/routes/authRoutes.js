import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth.js';

import User from './../models/UserModel.js'
import Customer from './../models/CustomerModel.js'


const router = express.Router();

const generateId = (prefix) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = prefix + "-"

  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return id
}

// Register
router.post('/register', async (req, res) => {  
  try {
    const {
      orgName,
      industry,
      orgSize,
      location,
      adminName,
      adminEmail,
      password
    } = req.body;

    // Check if user exists
    if (await User.exists({ email: adminEmail })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    let id = ''
    do {
      id = generateId('CUST')
    } while (await User.exists({ customerId: id }))
      // Create customer
      const customer = {
        customerId: id,
        orgName,
        industry,
        orgSize,
        location
      };
      
    do {
      id = generateId('ADM')
    } while (await User.exists({ userId: id }))
    // Create admin
    const admin = {
      userId: id,
      customerId: customer.customerId,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdBy: id,
      updatedBy: id
    }

    await new User(admin).save();
    await new Customer(customer).save();

    // Create token
    const token = jwt.sign(
      { id: admin.userId, customerId: admin.customerId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = admin;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({
      message: 'User registered successfully',
      customer,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log("No user")
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Incorrect pwd)")
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.userId, customerId: user.customerId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      message: 'Logged in successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;