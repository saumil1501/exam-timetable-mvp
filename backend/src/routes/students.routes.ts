import { Router } from 'express';
import { studentService } from '../services/student.service';
import { validateRequest, createStudentSchema, updateStudentSchema } from '../middleware/validators';
import { logger } from '../utils/logger';

const router = Router();

// ===== GET ALL STUDENTS =====
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const { students, total, pages } = await studentService.getAllStudents(
      page,
      limit,
      search
    );

    res.json({
      success: true,
      data: students,
      pagination: { page, limit, total, pages },
    });
  } catch (error: any) {
    logger.error('GET /students error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GET STUDENT BY ID =====
router.get('/:id', async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.json({ success: true, data: student });
  } catch (error: any) {
    logger.error('GET /students/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== CREATE STUDENT =====
router.post('/', validateRequest(createStudentSchema), async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error: any) {
    logger.error('POST /students error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== UPDATE STUDENT =====
router.put('/:id', validateRequest(updateStudentSchema), async (req, res) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.json({ success: true, data: student });
  } catch (error: any) {
    logger.error('PUT /students/:id error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== DELETE STUDENT =====
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await studentService.deleteStudent(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error: any) {
    logger.error('DELETE /students/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== GET STUDENT COURSES =====
router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await studentService.getStudentCourses(req.params.id);
    res.json({ success: true, data: courses });
  } catch (error: any) {
    logger.error('GET /students/:id/courses error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;