import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Phone,
  Mail,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  Home,
  Package,
  Sparkles,
  Info,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      {/* Header Top */}
      <div className="navbar-top">
        <p className="contact-info">
          <Phone size={14} /> 1800-5789 | <Mail size={14} /> support@supermart.vn
        </p>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <h2>
              <ShoppingCart size={24} /> SuperMart
            </h2>
          </Link>
        </div>

        

        {/* Right Section */}
        <div className="navbar-right">
          {/* Search Icon Mobile */}
          <button
            className="search-icon-mobile"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={18} />
          </button>

          {/* User Account */}
          <div className="nav-item">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/account" className="nav-link">
                  <User size={16} /> {user?.name || "Tài khoản"}
                </Link>
                <div className="user-dropdown">
                  <button onClick={logout} className="dropdown-item logout-btn">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-link login-link">
                <User size={16} /> Đăng nhập
              </Link>
            )}
          </div>

          {/* Cart */}
          <div className="nav-item cart-item">
            <Link to="/cart" className="nav-link">
              <ShoppingCart size={16} /> Giỏ hàng
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">
              <Home size={16} /> Trang chủ
            </Link>
          </li>
          <li className="dropdown">
            <a href="#" className="nav-link">
              <Package size={16} /> Danh mục
            </a>
            <ul className="submenu">
              <li>
                <a href="/category/vegetables">Rau quả tươi</a>
              </li>
              <li>
                <a href="/category/meat">Thịt - Cá</a>
              </li>
              <li>
                <a href="/category/dairy">Sữa - Trứng</a>
              </li>
              <li>
                <a href="/category/snacks">Đồ ăn vặt</a>
              </li>
              <li>
                <a href="/category/drinks">Nước uống</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/deals" className="nav-link">
              <Sparkles size={16} /> Khuyến mại
            </a>
          </li>
          <li>
            <a href="/about" className="nav-link">
              <Info size={16} /> Về chúng tôi
            </a>
          </li>
          <li>
            <a href="/contact" className="nav-link">
              <Mail size={16} /> Liên hệ
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
