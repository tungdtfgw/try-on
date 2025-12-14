# Sprint 2: Product Catalog Management
## Mục tiêu Sprint
Xây dựng hệ thống quản lý danh mục và sản phẩm cho Admin
User Stories: US-03, US-04

## Tasks
### 1. Thiết kế Database cho Quản lý Kho hàng (Priority: High)
**Mô tả:** Thiết kế schema cho categories và products

**Công việc:**
- [ ] Xác định bảng categories (id, name, slug, description, created_at, updated_at)
- [ ] Xác định bảng products (id, name, price, category_id, description, created_at, updated_at)
- [ ] Thiết lập foreign key, indexes và constraints
- [ ] Viết script/migration SQL trên Supabase
- [ ] Thiết kế storage bucket cho product images trên Supabase
- [ ] Viết script/migration cho storage bucket

**Acceptance Criteria:**
- Schema `categories` và `products` được tạo trên Supabase
- Foreign key từ products.category_id đến categories.id
- Storage bucket cho product images được tạo với policy phù hợp
- Có dữ liệu mẫu cho testing (3-5 categories, 10-15 products)
- Lưu schema vào /design, scripts vào /migrations

---

### 2. Phân quyền Admin (Priority: High)
**Mô tả:** Thêm role-based access control

**Công việc:**
- [ ] Thêm cột role vào bảng profiles (enum: 'user', 'admin')
- [ ] Viết migration để thêm cột role
- [ ] Tạo middleware kiểm tra role admin (isAdmin)
- [ ] Update API để protect các endpoint admin
- [ ] Tạo dữ liệu mẫu cho admin user

**Acceptance Criteria:**
- Bảng profiles có cột role với default là 'user'
- Middleware isAdmin hoạt động chính xác
- Chỉ admin mới truy cập được các endpoint quản lý
- Có ít nhất 1 admin user trong database để test

---

### 3. API Quản lý Danh mục (Priority: High)
**Mô tả:** Xây dựng CRUD API cho categories

**Công việc:**
- [ ] Tạo category repository (categories_repository.js)
- [ ] Tạo category service (categories_service.js)
- [ ] Tạo category controller (categories_controller.js)
- [ ] Implement GET /api/categories (public - lấy tất cả danh mục)
- [ ] Implement GET /api/categories/:id (public - lấy chi tiết 1 danh mục)
- [ ] Implement POST /api/categories (admin only - tạo danh mục mới)
- [ ] Implement PUT /api/categories/:id (admin only - cập nhật danh mục)
- [ ] Implement DELETE /api/categories/:id (admin only - xóa danh mục)
- [ ] Validation cho category data (name required, slug unique)
- [ ] Auto-generate slug từ name
- [ ] Error handling đầy đủ

**Acceptance Criteria:**
- CRUD operations hoạt động đúng
- Public endpoints không yêu cầu authentication
- Admin endpoints yêu cầu admin role
- Validation hoạt động chính xác
- Error messages rõ ràng và nhất quán
- Không thể xóa category còn products

---

### 4. UI Quản lý Danh mục (Priority: High)
**Mô tả:** Xây dựng giao diện quản lý danh mục cho Admin

**Công việc:**
- [ ] Tạo CategoriesPage component (list tất cả categories)
- [ ] Tạo CategoryForm component (form tạo/sửa category)
- [ ] Tạo categories service (categories_service.js) trong frontend
- [ ] Hiển thị danh sách categories dạng table/card
- [ ] Form thêm category mới
- [ ] Form sửa category (inline hoặc modal)
- [ ] Nút xóa category với confirmation
- [ ] Loading states và error handling
- [ ] Success/error notifications
- [ ] Responsive design

**Acceptance Criteria:**
- Admin có thể xem danh sách categories
- Admin có thể thêm category mới
- Admin có thể sửa category
- Admin có thể xóa category (với confirmation)
- UI thân thiện, dễ sử dụng
- Responsive trên mobile và desktop
- Thông báo rõ ràng khi thao tác thành công/thất bại

---

### 5. API Quản lý Sản phẩm (Priority: High)
**Mô tả:** Xây dựng CRUD API cho products

