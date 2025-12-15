# US-04 - Non-admin View Products

```mermaid
flowchart TD
  A[User mở trang danh sách sản phẩm /products] --> B[Frontend gọi GET /api/products?limit=&offset=&category_id?]
  B --> C{API trả về 200?}
  C -- Yes --> D[Hiển thị danh sách products (grid) + filter category + pagination]
  C -- No --> E[Hiển thị thông báo lỗi]

  D --> F[User chọn 1 product]
  F --> G[Frontend điều hướng /products/:id]
  G --> H[Gọi GET /api/products/:id (public)]
  H --> I{API trả về 200?}
  I -- Yes --> J[Hiển thị chi tiết sản phẩm + ảnh]
  I -- No --> K[Hiển thị 'Không tìm thấy sản phẩm' hoặc lỗi phù hợp]
```