import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ NHẬN DANH SÁCH SẢN PHẨM ĐÃ CHỌN
  const selectedItems = location.state?.selectedItems || [];

  // ⭐ Lọc sản phẩm được chọn
  const selectedProducts = cart.filter((item) =>
    selectedItems.includes(item.product_id)
  );

  // ⭐ Tính tổng tiền theo SP được chọn
  const totalSelectedPrice = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // State form
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ⭐ Giảm giá
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalSelectedPrice);

  // Lấy giảm giá
  useEffect(() => {
    if (currentUser) loadDiscount();
  }, [currentUser, totalSelectedPrice]);

  const loadDiscount = async () => {
    const { data } = await supabase
      .from("spinwheel")
      .select("*")
      .eq("user_id", currentUser.id)
      .single();

    if (data) {
      const percent = parseInt(data.reward.replace("%", ""));
      setDiscountPercent(percent);

      const newTotal =
        totalSelectedPrice - (totalSelectedPrice * percent) / 100;
      setFinalPrice(newTotal);
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) return navigate("/login");
    if (!name || !phone || !address)
      return alert("Vui lòng điền đủ thông tin!");

    // Tạo đơn hàng
    const { data: order } = await supabase
      .from("orders")
      .insert([
        {
          user_id: currentUser.id,
          total: finalPrice,
          discount: discountPercent,
          customer_name: name,
          phone,
          address,
        },
      ])
      .select()
      .single();

    // Chỉ tạo order_items cho sản phẩm đã chọn
    const orderItems = selectedProducts.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await supabase.from("order_items").insert(orderItems);

    alert("🎉 Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-steps">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          1. Xác nhận đơn
        </div>
        <div className={`step ${step === 2 ? "active" : ""}`}>
          2. Thông tin giao hàng
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="checkout-box">
          <h2>Danh sách sản phẩm</h2>

          {selectedProducts.map((item) => (
            <div key={item.product_id} className="checkout-item">
              <img src={item.image} alt="" />
              <div>
                <p className="item-name">{item.name}</p>
                <p className="item-qty">SL: {item.quantity}</p>
              </div>
              <p className="item-price">
                {(item.price * item.quantity).toLocaleString()}đ
              </p>
            </div>
          ))}

          <div className="checkout-total">
            <p>
              Tạm tính: <strong>{totalSelectedPrice.toLocaleString()}đ</strong>
            </p>

            {discountPercent > 0 && (
              <p className="discount-text">
                🎁 Giảm giá vòng quay: -{discountPercent}%
              </p>
            )}

            <p className="final-total">
              Tổng thanh toán:{" "}
              <strong style={{ color: "red" }}>
                {finalPrice.toLocaleString()}đ
              </strong>
            </p>
          </div>

          <button className="checkout-btn" onClick={() => setStep(2)}>
            Tiếp tục →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="checkout-box">
          <h2>Thông tin giao hàng</h2>

          <div className="checkout-form">
            <label>
              Họ tên
              <input
                className="checkout-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Số điện thoại
              <input
                className="checkout-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label>
              Địa chỉ giao hàng
              <textarea
                className="checkout-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </label>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Đặt hàng ngay
          </button>

          <button className="checkout-btn back" onClick={() => setStep(1)}>
            ← Quay lại
          </button>
        </div>
      )}
    </div>
  );
}
