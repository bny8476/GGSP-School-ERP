import mongoose from 'mongoose';
import env from './env';

// Disable Mongoose command buffering so queries fail immediately when DB is down rather than hanging
mongoose.set('bufferCommands', false);

const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

const connectDB = async () => {
  let attempt = 0;
  let delay = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn(`[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${errMsg}`);

      if (attempt < MAX_RETRIES) {
        console.log(`[DB] Retrying connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 8000);
      }
    }
  }

  // All connection retries failed
  console.error(`[DB] CRITICAL: Unable to establish database connection after ${MAX_RETRIES} attempts.`);

  if (env.NODE_ENV === 'production') {
    console.error('FATAL: Database connection failed in production. Terminating process.');
    process.exit(1);
  } else {
    console.warn('⚠️  Database is offline. Non-health HTTP endpoints will return 503 Service Unavailable.');
  }
};

export default connectDB;
