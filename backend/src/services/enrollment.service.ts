import { Enrollment, IEnrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { Student } from '../models/Student';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class EnrollmentService {

  /**
   * Get all enrollments with pagination
   */
  async getAllEnrollments(
    page: number = 1,
    limit: number = 10
  ): Promise<{ enrollments: any[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const enrollments = await Enrollment.find({})
        .populate('studentId', 'studentCode name email department')
        .populate('courseId', 'code name department credits')
        .skip(skip)
        .limit(limit)
        .sort({ enrolledAt: -1 })
        .lean();

      const total = await Enrollment.countDocuments({});
      const pages = Math.ceil(total / limit);

      return { enrollments, total, pages };
    } catch (error) {
      logger.error('Error fetching enrollments:', error);
      throw error;
    }
  }

  /**
   * Create enrollment
   */
  async createEnrollment(studentId: string, courseId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(studentId) || !Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid student or course ID');
      }

      const studentObjectId = new Types.ObjectId(studentId);
      const courseObjectId = new Types.ObjectId(courseId);

      const existing = await Enrollment.findOne({
        studentId,
        courseId,
        status: 'active',
      } as any);

      if (existing) {
        throw new Error('Student is already enrolled in this course');
      }

      const enrollment = new Enrollment({
        studentId: studentObjectId,
        courseId: courseObjectId,
        status: 'active',
      });

      await enrollment.save();
      await enrollment.populate('studentId courseId');

      logger.info(`Enrollment created: ${enrollment._id}`);
      return enrollment.toObject();
    } catch (error) {
      logger.error('Error creating enrollment:', error);
      throw error;
    }
  }

  /**
   * Delete enrollment
   */
  async deleteEnrollment(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enrollment ID');
      }

      const result = await Enrollment.findByIdAndDelete(id);

      if (result) {
        logger.info(`Enrollment deleted: ${id}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error deleting enrollment:', error);
      throw error;
    }
  }

  /**
   * Get enrollments by student
   */
  async getEnrollmentsByStudent(studentId: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID');
      }

      const enrollments = await Enrollment.find({
        studentId,
        status: 'active',
      } as any)
        .populate('courseId', 'code name department credits')
        .lean();

      return enrollments;
    } catch (error) {
      logger.error('Error getting student enrollments:', error);
      throw error;
    }
  }

  /**
   * Get enrollments by course
   */
  async getEnrollmentsByCourse(courseId: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid course ID');
      }

      const enrollments = await Enrollment.find({
        courseId,
        status: 'active',
      } as any)
        .populate('studentId', 'studentCode name email department')
        .lean();

      return enrollments;
    } catch (error) {
      logger.error('Error getting course enrollments:', error);
      throw error;
    }
  }

  /**
   * Get all conflicts in the system
   * Returns conflicts with IDs for frontend filtering
   */
  async getAllConflicts(): Promise<any[]> {
    try {
      const enrollments = await Enrollment.find({ status: 'active' }).lean();

      // Map student -> set of course IDs
      const studentCourses = new Map<string, Set<string>>();

      for (const enrollment of enrollments) {
        const studentId = enrollment.studentId.toString();
        const courseId = enrollment.courseId.toString();

        if (!studentCourses.has(studentId)) {
          studentCourses.set(studentId, new Set());
        }
        studentCourses.get(studentId)!.add(courseId);
      }

      // Build conflict pairs
      const conflictList: any[] = [];
      for (const [studentId, courseIds] of studentCourses.entries()) {
        const courses = Array.from(courseIds);
        if (courses.length > 1) {
          for (let i = 0; i < courses.length; i++) {
            for (let j = i + 1; j < courses.length; j++) {
              conflictList.push({
                studentId,
                course1Id: courses[i],
                course2Id: courses[j],
              });
            }
          }
        }
      }

      // Populate names/codes alongside IDs
      const populatedConflicts = await Promise.all(
        conflictList.map(async (conflict) => {
          try {
            const [course1, course2, student] = await Promise.all([
              Course.findById(conflict.course1Id).lean(),
              Course.findById(conflict.course2Id).lean(),
              Student.findById(conflict.studentId).lean(),
            ]);

            return {
              studentId: conflict.studentId,
              student: (student as any)?.name || 'Unknown',
              studentCode: (student as any)?.studentCode || '',
              course1Id: conflict.course1Id,
              course2Id: conflict.course2Id,
              course1: (course1 as any)?.code || 'Unknown',
              course2: (course2 as any)?.code || 'Unknown',
              severity: 'high',
            };
          } catch (err) {
            logger.error('Error populating conflict:', err);
            return null;
          }
        })
      );

      return populatedConflicts.filter((c) => c !== null);
    } catch (error) {
      logger.error('Error getting all conflicts:', error);
      throw error;
    }
  }

  /**
   * Get enrollment statistics
   */
  async getStatistics(): Promise<{
    totalCourses: number;
    totalStudents: number;
    totalEnrollments: number;
    potentialConflicts: number;
    topCourses: any[];
  }> {
    try {
      const totalCourses = await Course.countDocuments({});
      const totalStudents = await Student.countDocuments({});
      const totalEnrollments = await Enrollment.countDocuments({
        status: 'active',
      });

      const conflicts = await this.getAllConflicts();
      const potentialConflicts = conflicts.length;

      const topCourses = await Enrollment.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'course',
          },
        },
        {
          $project: {
            _id: 0,
            code: { $arrayElemAt: ['$course.code', 0] },
            name: { $arrayElemAt: ['$course.name', 0] },
            students: '$count',
          },
        },
      ]);

      return {
        totalCourses,
        totalStudents,
        totalEnrollments,
        potentialConflicts,
        topCourses: topCourses || [],
      };
    } catch (error) {
      logger.error('Error getting statistics:', error);
      throw error;
    }
  }

  /**
   * Check if student can be enrolled in course
   */
  async canEnroll(
    studentId: string,
    courseId: string
  ): Promise<{ canEnroll: boolean; conflicts: string[] }> {
    try {
      if (
        !Types.ObjectId.isValid(studentId) ||
        !Types.ObjectId.isValid(courseId)
      ) {
        throw new Error('Invalid IDs');
      }

      const existing = await Enrollment.findOne({
        studentId,
        courseId,
        status: 'active',
      } as any);

      if (existing) {
        return {
          canEnroll: false,
          conflicts: ['Already enrolled in this course'],
        };
      }

      return { canEnroll: true, conflicts: [] };
    } catch (error) {
      logger.error('Error checking enrollment eligibility:', error);
      throw error;
    }
  }

  /**
   * Get enrollment summary for a course
   */
  async getCourseSummary(courseId: string): Promise<{
    courseId: string;
    courseName: string;
    totalStudents: number;
    enrolledStudents: any[];
  }> {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid course ID');
      }

      const course = await Course.findById(courseId).lean();
      const enrollments = await this.getEnrollmentsByCourse(courseId);

      return {
        courseId,
        courseName: (course as any)?.name || 'Unknown',
        totalStudents: enrollments.length,
        enrolledStudents: enrollments.map((e: any) => ({
          id: e.studentId._id,
          code: e.studentId.studentCode,
          name: e.studentId.name,
        })),
      };
    } catch (error) {
      logger.error('Error getting course summary:', error);
      throw error;
    }
  }

  /**
   * Bulk create enrollments
   */
  async bulkCreateEnrollments(
    enrollmentsData: Array<{ studentId: string; courseId: string }>
  ): Promise<IEnrollment[]> {
    try {
      const validatedEnrollments = enrollmentsData.map((e) => ({
        studentId: new Types.ObjectId(e.studentId),
        courseId: new Types.ObjectId(e.courseId),
        status: 'active' as const,
      }));

      const created = await Enrollment.insertMany(validatedEnrollments, {
        ordered: false,
      });

      logger.info(`Bulk enrollments created: ${created.length}`);
      return created;
    } catch (error) {
      logger.error('Error bulk creating enrollments:', error);
      throw error;
    }
  }

  /**
   * Get conflict count
   */
  async getConflictCount(): Promise<number> {
    try {
      const conflicts = await this.getAllConflicts();
      return conflicts.length;
    } catch (error) {
      logger.error('Error getting conflict count:', error);
      return 0;
    }
  }
}

export const enrollmentService = new EnrollmentService();