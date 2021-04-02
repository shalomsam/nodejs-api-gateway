import { Router } from 'express';
import apiRoutes from './api/v1';
import gatewayRoutes from './gateway.route';

const router = Router();
const version = 'v1'

router.use(`/api/${version}`, apiRoutes);
router.use('/gateway', gatewayRoutes);

export default router;
