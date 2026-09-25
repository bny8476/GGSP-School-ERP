import mongoose from 'mongoose';
import env from './env';
import { seedDatabase } from '../services/seedService';

// Disable Mongoose command buffering so queries fail immediately when DB is down rather than hanging
mongoose.set('bufferCommands', false);

let memoryServerInstance: any = null;

const connectDB = async () => {
  // 1. Attempt connection to primary configured MONGODB_URI
  try {
    console.log(`[DB] Attempting connection to MongoDB at ${env.MONGODB_URI}...`);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

    // If development and database is brand new, seed initial data
    if (env.NODE_ENV !== 'production') {
      const collections = await mongoose.connection.db?.listCollections().toArray();
      if (!collections || collections.length === 0) {
        console.log('[DB] Fresh database detected. Seeding default roles & accounts...');
        await seedDatabase();
      }
    }
    return;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[DB] Primary MongoDB connection failed (${errMsg}).`);
  }

  // 2. If in production, fail hard
  if (env.NODE_ENV === 'production') {
    console.error('FATAL: Database connection failed in production. Terminating process.');
    process.exit(1);
  }

  // 3. In development / testing: Fallback to embedded in-memory MongoDB
  try {
    console.log('⚡ Launching embedded in-memory MongoDB for local development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'global_international_erp',
      },
    });

    const memoryUri = memoryServerInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✓ Embedded in-memory MongoDB connected: ${memoryUri}`);

    // Seed default administrative roles and login credentials
    console.log('[DB] Seeding default development accounts...');
    await seedDatabase();
    console.log('✓ Development database ready! You can log in with:');
    console.log('   • Admin:      admin@school.com / password123');
    console.log('   • Teacher:    teacher@school.com / password123');
    console.log('   • Parent:     parent@school.com / password123');
  } catch (memErr) {
    console.error('[DB] CRITICAL: Failed to launch embedded in-memory MongoDB fallback:', memErr);
    console.warn('⚠️  Database is offline. Non-health HTTP endpoints will return 503 Service Unavailable.');
  }
};

// Graceful cleanup on shutdown
process.on('SIGINT', async () => {
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
  await mongoose.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
  await mongoose.disconnect();
  process.exit(0);
});

export default connectDB;
