import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useCart } from "../contexts/CartContext";

import "../css/cart.css";

export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Fill form with user info on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      })
      .catch((err) => console.error(err));
  }, []);

  const subtotal = getTotalPrice();
  
  const shipping = 15000; // Fixed shipping for simplicity
  const total = subtotal  + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);
    try {
      const res = await fetch("http://localhost:8080/orders/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          paymentMethod,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
        }),
      });
      const body = {
        name,
        email,
        phone,
        address,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      };
      console.log("Body gửi đi:", body);
      console.log("Status:", res.status);

      if (!res.ok) {
        const err = await res.text();
        console.error("Lỗi:", err);
        alert("Đặt hàng thất bại: " + err);
        return;
      }

      const data = await res.json();
      console.log("Order:", data);
      clearCart();
      alert("Đặt hàng thành công!");
      navigate("/");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Có lỗi xảy ra!");
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <h1>Giỏ hàng trống</h1>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <button onClick={() => navigate("/")} className="continue-shopping">
            Tiếp tục mua sắm
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Thanh toán</h1>
        <div className="cart-wrapper">
          <div className="cart-items-section">
            <h2>Tóm tắt đơn hàng</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <img
                    src={item.imageUrl || "/default.jpg"}
                    alt={item.name}
                    className="item-image"
                  />
                  <h3>{item.name}</h3>
                  <p>Số lượng: {item.quantity}</p>
                  <p>
                    Giá: {(item.price * item.quantity).toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))}
            <div className="order-summary">
              <p>Tạm tính: {subtotal.toLocaleString()} VND</p>
              
              <p>Vận chuyển: {shipping.toLocaleString()} VND</p>
              <p>
                <strong>Tổng cộng: {total.toLocaleString()} VND</strong>
              </p>
            </div>
          </div>
          <div className="payment-form-section">
            <h2>Thông tin thanh toán</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ tên:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ:</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit">Thẻ tín dụng</option>
                  <option value="debit">Thẻ ghi nợ</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <>
                  <div className="form-group">
                    <label>Số thẻ:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày hết hạn:</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV:</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit" className="checkout-btn">
                Thanh toán {total.toLocaleString()} VND
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
