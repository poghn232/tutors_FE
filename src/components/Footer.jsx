import React from 'react';
import TutoraLogo from './TutoraLogo';
import { Mail, Phone, Globe, Shield, Award, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="tutora-footer">
      <div className="tutora-footer-inner">
        {/* Top Section: 4 Columns */}
        <div className="tutora-footer-grid">
          {/* Column 1: Brand & Contact */}
          <div className="footer-col brand-col">
            <TutoraLogo size="md" light={true} subtitleText="tutora.io.vn" />
            
            <p className="footer-desc">
              Nền tảng công nghệ giáo dục kết nối gia sư chất lượng cao và học sinh hàng đầu Việt Nam. 
              Tích hợp trợ lý AI ghi chú bài giảng thông minh giúp học sinh tiến bộ vượt bậc.
            </p>

            <div className="footer-contact-list">
              <div className="contact-item">
                <Globe size={16} className="contact-icon" />
                <a href="https://www.tutora.io.vn" target="_blank" rel="noreferrer">
                  https://www.tutora.io.vn
                </a>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@tutora.io.vn</span>
              </div>
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>Hotline: 0901 234 567 (8:00 - 22:00)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Học sinh & Phụ huynh */}
          <div className="footer-col">
            <h4 className="footer-col-title">Học sinh & Phụ huynh</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('tutors')}>
                  🔍 Tìm gia sư theo môn học
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('classes')}>
                  📚 Lớp học trực tuyến 1 kèm 1
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('materials')}>
                  📖 Thư viện tài liệu & Đề thi
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('assignments')}>
                  📝 Quản lý bài tập & Lộ trình
                </button>
              </li>
              <li>
                <span>⭐ Đánh giá & Phản hồi gia sư</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Gia sư & Giảng dạy */}
          <div className="footer-col">
            <h4 className="footer-col-title">Dành cho Gia sư</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('register')}>
                  🎓 Đăng ký trở thành gia sư
                </button>
              </li>
              <li>
                <span>📋 Quy chuẩn thẩm định bằng cấp</span>
              </li>
              <li>
                <span>📅 Quản lý lịch dạy thông minh</span>
              </li>
              <li>
                <span>💳 Bảng thu nhập & Rút tiền tự động</span>
              </li>
              <li>
                <span>🤖 Trợ lý AI Note tóm tắt buổi dạy</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Cam kết & Pháp lý */}
          <div className="footer-col">
            <h4 className="footer-col-title">Chính sách & An toàn</h4>
            <div className="footer-badges">
              <div className="trust-badge">
                <Shield size={16} color="#10b981" />
                <span>Bảo mật dữ liệu chuẩn SSL 256-bit</span>
              </div>
              <div className="trust-badge">
                <Award size={16} color="#f59e0b" />
                <span>100% Gia sư được xác minh CCCD/Bằng cấp</span>
              </div>
              <div className="trust-badge">
                <Sparkles size={16} color="#a855f7" />
                <span>Cam kết hoàn tiền nếu không hài lòng</span>
              </div>
            </div>

            <ul className="footer-links legal-links">
              <li><span>Điều khoản dịch vụ</span></li>
              <li><span>Chính sách quyền riêng tư</span></li>
              <li><span>Quy chế hoạt động sàn</span></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="tutora-footer-divider" />

        {/* Bottom Section: Copyright & System Status */}
        <div className="tutora-footer-bottom">
          <div className="copyright-text">
            © {new Date().getFullYear()} <strong>Tutora</strong> (tutora.io.vn). Bảo lưu mọi quyền. Phát triển vì sự tiến bộ của giáo dục Việt Nam.
          </div>

          <div className="footer-bottom-badges">
            <span className="status-pill">
              <span className="status-dot-pulse" />
              Hệ thống hoạt động 99.9% ổn định
            </span>
            <span className="domain-pill">
              tutora.io.vn
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
