import mongoose from 'mongoose';
import env from './env';

// Disable Mongoose command buffering so queries fail or fallback immediately instead of hanging for 10s
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`⚠️  MongoDB connection notice: ${error.message}`);
      if (error.message.includes('Could not connect to any servers') || error.message.includes('whitelist')) {
        console.warn('👉 ATLAS WHITELIST FIX: In MongoDB Atlas, go to "Network Access" -> "+ Add IP Address" -> select "Allow Access from Anywhere" (0.0.0.0/0).');
      }
    } else {
      console.warn('⚠️  An unknown error occurred during database connection');
    }

    if (env.NODE_ENV === 'production') {
      console.error('FATAL: Database connection failed in production. Refusing to start in fallback mode.');
      process.exit(1);
    }

    console.log('⚡ Running in resilient fallback demo mode for seamless dev & testing.');
  }
};

export default connectDB;
