import { Router } from 'express';
import { timetableService } from '../services/timetable.service';
import { algorithmService } from '../services/algorithm.service';
import { logger } from '../utils/logger';

const router = Router();

// ===== GET ALL TIMETABLES =====
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { timetables, total, pages } = await timetableService.getAllTimetables(
      page,
      limit
    );

    res.json({
      success: true,
      data: timetables,
      pagination: { page, limit, total, pages },
    });
  } catch (error: any) {
    logger.error('GET /timetables error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GET TIMETABLE BY ID =====
router.get('/:id', async (req, res) => {
  try {
    const timetable = await timetableService.getTimetableById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found',
      });
    }

    res.json({ success: true, data: timetable });
  } catch (error: any) {
    logger.error('GET /timetables/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== CREATE TIMETABLE =====
router.post('/', async (req, res) => {
  try {
    const { name, description, academicYear, semester, config, courseIds } =
      req.body;

    if (!name || !config || !courseIds || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'name, config, and courseIds (non-empty) are required',
      });
    }

    const timetable = await timetableService.createTimetable({
      name,
      description,
      academicYear,
      semester,
      config,
      courseIds,
    });

    res.status(201).json({ success: true, data: timetable });
  } catch (error: any) {
    logger.error('POST /timetables error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GENERATE TIMETABLE (Run Algorithm) =====
router.post('/:id/generate', async (req, res) => {
  try {
    // Run algorithm
    const result = await algorithmService.generateTimetable(req.params.id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Algorithm failed',
      });
    }

    // Save slots to timetable
    const updated = await timetableService.updateTimetableSlots(
      req.params.id,
      result.slots,
      result.stats
    );

    res.json({
      success: true,
      data: updated,
      stats: result.stats,
    });
  } catch (error: any) {
    logger.error('POST /timetables/:id/generate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== UPDATE TIMETABLE SLOTS =====
router.put('/:id/slots', async (req, res) => {
  try {
    const { slots, stats } = req.body;

    if (!slots || !stats) {
      return res.status(400).json({
        success: false,
        error: 'slots and stats are required',
      });
    }

    const timetable = await timetableService.updateTimetableSlots(
      req.params.id,
      slots,
      stats
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found',
      });
    }

    res.json({ success: true, data: timetable });
  } catch (error: any) {
    logger.error('PUT /timetables/:id/slots error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== DELETE TIMETABLE =====
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await timetableService.deleteTimetable(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found',
      });
    }

    res.json({
      success: true,
      message: 'Timetable deleted successfully',
    });
  } catch (error: any) {
    logger.error('DELETE /timetables/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== FINALIZE TIMETABLE =====
router.put('/:id/finalize', async (req, res) => {
  try {
    const timetable = await timetableService.finalizeTimetable(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found',
      });
    }

    res.json({ success: true, data: timetable });
  } catch (error: any) {
    logger.error('PUT /timetables/:id/finalize error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GET TIMETABLE CONFLICTS =====
router.get('/:id/conflicts', async (req, res) => {
  try {
    const conflicts = await timetableService.getConflicts(req.params.id);

    res.json({
      success: true,
      data: conflicts,
      total: conflicts.length,
    });
  } catch (error: any) {
    logger.error('GET /timetables/:id/conflicts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GET TIMETABLE STATISTICS =====
router.get('/:id/statistics', async (req, res) => {
  try {
    const stats = await timetableService.getStatistics(req.params.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    logger.error('GET /timetables/:id/statistics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;