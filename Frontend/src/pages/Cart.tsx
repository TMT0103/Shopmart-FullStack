import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import CartItem from "../components/CartItem";
import "../css/cart.css";
import { useCart } from "../contexts/CartContext";
import {
  ShoppingCart,
  Trash2,
  ClipboardList,
  Truck,
  Gift,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = getTotalPrice();
 
  const shipping = shippingMethod === "express" ? 30000 : 15000;
  const total = subtotal +  shipping;

  const handleCheckout = () => {
    navigate("/payment");
  };

  const continueShopping = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="cart-container">
        {/* Page Title */}
        <div className="cart-header">
          <h1><ShoppingCart size={24} /> Giỏ hàng của bạn</h1>
          <p className="item-count">{cartItems.length} sản phẩm</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-wrapper">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span className="header-product">Sản phẩm</span>
                <span className="header-price">Giá</span>
                <span className="header-quantity">Số lượng</span>
                <span className="header-total">Tổng cộng</span>
                <span className="header-action">Thao tác</span>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl={item.imageUrl || "/default.jpg"}
                  stock={item.stock}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
              <button className="clear-cart-btn" onClick={clearCart}>
                <Trash2 size={14} /> Xóa tất cả
              </button>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-card">
                <h3><ClipboardList size={16} /> Tóm tắt đơn hàng</h3>

                {/* Shipping Method */}
                <div className="shipping-section">
                  <h4><Truck size={16} /> Phương thức giao hàng</h4>
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <span>Giao hàng tiêu chuẩn (20-30 phút)</span>
                    <span className="price">+15.000₫</span>
                  </label>
                  <label className="shipping-option">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <span>Giao hàng nhanh (10-20 phút)</span>
                    <span className="price">+30.000₫</span>
                  </label>
                </div>

                {/* Promo Code */}
                <div className="promo-section">
                  <h4><Gift size={16} /> Mã khuyến mại</h4>
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Nhập mã khuyến mại"
                      className="promo-input"
                    />
                    <button className="promo-btn">Áp dụng</button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Vận chuyển:</span>
                    <span>{shipping.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="cart-actions">
                  <button className="checkout-btn" onClick={handleCheckout}>
                    <CreditCard size={16} /> Thanh toán
                  </button>
                  <button className="continue-btn" onClick={continueShopping}>
                    <ArrowRight size={16} /> Tiếp tục mua hàng
                  </button>
                </div>

                {/* Info */}
                <div className="cart-info">
                  <p><CheckCircle size={16} /> Miễn phí trả hàng trong 30 ngày</p>
                  <p><CheckCircle size={16} /> Giao hàng an toàn với bảo hiểm</p>
                  <p><CheckCircle size={16} /> Hỗ trợ khách hàng 24/7</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon"><ShoppingBag size={40} /></div>
            <h2>Giỏ hàng của bạn trống</h2>
            <p>Hãy bắt đầu mua sắm để thêm sản phẩm vào giỏ hàng</p>
            <button className="empty-cart-btn" onClick={continueShopping}>
              <ShoppingBag size={16} /> Tiếp tục mua hàng
            </button>
          </div>
        )}
      </div>
    </>
  );
}
