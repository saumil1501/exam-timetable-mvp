import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  studentCode: string;
  name: string;
  email?: string;
  department?: string;
  semester?: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    studentCode: {
      type: String,
      required: [true, 'Student code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Student code max 20 characters'],
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [200, 'Student name max 200 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
  },
  { timestamps: true }
);

studentSchema.index({ studentCode: 1 });
studentSchema.index({ department: 1 });

export const Student = model<IStudent>('Student', studentSchema);