const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authMiddleware,adminMiddleware} = require('../middleware/auth')

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, address, whatsapp } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({ username, email, password, role, address, whatsapp });
    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.status(200).json({ token, user: user.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.password; } }) });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Get user by ID
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

//protected route
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Welcome Admin' });
});

module.exports = router;