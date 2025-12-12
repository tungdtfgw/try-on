-- Migration: Seed sample data
-- Description: Dữ liệu mẫu cho bảng profiles (Sprint 1)
-- Note: Chỉ chạy trên môi trường dev/test, không chạy trên production

-- Sample profiles for testing
-- Note: Cần tạo user qua Supabase Auth trước, sau đó profile sẽ tự động được tạo
-- Dưới đây là ví dụ cập nhật profile sau khi user đã được tạo

-- Example: Update profile with body measurements (chạy sau khi có user)
-- UPDATE public.profiles
-- SET 
--     display_name = 'Test User 1',
--     height_cm = 170,
--     weight_kg = 65
-- WHERE email = 'test1@example.com';

-- UPDATE public.profiles
-- SET 
--     display_name = 'Test User 2',
--     height_cm = 165,
--     weight_kg = 55
-- WHERE email = 'test2@example.com';

-- Để test, tạo user qua Supabase Dashboard hoặc API:
-- 1. Vào Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Nhập email: test1@example.com, password: Test@123456
-- 4. Profile sẽ tự động được tạo qua trigger handle_new_user
-- 5. Sau đó có thể chạy UPDATE ở trên để thêm thông tin chiều cao/cân nặng
