# Database Schema - Sprint 1

## Overview
Schema cho tính năng authentication và profile management.

## Tables

### profiles
Bảng lưu thông tin hồ sơ người dùng, liên kết với `auth.users` của Supabase.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK -> auth.users(id), ON DELETE CASCADE | ID người dùng từ Supabase Auth |
| email | text | NOT NULL, UNIQUE | Email đăng nhập |
| display_name | text | NULL | Tên hiển thị (tùy chọn) |
| height_cm | numeric | NULL, CHECK (100-250) | Chiều cao (cm) |
| weight_kg | numeric | NULL, CHECK (30-250) | Cân nặng (kg) |
| body_photo_url | text | NULL | URL ảnh toàn thân từ Supabase Storage |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Thời gian tạo |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Thời gian cập nhật |

### Indexes
- `profiles_pkey`: PRIMARY KEY on `id`
- `profiles_email_key`: UNIQUE on `email`

### Constraints
- `profiles_height_cm_check`: height_cm >= 100 AND height_cm <= 250
- `profiles_weight_kg_check`: weight_kg >= 30 AND weight_kg <= 250
- Foreign key từ `id` đến `auth.users(id)` với ON DELETE CASCADE

## Row Level Security (RLS)
- Bật RLS cho bảng `profiles`
- Policy `profiles_select_own`: User chỉ đọc được profile của mình
- Policy `profiles_update_own`: User chỉ cập nhật được profile của mình
- Policy `profiles_insert_own`: User chỉ tạo được profile cho chính mình

## Triggers
- `handle_updated_at`: Tự động cập nhật `updated_at` khi có thay đổi
- `handle_new_user`: Tự động tạo profile khi user mới đăng ký qua Supabase Auth

## Storage

### Bucket: body-photos
- **Mục đích**: Lưu ảnh toàn thân của user
- **Access**: Private (cần auth để truy cập)
- **File types**: jpg, jpeg, png
- **Max size**: 5MB
- **Structure**: `{user_id}/body-photo.{ext}`

### Storage Policies
- `body_photos_select_own`: User chỉ xem được ảnh của mình
- `body_photos_insert_own`: User chỉ upload được vào folder của mình
- `body_photos_update_own`: User chỉ cập nhật được ảnh của mình
- `body_photos_delete_own`: User chỉ xóa được ảnh của mình

## ERD Diagram

```
┌─────────────────────────────────────────────────┐
│                   profiles                       │
├─────────────────────────────────────────────────┤
│ id           : uuid [PK, FK -> auth.users(id)]  │
│ email        : text [UNIQUE, NOT NULL]          │
│ display_name : text                              │
│ height_cm    : numeric [CHECK 100-250]          │
│ weight_kg    : numeric [CHECK 30-250]           │
│ body_photo_url : text                           │
│ created_at   : timestamptz [NOT NULL]           │
│ updated_at   : timestamptz [NOT NULL]           │
└─────────────────────────────────────────────────┘
         │
         │ FK (ON DELETE CASCADE)
         ▼
┌─────────────────────────────────────────────────┐
│               auth.users (Supabase)             │
├─────────────────────────────────────────────────┤
│ id           : uuid [PK]                        │
│ email        : text                              │
│ ...                                              │
└─────────────────────────────────────────────────┘
```
