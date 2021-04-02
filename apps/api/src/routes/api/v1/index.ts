import { Router } from "express";
import clientRoute from '../v1/client.route';
import tokenRoute from '../v1/token.route';
import userRoute from '../v1/user.route';

const router = Router();
router.use('/', [ clientRoute, tokenRoute, userRoute ]);

export default router;
