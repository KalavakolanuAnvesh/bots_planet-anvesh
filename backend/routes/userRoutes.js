import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';

const router = express.Router();

function generateId(prefix) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = prefix + '-';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const loggedInAdminId = req.user.id;
    const adminCustomerId = req.user.customerId;

    if (!adminCustomerId) {
        return res.status(400).json({ message: 'Admin user data is missing customer ID.' });
    }

    const userId = generateId('USR');
    const customerId = adminCustomerId;
    const createdBy = loggedInAdminId;
    const updatedBy = createdBy;

    const { name, email, password: rawPassword } = req.body;

    if (await User.exists({ email })) {
       return res.status(400).json({ message: 'User with this email already exists.' });
     }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword || 'changeme123', salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userId,
      customerId,
      createdBy,
      updatedBy,
      role: 'user',
    });

    await user.save();
    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(201).json(userWithoutPassword);

  } catch (err) {
    console.error('Error creating user in /api/users:', err);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: 'Validation error creating user', errors: messages });
    }
    res.status(500).json({ message: 'Server error creating user', error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser._doc;
    res.json(userWithoutPassword);

  } catch (err) {
    console.error('Error updating user:', err);
     if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: 'Validation error updating user', errors: messages });
    }
    res.status(400).json({ message: 'Failed to update user', error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
       return res.status(404).json({ message: 'User not found' });
    }
    await userToDelete.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(400).json({ message: 'Failed to delete user', error: err.message });
  }
});

export default router; 