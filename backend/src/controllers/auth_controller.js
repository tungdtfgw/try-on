import { HTTP_STATUS } from '../config/constants.js';
import * as authService from '../services/auth_service.js';

/**
 * Controller: Đăng ký tài khoản mới
 */
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.registerUser(email, password);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
