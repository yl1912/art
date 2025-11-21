import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* CỘT 1 */}
        <div className="footer-col">
          <h3>Rock your space!</h3>
          <p>
            Tranh Decor Từ poster đồ họa đến art print, từ những xu hướng được
            nhiều người yêu thích cho đến những sáng tác đậm tính cá nhân. Chúng
            tôi tự tin mang đến cho bạn đa dạng lựa chọn trang trí không chỉ làm
            sống động không gian mà còn thể hiện phong cách riêng của bạn.
          </p>
        </div>

        {/* CỘT 2 */}
        <div className="footer-col">
          <h3>Tranh Decor</h3>
          <ul>
            <li>Về Tranh Decor</li>
            <li>Hướng dẫn treo tranh</li>
            <li>Chính sách & điều kiện</li>
            <li>Điều khoản & dịch vụ</li>
          </ul>
        </div>

        {/* CỘT 3 */}
        <div className="footer-col">
          <h3>Liên lạc</h3>
          <ul className="contact-info">
            <li>📍 Văn phòng: 27G Trần Nhật Duật, Tân Định, Quận 1, TP. HCM</li>
            <li>📞 (+84)768 96 22 76</li>
            <li>✉️ hello@cyantific.vn</li>
          </ul>
        </div>

        {/* CỘT 4 */}
        <div className="footer-col">
          <h3>Fanpage</h3>
          <div className="fb-box">
            <iframe
              title="fb-page"
              src="https://www.facebook.com/plugins/page.php?href=https://facebook.com/Cyantific&tabs&width=300&height=130"
              width="300"
              height="130"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  );
}
