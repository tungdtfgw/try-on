import { z } from 'zod';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

/**
 * Custom error class for validation errors
 */
class ValidationError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ValidationError';
  }
}

/**
 * Middleware factory to validate request body with Zod schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        const validationError = new ValidationError(
          firstError.message || 'Validation failed',
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.VALIDATION_ERROR
        );
        return next(validationError);
      }
      next(error);
    }
  };
};

/**
 * Register validation schema
 */
const registerSchema = z.object({
  email: z
    .string({
      required_error: 'Email là bắt buộc',
      invalid_type_error: 'Email phải là chuỗi',
    })
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string({
      required_error: 'Mật khẩu là bắt buộc',
      invalid_type_error: 'Mật khẩu phải là chuỗi',
    })
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

/**
 * Middleware: Validate register request
 */
export const validateRegister = validate(registerSchema);
