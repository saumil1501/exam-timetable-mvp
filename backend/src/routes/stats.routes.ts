import { Router } from 'express';
import { enrollmentService } from '../services/enrollment.service';
import { logger } from '../utils/logger';

const router = Router();

// ===== GET DASHBOARD STATISTICS =====
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await enrollmentService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    logger.error('GET /stats/dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;