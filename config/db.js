const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const router = require('../routes/api/profile');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB Server');
  } catch (err) {
    console.error(err.message);
    // Exit process with exit code 1
    process.exit(1);
  }
};

module.exports = connectDB;
