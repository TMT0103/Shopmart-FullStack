import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";
import type { UserInfo } from "../types/UserInfo";
import "../css/admin.css";
import type { Order } from "../types/Order";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "users" | "orders"
  >("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
    category: { id: "" },
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategoryForm, setEditCategoryForm] = useState<{
    id: number | null;
    name: string;
  }>({
    id: null,
    name: "",
  });
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [tempOrderStatus, setTempOrderStatus] = useState<string>("");

  
  const [editProductForm, setEditProductForm] = useState<{
    id: number | null;
    name: string;
    price: string;
    stock: string;
    imageUrl: string;
    description: string;
    category: { id: number; name: string };
  }>({
     id: null, name: "" ,
      price: "",
      stock: "",
      imageUrl: "",
      description: "",
      category: { id: 0, name: "" },
  });
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
        description: productForm.description,
        category: { id: Number(productForm.category.id) },
      }),
    });
    console.log("Token:", token);
    if (res.ok) {
      alert("Thêm sản phẩm thành công!");
      setProductForm({
        name: "",
        price: "",
        stock: "",
        imageUrl: "",
        description: "",
        category: { id: "" },
      });
    } else {
      alert("Thêm thất bại!");
    }
  };
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: categoryForm.name,
      }),
    });

    if (res.ok) {
      alert("Thêm danh mục thành công!");
      setCategoryForm({ name: "" });
    } else {
      alert("Thêm thất bại!");
    }
  };
  const handleEditCategory = async (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setEditCategoryForm({ id, name: category.name });
    }
  };

  const handleSaveEditCategory = async () => {
    if (!editCategoryForm.id) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/category/${editCategoryForm.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editCategoryForm.name }),
      },
    );

    if (res.ok) {
      const updated = await res.json();

      // 🔥 cập nhật state ngay lập tức
      setCategories((prev) =>
        prev.map((c) => (c.id === editCategoryForm.id ? updated : c)),
      );

      alert("Cập nhật thành công");
      setEditCategoryForm({ id: null, name: "" });
    } else {
      alert("Cập nhật thất bại");
    }
  };

  const handleCancelEditCategory = () => {
    setEditCategoryForm({ id: null, name: "" });
  };
  const handleEditProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditProductForm({
        id,
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || "",
        description: product.description || "",
        category: { 
          id: product.category?.id || 0,
          name: product.category?.name || ""
        },
      });
    }
  };

  const handleSaveEditProduct = async () => {
    if (!editProductForm.id) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/products/${editProductForm.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editProductForm.name,
          price: Number(editProductForm.price),
          stock: Number(editProductForm.stock),
          category: {
            id: editProductForm.category.id,
          },
          imageUrl: editProductForm.imageUrl,
          description: editProductForm.description,
        }),
      },
    );

    if (res.ok) {
      const updated = await res.json();

      setProducts((prev) =>
        prev.map((p) => (p.id === editProductForm.id ? updated : p)),
      );

      alert("Cập nhật thành công");
      setEditProductForm({
        id: null,
        name: "",
        price: "",
        stock: "",
        imageUrl: "",
        description: "",
        category: {
          id: 0,
          name: "",
        },
      });
    } else {
      alert("Cập nhật thất bại");
    }
  };

  const handleCancelEditProduct = () => {
    setEditProductForm({
      id: null,
      name: "",
      price: "",
      stock: "",
      imageUrl: "",
      description: "",
      category: {
        id: 0,
        name: "",
      },
    });
  };
  const handleEditOrderStatus = (orderId: number, currentStatus: string) => {
    setEditingOrderId(orderId);
    setTempOrderStatus(currentStatus);
  };
  const handleSaveOrderStatus = async () => {
    if (editingOrderId === null) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/orders/${editingOrderId}/status?status=${tempOrderStatus}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.ok) {
      alert("Cập nhật thành công");
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrderId
            ? { ...order, status: tempOrderStatus }
            : order,
        ),
      );
      setEditingOrderId(null);
      setTempOrderStatus("");
    } else {
      alert("Thất bại");
    }
  };
  const handleCancelEditOrderStatus = () => {
    setEditingOrderId(null);
    setTempOrderStatus("");
  };
  const statusMap: Record<string, string> = {
    PENDING: "Chờ xử lý",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    DONE: "Đã giao",
    CANCELLED: "Đã hủy",
  };
  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:8080/products")
        .then((res) => res.json())
        .then((data) => {
          console.log("Data từ API:", data);
          setProducts(data);
        })
        .catch((err) => console.error(err));
      fetch("http://localhost:8080/category")
        .then((res) => res.json())
        .then((data) => {
          console.log("Categories from API:", data);
          setCategories(data);
        })
        .catch((err) => console.error(err));
      fetch("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          console.log("Status:", res.status);
          if (!res.ok) throw new Error("Status: " + res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Users:", data);
          setUsers(data);
        })
        .catch((err) => console.error(err));
      const token = localStorage.getItem("token");

      fetch("http://localhost:8080/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Order[0]:", JSON.stringify(data[0]));
          setOrders(data);
        })
        .catch((err) => console.error(err));
      setLoading(false);
    }, 1000);
  }, []);

  if (!isAuthenticated || !user) {
    return <div>Please log in as admin to access this page.</div>;
  }

  // Assume admin check - in real app, check user.role === 'admin'
  const isAdmin = true; // Placeholder

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };
  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Xóa đơn hàng này?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== id));
    }
  }
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Xóa danh mục này?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/category/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };
  const renderProducts = () => (
    <div>
      <h2 className="admin-subtitle">Manage Products</h2>
      <button
        className="admin-add-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Hủy" : "Add Product"}
      </button>

      {/* Form thêm product */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className="admin-form">
          <p className="admin-form-title">Thêm sản phẩm mới</p>
          <input
            placeholder="Tên sản phẩm"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            required
          />
          <input
            placeholder="Giá"
            type="number"
            value={productForm.price}
            onChange={(e) =>
              setProductForm({ ...productForm, price: e.target.value })
            }
            required
          />
          <input
            placeholder="Số lượng"
            type="number"
            value={productForm.stock}
            onChange={(e) =>
              setProductForm({ ...productForm, stock: e.target.value })
            }
            required
          />
          <input
            placeholder="URL ảnh"
            value={productForm.imageUrl}
            onChange={(e) =>
              setProductForm({ ...productForm, imageUrl: e.target.value })
            }
          />
          <input
            placeholder="Mô tả"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
          />
          <select
            value={productForm.category.id}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                category: { id: e.target.value },
              })
            }
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="admin-form-submit">
            Thêm sản phẩm
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">ID</th>
            <th className="admin-th">Name</th>
            <th className="admin-th">Category</th>
            <th className="admin-th">Price</th>
            <th className="admin-th">Stock</th>
            <th className="admin-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="admin-td">{product.id}</td>
              <td className="admin-td">
                {editProductForm.id === product.id ? (
                  <input
                    value={editProductForm.name}
                    onChange={(e) =>
                      setEditProductForm({ ...editProductForm, name: e.target.value })
                    }
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="admin-td">
                {editProductForm.id === product.id ? (
                  <select
                    value={editProductForm.category.id}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        category: {
                          ...editProductForm.category,
                          id: Number(e.target.value),
                        },
                      })
                    }
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  product.category.name
                )}
              </td>
              <td className="admin-td">
                {editProductForm.id === product.id ? (
                  <input
                    type="number"
                    value={editProductForm.price}
                    onChange={(e) =>
                      setEditProductForm({ ...editProductForm, price: e.target.value })
                    }
                  />
                ) : (
                  `${product.price}đ`
                )}
              </td>
              <td className="admin-td">
                {editProductForm.id === product.id ? (
                  <input
                    type="number"
                    value={editProductForm.stock}
                    onChange={(e) =>
                      setEditProductForm({ ...editProductForm, stock: e.target.value })
                    }
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td className="admin-td">
                {editProductForm.id === product.id ? (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={handleSaveEditProduct}
                    >
                      Save
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={handleCancelEditProduct}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCategories = () => (
    <div>
      <h2 className="admin-subtitle">Manage Categories</h2>
      <button
        className="admin-add-button"
        onClick={() => setShowCategoryForm(!showCategoryForm)}
      >
        {showCategoryForm ? "Hủy" : "Add Category"}
      </button>
      {showCategoryForm && (
        <form onSubmit={handleAddCategory} className="admin-form">
          <p className="admin-form-title">Thêm danh mục mới</p>
          <input
            placeholder="Tên danh mục"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, name: e.target.value })
            }
            required
          />
          <button type="submit" className="admin-form-submit">
            Thêm danh mục
          </button>
        </form>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">ID</th>
            <th className="admin-th">Name</th>
            <th className="admin-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="admin-td">{category.id}</td>
              <td className="admin-td">
                {editCategoryForm.id === category.id ? (
                  <input
                    value={editCategoryForm.name}
                    onChange={(e) =>
                      setEditCategoryForm({
                        ...editCategoryForm,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  category.name
                )}
              </td>
              <td className="admin-td">
                {editCategoryForm.id === category.id ? (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={handleSaveEditCategory}
                    >
                      Save
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={handleCancelEditCategory}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h2 className="admin-subtitle">Manage Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">ID</th>
            <th className="admin-th">Name</th>
            <th className="admin-th">Email</th>
            <th className="admin-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.role === "USER") 
            .map((user) => (
              <tr key={user.id}>
                <td className="admin-td">{user.id}</td>
                <td className="admin-td">{user.name}</td>
                <td className="admin-td">{user.email}</td>
                <td className="admin-td">
                  <button className="admin-edit-button">Edit</button>
                  <button className="admin-delete-button">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
  const renderOrders = () => (
    <div>
      <h2 className="admin-subtitle">Manage Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">Order ID</th>
            <th className="admin-th">Customer</th>
            <th className="admin-th">Order Date</th>
            <th className="admin-th">Total Amount</th>
            <th className="admin-th">Status</th>
            <th className="admin-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="admin-td">{order.id}</td>
              <td className="admin-td">{order.user?.name}</td>
              <td className="admin-td">
                {new Date(order.orderDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="admin-td">{order.total}đ</td>
              <td className="admin-td">
                {editingOrderId === order.id ? (
                  <select
                    value={tempOrderStatus}
                    onChange={(e) => setTempOrderStatus(e.target.value)}
                    className="admin-status-select"
                  >
                    {Object.entries(statusMap).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  statusMap[order.status] || order.status
                )}
              </td>
              <td className="admin-td">
                {editingOrderId === order.id ? (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={handleSaveOrderStatus}
                    >
                      Save
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={handleCancelEditOrderStatus}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-edit-button"
                      onClick={() =>
                        handleEditOrderStatus(order.id, order.status)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-welcome">
        Welcome to the admin dashboard! Here you can manage products, orders,
        and more.
      </p>
      <div className="admin-navbar">
        <button
          className={`admin-button ${activeTab === "products" ? "admin-button-active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`admin-button ${activeTab === "categories" ? "admin-button-active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`admin-button ${activeTab === "users" ? "admin-button-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`admin-button ${activeTab === "orders" ? "admin-button-active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>
      <div className="admin-content">
        {activeTab === "products" && renderProducts()}
        {activeTab === "categories" && renderCategories()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "orders" && renderOrders()}
      </div>
    </div>
  );
}