**Công việc:**
- [ ] Tạo product repository (products_repository.js)
- [ ] Tạo product service (products_service.js)
- [ ] Tạo product controller (products_controller.js)
- [ ] Implement GET /api/products (public - lấy tất cả hoặc filter by category)
- [ ] Implement GET /api/products/:id (public - lấy chi tiết 1 sản phẩm)
- [ ] Implement POST /api/products (admin only - tạo sản phẩm mới)
- [ ] Implement PUT /api/products/:id (admin only - cập nhật sản phẩm)
- [ ] Implement DELETE /api/products/:id (admin only - xóa sản phẩm)
- [ ] Implement POST /api/products/:id/image (admin only - upload ảnh)
- [ ] Validation cho product data
- [ ] Pagination cho danh sách sản phẩm
- [ ] Error handling đầy đủ

**Acceptance Criteria:**
- CRUD operations hoạt động đúng
- Public endpoints không yêu cầu authentication
- Admin endpoints yêu cầu admin role
- Validation hoạt động (name, price > 0, category_id exists)
- Upload ảnh lên Supabase Storage
- Pagination hoạt động với limit/offset
- Filter by category_id hoạt động
- Error messages rõ ràng

---

### 6. UI Quản lý Sản phẩm (Priority: High)
**Mô tả:** Xây dựng giao diện quản lý sản phẩm cho Admin

**Công việc:**
- [ ] Tạo ProductsPage component (list tất cả products)
- [ ] Tạo ProductForm component (form tạo/sửa product)
- [ ] Tạo products service (products_service.js) trong frontend
- [ ] Hiển thị danh sách products dạng table/grid với ảnh
- [ ] Filter products by category
- [ ] Form thêm product mới với upload ảnh
- [ ] Form sửa product với thay đổi ảnh
- [ ] Nút xóa product với confirmation
- [ ] Preview ảnh trước khi upload
- [ ] Loading states và error handling
- [ ] Success/error notifications
- [ ] Pagination UI
- [ ] Responsive design

**Acceptance Criteria:**
- Admin có thể xem danh sách products
- Admin có thể filter products theo category
- Admin có thể thêm product mới kèm ảnh
- Admin có thể sửa product và thay đổi ảnh
- Admin có thể xóa product (với confirmation)
- Preview ảnh hoạt động
- UI thân thiện, hiển thị đẹp với ảnh sản phẩm
- Responsive trên mobile và desktop
- Pagination hoạt động
- Thông báo rõ ràng khi thao tác thành công/thất bại

---

### 7. Navigation & Admin Dashboard (Priority: Medium)
**Mô tả:** Cập nhật navigation và tạo trang Admin Dashboard

**Công việc:**
- [ ] Cập nhật AuthenticatedHeader với menu Admin (nếu role=admin)
- [ ] Tạo AdminDashboard component
- [ ] Thêm routes cho /admin/categories và /admin/products
- [ ] Protected routes cho admin pages (kiểm tra role)
- [ ] Link navigation giữa các trang admin
- [ ] Hiển thị thống kê tổng quan (số categories, products)

**Acceptance Criteria:**
- Admin menu hiển thị khi user có role=admin
- Admin Dashboard hiển thị tổng quan
- Navigation giữa các trang admin hoạt động mượt
- Protected routes chỉ cho phép admin truy cập
- Non-admin users không thấy menu/routes admin

---

### 8. Testing & Polish (Priority: Medium)
**Mô tả:** Test và hoàn thiện các tính năng

**Công việc:**
- [ ] Test end-to-end flow quản lý categories
- [ ] Test end-to-end flow quản lý products
- [ ] Test upload ảnh với các file formats khác nhau
- [ ] Test edge cases (xóa category có products, v.v.)
- [ ] Test responsive trên các devices
- [ ] Fix bugs phát hiện được
- [ ] Cải thiện UI/UX dựa trên feedback
- [ ] Update README với hướng dẫn admin features

**Acceptance Criteria:**
- Tất cả flows hoạt động mượt mà
- Không có lỗi major
- UI/UX được polish
- Documentation được cập nhật

## Definition of Done
- Code được review
- Unit tests passed (nếu có)
- Functionality tested trên môi trường local
- Database migrations chạy thành công
- Documentation cập nhật
- Code được merge vào branch chính

## Notes
- Ưu tiên hoàn thành Task 1 và 2 trước để các task khác có thể triển khai
- Task 3 và 5 có thể làm song song
- Task 4 và 6 phụ thuộc vào Task 3 và 5
- Lưu ý bảo mật: chỉ admin mới được thao tác CRUD
- Cân nhắc optimize cho upload ảnh (resize, compress)
