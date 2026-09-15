import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/preschool-erp');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
    } else {
      console.error('An unknown error occurred during database connection');
    }
    console.warn('⚠️  Backend will continue running. Ensure MongoDB is running locally or provide a valid MONGO_URI in backend/.env');
  }
};

export default connectDB;
