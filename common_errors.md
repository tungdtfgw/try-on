# Common Errors & Solutions

## Frontend Errors

### JSX Syntax Error: Unterminated JSX contents
**Error:** `[plugin:vite:react-babel] Unterminated JSX contents. (324:10)`

**Cause:** Thiếu closing tag trong JSX structure

**Solution:** 
- Kiểm tra số lượng opening và closing tags phải bằng nhau
- Đảm bảo mỗi `<div>` có closing `</div>` tương ứng
- Sử dụng code formatter hoặc linter để phát hiện lỗi sớm

**Example:**
```jsx
// ❌ Wrong - missing closing div
return (
  <div className="container">
    <div className="content">
      ...
    </div>
  // Missing </div> here
);

// ✅ Correct
return (
  <div className="container">
    <div className="content">
      ...
    </div>
  </div>
);
```

**Prevention:**
- Sử dụng IDE với JSX syntax highlighting
- Chạy linter trước khi commit
- Sử dụng Prettier để format code tự động

---

## Backend Errors

### Import/Export Module Mismatch
**Error:** `SyntaxError: The requested module does not provide an export named 'xxx'`

**Cause:** Import tên function không khớp với tên export trong file nguồn

**Solution:**
- Kiểm tra tên export trong file nguồn trước khi import
- Đảm bảo tên import khớp chính xác với tên export

**Example:**
```javascript
// ❌ Wrong - auth_middleware.js exports authMiddleware but imports authenticateToken
import { authenticateToken, requireAdmin } from '../middlewares/auth_middleware.js';

// ✅ Correct - match export names
import { authMiddleware, isAdminMiddleware } from '../middlewares/auth_middleware.js';
```

**Prevention:**
- Sử dụng IDE với auto-import feature
- Kiểm tra file nguồn trước khi import
- Chạy code ngay sau khi thêm import để phát hiện lỗi sớm

---

### Supabase Storage: RLS Policies không hoạt động
**Error:** Storage operations fail với authentication errors

**Cause:** Project không sử dụng Supabase Auth, nhưng storage RLS policies dùng `auth.uid()`

**Solution:**
- Sử dụng `SUPABASE_SERVICE_ROLE_KEY` cho storage operations
- Tạo separate Supabase client với service role key
- Access control vẫn được kiểm soát ở application level qua JWT middleware

**Example:**
```javascript
// config/supabase.js
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseStorage = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : supabase;
```

**Note:** Service role key có quyền cao, chỉ dùng ở backend, không commit vào git

---

## Configuration Issues

### Missing Environment Variables
**Error:** `Missing Supabase environment variables`

**Solution:**
- Kiểm tra file `.env` có đầy đủ biến:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (cho storage operations)
  - `JWT_SECRET`
  - `FRONTEND_URL` (backend)
  - `VITE_API_URL` (frontend)

---

## UI/UX Issues

### Form không focus sau khi click Edit
**Error:** Form hiển thị nhưng không scroll đến vị trí form, user phải scroll thủ công

**Cause:** Không có scroll behavior khi show/hide form

**Solution:**
- Sử dụng `useRef` để reference form container
- Gọi `scrollIntoView` với smooth behavior sau khi set showForm = true
- Dùng setTimeout để đảm bảo DOM đã render

**Example:**
```javascript
// ❌ Wrong - no scroll behavior
const handleEdit = (item) => {
  setEditingItem(item);
  setShowForm(true);
};

// ✅ Correct - auto scroll to form
const formRef = useRef(null);

const handleEdit = (item) => {
  setEditingItem(item);
  setShowForm(true);
  setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

// In JSX
<div ref={formRef} className="form-container">
  <Form ... />
</div>
```

**Prevention:**
- Test UX flow từ đầu đến cuối
- Chú ý scroll position khi show/hide elements
- Sử dụng smooth scroll cho better UX

---

### Inconsistent Header Across Pages
**Error:** Các trang đã đăng nhập có header khác nhau

**Solution:**
- Tạo `AuthenticatedHeader` component dùng chung
- Import và sử dụng ở tất cả protected pages (Dashboard, ProfilePage, etc.)

**Example:**
```jsx
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';

const MyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader />
      {/* Page content */}
    </div>
  );
};
```

---

## Routing Issues

### Route không tồn tại sau khi đăng nhập
**Error:** Redirect đến `/dashboard` nhưng route chưa được định nghĩa

**Solution:**
- Tạo component cho route đó (ví dụ: Dashboard)
- Thêm route vào `App.jsx` với ProtectedRoute wrapper

**Example:**
```jsx
// App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## File Upload Issues

### Supabase Storage: Mime type undefined error
**Error:** `StorageApiError: mime type undefined is not supported`

**Cause:** Truyền file object thay vì file buffer và mimetype riêng biệt cho Supabase Storage

**Solution:**
- Truyền `file.buffer` thay vì `file` object
- Truyền `file.mimetype` riêng biệt vào contentType option
- Đảm bảo multer đã parse file và có buffer available

**Example:**
```javascript
// ❌ Wrong - passing file object
const { data, error } = await supabaseStorage
  .storage
  .from('product-images')
  .upload(filePath, file, {
    contentType: file.mimetype  // mimetype is undefined
  });

// ✅ Correct - passing buffer and mimetype separately
const { data, error } = await supabaseStorage
  .storage
  .from('product-images')
  .upload(filePath, file.buffer, {
    contentType: file.mimetype
  });
```

**Prevention:**
- Sử dụng multer.memoryStorage() để có file.buffer
- Test upload ngay sau khi implement
- Log file object để kiểm tra available properties

---

### Multer Error: File size limit
**Error:** `LIMIT_FILE_SIZE` error khi upload file

**Solution:**
- Kiểm tra file size trong multer config (đã set 5MB)
- Validate file size ở client trước khi upload
- Hiển thị error message thân thiện cho user

**Example:**
```javascript
// Backend: routes/profile_routes.js
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5242880 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file jpg, jpeg hoặc png'), false);
    }
  },
});
```

---

## Best Practices

1. **Always validate input** ở cả client và server
2. **Use TypeScript or PropTypes** để catch type errors sớm
3. **Run linter** trước khi commit code
4. **Test error scenarios** không chỉ happy path
5. **Use consistent error messages** không lộ thông tin hệ thống
6. **Log errors** ở server nhưng không gửi stack trace cho client trong production
