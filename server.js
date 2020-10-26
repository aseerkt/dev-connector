const express = require('express');
const logger = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Load vars
require('dotenv').config();

// Connect Database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));
app.use(logger('dev'));

app.get('/', (_req, res) => res.json('API Running'));

// Serve Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profiles', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
