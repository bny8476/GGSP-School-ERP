import mongoose from 'mongoose';

// Disable Mongoose command buffering so queries fail or fallback immediately instead of hanging for 10s
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/global_international_erp', {
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
    console.log('⚡ Running in resilient fallback demo mode for seamless dev & testing.');
  }
};

export default connectDB;
