import { HTTP_STATUS } from '../config/constants.js';
import * as profileService from '../services/profile_service.js';

/**
 * Controller: Lấy thông tin profile của user hiện tại
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    const profile = await profileService.getProfile(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Cập nhật thông tin profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const { display_name, height_cm, weight_kg } = req.body;

    const updatedProfile = await profileService.updateProfile(userId, {
      display_name,
      height_cm,
      weight_kg,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Upload ảnh toàn thân
 */
export const uploadPhoto = async (req, res, next) => {
  try {
    const userId = req.user.sub;

    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng chọn ảnh',
        },
      });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    const photoUrl = await profileService.uploadBodyPhoto(userId, fileBuffer, mimeType, originalName);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        body_photo_url: photoUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
