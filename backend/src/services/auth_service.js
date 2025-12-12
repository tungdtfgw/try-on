import { supabase } from '../config/supabase.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Service: Đăng ký user mới
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu (tối thiểu 8 ký tự)
 * @returns {Promise<Object>} User object
 */
export const registerUser = async (email, password) => {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new AppError('Email không hợp lệ', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Validate password length
  if (!password || password.length < 8) {
    throw new AppError('Mật khẩu phải có ít nhất 8 ký tự', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Normalize email: lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();

  // Sign up user via Supabase Auth
  // Supabase will automatically check for duplicate emails and trigger profile creation
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: password,
    options: {
      emailRedirectTo: undefined, // Disable email redirect for now
    },
  });

  if (error) {
    // Log error for debugging
    console.error('Supabase signUp error:', {
      message: error.message,
      status: error.status,
      name: error.name,
      error: error,
    });

    // Handle Supabase specific errors
    if (
      error.message.includes('already registered') ||
      error.message.includes('already exists') ||
      error.message.includes('User already registered') ||
      error.message.includes('email address is already registered') ||
      error.message.includes('already been registered')
    ) {
      throw new AppError('Email đã được sử dụng', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    // Return more specific error message in development
    const errorMessage =
      process.env.NODE_ENV === 'production'
        ? 'Đã có lỗi xảy ra, vui lòng thử lại'
        : `Lỗi đăng ký: ${error.message}`;

    throw new AppError(errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  // Check if user was created (even if email confirmation is required)
  if (!data || !data.user) {
    console.error('Supabase signUp: No user returned', { data });
    throw new AppError('Đã có lỗi xảy ra, vui lòng thử lại', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  // Log success for debugging
  console.log('User registered successfully:', {
    id: data.user.id,
    email: data.user.email,
    confirmed: data.user.email_confirmed_at !== null,
  });

  // Profile will be auto-created by trigger (handle_new_user)
  // Note: Even if email confirmation is required, the user and profile are created
  return {
    id: data.user.id,
    email: data.user.email,
  };
};
