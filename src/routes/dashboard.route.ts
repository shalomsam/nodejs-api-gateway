import { showDashboard } from '../controllers/dash.controller';
import { Router } from 'express';

const router = Router();
router.get('/:path?', showDashboard);

export default router;