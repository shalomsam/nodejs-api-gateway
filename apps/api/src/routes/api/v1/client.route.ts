import { Router } from 'express';
import jwtMiddleware from '../../../middleware/jwt.middleware';
import { addClient, getClient } from '../../../controllers/client.controller';
import validator from '../../../middleware/validator.middleware';
import { newClientValidator } from '@node-api-gateway/validators';

const router = Router();
router.get('/clients', jwtMiddleware, getClient);
router.post('/client', validator(newClientValidator), jwtMiddleware, addClient);

export default router;
