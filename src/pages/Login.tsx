import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/auth.css";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingCart,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Search,
  Truck,
  CreditCard,
  RotateCcw,
  Loader2,
  CheckCircle,
  Users,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Vui lòng nhập email và mật khẩu");
    return;
  }

  if (!email.includes("@")) {
    setError("Email không hợp lệ");
    return;
  }

  if (password.length < 6) {
    setError("Mật khẩu phải có ít nhất 6 ký tự");
    return;
  }

  // 🔥 CALL LOGIN
  const result = await login(email, password);

  if (result.success) {
    if (result.role === "ADMIN") {
    navigate("/dashboards");
  } else {
    navigate("/");
  }
  } else {
    setError("Đăng nhập thất bại");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1><ShoppingCart size={28} /> SuperMart</h1>
            <h2>Đăng nhập tài khoản</h2>
            <p>Nhập thông tin của bạn để tiếp tục</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

            {/* Email Field */}
            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label><Lock size={16} /> Mật khẩu</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-remember">
              <label>
                <input type="checkbox" />
                <span>Nhớ tôi</span>
              </label>
              <a href="#forgot" className="forgot-link">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><Loader2 size={16} className="rotate" /> Đang đăng nhập...</> : <><CheckCircle size={16} /> Đăng nhập</>}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button className="social-btn google-btn"><Search size={16} /> Google</button>
            <button className="social-btn facebook-btn"><Users size={16} /> Facebook</button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Chưa có tài khoản?{" "}
              <Link to="/register" className="footer-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="auth-info">
          <div className="info-item">
            <span className="info-icon"><Truck size={20} /></span>
            <h3>Giao hàng nhanh</h3>
            <p>Miễn phí vận chuyển cho các đơn hàng trên 100k</p>
          </div>
          <div className="info-item">
            <span className="info-icon"><CreditCard size={20} /></span>
            <h3>Thanh toán an toàn</h3>
            <p>Bảo mật giao dịch 100%</p>
          </div>
          <div className="info-item">
            <span className="info-icon"><RotateCcw size={20} /></span>
            <h3>Trả hàng dễ dàng</h3>
            <p>Miễn phí trả hàng trong 30 ngày</p>
          </div>
        </div>
      </div>
    </div>
  );
}
