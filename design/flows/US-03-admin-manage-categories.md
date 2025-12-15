# US-03 - Admin Manage Categories

```mermaid
flowchart TD
  A[Admin mở trang /admin/categories] --> B[Frontend gọi GET /api/categories]
  B --> C{API trả về 200?}
  C -- Yes --> D[Hiển thị danh sách categories (table/card)]
  C -- No --> E[Hiển thị thông báo lỗi]

  D --> F{Admin chọn hành động?}
  F -- Thêm mới --> G[Click 'Thêm danh mục']
  F -- Sửa --> M[Click 'Sửa' 1 danh mục]
  F -- Xóa --> R[Click 'Xóa' 1 danh mục]
  F -- Thoát --> Z[Admin rời trang]

  %% Tạo mới
  G --> H[Hiển thị CategoryForm rỗng]
  H --> I[Admin nhập name, description và bấm Lưu]
  I --> J[Frontend validate cơ bản (required, length)]
  J --> K{Valid?}
  K -- No --> H1[Hiển thị lỗi form] --> H
  K -- Yes --> L[Frontend gọi POST /api/categories kèm dữ liệu]
  L --> L1{Server validate & generate slug}
  L1 -- Lỗi --> L2[Trả về 400 với message] --> H1
  L1 -- OK --> L3[Lưu DB & trả về 201]
  L3 --> L4[Frontend hiển thị toast thành công]
  L4 --> B

  %% Sửa
  M --> N[Hiển thị CategoryForm với dữ liệu hiện tại]
  N --> O[Admin chỉnh sửa và bấm Lưu]
  O --> P[Frontend validate cơ bản]
  P --> Q{Valid?}
  Q -- No --> N1[Hiển thị lỗi form] --> N
  Q -- Yes --> Q1[Frontend gọi PUT /api/categories/:id]
  Q1 --> Q2{Server validate & update}
  Q2 -- Lỗi --> Q3[Trả về 400/404 với message] --> N1
  Q2 -- OK --> Q4[Trả về 200]
  Q4 --> Q5[Frontend hiển thị toast thành công]
  Q5 --> B

  %% Xóa
  R --> S[Hiện dialog xác nhận 'Bạn có chắc?']
  S --> T{Admin xác nhận?}
  T -- Không --> D
  T -- Có --> U[Frontend gọi DELETE /api/categories/:id]
  U --> V{Server kiểm tra có products?}
  V -- Có products --> W[Trả về 400 'Không thể xóa danh mục đang có sản phẩm'] --> X[Hiển thị lỗi] --> D
  V -- Không --> Y[Xóa category & trả về 200]
  Y --> Y1[Hiển thị toast thành công] --> B
```