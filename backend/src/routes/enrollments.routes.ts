import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ success: true, data: [], message: 'Enrollments route works!' });
});

export default router;