const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Bring in Mongo URI from .env
const mongoURI = process.env.MONGO_REMOTE_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Server');
  } catch (err) {
    console.error(err.message);
    // Exit process with exit code 1
    process.exit(1);
  }
};

module.exports = connectDB;