import express from 'express';
import { register } from '../controllers/auth_controller.js';
import { validateRegister } from '../middlewares/validation_middleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 * Body: { email, password }
 */
router.post('/register', validateRegister, register);

export default router;
