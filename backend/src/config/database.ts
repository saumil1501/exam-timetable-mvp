import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_timetable_mvp';

async function connectToDatabase(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI);

    logger.info(`MongoDB connected to ${MONGODB_URI}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB error:', error);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export default connectToDatabase;