import { supabase } from '../config/supabase.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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

  // Check if email already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', normalizedEmail)
    .single();

  if (existingUser) {
    throw new AppError('Email đã được sử dụng', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Generate UUID for new user
  const userId = randomUUID();

  // Insert user directly into profiles table
  const { data: newUser, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: normalizedEmail,
      password_hash: passwordHash,
    })
    .select('id, email')
    .single();

  if (insertError) {
    console.error('Error creating user:', insertError);
    
    // Handle duplicate email error
    if (insertError.code === '23505' || insertError.message.includes('unique')) {
      throw new AppError('Email đã được sử dụng', HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    const errorMessage =
      process.env.NODE_ENV === 'production'
        ? 'Đã có lỗi xảy ra, vui lòng thử lại'
        : `Lỗi đăng ký: ${insertError.message}`;

    throw new AppError(errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  if (!newUser) {
    console.error('No user returned after insert');
    throw new AppError('Đã có lỗi xảy ra, vui lòng thử lại', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  // Log success for debugging
  console.log('User registered successfully:', {
    id: newUser.id,
    email: newUser.email,
  });

  return {
    id: newUser.id,
    email: newUser.email,
  };
};

/**
 * Service: Đăng nhập user
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Object chứa token, user, và profile
 */
export const loginUser = async (email, password) => {
  // Validate input không rỗng
  if (!email || !password) {
    throw new AppError('Vui lòng nhập đầy đủ thông tin', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Normalize email: lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();

  // Get user from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id, email, password_hash, display_name, height_cm, weight_kg, body_photo_url, role, created_at, updated_at'
    )
    .eq('email', normalizedEmail)
    .single();

  if (profileError || !profile) {
    // Don't reveal if email exists or not (security best practice)
    throw new AppError('Email hoặc mật khẩu không đúng', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, profile.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không đúng', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }

  // Generate JWT token
  const tokenPayload = {
    sub: profile.id,
    email: profile.email,
    role: profile.role || 'user',
  };
  const token = generateToken(tokenPayload);

  // Remove password_hash from profile data before returning
  const { password_hash, ...profileWithoutPassword } = profile;

  // Return token, user, and profile
  return {
    token,
    user: {
      id: profile.id,
      email: profile.email,
    },
    profile: profileWithoutPassword,
  };
};
