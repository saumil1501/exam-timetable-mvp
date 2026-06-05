import { Student, IStudent } from '../models/Student';
import { Enrollment, IEnrollment } from '../models/Enrollment';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class StudentService {
  /**
   * Get all students with pagination and search
   */
  async getAllStudents(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ students: IStudent[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build search query
      let query = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query = {
          $or: [
            { studentCode: searchRegex },
            { name: searchRegex },
            { email: searchRegex },
            { department: searchRegex },
          ],
        };
      }

      const students = await Student.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await Student.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return { students, total, pages };
    } catch (error) {
      logger.error('Error fetching students:', error);
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: string): Promise<IStudent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid student ID format');
      }

      const student = await Student.findById(id).lean();
      return student;
    } catch (error) {
      logger.error('Error fetching student:', error);
      throw error;
    }
  }

  /**
   * Create new student
   */
  async createStudent(data: {
    studentCode: string;
    name: string;
    email?: string;
    department?: string;
    semester?: number;
  }): Promise<IStudent> {
    try {
      // Check if student code already exists
      const existing = await Student.findOne({
        studentCode: data.studentCode.toUpperCase(),
      });
      if (existing) {
        throw new Error(
          `Student with code ${data.studentCode} already exists`
        );
      }

      const student = new Student({
        ...data,
        studentCode: data.studentCode.toUpperCase(),
      });

      await student.save();
      logger.info(`Student created: ${student._id} (${student.studentCode})`);

      return student.toObject();
    } catch (error) {
      logger.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Update student
   */
  async updateStudent(
    id: string,
    data: Partial<{
      studentCode: string;
      name: string;
      email?: string;
      department?: string;
      semester?: number;
    }>
  ): Promise<IStudent | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid student ID format');
      }

      // If student code is being updated, check for duplicates
      if (data.studentCode) {
        const existing = await Student.findOne({
          studentCode: data.studentCode.toUpperCase(),
          _id: { $ne: id },
        });
        if (existing) {
          throw new Error(
            `Student with code ${data.studentCode} already exists`
          );
        }
      }

      const student = await Student.findByIdAndUpdate(
        id,
        {
          ...data,
          studentCode: data.studentCode
            ? data.studentCode.toUpperCase()
            : undefined,
        },
        { new: true, runValidators: true }
      ).lean();

      if (student) {
        logger.info(`Student updated: ${id}`);
      }

      return student;
    } catch (error) {
      logger.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid student ID format');
      }

      const studentObjectId = new Types.ObjectId(id);

      // Delete related enrollments
      await Enrollment.deleteMany({
        studentId: id,
      } as any);

      const result = await Student.findByIdAndDelete(id);

      if (result) {
        logger.info(`Student deleted: ${id}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Get courses for a student
   */
  async getStudentCourses(studentId: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid student ID format');
      }

      const studentObjectId = new Types.ObjectId(studentId);

      const enrollments = await Enrollment.find({
        studentId: studentId,
        status: 'active',
      } as any)
        .populate('courseId', 'code name department')
        .lean();

      return enrollments.map((e: any) => e.courseId);
    } catch (error) {
      logger.error('Error getting student courses:', error);
      throw error;
    }
  }

  /**
   * Get student by code (for external queries)
   */
  async getStudentByCode(studentCode: string): Promise<IStudent | null> {
    try {
      const student = await Student.findOne({
        studentCode: studentCode.toUpperCase(),
      }).lean();
      return student;
    } catch (error) {
      logger.error('Error fetching student by code:', error);
      throw error;
    }
  }

  /**
   * Get count of active students
   */
  async getActiveStudentCount(): Promise<number> {
    try {
      const count = await Student.countDocuments();
      return count;
    } catch (error) {
      logger.error('Error getting student count:', error);
      throw error;
    }
  }

  /**
   * Get students by department
   */
  async getStudentsByDepartment(department: string): Promise<IStudent[]> {
    try {
      const students = await Student.find({
        department: new RegExp(department, 'i'),
      })
        .sort({ name: 1 })
        .lean();
      return students;
    } catch (error) {
      logger.error('Error fetching students by department:', error);
      throw error;
    }
  }

  /**
   * Get students by semester
   */
  async getStudentsBySemester(semester: number): Promise<IStudent[]> {
    try {
      const students = await Student.find({ semester })
        .sort({ name: 1 })
        .lean();
      return students;
    } catch (error) {
      logger.error('Error fetching students by semester:', error);
      throw error;
    }
  }

  /**
   * Bulk create students
   */
  async bulkCreateStudents(
    data: Array<{
      studentCode: string;
      name: string;
      email?: string;
      department?: string;
      semester?: number;
    }>
  ): Promise<IStudent[]> {
    try {
      const students = await Student.insertMany(
        data.map((d) => ({
          ...d,
          studentCode: d.studentCode.toUpperCase(),
        })),
        { ordered: false }
      );

      logger.info(`Bulk created ${students.length} students`);
      return students.map((s) => s.toObject());
    } catch (error) {
      logger.error('Error bulk creating students:', error);
      throw error;
    }
  }

  /**
   * Get student statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byDepartment: Record<string, number>;
    bySemester: Record<number, number>;
  }> {
    try {
      const total = await Student.countDocuments();

      // Count by department
      const byDepartment = await Student.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            department: '$_id',
            count: 1,
          },
        },
      ]);

      // Count by semester
      const bySemester = await Student.aggregate([
        {
          $group: {
            _id: '$semester',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            semester: '$_id',
            count: 1,
          },
        },
      ]);

      // Convert arrays to objects
      const departmentMap: Record<string, number> = {};
      byDepartment.forEach((d: any) => {
        departmentMap[d.department || 'Unassigned'] = d.count;
      });

      const semesterMap: Record<number, number> = {};
      bySemester.forEach((s: any) => {
        if (s.semester) {
          semesterMap[s.semester] = s.count;
        }
      });

      return {
        total,
        byDepartment: departmentMap,
        bySemester: semesterMap,
      };
    } catch (error) {
      logger.error('Error getting student statistics:', error);
      throw error;
    }
  }
}

export const studentService = new StudentService();