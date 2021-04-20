import { Router } from 'express';
import jwtMiddleware from '../../../middleware/jwt.middleware';
import { genToken, verifyToken } from '../../../controllers/token.controller';

const router = Router();
router.post('/token', jwtMiddleware, genToken);
router.post('/token/validate', jwtMiddleware, verifyToken);

export default router;
