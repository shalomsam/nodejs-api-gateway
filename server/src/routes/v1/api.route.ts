import { genToken, verifyToken } from '../../controllers/token.controller';
import { Router } from 'express';

const router = Router();
router.post('/token', genToken);
router.post('/token/validate', verifyToken);

export default router;