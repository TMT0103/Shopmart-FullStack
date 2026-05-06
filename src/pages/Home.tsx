import Navbar from "../components/navbar";
import "../css/home.css";
import ProductItem from "../components/productItem";
import { useState, useEffect } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../contexts/CartContext";
import type { Category } from "../types/Category";
import { Search, ShoppingCart, Folder, Sparkles, Percent } from "lucide-react";
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data từ API:", data);
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetch("http://localhost:8080/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error(err));
    }
  }, [searchQuery]);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/products/search?keyword=${searchQuery}`,
      );
      
      const data = await res.json();
      console.log("Data:", data);
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let url = "http://localhost:8080/products";

    if (selectedCategory !== "all") {
      url += `?categoryId=${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [selectedCategory]);
  return (
    <>
      <Navbar />
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="search-container"
      >
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <Search size={20} />
        </button>
      </form>
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1><ShoppingCart size={32} /> Chào mừng đến SuperMart</h1>
        <p>Tìm kiếm sản phẩm chất lượng cao với giá tốt nhất hôm nay!</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <h3><Folder size={18} /> Danh mục sản phẩm</h3>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => {
                if (selectedCategory === cat.id) {
                  setSelectedCategory("all");
                } else {
                  setSelectedCategory(cat.id);
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <span><Percent size={18} /></span>
        Khuyến mại lớn! Giảm tới 50% cho hôm nay
        <span><Sparkles size={18} /></span>
      </div>

      {/* Section Title */}
      <div className="section-title">
        <h2><Sparkles size={24} /> Sản phẩm nổi bật</h2>
        <p>Những sản phẩm được yêu thích nhất từ khách hàng</p>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p>
          <strong>SuperMart</strong> - Siêu thị online uy tín
        </p>
        <p>📞 1800-5789 | ✉️ support@supermart.vn</p>
        <p>© 2024 SuperMart. Bản quyền được bảo vệ.</p>
      </div>
    </>
  );
}
