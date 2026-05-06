import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "../css/account.css";
import {
  User,
  LogOut,
  Package,
  MapPin,
  Settings,
  Edit2,
  X,
  Camera,
  CalendarDays,
  Star,
  Save,
 
  Plus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
export default function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses" | "settings"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
  });
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zipcode: user.zipcode || "",
      });
    }
  }, [user]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", localStorage.getItem("token"));
    if (!token) return;

    fetch("http://localhost:8080/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token orders:", token);
    if (!token) return;

    fetch("http://localhost:8080/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders:", data);
        setOrders(data);
      })

      .catch((err) => console.error(err));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8080/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updated = await res.json();
      setUser(updated);
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "pending",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return colors[status] || "default";
  };

  return (
    <>
      <Navbar />

      <div className="account-container">
        {/* Account Header */}
        <div className="account-header">
          <div className="account-title">
              <h1><User size={24} /> Thông tin tài khoản</h1>
              <p>Quản lý hồ sơ cá nhân của bạn</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>

        <div className="account-wrapper">
          {/* Sidebar Navigation */}
          <div className="account-sidebar">
            <nav className="account-nav">
              <button
                className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={16} /> Hồ sơ cá nhân
              </button>
              <button
                className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <Package size={16} /> Đơn hàng ({orders.length})
              </button>
              <button
                className={`nav-item ${activeTab === "addresses" ? "active" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin size={16} /> Địa chỉ (1)
              </button>
              <button
                className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={16} /> Cài đặt
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="account-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Hồ sơ cá nhân</h2>
                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <><X size={14} /> Hủy</> : <><Edit2 size={14} /> Chỉnh sửa</>}
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="profile-form">
                  {/* Avatar */}
                  <div className="avatar-section">
                    <div className="avatar-display"></div>
                    {isEditing && (
                      <button type="button" className="change-avatar-btn">
                        <Camera size={16} /> Thay đổi ảnh
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Thành phố</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button type="submit" className="submit-btn">
                      <Save size={16} /> Lưu thay đổi
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" &&
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Đơn hàng #{order.id}</h3>
                      <p className="order-date">
                        <CalendarDays size={16} /> {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <span
                      className={`order-status ${getStatusColor(order.status?.toLowerCase())}`}
                    >
                      {getStatusLabel(order.status?.toLowerCase())}
                    </span>
                  </div>
                  <div className="order-details">
                    <p><Package size={16} /> {order.totalItems} sản phẩm</p>
                    <p className="order-total">
                      <p>Tổng tiền: {order.total?.toLocaleString("vi-VN")}₫</p>
                    </p>
                  </div>
                  <button className="view-btn" onClick={() => navigate(`/orders/${order.id}`)}>
                    Xem chi tiết
                  </button>
                </div>
              ))}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Sổ địa chỉ</h2>
                  <button className="add-btn"><Plus size={14} /> Thêm địa chỉ</button>
                </div>
                <div className="addresses-list">
                  <div className="address-card">
                    <div className="address-header">
                      <h3>Địa chỉ mặc định</h3>
                      <span className="default-badge"><Star size={12} /> Mặc định</span>
                    </div>
                    <p className="address-text">
                      {editForm.address || "Chưa cập nhật địa chỉ"}
                    </p>
                    <p className="address-text">
                      ☎️ {editForm.phone || "Chưa cập nhật số điện thoại"}
                    </p>
                    <div className="address-actions">
                      <button
                        className="action-btn"
                        onClick={() => setActiveTab("profile")}
                      >
                        ✎ Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="content-section">
                <h2>Cài đặt tài khoản</h2>
                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Đổi mật khẩu</h3>
                      <p>
                        Cập nhật mật khẩu của bạn thường xuyên để bảo vệ tài
                        khoản
                      </p>
                    </div>
                    <button className="setting-btn">Đổi mật khẩu</button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Thông báo qua email</h3>
                      <p>Nhận thông báo về đơn hàng, khuyến mại và tin tức</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Xoá tài khoản</h3>
                      <p>Xoá vĩnh viễn tài khoản và dữ liệu của bạn</p>
                    </div>
                    <button className="delete-btn">Xoá tài khoản</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
