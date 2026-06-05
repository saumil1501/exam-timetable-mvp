import { Router } from 'express';
import { enrollmentService } from '../services/enrollment.service';
import { logger } from '../utils/logger';

const router = Router();

// ===== GET ALL ENROLLMENTS =====
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { enrollments, total, pages } = await enrollmentService.getAllEnrollments(
      page,
      limit
    );

    res.json({
      success: true,
      data: enrollments,
      pagination: { page, limit, total, pages },
    });
  } catch (error: any) {
    logger.error('GET /enrollments error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CREATE ENROLLMENT =====
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'studentId and courseId are required',
      });
    }

    const enrollment = await enrollmentService.createEnrollment(studentId, courseId);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error: any) {
    logger.error('POST /enrollments error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== DELETE ENROLLMENT =====
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await enrollmentService.deleteEnrollment(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    res.json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error: any) {
    logger.error('DELETE /enrollments/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== GET ENROLLMENTS BY STUDENT =====
router.get('/student/:studentId', async (req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollmentsByStudent(
      req.params.studentId
    );

    res.json({ success: true, data: enrollments });
  } catch (error: any) {
    logger.error('GET /enrollments/student/:studentId error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== GET ENROLLMENTS BY COURSE =====
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollmentsByCourse(
      req.params.courseId
    );

    res.json({ success: true, data: enrollments });
  } catch (error: any) {
    logger.error('GET /enrollments/course/:courseId error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== GET ALL CONFLICTS =====
router.get('/conflicts/all', async (req, res) => {
  try {
    const conflicts = await enrollmentService.getAllConflicts();

    res.json({
      success: true,
      data: conflicts,
      total: conflicts.length,
    });
  } catch (error: any) {
    logger.error('GET /enrollments/conflicts/all error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;