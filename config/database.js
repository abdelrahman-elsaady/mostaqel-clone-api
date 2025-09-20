const mongoose = require('mongoose');

/**
 * Database configuration and connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MYDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
