# Try-on (GenAI4Dev K1)

## Giới thiệu
Dự án "Try-on" là ứng dụng thử đồ (virtual try-on) theo hướng GenA
- Backlog tổng quan: xem `PB.md`
- Sprint 1 backlog: xem `sprints/sprint1.md`
- User stories chi tiết: xem `sprints/US-01.md` và `sprints/US-02.md`

## Tech stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Database & Storage: Supabase
- Auth: JWT

## Cấu trúc repo
- `.cursor/`: rules/commands cho Cursor
- `sprints/`: user stories + sprint backlog
- `PB.md`: product backlog
- `README.md`: tài liệu dự án
- `backend/`: Backend API (Node.js + Express)
- `frontend/`: Frontend application (React + Vite)

## Hướng dẫn Setup & Run

### Yêu cầu
- Node.js >= 18.x
- npm hoặc yarn
- Tài khoản Supabase

### Backend Setup

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật các biến môi trường trong `.env`:
- `PORT`: Port cho server (mặc định: 3000)
- `NODE_ENV`: Môi trường chạy (development/production)
- `FRONTEND_URL`: URL của frontend (mặc định: http://localhost:5173)
- `JWT_SECRET`: Secret key cho JWT (thay đổi trong production)
- `JWT_EXPIRES_IN`: Thời gian hết hạn của JWT (mặc định: 7d)
- `SUPABASE_URL`: URL của Supabase project
- `SUPABASE_ANON_KEY`: Anon key của Supabase

5. Chạy server:
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

### Frontend Setup

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật các biến môi trường trong `.env`:
- `VITE_API_URL`: URL của backend API (mặc định: http://localhost:3000/api/v1)

5. Chạy development server:
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### Scripts có sẵn

#### Backend
- `npm start`: Chạy server ở production mode
- `npm run dev`: Chạy server ở development mode (với nodemon)
- `npm run lint`: Kiểm tra lỗi ESLint
- `npm run lint:fix`: Tự động sửa lỗi ESLint
- `npm run format`: Format code với Prettier

#### Frontend
- `npm run dev`: Chạy development server
- `npm run build`: Build cho production
- `npm run preview`: Preview build production
- `npm run lint`: Kiểm tra lỗi ESLint
- `npm run lint:fix`: Tự động sửa lỗi ESLint
- `npm run format`: Format code với Prettier

## Hướng dẫn vibe code
- Bám theo các tasks liệt kê trong sprint backlog, hãy ra lệnh cho AI thực hiện từng task một. Nhớ @ các files liên quan tới tasks khi ra lệnh.
- Sử dụng các commands hợp lý trong quá trình vibe code.
- Prompt mẫu hoàn thành task 1: 
```
Hãy triển khai Task 1 trong @sprints/sprint1.md: Thiết lập Project.
```
- Prompt mẫu hoàn thành task 2: 
```
@PB.md, @US-01.md, @US-02.md, @sprints/sprint1.md: Hãy triển khai Task 2 trong @sprints/sprint1.md: Tạo Landing Page.
```
