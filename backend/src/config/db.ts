import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/preschool-erp', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
      if (error.message.includes('Could not connect to any servers') || error.message.includes('whitelist')) {
        console.error('👉 ATLAS WHITELIST FIX: In MongoDB Atlas, go to "Network Access" -> "+ Add IP Address" -> select "Allow Access from Anywhere" (0.0.0.0/0).');
      }
    } else {
      console.error('An unknown error occurred during database connection');
    }
    console.warn('⚠️  Backend will continue running. Please check your MONGO_URI in Render environment variables.');
  }
};

export default connectDB;
