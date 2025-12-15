# Auth & Profile Flow - Sprint 1

## Overview
Tài liệu mô tả các luồng xử lý cho tính năng authentication và profile management.

---

## 1. Flow Đăng ký (Register)

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User mở form đăng ký]
    A --> B[Nhập email và password]
    B --> C{Client validate}
    C -->|Fail| D[Hiển thị lỗi validation]
    D --> B
    C -->|Pass| E[Submit form]
    E --> F[API POST /api/auth/register]
    F --> G{Server validate email format}
    G -->|Invalid| H[400: Email không hợp lệ]
    H --> End1([End])
    G -->|Valid| I{Validate password >= 8 chars}
    I -->|Invalid| J[400: Mật khẩu quá ngắn]
    J --> End1
    I -->|Valid| K{Check email exists}
    K -->|Exists| L[409: Email đã được sử dụng]
    L --> End1
    K -->|Not exists| M[Supabase Auth signUp]
    M --> N[Auto-trigger: Create profile]
    N --> O[201: Đăng ký thành công]
    O --> P[Client redirect to /login]
    P --> End2([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant S as Supabase Auth
    participant D as Database (profiles)

    C->>B: POST /api/auth/register<br/>{email, password}
    B->>B: Validate input<br/>- Email format<br/>- Password >= 8 chars
    
    alt Validation failed
        B-->>C: 400 Bad Request
    else Validation passed
        B->>S: signUp(email, password)
        S->>D: Create user in auth.users
        D->>D: Trigger: auto create profile
        S-->>B: Return user + session
        B-->>C: 201 Created<br/>{message, user}
        C->>C: Redirect to /login
    end
```

### API Endpoint

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Success Response (201):
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}

Error Responses:
- 400: Validation error (email format, password too short)
- 409: Email already exists
- 500: Server error
```

### Validation Rules
- Email: format hợp lệ, lowercase, trim whitespace
- Password: tối thiểu 8 ký tự

### Error Handling
| Error | HTTP Code | Message |
|-------|-----------|---------|
| Email trống/sai format | 400 | "Email không hợp lệ" |
| Password < 8 ký tự | 400 | "Mật khẩu phải có ít nhất 8 ký tự" |
| Email đã tồn tại | 409 | "Email đã được sử dụng" |
| Lỗi server | 500 | "Đã có lỗi xảy ra, vui lòng thử lại" |

---

## 2. Flow Đăng nhập (Login + JWT)

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User mở form đăng nhập]
    A --> B[Nhập email và password]
    B --> C{Client validate không rỗng}
    C -->|Fail| D[Hiển thị lỗi]
    D --> B
    C -->|Pass| E[Submit form]
    E --> F[API POST /api/auth/login]
    F --> G{Server validate input}
    G -->|Empty fields| H[400: Thiếu thông tin]
    H --> End1([End])
    G -->|Valid| I[Supabase signInWithPassword]
    I --> J{Credentials hợp lệ?}
    J -->|Invalid| K[401: Sai email/password]
    K --> End1
    J -->|Valid| L[Nhận session + access_token]
    L --> M[Query profile từ DB]
    M --> N[200: Trả token + user + profile]
    N --> O[Client lưu token vào localStorage]
    O --> P[Client redirect to /dashboard]
    P --> End2([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant S as Supabase Auth
    participant D as Database (profiles)

    C->>B: POST /api/auth/login<br/>{email, password}
    B->>B: Validate input
    
    alt Validation failed
        B-->>C: 400 Bad Request
    else Validation passed
        B->>S: signInWithPassword(email, password)
        
        alt Invalid credentials
            S-->>B: Error: Invalid credentials
            B-->>C: 401 Unauthorized
        else Credentials valid
            S-->>B: Return session + access_token
            B->>B: Generate JWT<br/>(from Supabase session)
            B->>D: Get profile by user_id
            D-->>B: Return profile data
            B-->>C: 200 OK<br/>{token, user, profile}
            C->>C: Store token in localStorage
            C->>C: Redirect to /dashboard
        end
    end
```

### API Endpoint

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Success Response (200):
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "profile": {
      "display_name": "John Doe",
      "height_cm": 170,
      "weight_kg": 65,
      "body_photo_url": null
    }
  }
}

Error Responses:
- 400: Validation error
- 401: Invalid credentials
- 500: Server error
```

### JWT Token Structure
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```
- Token TTL: 1 hour (có thể cấu hình qua env)
- Refresh: Client tự động refresh khi token sắp hết hạn

### Client Storage
- Lưu token vào `localStorage.setItem('token', token)`
- Gắn token vào header cho các request: `Authorization: Bearer <token>`

### Error Handling
| Error | HTTP Code | Message |
|-------|-----------|---------|
| Email/password trống | 400 | "Vui lòng nhập đầy đủ thông tin" |
| Sai email/password | 401 | "Email hoặc mật khẩu không đúng" |
| Lỗi server | 500 | "Đã có lỗi xảy ra, vui lòng thử lại" |

---

## 3. Flow Lấy Profile (Get Profile)

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User truy cập trang Profile]
    A --> B{Token trong localStorage?}
    B -->|No| C[Redirect to /login]
    C --> End1([End])
    B -->|Yes| D[API GET /api/user/profile]
    D --> E[Gắn token vào Authorization header]
    E --> F{Server verify JWT}
    F -->|Invalid| G[401: Token không hợp lệ]
    G --> H[Clear localStorage]
    H --> C
    F -->|Expired| I[401: Token hết hạn]
    I --> H
    F -->|Valid| J[Extract user_id từ token]
    J --> K[Query profile từ DB]
    K --> L{Profile tồn tại?}
    L -->|No| M[404: Profile not found]
    M --> End1
    L -->|Yes| N[200: Trả profile data]
    N --> O[Hiển thị form với dữ liệu]
    O --> End2([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant D as Database (profiles)

    C->>B: GET /api/user/profile<br/>Authorization: Bearer token
    B->>B: Verify JWT
    
    alt Token invalid/expired
        B-->>C: 401 Unauthorized
    else Token valid
        B->>B: Extract user_id from token
        B->>D: SELECT * FROM profiles<br/>WHERE id = user_id
        D-->>B: Return profile data
        
        alt Profile not found
            B-->>C: 404 Not Found
        else Profile found
            B-->>C: 200 OK<br/>{profile}
        end
    end
```

### API Endpoint

```
GET /api/user/profile
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John Doe",
    "height_cm": 170,
    "weight_kg": 65,
    "body_photo_url": "https://storage.supabase.co/...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}

Error Responses:
- 401: Unauthorized (token missing/invalid/expired)
- 404: Profile not found
- 500: Server error
```

---

## 4. Flow Cập nhật Profile (Update Profile)

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User chỉnh sửa form Profile]
    A --> B[Nhập display_name, height_cm, weight_kg]
    B --> C{Client validate}
    C -->|Invalid| D[Hiển thị lỗi validation]
    D --> B
    C -->|Valid| E[Submit form]
    E --> F[API PUT /api/user/profile]
    F --> G{Server verify JWT}
    G -->|Invalid/Expired| H[401: Unauthorized]
    H --> End1([End])
    G -->|Valid| I[Extract user_id từ token]
    I --> J{Validate height_cm 100-250}
    J -->|Invalid| K[400: Chiều cao không hợp lệ]
    K --> End1
    J -->|Valid| L{Validate weight_kg 30-250}
    L -->|Invalid| M[400: Cân nặng không hợp lệ]
    M --> End1
    L -->|Valid| N[UPDATE profiles trong DB]
    N --> O[200: Trả updated profile]
    O --> P[UI hiển thị thành công]
    P --> End2([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant D as Database (profiles)

    C->>B: PUT /api/user/profile<br/>Authorization: Bearer token<br/>{display_name, height_cm, weight_kg}
    B->>B: Verify JWT
    
    alt Token invalid/expired
        B-->>C: 401 Unauthorized
    else Token valid
        B->>B: Extract user_id from token
        B->>B: Validate input<br/>- height_cm: 100-250<br/>- weight_kg: 30-250
        
        alt Validation failed
            B-->>C: 400 Bad Request
        else Validation passed
            B->>D: UPDATE profiles<br/>SET ... WHERE id = user_id
            D-->>B: Return updated profile
            B-->>C: 200 OK<br/>{updated profile}
        end
    end
```

### API Endpoint

```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "display_name": "John Doe",    // optional
  "height_cm": 170,              // optional, 100-250
  "weight_kg": 65                // optional, 30-250
}

Success Response (200):
{
  "success": true,
  "message": "Cập nhật hồ sơ thành công",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John Doe",
    "height_cm": 170,
    "weight_kg": 65,
    "body_photo_url": "...",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}

Error Responses:
- 400: Validation error
- 401: Unauthorized
- 500: Server error
```

### Validation Rules
- `display_name`: string, optional, max 100 ký tự
- `height_cm`: number, optional, 100-250
- `weight_kg`: number, optional, 30-250

### Error Handling
| Error | HTTP Code | Message |
|-------|-----------|---------|
| height_cm ngoài khoảng | 400 | "Chiều cao phải từ 100cm đến 250cm" |
| weight_kg ngoài khoảng | 400 | "Cân nặng phải từ 30kg đến 250kg" |
| Token missing/invalid | 401 | "Vui lòng đăng nhập" |
| Token expired | 401 | "Phiên đăng nhập hết hạn" |

---

## 5. Flow Upload Ảnh Toàn Thân (Upload Body Photo)

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User chọn file ảnh]
    A --> B{Client validate file type}
    B -->|Not jpg/png| C[Hiển thị lỗi: Sai định dạng]
    C --> End1([End])
    B -->|Valid type| D{Validate file size <= 5MB}
    D -->|Too large| E[Hiển thị lỗi: File quá lớn]
    E --> End1
    D -->|Valid size| F[Hiển thị preview ảnh]
    F --> G[User bấm Upload]
    G --> H[API POST /api/user/profile/photo]
    H --> I{Server verify JWT}
    I -->|Invalid/Expired| J[401: Unauthorized]
    J --> End1
    I -->|Valid| K[Extract user_id từ token]
    K --> L{Server validate file}
    L -->|Invalid| M[400: File không hợp lệ]
    M --> End1
    L -->|Valid| N{Có ảnh cũ?}
    N -->|Yes| O[Xóa ảnh cũ từ Storage]
    O --> P[Upload ảnh mới lên Storage]
    N -->|No| P
    P --> Q{Upload thành công?}
    Q -->|No| R[500: Upload thất bại]
    R --> End1
    Q -->|Yes| S[Lấy public URL]
    S --> T[UPDATE body_photo_url trong DB]
    T --> U[200: Trả body_photo_url]
    U --> V[UI hiển thị ảnh mới]
    V --> End2([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant S as Supabase Storage
    participant D as Database (profiles)

    C->>B: POST /api/user/profile/photo<br/>Authorization: Bearer token<br/>Content-Type: multipart/form-data<br/>{file: body-photo.jpg}
    B->>B: Verify JWT
    
    alt Token invalid/expired
        B-->>C: 401 Unauthorized
    else Token valid
        B->>B: Extract user_id from token
        B->>B: Validate file<br/>- Type: jpg/jpeg/png<br/>- Size: <= 5MB
        
        alt Validation failed
            B-->>C: 400 Bad Request
        else Validation passed
            B->>S: Delete old photo (if exists)
            B->>S: Upload to: body-photos/{user_id}/body-photo.{ext}
            S-->>B: Return file path
            B->>B: Get public URL
            B->>D: UPDATE profiles<br/>SET body_photo_url = url
            D-->>B: Confirm update
            B-->>C: 200 OK<br/>{body_photo_url}
        end
    end
```

### API Endpoint

```
POST /api/user/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <binary> (body photo)

Success Response (200):
{
  "success": true,
  "message": "Upload ảnh thành công",
  "data": {
    "body_photo_url": "https://xxx.supabase.co/storage/v1/object/public/body-photos/uuid/body-photo.jpg"
  }
}

Error Responses:
- 400: Invalid file type/size
- 401: Unauthorized
- 500: Upload failed
```

### Validation Rules
- File types: `image/jpeg`, `image/jpg`, `image/png`
- Max size: 5MB
- Chỉ 1 file/request

### Storage Path
- Bucket: `body-photos`
- Path: `{user_id}/body-photo.{ext}`
- Khi upload mới, xóa file cũ (nếu có) trước khi upload

### Error Handling
| Error | HTTP Code | Message |
|-------|-----------|---------|
| Không có file | 400 | "Vui lòng chọn ảnh" |
| Sai định dạng | 400 | "Chỉ chấp nhận file jpg, jpeg hoặc png" |
| File quá lớn | 400 | "Dung lượng file không được vượt quá 5MB" |
| Upload thất bại | 500 | "Upload ảnh thất bại, vui lòng thử lại" |

---

## 6. Flow Logout

### Activity Diagram

```mermaid
flowchart TD
    Start([Start]) --> A[User bấm nút Logout]
    A --> B[API POST /api/auth/logout]
    B --> C[Server gọi Supabase signOut]
    C --> D[200: Đăng xuất thành công]
    D --> E[Client xóa token từ localStorage]
    E --> F[Clear user state trong React]
    F --> G[Redirect to Landing Page]
    G --> End([End])
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant B as Backend (Express)
    participant S as Supabase Auth

    C->>B: POST /api/auth/logout<br/>Authorization: Bearer token
    B->>S: signOut()
    S-->>B: Success
    B-->>C: 200 OK
    C->>C: localStorage.removeItem('token')
    C->>C: Clear user state
    C->>C: Redirect to /
```

### API Endpoint

```
POST /api/auth/logout
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### Client Actions
1. Gọi API logout
2. Xóa token từ localStorage: `localStorage.removeItem('token')`
3. Clear user state trong React context/store
4. Redirect về trang Landing Page (`/`)

---

## 7. Flow Bảo vệ Routes (Protected Routes)

### Frontend Route Protection

```mermaid
flowchart TD
    A[User truy cập Protected Route] --> B{Token trong localStorage?}
    B -->|Không| C[Redirect to /login]
    B -->|Có| D{Token hợp lệ?}
    D -->|Không| E[Clear token]
    E --> C
    D -->|Có| F[Render Protected Component]
```

### ProtectedRoute Component Logic

```mermaid
flowchart TD
    subgraph ProtectedRoute Component
        A[Start] --> B{Check token<br/>in localStorage}
        B -->|No token| C[Navigate to /login]
        B -->|Has token| D{Verify token validity}
        D -->|Invalid/Expired| E[Clear token from storage]
        E --> C
        D -->|Valid| F[Render children<br/>via Outlet]
    end
```

### Backend Middleware Protection

```mermaid
flowchart TD
    subgraph authMiddleware
        A[Request arrives] --> B{Authorization header?}
        B -->|No| C[401: Token không tồn tại]
        B -->|Yes| D[Extract token from header]
        D --> E{Verify JWT}
        E -->|Invalid| F[401: Token không hợp lệ]
        E -->|Expired| G[401: Token hết hạn]
        E -->|Valid| H[Attach user to req.user]
        H --> I[next - Continue to route handler]
    end
```

### Protected API Routes
| Method | Endpoint | Middleware |
|--------|----------|------------|
| GET | /api/user/profile | authMiddleware |
| PUT | /api/user/profile | authMiddleware |
| POST | /api/user/profile/photo | authMiddleware |
| POST | /api/auth/logout | authMiddleware |

### Public API Routes
| Method | Endpoint |
|--------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Summary

### API Endpoints Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Đăng ký tài khoản |
| POST | /api/auth/login | No | Đăng nhập |
| POST | /api/auth/logout | Yes | Đăng xuất |
| GET | /api/user/profile | Yes | Lấy thông tin profile |
| PUT | /api/user/profile | Yes | Cập nhật profile |
| POST | /api/user/profile/photo | Yes | Upload ảnh toàn thân |

### Frontend Routes Overview

| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| / | LandingPage | No | Trang chủ |
| /login | LoginPage | No | Trang đăng nhập |
| /register | RegisterPage | No | Trang đăng ký |
| /dashboard | Dashboard | Yes | Dashboard sau login |
| /profile | ProfilePage | Yes | Trang hồ sơ |

### Security Checklist
- [x] Password hash bằng bcrypt (Supabase Auth)
- [x] JWT với TTL hợp lý (1 hour)
- [x] CORS cấu hình đúng origin
- [x] RLS policies cho database
- [x] Storage policies cho file upload
- [x] Không log plaintext password
- [x] Error messages không lộ thông tin hệ thống
