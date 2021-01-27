import { Router } from 'express';
import { checkSchema, body, param, Schema } from 'express-validator';
import jwtMiddleware from '../../middleware/jwt.middleware';
import { genToken, verifyToken } from '../../controllers/api.controller';
import { addClient, getClient } from '../../controllers/client.controllers';
import { addNewUser, authenticate, resetPassword, updateUser } from '../../controllers/user.controller';
import { globalConfig } from '../../config';

const {
    passwordMaxLength,
    passwordMinLength
} = globalConfig;

const UserSchema: Schema = {
    firstName: {
        isLength: {
            errorMessage: 'firstName should be at least 3 chars long.',
            options: { min: 3 }
        }
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
            errorMessage: 'Password should be at least 6 chars long and Maximum of 16 chars long.',
            options: { min: passwordMinLength, max: passwordMaxLength }
        },
        notEmpty: true,
    }
}

const router = Router();
// Token
router.post('/token', jwtMiddleware, genToken);
router.post('/token/validate', jwtMiddleware, verifyToken);

// Clients
router.get('/clients', jwtMiddleware, getClient);
router.post('/client', jwtMiddleware, addClient);

// User
// Authenticate User
router.post(
    '/user/authenticate',
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isStrongPassword({ minLength: passwordMinLength }).isLength({ max: passwordMaxLength }),
    jwtMiddleware,
    authenticate
);
// Reset User Password
router.post(
    '/user/resetpassword',
    body('email').isEmail().normalizeEmail(),
    jwtMiddleware,
    resetPassword
)
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
    checkSchema({
        ...UserSchema,
        email: {
            isEmpty: true
        }
    }, ['body']),
    jwtMiddleware,
    updateUser
);


export default router;