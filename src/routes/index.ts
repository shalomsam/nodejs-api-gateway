import { Router } from 'express';
import apiRoutes from './v1/api.route';
import dashRoutes from './dashboard/index.route';

const router = Router();
const version = 'v1'

router.use(`/api/${version}`, apiRoutes);
router.use('/', dashRoutes)

export default router;
