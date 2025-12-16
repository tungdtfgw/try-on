# Sprint 3: Virtual Try-On Room

## Mục tiêu Sprint
Xây dựng phòng thử đồ ảo cho phép user xem ảnh bản thân mặc sản phẩm dựa trên avatar và thông tin body
User Stories: US-05, US-06

## Tasks

### 1. Thiết kế Database cho Phòng thử đồ (Priority: High)
**Mô tả:** Thiết kế schema cho lưu trữ ảnh try-on

**Công việc:**
- [x] Thiết kế bảng tryon_images (id, profile_id, product_id, image_url, created_at)
- [x] Thiết lập foreign keys (profile_id → profiles, product_id → products)
- [x] Thêm unique constraint (profile_id, product_id) tránh duplicate
- [x] Viết script/migration SQL trên Supabase
- [x] Thiết kế storage bucket cho tryon-images trên Supabase
- [x] Viết script/migration cho storage bucket với policy phù hợp (private read cho owner)

**Acceptance Criteria:**
- [x] Schema `tryon_images` được tạo trên Supabase
- [x] Foreign keys và constraints được thiết lập đúng
- [x] Storage bucket tryon-images được tạo với policy private
- [x] Lưu schema vào /design, scripts vào /migrations

---

### 2. Thiết kế Flow Phòng thử đồ (Priority: High)
**Mô tả:** Thiết kế luồng hoạt động chi tiết cho tính năng try-on

**Công việc:**
- [ ] Phác thảo flow chọn danh mục và hiển thị sản phẩm đầu tiên
- [ ] Phác thảo flow sinh ảnh try-on với Google Gemini API
- [ ] Phác thảo flow cache management (check cache, save cache, cleanup old images)
- [ ] Phác thảo flow điều hướng Next/Prev với pre-generation
- [ ] Phác thảo flow xử lý lỗi (no avatar, API error, rate limit)
- [ ] Lưu activity diagrams vào thư mục /design/flows

**Acceptance Criteria:**
- Có tài liệu flow rõ ràng cho tất cả các luồng chính
- Activity diagrams được tạo và lưu trong /design/flows
- Flow được review và chốt trước khi dev tính năng

---

### 3. Tích hợp Google Gemini API (Priority: High)
**Mô tả:** Setup và tích hợp Google Gemini để sinh ảnh try-on

**Backend:**
- [ ] Thêm GEMINI_API_KEY vào .env.example
- [ ] Cài đặt Google Gemini SDK (@google/generative-ai)
- [ ] Tạo gemini_service.js trong backend/src/services
- [ ] Implement function generateTryOnImage(avatarUrl, productImageUrl, bodyInfo)
- [ ] Xử lý error handling (rate limit, quota, invalid response)
- [ ] Implement retry logic với exponential backoff
- [ ] Test với sample images

**Acceptance Criteria:**
- Gemini API được tích hợp thành công
- Có thể gọi API sinh ảnh try-on từ avatar + product image
- Error handling đầy đủ cho các trường hợp lỗi
- Retry logic hoạt động với exponential backoff

---

### 4. API Sinh ảnh Try-on (Priority: High)
**Mô tả:** Xây dựng API endpoint để sinh và lưu ảnh try-on

**Backend:**
- [ ] Tạo tryon_repository.js (CRUD operations cho tryon_images)
- [ ] Tạo tryon_service.js (business logic: check cache, generate, save, cleanup)
- [ ] Tạo tryon_controller.js (request handlers)
- [ ] Implement POST /api/tryon/generate (sinh ảnh mới hoặc trả cache)
  - Input: product_id
  - Logic: check avatar, check body info, check cache, generate if needed
- [ ] Implement GET /api/tryon/:product_id (lấy ảnh try-on nếu đã có)
- [ ] Implement DELETE /api/tryon/:id (xóa ảnh try-on - optional)
- [ ] Implement cache cleanup logic (xóa ảnh cũ nhất khi > 5 ảnh)
- [ ] Upload generated image lên Supabase Storage
- [ ] Validation: user phải có avatar và body info
- [ ] Error handling đầy đủ

**Acceptance Criteria:**
- API sinh ảnh try-on hoạt động đúng
- Cache mechanism hoạt động (không sinh lại nếu đã có)
- Auto-cleanup khi vượt quá 5 ảnh/user
- Upload ảnh vào Storage thành công
- Validation avatar/body info hoạt động
- Error messages rõ ràng

---

### 5. API Danh sách sản phẩm cho Try-on (Priority: Medium)
**Mô tả:** API hỗ trợ navigation trong phòng thử đồ

**Backend:**
- [ ] Implement GET /api/tryon/products?category_id=xxx
  - Trả về danh sách sản phẩm trong danh mục (chỉ id, name, image_url, price)
  - Trả về total count để hiển thị position indicator
