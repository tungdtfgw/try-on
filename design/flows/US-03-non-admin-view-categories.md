# US-03 - Non-admin View Categories

```mermaid
flowchart TD
  A[User mở trang danh sách sản phẩm / hoặc landing] --> B[Frontend gọi GET /api/categories (public)]
  B --> C{API trả về 200?}
  C -- Yes --> D[Hiển thị danh mục cho user chọn/filter]
  C -- No --> E[Hiển thị thông báo lỗi nhẹ, đề xuất thử lại]
```