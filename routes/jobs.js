const express = require('express');
const router = express.Router();
const path = require('path');

// ✅ Load the Job model correctly
const Job = require(path.resolve(__dirname, '../models/JobModel'));
const { ensureAuth } = require('../middleware/auth');

// ✅ Debug logs
console.log('✅ Job type:', typeof Job);
console.log('✅ Job.find =', Job.find);
console.log('✅ Job keys:', Object.keys(Job));

// 🏠 GET /dashboard — Show user’s jobs
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    console.log('📦 Session userId:', req.session.userId);
    if (typeof Job.find !== 'function') {
      throw new Error('❌ Job.find is not a function — something is wrong with the model');
    }

    const jobs = await Job.find({ user: req.session.userId });
    res.render('dashboard', { jobs });
  } catch (err) {
    console.error('❌ Dashboard Error:', err);
    res.status(500).send('Error loading dashboard: ' + err.message);
  }
});

// ➕ GET /add — Show add job form
router.get('/add', ensureAuth, (req, res) => {
  res.render('add-job');
});

// ➕ POST /add — Add a new job
router.post('/add', ensureAuth, async (req, res) => {
  try {
    const { title, company, status } = req.body;
    await Job.create({
      user: req.session.userId,
      title,
      company,
      status
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Add Job Error:', err);
    res.status(500).send('Error adding job: ' + err.message);
  }
});

// ❌ POST /delete/:id — Delete a job
router.post('/delete/:id', ensureAuth, async (req, res) => {
  try {
    await Job.deleteOne({ _id: req.params.id, user: req.session.userId });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Delete Job Error:', err);
    res.status(500).send('Error deleting job: ' + err.message);
  }
});

module.exports = router;
