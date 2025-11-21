import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CategoryPage() {
  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // 🔥 Lấy sản phẩm từ Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  };

  // 🔥 Sắp xếp
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.fromprice - b.fromprice;
    if (sort === "price-desc") return b.fromprice - a.fromprice;
    return 0;
  });

  return (
    <div className="category-page">
      {/* ⭐ TIÊU ĐỀ */}
      <h2 className="category-title">TẤT CẢ SẢN PHẨM</h2>

      {/* ⭐ THANH SẮP XẾP */}
      <div className="sort-bar">
        <span>Sắp xếp theo:</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>

      {/* ⭐ LOADING */}
      {products.length === 0 && <p>Đang tải sản phẩm...</p>}

      {/* ⭐ GRID SẢN PHẨM */}
      <div className="product-grid">
        {sortedProducts.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-image-wrap">
              <img src={p.image} alt={p.name} />
            </div>

            <div className="product-info">
              <div className="product-name">{p.name}</div>

              <div className="product-bottom">
                <div className="product-price-row">
                  <span className="product-price-label">Chỉ từ:</span>
                  <span className="product-price">
                    {(p.fromprice ?? 0).toLocaleString()}đ
                  </span>
                </div>

                <button
                  className="product-cart-btn"
                  onClick={() => addToCart(p)}
                >
                  🛒+
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
