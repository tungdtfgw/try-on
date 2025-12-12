import { supabase, supabaseStorage } from '../config/supabase.js';
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
 * Service: Lấy thông tin profile của user
 * @param {string} userId - ID của user
 * @returns {Promise<Object>} Profile object
 */
export const getProfile = async (userId) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, height_cm, weight_kg, body_photo_url, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw new AppError('Không tìm thấy hồ sơ', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  if (!profile) {
    throw new AppError('Không tìm thấy hồ sơ', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  return profile;
};

/**
 * Service: Cập nhật thông tin profile
 * @param {string} userId - ID của user
 * @param {Object} updateData - Dữ liệu cập nhật { display_name?, height_cm?, weight_kg? }
 * @returns {Promise<Object>} Updated profile object
 */
export const updateProfile = async (userId, updateData) => {
  const { display_name, height_cm, weight_kg } = updateData;

  // Validate height_cm if provided
  if (height_cm !== undefined && height_cm !== null) {
    const height = Number(height_cm);
    if (isNaN(height) || height < 100 || height > 250) {
      throw new AppError('Chiều cao phải từ 100cm đến 250cm', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }
  }

  // Validate weight_kg if provided
  if (weight_kg !== undefined && weight_kg !== null) {
    const weight = Number(weight_kg);
    if (isNaN(weight) || weight < 30 || weight > 250) {
      throw new AppError('Cân nặng phải từ 30kg đến 250kg', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }
  }

  // Validate display_name length if provided
  if (display_name !== undefined && display_name !== null && display_name.length > 100) {
    throw new AppError('Tên hiển thị không được vượt quá 100 ký tự', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Build update object (only include fields that are provided)
  const updateObject = {};
  if (display_name !== undefined) updateObject.display_name = display_name || null;
  if (height_cm !== undefined) updateObject.height_cm = height_cm ? Number(height_cm) : null;
  if (weight_kg !== undefined) updateObject.weight_kg = weight_kg ? Number(weight_kg) : null;

  // Update profile
  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(updateObject)
    .eq('id', userId)
    .select('id, email, display_name, height_cm, weight_kg, body_photo_url, created_at, updated_at')
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    
    // Handle constraint violations
    if (error.code === '23514') {
      // Check constraint violation
      if (error.message.includes('height_cm')) {
        throw new AppError('Chiều cao phải từ 100cm đến 250cm', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
      }
      if (error.message.includes('weight_kg')) {
        throw new AppError('Cân nặng phải từ 30kg đến 250kg', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
      }
    }

    const errorMessage =
      process.env.NODE_ENV === 'production'
        ? 'Cập nhật hồ sơ thất bại, vui lòng thử lại'
        : `Lỗi cập nhật: ${error.message}`;

    throw new AppError(errorMessage, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  if (!updatedProfile) {
    throw new AppError('Không tìm thấy hồ sơ', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }

  return updatedProfile;
};

/**
 * Service: Upload ảnh toàn thân lên Supabase Storage
 * @param {string} userId - ID của user
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - MIME type của file
 * @param {string} originalName - Tên file gốc
 * @returns {Promise<string>} Public URL của ảnh
 */
export const uploadBodyPhoto = async (userId, fileBuffer, mimeType, originalName) => {
  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new AppError('Chỉ chấp nhận file jpg, jpeg hoặc png', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Validate file size (5MB = 5242880 bytes)
  const maxSize = 5242880;
  if (fileBuffer.length > maxSize) {
    throw new AppError('Dung lượng file không được vượt quá 5MB', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }

  // Determine file extension
  const extension = mimeType === 'image/jpeg' || mimeType === 'image/jpg' ? 'jpg' : 'png';
  const fileName = `${userId}/body-photo.${extension}`;

  // Get current profile to check for existing photo
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('body_photo_url')
    .eq('id', userId)
    .single();

  // Delete old photo if exists
  if (currentProfile?.body_photo_url) {
    try {
      // Extract file path from URL
      // URL format: https://xxx.supabase.co/storage/v1/object/sign/body-photos/{userId}/body-photo.{ext}?token=...
      // Or: https://xxx.supabase.co/storage/v1/object/public/body-photos/{userId}/body-photo.{ext}
      const url = new URL(currentProfile.body_photo_url);
      const pathParts = url.pathname.split('/');
      // Find 'body-photos' in path and get everything after it
      const bodyPhotosIndex = pathParts.indexOf('body-photos');
      if (bodyPhotosIndex !== -1 && pathParts.length > bodyPhotosIndex + 2) {
        const oldFileName = `${pathParts[bodyPhotosIndex + 1]}/${pathParts[bodyPhotosIndex + 2]}`;
        
        const { error: deleteError } = await supabaseStorage.storage
          .from('body-photos')
          .remove([oldFileName]);

        if (deleteError) {
          console.warn('Warning: Could not delete old photo:', deleteError);
          // Continue with upload even if delete fails
        }
      }
    } catch (error) {
      console.warn('Warning: Error deleting old photo:', error);
      // Continue with upload
    }
  }

  // Upload new photo using storage client (with service role key if available)
  const { data: uploadData, error: uploadError } = await supabaseStorage.storage
    .from('body-photos')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true, // Replace if exists
    });

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    throw new AppError('Upload ảnh thất bại, vui lòng thử lại', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  // Get signed URL (valid for 1 year) since bucket is private
  // For private buckets, we need signed URLs instead of public URLs
  const { data: signedUrlData, error: signedUrlError } = await supabaseStorage.storage
    .from('body-photos')
    .createSignedUrl(fileName, 31536000); // 1 year in seconds

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error('Error creating signed URL:', signedUrlError);
    // Try to delete uploaded file
    await supabaseStorage.storage.from('body-photos').remove([fileName]);
    throw new AppError('Không thể lấy URL ảnh', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  // Update profile with new photo URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ body_photo_url: signedUrlData.signedUrl })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating profile with photo URL:', updateError);
    // Try to delete uploaded file
    await supabaseStorage.storage.from('body-photos').remove([fileName]);
    throw new AppError('Cập nhật hồ sơ thất bại', HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }

  return signedUrlData.signedUrl;
};
