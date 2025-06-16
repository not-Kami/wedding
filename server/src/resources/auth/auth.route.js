import { Router } from 'express';
<<<<<<< HEAD
import { register, login } from './auth.controller.js';
=======
import { register, login, refreshToken } from './auth.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
>>>>>>> e96b766 (improved basic component & navigation)

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
<<<<<<< HEAD
=======
authRouter.post('/refresh-token', refreshToken);
>>>>>>> e96b766 (improved basic component & navigation)

export default authRouter;