- [ ] Implement GET /api/tryon/products/:id/context
  - Trả về product info + prev_id + next_id để hỗ trợ navigation
- [ ] Optimize query performance với appropriate indexes

**Acceptance Criteria:**
- API trả về danh sách sản phẩm theo category
- API trả về context cho navigation (prev/next)
- Response time < 500ms

---

### 6. UI Phòng thử đồ - Màn hình chính (Priority: High)
**Mô tả:** Xây dựng giao diện phòng thử đồ

**Frontend:**
- [ ] Tạo TryOnPage component
- [ ] Tạo CategorySelector component (dropdown/tabs chọn danh mục)
- [ ] Tạo TryOnViewer component (hiển thị ảnh try-on)
- [ ] Tạo ProductInfo component (hiển thị thông tin sản phẩm)
- [ ] Tạo tryon_service.js trong frontend/src/services
- [ ] Implement API calls: generateTryOnImage, getTryOnProducts
- [ ] Hiển thị loading state khi đang sinh ảnh (skeleton/spinner)
- [ ] Hiển thị error states với action buttons (retry, go to profile)
- [ ] Check user có avatar và body info, nếu không redirect/show modal
- [ ] Responsive design cho mobile và desktop

**Acceptance Criteria:**
- User có thể chọn danh mục và xem ảnh try-on
- Loading state hiển thị rõ ràng khi đang generate
- Error handling với thông báo thân thiện
- Redirect/warning nếu user chưa có avatar/body info
- UI đẹp, ảnh try-on là focal point
- Responsive trên các thiết bị

---

### 7. UI Điều hướng sản phẩm (Priority: High)
**Mô tả:** Xây dựng navigation controls cho phòng thử đồ

**Frontend:**
- [ ] Tạo NavigationControls component (nút Prev/Next)
- [ ] Tạo PositionIndicator component ("Sản phẩm 3/15")
- [ ] Implement navigation logic với state management
- [ ] Implement pre-generation logic (fetch next product's try-on image)
- [ ] Implement request cancellation với AbortController
- [ ] Debounce navigation clicks (300ms)
- [ ] Keyboard navigation support (← → arrow keys)
- [ ] Touch swipe support cho mobile (optional)
- [ ] Smooth transition animations giữa các sản phẩm
- [ ] Wrap around logic (cuối → đầu, đầu → cuối)

**Acceptance Criteria:**
- Nút Prev/Next hoạt động chính xác
- Position indicator hiển thị đúng
- Pre-generation chạy background không block UI
- Keyboard navigation hoạt động
- Wrap around hoạt động đúng
- Transition mượt mà
- UI responsive và dễ sử dụng

---

### 8. Navigation & Integration (Priority: Medium)
**Mô tả:** Tích hợp phòng thử đồ vào navigation chính

**Công việc:**
- [ ] Thêm route /tryon vào React Router
- [ ] Cập nhật AuthenticatedHeader với link đến "Thử đồ"
- [ ] Thêm CTA button trên trang Products để vào phòng thử đồ
- [ ] Thêm link từ ProductsPage đến TryOnPage với pre-selected category
- [ ] Protected route cho TryOnPage (yêu cầu login)
- [ ] Update Dashboard với quick access đến phòng thử đồ

**Acceptance Criteria:**
- Navigation từ header đến phòng thử đồ hoạt động
- Có thể vào phòng thử đồ từ trang sản phẩm
- Protected route chỉ cho phép user đã login
- Navigation flow mượt mà và logic

---

### 9. Testing & Polish (Priority: Medium)
**Mô tả:** Test và hoàn thiện các tính năng

**Công việc:**
- [ ] Test end-to-end flow chọn danh mục và xem try-on
- [ ] Test navigation giữa các sản phẩm
- [ ] Test pre-generation hoạt động đúng
- [ ] Test cache mechanism (hit/miss scenarios)
- [ ] Test cleanup logic khi vượt 5 ảnh
- [ ] Test edge cases (no avatar, no products in category, API errors)
- [ ] Test responsive trên các devices
- [ ] Fix bugs phát hiện được
- [ ] Cải thiện UI/UX dựa trên feedback
- [ ] Update README với hướng dẫn setup Gemini API key

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
- Ưu tiên Task 1 và 2 (thiết kế) trước khi bắt đầu dev
- Task 3 (Gemini integration) là foundation cho Task 4
- Task 4 và 5 có thể làm song song một phần
- Task 6 và 7 phụ thuộc vào Task 4 và 5
- Lưu ý: Gemini API có rate limits, cần implement proper error handling
- Cân nhắc UX khi generation time > 10s (progress indicator, cancel button)
- Max 5 ảnh/user là để tiết kiệm storage, có thể adjust sau nếu cần
