import { Router } from 'express';
import { gatewayController } from '../controllers/gateway.controller';

const router = Router();
router.all('/:basePath/:apiPath*', gatewayController);

export default router;
