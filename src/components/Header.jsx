import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${keyword}`);
  };

  return (
    <>
      <div className="top-banner">
        GIAO HÀNG TỪ 2-5 NGÀY LÀM VIỆC.
        <span className="top-banner-hotline">
          📞 HOTLINE (10:00AM - 20:00H): (+84) 768962276
        </span>
      </div>

      <header className="header">
        <div className="header-left" />

        <div className="header-center">
          <Link to="/" className="logo">
            TranhDecor
          </Link>

          <nav className="main-nav">
            <ul className="main-nav-list">
              <li className="nav-item">
                <Link to="/">Tất cả</Link>
              </li>

              {/* DROPDOWN 1 */}
              <li className="nav-item dropdown">
  <span className="nav-link">TRANH BỘ</span>
  <ul className="dropdown-menu">

    <li>
      <Link to="/category/truu-tuong">TRỪU TƯỢNG</Link>
    </li>

    <li>
      <Link to="/category/thuc-vat">THỰC VẬT</Link>
    </li>

    <li>
      <Link to="/category/dong-vat">ĐỘNG VẬT</Link>
    </li>

    <li>
      <Link to="/category/ban-do">BẢN ĐỒ & THÀNH PHỐ</Link>
    </li>

  </ul>
</li>


              {/* DROPDOWN 2 */}
              <li className="nav-item dropdown">
                <span className="nav-link">BỘ SƯU TẬP</span>
                <ul className="dropdown-menu">
                  <li>WILLIAM MORRIS</li>
                  <li>VAN GOGH EXHIBITION</li>
                  <li>HENRI MATISSE INSPIRED</li>
                  <li>MONET EXHIBITION</li>
                  <li>MAISON DÉCORA</li>
                  <li>BEIGE IMPRESSION</li>
                  <li>WAVE GLASS</li>
                  <li>CỔ VẬT</li>
                </ul>
              </li>

              {/* DROPDOWN 3 */}
              <li className="nav-item dropdown">
                <span className="nav-link">TRANH RỜI</span>
                <ul className="dropdown-menu">
                  <li>Trừu tượng</li>
                  <li>Bản đồ & Thành phố</li>
                  <li>Thực vật</li>
                  <li>Động vật</li>
                  <li>Không gian</li>
                  <li>Tranh cho bé</li>
                  <li>Thời trang</li>
                  <li>Nét vẽ tay</li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-right">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="🔍 Bạn tìm gì..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>

          <Link to="/cart" className="cart-btn">
            🛍
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          <div className="user-box-wrapper">
            {isAuthenticated ? (
              <>
                <div className="user-box">
                  <span className="user-icon">👤</span>
                  <div className="user-info">
                    <div className="user-email">{currentUser.email}</div>
                    <button className="link-btn" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                </div>

                {isAdmin && (
                  <Link to="/admin" className="admin-btn">
                    ⚙️ Quản lý sản phẩm
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" className="icon-btn">
                👤
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
