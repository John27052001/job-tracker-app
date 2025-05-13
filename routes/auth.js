const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET: Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// POST: Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// GET: Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// POST: Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.matchPassword(password)) {
    req.session.userId = user._id;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
