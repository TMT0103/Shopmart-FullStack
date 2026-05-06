import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, CartContextType } from "../types/Cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart vào localStorage khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: any, quantity: number = 1) => {
    const token = localStorage.getItem("token");

    // Nếu đã login thì sync lên DB
    if (token) {
      try {
        await fetch(
          `http://localhost:8080/cart/add?productId=${product.id}&quantity=${quantity}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (err) {
        console.error("Lỗi sync cart:", err);
      }
    }

    // Vẫn lưu localStorage như cũ
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Không thể thêm. Chỉ còn ${product.stock} sản phẩm trong kho.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item,
        );
      } else {
        if (quantity > product.stock) {
          alert(`Không thể thêm. Chỉ còn ${product.stock} sản phẩm trong kho.`);
          return prevItems;
        }
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
            stock: product.stock,
            description: product.description,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Kiểm tra không vượt quá stock
          if (quantity > item.stock) {
            alert(
              `Không thể cập nhật. Chỉ còn ${item.stock} sản phẩm trong kho.`,
            );
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
