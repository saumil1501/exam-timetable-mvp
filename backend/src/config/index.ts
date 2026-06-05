import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/exam_timetable_mvp',
  nodeEnv: process.env.NODE_ENV || 'development',
};