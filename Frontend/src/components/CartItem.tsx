interface CartItemProps {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    stock: number;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItem({
    id,
    name,
    price,
    quantity,
    imageUrl,
    stock,
    onUpdateQuantity,
    onRemove
}: CartItemProps) {
    
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0 && newQuantity <= stock) {
            onUpdateQuantity(id, newQuantity);
        }
    };

    const itemTotal = price * quantity;

    return (
        <div className="cart-item">
            <div className="item-product">
                <img src={imageUrl} alt={name} className="item-image" />
                <div className="item-info">
                    <h3>{name}</h3>
                    <p className="item-stock">Còn: {stock} sản phẩm</p>
                </div>
            </div>

            <div className="item-price">
                {price.toLocaleString('vi-VN')}₫
            </div>

            <div className="item-quantity">
                <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={stock}
                    className="qty-input"
                />
                <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= stock}
                >
                    +
                </button>
            </div>

            <div className="item-total">
                {itemTotal.toLocaleString('vi-VN')}₫
            </div>

            <button 
                className="item-remove"
                onClick={() => onRemove(id)}
                title="Xóa khỏi giỏ"
            >
                🗑️
            </button>
        </div>
    );
}
