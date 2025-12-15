-- Migration: Seed sample data for Sprint 2
-- Description: Dữ liệu mẫu cho categories, products và admin user
-- Note: Chỉ chạy trên môi trường dev/test, không chạy trên production

-- ============================================
-- ADMIN USER
-- ============================================
-- Tạo admin user (password: Admin@123456)
-- Password hash được tạo bằng bcrypt với salt rounds = 10
INSERT INTO public.profiles (email, password_hash, display_name, role)
VALUES (
    'admin@example.com',
    '$2b$10$rQZ8K5X5X5X5X5X5X5X5XuYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', -- Placeholder, cần hash thực tế
    'Admin User',
    'admin'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- ============================================
-- CATEGORIES (5 danh mục)
-- ============================================
INSERT INTO public.categories (id, name, slug, description) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Áo', 'ao', 'Các loại áo thời trang nam nữ'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Quần', 'quan', 'Các loại quần thời trang'),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Váy', 'vay', 'Các loại váy đầm nữ'),
    ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Áo khoác', 'ao-khoac', 'Áo khoác, jacket các loại'),
    ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Phụ kiện', 'phu-kien', 'Phụ kiện thời trang')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PRODUCTS (15 sản phẩm)
-- ============================================
-- Áo (category: a1b2c3d4-e5f6-7890-abcd-ef1234567890)
INSERT INTO public.products (name, price, category_id, description) VALUES
    ('Áo thun basic trắng', 199000, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Áo thun cotton 100% màu trắng, form regular fit'),
    ('Áo sơ mi xanh navy', 399000, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Áo sơ mi dài tay, chất liệu cotton pha, màu xanh navy'),
    ('Áo polo đen', 299000, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Áo polo nam màu đen, chất liệu cotton pique')
ON CONFLICT DO NOTHING;

-- Quần (category: b2c3d4e5-f6a7-8901-bcde-f12345678901)
INSERT INTO public.products (name, price, category_id, description) VALUES
    ('Quần jean xanh đậm', 599000, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Quần jean nam slim fit, màu xanh đậm wash'),
    ('Quần kaki be', 499000, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Quần kaki nam regular fit, màu be'),
    ('Quần short đen', 349000, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Quần short nam màu đen, chất liệu cotton')
ON CONFLICT DO NOTHING;

-- Váy (category: c3d4e5f6-a7b8-9012-cdef-123456789012)
INSERT INTO public.products (name, price, category_id, description) VALUES
    ('Váy midi hoa nhí', 699000, 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Váy midi họa tiết hoa nhí, chất liệu voan'),
    ('Váy liền công sở', 799000, 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Váy liền thân công sở, màu đen thanh lịch'),
    ('Chân váy chữ A', 449000, 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Chân váy chữ A màu be, dáng xòe nhẹ')
ON CONFLICT DO NOTHING;

-- Áo khoác (category: d4e5f6a7-b8c9-0123-defa-234567890123)
INSERT INTO public.products (name, price, category_id, description) VALUES
    ('Áo khoác bomber đen', 899000, 'd4e5f6a7-b8c9-0123-defa-234567890123', 'Áo khoác bomber unisex màu đen, chất liệu dù'),
    ('Áo blazer xám', 1299000, 'd4e5f6a7-b8c9-0123-defa-234567890123', 'Áo blazer nam màu xám, phong cách công sở'),
    ('Áo cardigan len', 599000, 'd4e5f6a7-b8c9-0123-defa-234567890123', 'Áo cardigan len mỏng, màu kem')
ON CONFLICT DO NOTHING;

-- Phụ kiện (category: e5f6a7b8-c9d0-1234-efab-345678901234)
INSERT INTO public.products (name, price, category_id, description) VALUES
    ('Thắt lưng da đen', 299000, 'e5f6a7b8-c9d0-1234-efab-345678901234', 'Thắt lưng da bò thật màu đen'),
    ('Khăn quàng cổ', 199000, 'e5f6a7b8-c9d0-1234-efab-345678901234', 'Khăn quàng cổ len màu xám'),
    ('Mũ lưỡi trai', 149000, 'e5f6a7b8-c9d0-1234-efab-345678901234', 'Mũ lưỡi trai unisex màu đen')
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTES
-- ============================================
-- 1. Admin user cần được tạo với password hash thực tế qua API register
--    hoặc update password_hash sau khi hash bằng bcrypt
-- 2. Để tạo admin thực tế:
--    - Đăng ký user qua API: POST /api/auth/register với email admin@example.com
--    - Sau đó chạy: UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- 3. Products chưa có image_url, admin sẽ upload ảnh qua UI sau
