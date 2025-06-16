import { Router } from 'express';
import { register, login, refreshToken } from './auth.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;