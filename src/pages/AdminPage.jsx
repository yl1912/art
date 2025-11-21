import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // Hiển thị thông báo 2 giây
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // 🔥 LOAD PRODUCT TỪ SUPABASE
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 UPLOAD ẢNH BASE64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔥 SAVE PRODUCT (CREATE + UPDATE)
  const handleSave = async () => {
    if (!name || !fromPrice || !image)
      return alert("Nhập đầy đủ thông tin sản phẩm!");

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from("products")
        .update({
          name,
          fromprice: Number(fromPrice),
          image,
        })
        .eq("id", editingId);

      if (!error) showMessage("✅ Cập nhật sản phẩm thành công!");

      resetForm();
      fetchProducts();
      return;
    }

    // CREATE
    const { error } = await supabase.from("products").insert([
      {
        name,
        fromprice: Number(fromPrice),
        image,
      },
    ]);

    if (!error) showMessage("🎉 Thêm sản phẩm thành công!");

    resetForm();
    fetchProducts();
  };

  // 🔥 DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (!error) showMessage("🗑️ Xóa sản phẩm thành công!");

    fetchProducts();
  };

  // 🔥 EDIT PRODUCT
  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setFromPrice(p.fromprice);
    setImage(p.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setFromPrice("");
    setImage("");
  };

  return (
    <div className="admin-page">
      <h2>Quản lý sản phẩm</h2>

      {/* 🔥 THÔNG BÁO */}
      {message && <div className="success-msg">{message}</div>}

      {/* FORM */}
      <div className="admin-form">
        <h3>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>

        <label>
          Tên sản phẩm
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Giá
          <input
            type="number"
            value={fromPrice}
            onChange={(e) => setFromPrice(e.target.value)}
          />
        </label>

        <label>
          Upload ảnh
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        {image && (
          <img
            src={image}
            alt="preview"
            style={{
              width: "120px",
              marginTop: "10px",
              borderRadius: "4px",
            }}
          />
        )}

        <button className="primary-btn" onClick={handleSave}>
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>

        {editingId && (
          <button className="link-btn" onClick={resetForm}>
            Hủy sửa
          </button>
        )}
      </div>

      {/* LIST */}
      <h3>Danh sách sản phẩm</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt="" className="admin-thumb" />
              </td>
              <td>{p.name}</td>
              <td>{p.fromprice?.toLocaleString()}₫</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(p)}>
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(p.id)}
                >
                  Xóa{" "}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
