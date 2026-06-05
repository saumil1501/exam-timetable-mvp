// ===== COURSE =====
export interface Course {
  _id: string;
  code: string;
  name: string;
  department?: string;
  credits?: number;
  semester?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  code: string;
  name: string;
  department?: string;
  credits?: number;
  semester?: number;
}

// ===== STUDENT =====
export interface Student {
  _id: string;
  studentCode: string;
  name: string;
  email?: string;
  department?: string;
  semester?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  studentCode: string;
  name: string;
  email?: string;
  department?: string;
  semester?: number;
}

// ===== ENROLLMENT =====
export interface Enrollment {
  _id: string;
  studentId: string | Student;
  courseId: string | Course;
  status: 'active' | 'dropped' | 'completed';
  enrolledAt: string;
}

// ===== TIMETABLE =====
export interface ExamSlot {
  courseId: string | Course;
  slotNumber: number;
  day: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  examDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface TimetableConfig {
  slotsPerDay: number;
  maxDays: number;
  examDurationMins: number;
  breakDurationMins: number;
}

export interface Timetable {
  _id: string;
  name: string;
  description?: string;
  academicYear?: string;
  semester?: number;
  config: TimetableConfig;
  courseIds: string[] | Course[];
  slots: ExamSlot[];
  totalSlotsUsed: number;
  totalDaysUsed: number;
  conflictsFound: number;
  generationTimeMs: number;
  status: 'draft' | 'finalized' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// ===== API RESPONSE =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}