# GiaSuHQ Frontend (`tutors_FE`)

Giao diện người dùng (Frontend) của ứng dụng GiaSuHQ — xây dựng bằng React.

## 🚀 Công nghệ sử dụng
- **Framework:** React 18 (Vite)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Deployment:** Vercel

---

## 🛠️ Hướng dẫn cài đặt & Chạy trên máy Local (Dành cho thành viên nhóm)

### 1. Yêu cầu môi trường
- Node.js 18.x hoặc 20.x trở lên
- npm / yarn / pnpm

### 2. Cài đặt Dependencies
Mở terminal tại thư mục `tutors_FE`:
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` dựa trên `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Khởi chạy Server Development
```bash
npm run dev
```
Ứng dụng Frontend sẽ chạy tại địa chỉ: `http://localhost:5173`

---

## 🌐 Deployment trên Vercel
1. Kết nối repository GitHub `tutors_FE` với dự án trên **Vercel**.
2. Thiết lập Framework Preset: **Vite**.
3. Cấu hình biến môi trường trên Vercel Dashboard:
   - `VITE_API_BASE_URL`: URL API Backend thật (sau khi deploy BE).
4. Vercel tự động build & deploy mỗi khi push code lên branch `main`.

---

## 🌿 Quy định Git & Làm việc nhóm 2 người
- **Branch chính:** `main`
- **Tạo branch mới cho mỗi giao diện:** `feature/ten-man-hinh` (ví dụ: `feature/login`, `feature/tutor-dashboard`).
- **Tạo Pull Request (PR):** Đánh giá code trước khi merge vào `main`.
