const mongoose = require('mongoose');

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
