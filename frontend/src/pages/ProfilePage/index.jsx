import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, uploadPhoto } from '../../services/profile_service.js';
import { cn } from '../../utils/cn.js';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';

// Validation schema
const profileSchema = z.object({
  display_name: z.string().max(100, 'Tên hiển thị không được vượt quá 100 ký tự').optional().or(z.literal('')),
  height_cm: z
    .union([
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.number(),
    ])
    .refine((val) => val === undefined || (!isNaN(val) && val >= 100 && val <= 250), {
      message: 'Chiều cao phải từ 100cm đến 250cm',
    })
    .optional(),
  weight_kg: z
    .union([
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.number(),
    ])
    .refine((val) => val === undefined || (!isNaN(val) && val >= 30 && val <= 250), {
      message: 'Cân nặng phải từ 30kg đến 250kg',
    })
    .optional(),
});

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: '',
      height_cm: '',
      weight_kg: '',
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        display_name: profile.display_name || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
      });
      if (profile.body_photo_url) {
        setPreviewUrl(profile.body_photo_url);
      }
    }
  }, [profile, reset]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data) => {
      const updateData = {};
      if (data.display_name !== undefined && data.display_name !== '') {
        updateData.display_name = data.display_name;
      }
      if (data.height_cm !== undefined && data.height_cm !== '') {
        updateData.height_cm = Number(data.height_cm);
      }
      if (data.weight_kg !== undefined && data.weight_kg !== '') {
        updateData.weight_kg = Number(data.weight_kg);
      }
      return updateProfile(updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Cập nhật hồ sơ thành công');
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Cập nhật hồ sơ thất bại');
    },
  });

  // Upload photo mutation
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadPhoto(file),
    onSuccess: (url) => {
      setPreviewUrl(url);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Upload ảnh thành công');
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Upload ảnh thất bại');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file jpg, jpeg hoặc png');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      alert('Dung lượng file không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('Vui lòng chọn ảnh');
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <p className="text-red-600">Có lỗi xảy ra khi tải hồ sơ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ của tôi</h2>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
                Tên hiển thị (tùy chọn)
              </label>
              <input
                {...registerField('display_name')}
                type="text"
                id="display_name"
                className={cn(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  errors.display_name ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Nhập tên hiển thị"
              />
              {errors.display_name && (
                <p className="mt-1 text-sm text-red-600">{errors.display_name.message}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700 mb-2">
                Chiều cao (cm)
              </label>
              <input
                {...registerField('height_cm')}
                type="number"
                id="height_cm"
                min="100"
                max="250"
                className={cn(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  errors.height_cm ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="100-250"
              />
              {errors.height_cm && (
                <p className="mt-1 text-sm text-red-600">{errors.height_cm.message}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700 mb-2">
                Cân nặng (kg)
              </label>
              <input
                {...registerField('weight_kg')}
                type="number"
                id="weight_kg"
                min="30"
                max="250"
                className={cn(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  errors.weight_kg ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="30-250"
              />
              {errors.weight_kg && (
                <p className="mt-1 text-sm text-red-600">{errors.weight_kg.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          </form>

          {/* Photo Upload Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ảnh toàn thân</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload ảnh chân dung toàn thân (jpg, jpeg, png, tối đa 5MB). Khuyến nghị tỷ lệ 3:4 hoặc 9:16.
            </p>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Body photo preview"
                  className="max-w-xs max-h-96 object-contain rounded-md border border-gray-300"
                />
              </div>
            )}

            {/* File Input */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Chọn ảnh
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={uploadMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadMutation.isPending ? 'Đang upload...' : 'Upload ảnh'}
                </button>
              )}
            </div>

            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">Đã chọn: {selectedFile.name}</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
