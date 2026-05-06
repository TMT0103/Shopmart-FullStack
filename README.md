Đây là hệ thống Website thương mại điện tử gồm:

Backend: Spring Boot + JWT Authentication
Frontend: React (TypeScript)

Hệ thống cho phép:

Người dùng xem sản phẩm, thêm vào giỏ hàng, đặt hàng
Admin quản lý sản phẩm, danh mục, đơn hàng, người dùng
🧱 Công nghệ sử dụng
Backend
Java Spring Boot
Spring Security + JWT
JPA / Hibernate
PostgreSQL / MySQL
Frontend
React + TypeScript
Fetch API
CSS thuần
🚀 Chức năng chính
👤 User
Đăng ký / Đăng nhập
Xem danh sách sản phẩm
Tìm kiếm sản phẩm
Thêm vào giỏ hàng
Xem giỏ hàng
Đặt hàng
Xem lịch sử đơn hàng
Xem chi tiết đơn hàng
🛠️ Admin
Quản lý sản phẩm (CRUD)
Quản lý danh mục (CRUD)
Quản lý người dùng
Quản lý đơn hàng
Cập nhật trạng thái đơn hàng
🔐 Phân quyền
USER: mua hàng
ADMIN: quản trị hệ thống

Sử dụng JWT để xác thực:

Authorization: Bearer <token>
📂 Cấu trúc Backend
backend/
├── controller
├── service
├── repository
├── entity
├── security
│   ├── JwtAuthenticationFilter
│   ├── JwtTokenProvider
│   └── SecurityConfig
📂 Cấu trúc Frontend
frontend/
├── pages
│   ├── Home
│   ├── Cart
│   ├── Orders
│   ├── OrderDetail
│   └── AdminDashboard
├── components
├── services
⚙️ Cài đặt
1. Backend
cd backend
mvn spring-boot:run

Cấu hình database trong:

application.properties
2. Frontend
cd frontend
npm install
npm run dev

Chạy tại:

http://localhost:5173
🔗 API chính
Auth
POST /auth/register
POST /auth/login
Products
GET    /products
POST   /products        (ADMIN)
PUT    /products/{id}   (ADMIN)
DELETE /products/{id}   (ADMIN)
Category
GET    /category
POST   /category        (ADMIN)
PUT    /category/{id}   (ADMIN)
DELETE /category/{id}   (ADMIN)
Cart
GET    /cart
POST   /cart/add
PUT    /cart/update
DELETE /cart/remove
Orders
POST   /orders
GET    /orders/my
GET    /orders/{id}
PUT    /orders/{id}/status   (ADMIN)
🐞 Một số lỗi đã fix
❌ 403 khi gọi API → do sai ROLE_ prefix
❌ JWT không nhận /auth/register → fix filter skip path
❌ Frontend không hiển thị cart → thiếu Authorization header
❌ PUT product bị 403 → do SecurityConfig rule
🎨 UI
Admin Dashboard:
bảng có màu
hover effect
form thêm/sửa đẹp
Order detail page riêng
📌 Hướng phát triển thêm
Thanh toán online (VNPay / Stripe)
Upload ảnh sản phẩm
Pagination
Search nâng cao
Review sản phẩm
👨‍💻 Tác giả
Minh Tuấn Trần
