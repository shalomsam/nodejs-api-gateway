import { showDashboard } from '../../controllers/dash.controller';
import { Router } from 'express';

const router = Router();
router.get('/home', showDashboard);

export default router;