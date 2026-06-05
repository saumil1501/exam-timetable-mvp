import { Timetable, ITimetable } from '../models/Timetable';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class TimetableService {
  /**
   * Get all timetables with pagination
   */
  async getAllTimetables(
    page: number = 1,
    limit: number = 10
  ): Promise<{ timetables: ITimetable[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const timetables = await Timetable.find({})
        .populate('courseIds', 'code name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await Timetable.countDocuments({});
      const pages = Math.ceil(total / limit);

      return { timetables, total, pages };
    } catch (error) {
      logger.error('Error fetching timetables:', error);
      throw error;
    }
  }

  /**
   * Get timetable by ID
   */
  async getTimetableById(id: string): Promise<ITimetable | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findById(id)
        .populate('courseIds', 'code name')
        .populate('slots.courseId', 'code name')
        .lean();

      return timetable;
    } catch (error) {
      logger.error('Error fetching timetable:', error);
      throw error;
    }
  }

  /**
   * Create new timetable (initial setup)
   */
  async createTimetable(data: {
    name: string;
    description?: string;
    academicYear?: string;
    semester?: number;
    config: {
      slotsPerDay: number;
      maxDays: number;
      examDurationMins: number;
      breakDurationMins: number;
      startDate: string;
    };
    courseIds: string[];
  }): Promise<ITimetable> {
    try {
      // Convert course IDs to ObjectId
      const courseIds = data.courseIds.map(
        (id) => new Types.ObjectId(id)
      );

      const timetable = new Timetable({
        name: data.name,
        description: data.description,
        academicYear: data.academicYear,
        semester: data.semester,
        config: data.config,
        courseIds,
        slots: [],
        status: 'draft',
      });

      await timetable.save();
      logger.info(`Timetable created: ${timetable._id}`);

      return timetable.toObject();
    } catch (error) {
      logger.error('Error creating timetable:', error);
      throw error;
    }
  }

  /**
   * Update timetable slots (after generation)
   */
  async updateTimetableSlots(
    id: string,
    slots: any[],
    stats: {
      totalSlotsUsed: number;
      totalDaysUsed: number;
      conflictsFound: number;
      generationTimeMs: number;
    }
  ): Promise<ITimetable | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findByIdAndUpdate(
        id,
        {
          slots,
          totalSlotsUsed: stats.totalSlotsUsed,
          totalDaysUsed: stats.totalDaysUsed,
          conflictsFound: stats.conflictsFound,
          generationTimeMs: stats.generationTimeMs,
        },
        { new: true }
      ).lean();

      if (timetable) {
        logger.info(`Timetable slots updated: ${id}`);
      }

      return timetable;
    } catch (error) {
      logger.error('Error updating timetable slots:', error);
      throw error;
    }
  }

  /**
   * Delete timetable
   */
  async deleteTimetable(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const result = await Timetable.findByIdAndDelete(id);

      if (result) {
        logger.info(`Timetable deleted: ${id}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error deleting timetable:', error);
      throw error;
    }
  }

  /**
   * Finalize timetable
   */
  async finalizeTimetable(id: string): Promise<ITimetable | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findByIdAndUpdate(
        id,
        { status: 'finalized' },
        { new: true }
      ).lean();

      if (timetable) {
        logger.info(`Timetable finalized: ${id}`);
      }

      return timetable;
    } catch (error) {
      logger.error('Error finalizing timetable:', error);
      throw error;
    }
  }

  /**
   * Get conflicts in timetable
   */
  async getConflicts(id: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findById(id).lean();

      if (!timetable) {
        return [];
      }

      const conflicts: any[] = [];

      // Get enrollments for courses in this timetable
      const enrollments = await Enrollment.find({
        courseId: { $in: timetable.courseIds },
        status: 'active',
      }).lean();

      // Group by student
      const studentCourses = new Map<string, string[]>();
      enrollments.forEach((e: any) => {
        const studentId = e.studentId.toString();
        if (!studentCourses.has(studentId)) {
          studentCourses.set(studentId, []);
        }
        studentCourses.get(studentId)!.push(e.courseId.toString());
      });

      // Check for conflicts
      studentCourses.forEach((courseIds, studentId) => {
        const slotMap = new Map<string, string[]>();

        courseIds.forEach((courseId) => {
          const slot = timetable.slots.find(
            (s: any) => s.courseId.toString() === courseId
          );

          if (slot) {
            const slotKey = `${slot.day}-${slot.timeSlot}`;
            if (!slotMap.has(slotKey)) {
              slotMap.set(slotKey, []);
            }
            slotMap.get(slotKey)!.push(courseId);
          }
        });

        slotMap.forEach((courses, slotKey) => {
          if (courses.length > 1) {
            conflicts.push({
              studentId,
              slotKey,
              courses,
              message: `Student has ${courses.length} exams at same time`,
            });
          }
        });
      });

      return conflicts;
    } catch (error) {
      logger.error('Error getting conflicts:', error);
      throw error;
    }
  }

  /**
   * Archive timetable
   */
  async archiveTimetable(id: string): Promise<ITimetable | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findByIdAndUpdate(
        id,
        { status: 'archived' },
        { new: true }
      ).lean();

      if (timetable) {
        logger.info(`Timetable archived: ${id}`);
      }

      return timetable;
    } catch (error) {
      logger.error('Error archiving timetable:', error);
      throw error;
    }
  }

  /**
   * Get timetable statistics
   */
  async getStatistics(id: string): Promise<{
    totalCourses: number;
    totalStudents: number;
    totalSlots: number;
    totalDays: number;
    conflictsCount: number;
    generationTime: number;
  }> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid timetable ID');
      }

      const timetable = await Timetable.findById(id).lean();

      if (!timetable) {
        throw new Error('Timetable not found');
      }

      // Get unique students in this timetable
      const enrollments = await Enrollment.find({
        courseId: { $in: timetable.courseIds },
        status: 'active',
      }).lean();

      const uniqueStudents = new Set(
        enrollments.map((e: any) => e.studentId.toString())
      );

      const conflicts = await this.getConflicts(id);

      return {
        totalCourses: timetable.courseIds.length,
        totalStudents: uniqueStudents.size,
        totalSlots: timetable.totalSlotsUsed,
        totalDays: timetable.totalDaysUsed,
        conflictsCount: conflicts.length,
        generationTime: timetable.generationTimeMs,
      };
    } catch (error) {
      logger.error('Error getting timetable statistics:', error);
      throw error;
    }
  }
}

export const timetableService = new TimetableService();