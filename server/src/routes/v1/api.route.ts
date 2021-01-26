import { Router } from 'express';
import jwtMiddleware from '../../middleware/jwt.middleware';
import { genToken, verifyToken } from '../../controllers/api.controller';
import { addClient, getClient } from '../../controllers/client.controllers';
import { addNewUser, authenticate, updateUser } from '../../controllers/user.controller';

const router = Router();
// Token
router.post('/token', jwtMiddleware, genToken);
router.post('/token/validate', jwtMiddleware, verifyToken);

// Clients
router.get('/clients', jwtMiddleware, getClient);
router.post('/client', jwtMiddleware, addClient);

// User
router.post('/user/authenticate', authenticate);
router.put('/user/:id', updateUser);
router.post('/user', addNewUser);


export default router;