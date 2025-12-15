import { verifyToken } from '../utils/jwt.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'No token provided',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid or expired token',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const isAdminMiddleware = (req, res, next) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Admin role is required to access this resource',
        },
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

