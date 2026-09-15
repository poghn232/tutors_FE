import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Award, 
  User, 
  BookOpen, 
  Check, 
  Sparkles 
} from 'lucide-react';

export default function BookingView({ tutor, onBack }) {
  // Use passed tutor or fallback to Figma 61:2053 default
  const currentTutor = tutor || {
    id: 1,
    fullName: 'Hoàng Thiên Ưng',
    school: 'Đại học Bách Khoa Hà Nội',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 127,
    studentsCount: 243,
    hourlyRate: 250000,
    subjects: ['Toán học', 'Vật lý', 'Tin học'],
    bio: 'Tiến sĩ Toán học ứng dụng tại ĐH Quốc gia Hà Nội. Tôi giúp học sinh hiểu toán học qua các ứng dụng thực tế. 8+ năm kinh nghiệm từ THCS đến đại học.',
    hobbies: ['Cờ vua', 'Leo núi', 'Origami', 'Vật lý thiên văn', 'Thống kê'],
  };

  const [activeTab, setActiveTab] = useState('intro'); // 'intro', 'reviews', 'slots'
  const [selectedSubject, setSelectedSubject] = useState(currentTutor.subjects?.[0] || 'Toán học');
  const [selectedDay, setSelectedDay] = useState('Thứ 2 (16/09)');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const availableDays = [
    'Thứ 2 (16/09)',
    'Thứ 4 (18/09)',
    'Thứ 6 (20/09)',
    'Thứ 7 (21/09)',
    'Chủ nhật (22/09)'
  ];

  const availableTimes = [
    '09:00 - 10:30',
    '10:30 - 12:00',
    '14:00 - 15:30',
    '16:00 - 17:30',
    '18:00 - 19:30',
    '19:30 - 21:00'
  ];

  const reviews = [
    {
      id: 1,
      studentName: 'Trần Văn Minh (Lớp 12A1)',
      rating: 5,
      date: '10/09/2026',
      content: 'Thầy dạy cực kỳ có tâm! Các bài toán tích phân và lượng giác khó thầy hướng dẫn phương pháp giải rất ngắn gọn và dễ hiểu.',
    },
    {
      id: 2,
      studentName: 'Nguyễn Phương Thảo (Lớp 11)',
      rating: 5,
      date: '04/09/2026',
      content: 'Em từ mất gốc môn Vật lý mà sau 2 tháng học cùng thầy đã đạt 8.5 điểm kiểm tra 1 tiết. Cảm ơn thầy rất nhiều ạ!',
    }
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const handleConfirmBooking = () => {
    if (!selectedTime) return;
    setBookingConfirmed(true);
  };

  return (
    <div>
      {/* Back button */}
      <button 
        type="button" 
        className="btn btn-secondary" 
        style={{ marginBottom: '20px', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Quay lại Danh sách Gia sư
      </button>

      {/* Main Grid: Left Profile + Right Booking Box (Figma 61:2053) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Profile Details */}
        <div className="booking-detail-card">
          {/* Hero Profile Info */}
          <div className="tutor-hero-profile">
            <div className="tutor-hero-avatar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '2.5rem',
              color: '#2563eb',
              background: '#eff6ff'
            }}>
              {currentTutor.fullName.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {currentTutor.fullName}
                </h2>
                <span className="badge badge-tutor" style={{ textTransform: 'none' }}>Đã xác minh</span>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 10px 0' }}>
                {currentTutor.school} • {currentTutor.experienceYears} năm kinh nghiệm
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#475569' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800 }}>
                  <Star size={16} fill="#f59e0b" /> {currentTutor.rating}
                </span>
                <span>({currentTutor.reviewsCount} đánh giá)</span>
                <span>•</span>
                <span><strong>{currentTutor.studentsCount}</strong> học sinh đã dạy</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                {currentTutor.subjects?.map((sub, i) => (
                  <span key={i} className="tutor-tag">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="sub-tabs">
            <button
              type="button"
              className={`sub-tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveTab('intro')}
            >
              Giới thiệu
            </button>
            <button
              type="button"
              className={`sub-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({reviews.length})
            </button>
            <button
              type="button"
              className={`sub-tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
              onClick={() => setActiveTab('slots')}
            >
              Lịch trống
            </button>
          </div>

          {/* Tab Content: Giới thiệu */}
          {activeTab === 'intro' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '8px' }}>
                  GIỚI THIỆU CHUYÊN MÔN
                </h4>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {currentTutor.bio}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '10px' }}>
                  SỞ THÍCH & ĐAM MÊ
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentTutor.hobbies ? (
                    currentTutor.hobbies.map((h, idx) => (
                      <span key={idx} className="filter-chip" style={{ background: '#f1f5f9', cursor: 'default' }}>
                        {h}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className="filter-chip" style={{ background: '#f1f5f9' }}>Cờ vua</span>
                      <span className="filter-chip" style={{ background: '#f1f5f9' }}>Leo núi</span>
                      <span className="filter-chip" style={{ background: '#f1f5f9' }}>Origami</span>
                      <span className="filter-chip" style={{ background: '#f1f5f9' }}>Vật lý thiên văn</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', marginBottom: '10px' }}>
                  THỐNG KÊ GIẢNG DẠY
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <strong style={{ display: 'block', fontSize: '1.5rem', color: '#2563eb' }}>{currentTutor.studentsCount}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Học sinh</span>
                  </div>
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <strong style={{ display: 'block', fontSize: '1.5rem', color: '#f59e0b' }}>{currentTutor.reviewsCount}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Đánh giá 5★</span>
                  </div>
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <strong style={{ display: 'block', fontSize: '1.5rem', color: '#10b981' }}>{currentTutor.experienceYears}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Năm kinh nghiệm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Đánh giá */}
          {activeTab === 'reviews' && (
            <div>
              {reviews.map((r) => (
                <div key={r.id} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{r.studentName}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{r.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '8px' }}>
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                    "{r.content}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content: Lịch trống */}
          {activeTab === 'slots' && (
            <div>
              <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '16px' }}>
                Lịch dạy khả dụng trong tuần này của gia sư. Bạn có thể chọn ngày và giờ ở bảng đặt lịch bên phải:
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {availableDays.map((d, i) => (
                  <div key={i} style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{d}</strong>
                    <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>Còn 3 khung giờ trống</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Checkout / Booking Sidebar */}
        <aside className="card" style={{ padding: '28px', border: '2px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                {formatCurrency(currentTutor.hourlyRate)}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}> / buổi (90 phút)</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800 }}>
              <Star size={15} fill="#f59e0b" /> {currentTutor.rating}
            </div>
          </div>

          {bookingConfirmed ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Check size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Đặt lịch thành công!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '16px' }}>
                Lớp học <strong>{selectedSubject}</strong> cùng <strong>{currentTutor.fullName}</strong> vào <strong>{selectedDay}</strong> lúc <strong>{selectedTime}</strong> đã được xác nhận.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={onBack}
              >
                Quay lại Tìm gia sư
              </button>
            </div>
          ) : (
            <div>
              {/* Select Subject */}
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>MÔN HỌC MUỐN ĐĂNG KÝ</label>
                <select
                  className="form-control"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {currentTutor.subjects?.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Select Day */}
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>CHỌN NGÀY HỌC</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {availableDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`slot-btn ${selectedDay === d ? 'selected' : ''}`}
                      onClick={() => setSelectedDay(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Time */}
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>CHỌN KHUNG GIỜ</label>
                <div className="slots-grid">
                  {availableTimes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`slot-btn ${selectedTime === t ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{ height: '48px', fontSize: '1rem', fontWeight: 800, marginTop: '16px' }}
                disabled={!selectedTime}
                onClick={handleConfirmBooking}
              >
                {selectedTime ? 'Xác nhận Đặt Lịch Ngay' : 'Vui lòng chọn khung giờ'}
              </button>

              <div style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '0.8rem',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Thanh toán an toàn • Hủy miễn phí trước 24 giờ</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
