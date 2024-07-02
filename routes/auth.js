const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authMiddleware,adminMiddleware} = require('../middleware/auth')

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send('User already exists.');

  user = new User({ username,email, password, role });
  await user.save();

  const token = jwt.sign({ _id: user._id, role: user.role }, '05ba7ae8df02e52a18ec9c90d471492ae6d8d23547fafbc3c8dc8d3ecef37bd5');
  res.send({ token });
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await user.comparePassword(password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id, role: user.role }, '05ba7ae8df02e52a18ec9c90d471492ae6d8d23547fafbc3c8dc8d3ecef37bd5');
  res.send({ token });
});

// Example protected route
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.send('Welcome Admin');
});

module.exports = router;