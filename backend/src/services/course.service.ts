import { Course, ICourse } from '../models/Course';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class CourseService {
  /**
   * Get all courses with pagination and search
   */
  async getAllCourses(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ courses: ICourse[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build search query
      let query = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query = {
          $or: [
            { code: searchRegex },
            { name: searchRegex },
            { department: searchRegex },
          ],
        };
      }

      const courses = await Course.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await Course.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return { courses, total, pages };
    } catch (error) {
      logger.error('Error fetching courses:', error);
      throw error;
    }
  }

  /**
   * Get course by ID
   */
  async getCourseById(id: string): Promise<ICourse | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid course ID format');
      }

      const course = await Course.findById(id).lean();
      return course;
    } catch (error) {
      logger.error('Error fetching course:', error);
      throw error;
    }
  }

  /**
   * Create new course
   */
  async createCourse(data: {
    code: string;
    name: string;
    department?: string;
    credits?: number;
    semester?: number;
  }): Promise<ICourse> {
    try {
      // Check if code already exists
      const existing = await Course.findOne({ code: data.code.toUpperCase() });
      if (existing) {
        throw new Error(`Course with code ${data.code} already exists`);
      }

      const course = new Course({
        ...data,
        code: data.code.toUpperCase(),
      });

      await course.save();
      logger.info(`Course created: ${course._id} (${course.code})`);

      return course.toObject();
    } catch (error) {
      logger.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Update course
   */
  async updateCourse(
    id: string,
    data: Partial<{
      code: string;
      name: string;
      department?: string;
      credits?: number;
      semester?: number;
    }>
  ): Promise<ICourse | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid course ID format');
      }

      // If code is being updated, check for duplicates
      if (data.code) {
        const existing = await Course.findOne({
          code: data.code.toUpperCase(),
          _id: { $ne: id },
        });
        if (existing) {
          throw new Error(`Course with code ${data.code} already exists`);
        }
      }

      const course = await Course.findByIdAndUpdate(
        id,
        {
          ...data,
          code: data.code ? data.code.toUpperCase() : undefined,
        },
        { new: true, runValidators: true }
      ).lean();

      if (course) {
        logger.info(`Course updated: ${id}`);
      }

      return course;
    } catch (error) {
      logger.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete course
   */
  async deleteCourse(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid course ID format');
      }

      // TODO: Also delete related enrollments
      const result = await Course.findByIdAndDelete(id);

      if (result) {
        logger.info(`Course deleted: ${id}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Get count of students enrolled in a course
   */
  async getStudentCount(courseId: string): Promise<number> {
    try {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new Error('Invalid course ID format');
      }

      const { Enrollment } = await import('../models/Enrollment');
      const count = await Enrollment.countDocuments({
        courseId: new Types.ObjectId(courseId),
        status: 'active',
      } as any);

      return count;
    } catch (error) {
      logger.error('Error getting student count:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();