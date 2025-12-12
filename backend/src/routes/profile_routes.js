import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadPhoto } from '../controllers/profile_controller.js';
import { authMiddleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

// Configure multer for memory storage (we'll upload directly to Supabase)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5242880, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file jpg, jpeg hoặc png'), false);
    }
  },
});

/**
 * GET /api/v1/user/profile
 * Lấy thông tin profile của user hiện tại
 * Auth: Required
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * PUT /api/v1/user/profile
 * Cập nhật thông tin profile
 * Auth: Required
 * Body: { display_name?, height_cm?, weight_kg? }
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * POST /api/v1/user/profile/photo
 * Upload ảnh toàn thân
 * Auth: Required
 * Content-Type: multipart/form-data
 * Form field: file
 */
router.post(
  '/profile/photo',
  authMiddleware,
  upload.single('file'),
  (err, req, res, next) => {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dung lượng file không được vượt quá 5MB',
          },
        });
      }
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
        },
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message || 'File không hợp lệ',
        },
      });
    }
    next();
  },
  uploadPhoto
);

export default router;
