import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/auth.css';
import {
  ShoppingCart,
  AlertCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Search,
  Gift,
  Users,
  Loader2,
  Check,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const { register } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email || !name || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!email.includes('@')) {
            setError('Email không hợp lệ');
            return;
        }

        if (name.length < 3) {
            setError('Tên phải có ít nhất 3 ký tự');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (!agreeTerms) {
            setError('Vui lòng đồng ý với điều khoản và chính sách');
            return;
        }

        setLoading(true);

        // Simulate API call
        try {
            const result = await register(name, email, password);
            if (result.success) {
                alert('Đăng ký thành công! Hãy đăng nhập');
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>
            </div>

            <div className="auth-wrapper">
                <div className="auth-card register-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1><ShoppingCart size={28} /> SuperMart</h1>
                        <h2>Tạo tài khoản mới</h2>
                        <p>Đăng ký để bắt đầu mua sắm</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="form-group">
                            <label><User size={16} /> Họ tên</label>
                            <input
                                type="text"
                                placeholder="Nhập tên đầy đủ"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                            />
                        </div>

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
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label><Lock size={16} /> Xác nhận mật khẩu</label>
                            <div className="password-input-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="form-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span>
                                    Tôi đồng ý với{' '}
                                    <a href="#terms">điều khoản dịch vụ</a>
                                    {' '}và{' '}
                                    <a href="#privacy">chính sách bảo mật</a>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? <><Loader2 size={16} className="rotate" /> Đang đăng ký...</> : <><Check size={16} /> Tạo tài khoản</>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>hoặc</span>
                    </div>

                    {/* Social Login */}
                    <div className="social-login">
                        <button className="social-btn google-btn">
                            <Search size={16} /> Google
                        </button>
                        <button className="social-btn facebook-btn">
                            <Users size={16} /> Facebook
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="footer-link">
                                Đăng nhập tại đây
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="auth-info">
                    <div className="info-item">
                        <span className="info-icon"><CreditCard size={20} /></span>
                        <h3>Ưu đãi lớn</h3>
                        <p>Giảm tới 50% cho khách hàng mới</p>
                    </div>
                    <div className="info-item">
                        <span className="info-icon"><Gift size={20} /></span>
                        <h3>Điểm thưởng</h3>
                        <p>Tích lũy điểm và đổi quà</p>
                    </div>
                    <div className="info-item">
                        <span className="info-icon"><Users size={20} /></span>
                        <h3>Cộng đồng</h3>
                        <p>Tham gia cộng đồng triệu người dùng</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
