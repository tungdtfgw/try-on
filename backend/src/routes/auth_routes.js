import express from 'express';
import { register, login } from '../controllers/auth_controller.js';
import { validateRegister, validateLogin } from '../middlewares/validation_middleware.js';

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Đăng ký tài khoản mới
 * Body: { email, password }
 */
router.post('/register', validateRegister, register);

/**
 * POST /api/v1/auth/login
 * Đăng nhập
 * Body: { email, password }
 */
router.post('/login', validateLogin, login);

export default router;
