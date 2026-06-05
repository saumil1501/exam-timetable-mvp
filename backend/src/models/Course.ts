import { Schema, model, Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  name: string;
  department?: string;
  credits?: number;
  semester?: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Course code max 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [200, 'Course name max 200 characters'],
    },
    department: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      min: 1,
      max: 10,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
  },
  { timestamps: true }
);

courseSchema.index({ code: 1 });
courseSchema.index({ department: 1 });

export const Course = model<ICourse>('Course', courseSchema);