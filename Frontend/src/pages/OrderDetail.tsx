import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/OrderDetail.css";
import type { Order } from "../types/Order";
import Navbar from "../components/navbar";
import { ChevronLeft, Receipt, CalendarDays, CreditCard } from "lucide-react";
export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error(err));
  }, [id]);

  // 🔥 FIX ở đây
  if (!order) return <p className="order-container">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="back-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Quay lại
        </button>
      </div>
      
      <div className="order-container">
        
        <div className="order-card">
          <div className="order-title"><Receipt size={18} /> Đơn hàng #{order.id}</div>

          <div className="order-info">
            <p>Trạng thái: {order.status}</p>
            <p>
              <CalendarDays size={14} /> Ngày: {new Date(order.orderDate).toLocaleDateString("vi-VN")}
            </p>
            <p><CreditCard size={14} /> Tổng tiền: {order.total}đ</p>
          </div>

          <div className="order-items">
            <h3>Sản phẩm:</h3>

            {order.items?.map((item: any) => (
              <div className="order-item" key={item.id}>
                <div>
                  <div className="product-name">{item.product?.name}</div>
                  <div className="product-qty">SL: {item.quantity}</div>
                </div>

                <div className="product-price">{item.price}đ</div>
              </div>
            ))}
          </div>

          <div className="order-total">Tổng: {order.total}đ</div>
        </div>
      </div>
    </>
  );
}
