import { Router } from 'express';
import { checkSchema, body, param, Schema } from 'express-validator';
import jwtMiddleware from '../../../middleware/jwt.middleware';
import apiKeyMiddleware from '../../../middleware/apiKey.middleware';
import {
  addNewUser,
  authenticate,
  resetPassword,
  updateUser,
  getUser,
} from '../../../controllers/user.controller';
import { globalConfig } from '@node-api-gateway/config';

const { passwordMaxLength, passwordMinLength } = globalConfig;

const UserSchema: Schema = {
  firstName: {
    isLength: {
      errorMessage: 'firstName should be at least 3 chars long.',
      options: { min: 3 },
    },
  },
  lastName: {
    notEmpty: true,
  },
  email: {
    isEmail: true,
    notEmpty: true,
  },
  password: {
    isStrongPassword: true,
    isLength: {
      errorMessage:
        'Password should be at least 6 chars long and Maximum of 16 chars long.',
      options: { min: passwordMinLength, max: passwordMaxLength },
    },
    notEmpty: true,
  },
  role: {
    optional: true,
  },
};

const router = Router();
router.post(
  '/user/authenticate',
  body('email').isEmail(),
  body('password')
    .notEmpty()
    .isStrongPassword({ minLength: passwordMinLength })
    .isLength({ max: passwordMaxLength }),
  apiKeyMiddleware,
  authenticate
);
// Reset User Password
router.post(
  '/user/resetpassword',
  body('email').isEmail(),
  jwtMiddleware,
  resetPassword
);
// Create new User
router.post(
  '/user',
  checkSchema(UserSchema, ['body']),
  jwtMiddleware,
  addNewUser
);
// Update existing User
router.put(
  '/user/:id',
  param('id').isMongoId(),
  checkSchema(
    {
      ...UserSchema,
      email: {
        isEmpty: true,
      },
    },
    ['body']
  ),
  jwtMiddleware,
  updateUser
);
// get Current User
router.get('/user', jwtMiddleware, getUser);

export default router;
