# US-04 - Admin Manage Products

```mermaid
flowchart TD
  A[Admin mở trang /admin/products] --> B[Frontend gọi GET /api/products?limit=&offset=]
  B --> C{API trả về 200?}
  C -- Yes --> D[Hiển thị danh sách products (grid/table) + pagination]
  C -- No --> E[Hiển thị thông báo lỗi]

  D --> F{Hành động chính?}
  F -- Filter --> G[Chọn category trong dropdown]
  F -- Thêm mới --> K[Click 'Thêm sản phẩm']
  F -- Sửa --> S[Click 'Sửa' 1 sản phẩm]
  F -- Xóa --> AB[Click 'Xóa' 1 sản phẩm]
  F -- Điều hướng trang --> J[Chuyển trang pagination]
  F -- Thoát --> AO[Admin rời trang]

  %% Pagination
  J --> B

  %% Filter
  G --> H[Frontend cập nhật query category_id]
  H --> I[Gọi GET /api/products?category_id=&limit=&offset=]
  I --> C

  %% Tạo mới
  K --> L[Hiển thị ProductForm rỗng (tên, giá, category, mô tả, upload ảnh)]
  L --> M[Admin nhập form, chọn category, chọn file ảnh]
  M --> N[Frontend validate cơ bản (required, số, file type/size)]
  N --> O{Valid?}
  O -- No --> P[Hiển thị lỗi tại từng trường] --> L
  O -- Yes --> Q[Frontend gửi request tạo sản phẩm]
  Q --> Q1[Gọi POST /api/products (meta: name, price, category_id, description)]
  Q1 --> Q2{Server validate & lưu DB?}
  Q2 -- Lỗi --> Q3[Trả lỗi 400/422 với message] --> P
  Q2 -- OK --> Q4[Trả về product_id]
  Q4 --> Q5[Frontend gọi POST /api/products/:id/image upload ảnh]
  Q5 --> Q6{Upload & lưu URL thành công?}
  Q6 -- No --> Q7[Rollback (xóa product) hoặc log lỗi theo thiết kế] --> Q8[Trả lỗi cho frontend]
  Q6 -- Yes --> Q9[Lưu image_url vào DB] --> Q10[Trả 200/201]
  Q10 --> Q11[Hiển thị toast thành công]
  Q11 --> B

  %% Sửa
  S --> T[Hiển thị ProductForm với dữ liệu hiện tại + preview ảnh]
  T --> U[Admin chỉnh sửa thông tin, có thể chọn ảnh mới]
  U --> V[Frontend validate cơ bản]
  V --> W{Valid?}
  W -- No --> X[Hiển thị lỗi form] --> T
  W -- Yes --> Y[Frontend gọi PUT /api/products/:id cập nhật meta]
  Y --> Z{Server validate & update?}
  Z -- Lỗi --> Z1[Trả lỗi 400/404] --> X
  Z -- OK --> AA[Kiểm tra có ảnh mới không?]
  AA -- Không --> AF[Hiển thị toast thành công] --> B
  AA -- Có --> AC[Frontend gọi POST /api/products/:id/image với file mới]
  AC --> AD{Upload ảnh mới thành công?}
  AD -- No --> AE[Log warning, giữ ảnh cũ, trả lỗi UI nếu cần] --> X
  AD -- Yes --> AG[Server cập nhật image_url mới, có thể xóa ảnh cũ] --> AF[Hiển thị toast thành công] --> B

  %% Xóa
  AB --> AC1[Hiển thị dialog xác nhận xóa]
  AC1 --> AD1{Admin xác nhận?}
  AD1 -- Không --> D
  AD1 -- Có --> AE1[Frontend gọi DELETE /api/products/:id]
  AE1 --> AF1[Server xóa ảnh khỏi Storage]
  AF1 --> AG1[Xóa record product khỏi DB]
  AG1 --> AH1[Trả 200]
  AH1 --> AI1[Hiển thị toast thành công] --> B
```