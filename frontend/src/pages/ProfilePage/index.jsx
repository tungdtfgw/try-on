import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, uploadPhoto } from '../../services/profile_service.js';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';

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
  const [notification, setNotification] = useState(null);
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
      setNotification({ type: 'success', message: 'Cập nhật hồ sơ thành công' });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error?.response?.data?.error?.message || 'Cập nhật hồ sơ thất bại',
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  // Upload photo mutation
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadPhoto(file),
    onSuccess: (url) => {
      setPreviewUrl(url);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setNotification({ type: 'success', message: 'Upload ảnh thành công' });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error?.response?.data?.error?.message || 'Upload ảnh thất bại',
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setNotification({ type: 'error', message: 'Chỉ chấp nhận file jpg, jpeg hoặc png' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      setNotification({ type: 'error', message: 'Dung lượng file không được vượt quá 5MB' });
      setTimeout(() => setNotification(null), 3000);
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
      setNotification({ type: 'error', message: 'Vui lòng chọn ảnh' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    uploadMutation.mutate(selectedFile);
  };

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-grayLight">
        <AuthenticatedHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Spinner className="mx-auto" />
            <p className="mt-4 text-sm text-brand-grayMedium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-grayLight">
        <AuthenticatedHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Alert variant="error">Có lỗi xảy ra khi tải hồ sơ</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grayLight">
      <AuthenticatedHeader />
      <div className="py-xl mt-4">
        <Container className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-section-heading font-black text-brand-black tracking-heading uppercase">
              Hồ sơ của tôi
            </h1>
            <p className="mt-2 text-sm text-brand-grayMedium">
              Quản lý thông tin cá nhân và ảnh toàn thân
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-brand-grayLight/30 border-0 shadow-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-purpleLight flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-black text-brand-black">
                  Thông tin tài khoản
                </h2>
                <p className="text-xs text-brand-grayMedium">
                  Cập nhật thông tin của bạn
                </p>
              </div>
            </div>

            {notification ? (
              <Alert
                className="mt-6"
                variant={notification.type === 'success' ? 'success' : 'error'}
              >
                {notification.message}
              </Alert>
            ) : null}

          {/* Email (read-only) */}
            <div className="mt-6">
              <Input
                id="email"
                type="email"
                label="Email"
                value={profile?.email || ''}
                disabled
                hint="Email không thể thay đổi"
              />
            </div>

          {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Display Name */}
              <Input
                {...registerField('display_name')}
                id="display_name"
                type="text"
                label="Tên hiển thị (tùy chọn)"
                placeholder="Nhập tên hiển thị"
                error={errors.display_name?.message}
              />

            {/* Height */}
              <Input
                {...registerField('height_cm')}
                id="height_cm"
                type="number"
                min="100"
                max="250"
                label="Chiều cao (cm)"
                placeholder="100-250"
                error={errors.height_cm?.message}
              />

            {/* Weight */}
              <Input
                {...registerField('weight_kg')}
                id="weight_kg"
                type="number"
                min="30"
                max="250"
                label="Cân nặng (kg)"
                placeholder="30-250"
                error={errors.weight_kg?.message}
              />

            {/* Submit Button */}
              <Button type="submit" className="w-full" isLoading={updateMutation.isPending}>
                Lưu thông tin
              </Button>
            </form>

          {/* Photo Upload Section */}
            <div className="mt-10 pt-8 border-t-2 border-brand-yellow/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyanLight flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-black text-brand-black">Ảnh toàn thân</h2>
                  <p className="text-xs text-brand-grayMedium">
                    Upload ảnh chân dung toàn thân (jpg, jpeg, png, tối đa 5MB). Tỷ lệ 3:4 hoặc 9:16.
              </p>
                </div>
              </div>

            {/* Preview */}
              {previewUrl ? (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Body photo preview"
                    className="max-w-xs max-h-96 object-contain rounded-md border-2 border-brand-yellow/50 bg-white shadow-card"
                  />
                </div>
              ) : null}

            {/* File Input */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <label htmlFor="file-upload" className="inline-flex">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="block w-full text-sm file:mr-4 file:rounded-sm file:border-0 file:bg-gradient-to-r file:from-brand-orange file:to-brand-orangeLight file:px-4 file:py-2 file:font-medium file:uppercase file:tracking-wide file:text-white hover:file:opacity-90 file:transition-all file:cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>

                {selectedFile ? (
                  <Button
                    type="button"
                    onClick={handleFileUpload}
                    isLoading={uploadMutation.isPending}
                  >
                    Upload ảnh
                  </Button>
                ) : null}
              </div>

              {selectedFile ? (
                <p className="mt-2 text-sm text-brand-grayMedium">Đã chọn: {selectedFile.name}</p>
              ) : null}
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;
