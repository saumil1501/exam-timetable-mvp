import { Schema, model, Document } from 'mongoose';

export interface IExamSlot {
  courseId: Schema.Types.ObjectId;
  slotNumber: number;
  day: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  examDate?: Date;
  startTime?: string;
  endTime?: string;
}

export interface ITimetable extends Document {
  name: string;
  description?: string;
  academicYear?: string;
  semester?: number;
  config: {
    slotsPerDay: number;
    maxDays: number;
    examDurationMins: number;
    breakDurationMins: number;
  };
  courseIds: Schema.Types.ObjectId[];
  slots: IExamSlot[];
  totalSlotsUsed: number;
  totalDaysUsed: number;
  conflictsFound: number;
  generationTimeMs: number;
  status: 'draft' | 'finalized' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const examSlotSchema = new Schema<IExamSlot>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    slotNumber: { type: Number, required: true },
    day: { type: Number, required: true },
    timeSlot: { type: String, required: true, enum: ['Morning', 'Afternoon', 'Evening'] },
    examDate: Date,
    startTime: String,
    endTime: String,
  },
  { _id: false }
);

const timetableSchema = new Schema<ITimetable>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: String,
    academicYear: String,
    semester: Number,
    config: {
      type: {
        slotsPerDay: { type: Number, required: true },
        maxDays: { type: Number, required: true },
        examDurationMins: { type: Number, required: true },
        breakDurationMins: { type: Number, default: 30 },
      },
      required: true,
    },
    courseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    slots: [examSlotSchema],
    totalSlotsUsed: { type: Number, default: 0 },
    totalDaysUsed: { type: Number, default: 0 },
    conflictsFound: { type: Number, default: 0 },
    generationTimeMs: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'finalized', 'archived'], default: 'draft' },
  },
  { timestamps: true }
);

timetableSchema.index({ status: 1 });
timetableSchema.index({ createdAt: -1 });

export const Timetable = model<ITimetable>('Timetable', timetableSchema);