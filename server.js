const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs'); // ✅ <— Add this line

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/job-tracker');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Sessions
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/job-tracker' })
}));

// Routes
app.use('/', authRoutes);
app.use('/', jobRoutes); // ✅ <— Plug in the job routes here

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
app.listen(3000, () => {
  console.log('✅ Job Tracker running at http://localhost:3000');
});
