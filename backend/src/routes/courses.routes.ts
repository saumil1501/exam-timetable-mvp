import { Router } from 'express';

const router = Router();

// GET /api/courses
router.get('/', async (req, res) => {
  res.json({ success: true, data: [], message: 'Courses route works!' });
});

export default router;