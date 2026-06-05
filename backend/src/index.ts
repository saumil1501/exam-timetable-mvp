import express from 'express';
import cors from 'cors';
import { config } from './config';
import connectToDatabase from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error';
// import { seedDatabase } from './db/seed';

import courseRoutes from './routes/courses.routes';
import studentRoutes from './routes/students.routes';
import enrollmentRoutes from './routes/enrollments.routes';
import timetableRoutes from './routes/timetables.routes';
import statsRoutes from './routes/stats.routes';

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// ===== START SERVER =====
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Seed database
    // await seedDatabase();

    // Start HTTP server
    app.listen(config.port, () => {
      logger.info('========================================');
      logger.info(`  Server running on http://localhost:${config.port}`);
      logger.info(`  Environment: ${config.nodeEnv}`);
      logger.info('========================================');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;