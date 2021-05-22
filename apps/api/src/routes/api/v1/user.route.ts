import { Router } from 'express';
import jwtMiddleware from '../../../middleware/jwt.middleware';
import apiKeyMiddleware from '../../../middleware/apiKey.middleware';
import validator from '../../../middleware/validator.middleware';
import {
  addNewUser,
  authenticate,
  resetPassword,
  updateUser,
  getUser,
} from '../../../controllers/user.controller';
import {
  newUserValidator,
  loginValidator,
  resetPassValidator,
  updateUserValidator,
} from '@node-api-gateway/validators';

const router = Router();
router.post(
  '/user/authenticate',
  validator(loginValidator),
  apiKeyMiddleware,
  authenticate
);

// Reset User Password
router.post(
  '/user/resetpassword',
  validator(resetPassValidator),
  jwtMiddleware,
  resetPassword
);

// Create new User
router.post('/user', validator(newUserValidator), jwtMiddleware, addNewUser);

// Update existing User
router.put(
  '/user/:id',
  // param('id').isMongoId(),
  validator(updateUserValidator),
  jwtMiddleware,
  updateUser
);

// get Current User
router.get('/user', jwtMiddleware, getUser);

export default router;
