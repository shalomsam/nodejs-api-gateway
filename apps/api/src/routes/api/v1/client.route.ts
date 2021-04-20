import { Router } from 'express';
import jwtMiddleware from '../../../middleware/jwt.middleware';
import { addClient, getClient } from '../../../controllers/client.controller';

const router = Router();
router.get('/clients', jwtMiddleware, getClient);
router.post('/client', jwtMiddleware, addClient);

export default router;
