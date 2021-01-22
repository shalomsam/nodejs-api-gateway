import { Router } from 'express';
import apiRoute from './api.route';

const router = Router();
const version = 'v1'

router.use(`/api/${version}`, apiRoute);

export default router;
