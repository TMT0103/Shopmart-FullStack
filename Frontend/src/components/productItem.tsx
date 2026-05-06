import { useState } from "react";
import "../css/productItem.css";
import type { Product } from "../types/Product";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";

interface ProductItemProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductItem({
  product,
  onAddToCart,
}: ProductItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="product-item">
      {/* Image Container */}
      <div className="product-image-container">
        <img
          src={product.imageUrl /* || "src\\assets\\kale.jpg" */} // Fallback image
          alt={product.name}
          className="product-image"
          onError={(e) => console.log("Ảnh lỗi:", product.imageUrl, e)}
        />

        {/* Stock Status */}
        {/* {product.stock === 0 && <div className="out-of-stock">Hết hàng</div>} */}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Product Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Price Section */}
        <div className="product-price-section">
          <div className="price-container">
            <span className="price">
              {product.price.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        {/* Stock Info */}
        <div className="stock-info">
          {product.stock > 0 && (
            <span className="stock-status in-stock">
              Còn {product.stock} sản phẩm
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        {/* Quantity and Add to Cart */}
        <div className="product-actions">
          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max={product.stock}
              className="qty-input"
            />
            <button
              className="qty-btn"
              onClick={() => {
                setQuantity(Math.min(product.stock, quantity + 1));
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            className={`add-to-cart-btn ${isAdded ? "added" : ""} ${product.stock === 0 ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {isAdded ? <><Check size={16} /> Đã thêm</> : <><ShoppingCart size={16} /> Thêm vào giỏ</>}
          </button>
        </div>
      </div>
    </div>
  );
}
