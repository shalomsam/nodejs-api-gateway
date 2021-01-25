import { genToken, verifyToken } from '../../controllers/api.controller';
import { Router } from 'express';
import jwtMiddleware from '../../middleware/jwt.middleware';
import { addClient, getClient } from '../../controllers/client.controllers';

const router = Router();
router.post('/token', jwtMiddleware, genToken);
router.post('/token/validate', jwtMiddleware, verifyToken);
router.get('/clients', jwtMiddleware, getClient);
router.post('/client', jwtMiddleware, addClient)

export default router;