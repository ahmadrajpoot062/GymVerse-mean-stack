/**
 * Database Configuration for GymVerse
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/gymverse';

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferMaxEntries: 0,
      bufferCommands: false,
    };

    const conn = await mongoose.connect(mongoURI, options);

    logger.info(`🍃 MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    return conn;

  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
