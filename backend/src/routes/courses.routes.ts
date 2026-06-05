import { Router } from 'express';
import { courseService } from '../services/course.service';
import { validateRequest, createCourseSchema, updateCourseSchema } from '../middleware/validators';
import { logger } from '../utils/logger';

const router = Router();

// ===== GET ALL COURSES =====
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const { courses, total, pages } = await courseService.getAllCourses(
      page,
      limit,
      search
    );

    res.json({
      success: true,
      data: courses,
      pagination: { page, limit, total, pages },
    });
  } catch (error: any) {
    logger.error('GET /courses error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GET COURSE BY ID =====
router.get('/:id', async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({ success: true, data: course });
  } catch (error: any) {
    logger.error(`GET /courses/:id error:`, error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== CREATE COURSE =====
router.post('/', validateRequest(createCourseSchema), async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    logger.error('POST /courses error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== UPDATE COURSE =====
router.put('/:id', validateRequest(updateCourseSchema), async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({ success: true, data: course });
  } catch (error: any) {
    logger.error('PUT /courses/:id error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== DELETE COURSE =====
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await courseService.deleteCourse(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    logger.error('DELETE /courses/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== GET STUDENT COUNT FOR COURSE =====
router.get('/:id/students-count', async (req, res) => {
  try {
    const count = await courseService.getStudentCount(req.params.id);
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    logger.error('GET /courses/:id/students-count error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;