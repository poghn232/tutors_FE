import React, { useState } from 'react';
import CheckoutFlow from './CheckoutFlow';
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  Laptop, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export default function BookingView({ tutor, onBack, onNavigate, user, onRequireAuth }) {
  const currentTutor = tutor || {
    id: 1,
    fullName: 'Hoàng Thiên Ứng',
    school: 'Đại học Bách Khoa',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 127,
    studentsCount: 243,
    hourlyRate: 250000,
    priceNegotiable: false,
    subjects: ['Toán học', 'Vật lý', 'Tin học'],
    hobbies: ['Cờ vua', 'Leo núi', 'Origami', 'Vật lý thiên văn'],
    bio: 'Tiến sĩ Toán học ứng dụng tại ĐH Quốc gia Hà Nội. Tôi giúp học sinh hiểu toán học qua các ứng dụng thực tế. 8+ năm kinh nghiệm từ THCS đến đại học.',
    phone: '0901 234 567',
    facebookUrl: 'https://facebook.com/giasu.hoangthienung',
    email: 'tutor.nguyen@giasuhq.com'
  };

  const [activeTab, setActiveTab] = useState('intro'); // 'intro', 'reviews', 'slots'
  const [selectedSubject, setSelectedSubject] = useState(currentTutor.subjects?.[0] || 'Toán học');
  const [selectedDay, setSelectedDay] = useState('T2 14/09');
  const [selectedTime, setSelectedTime] = useState('9:00 SA');
  const [showCheckout, setShowCheckout] = useState(false);

  const verificationStatus = currentTutor.verificationStatus || 'PENDING';
  const hasHourlyRate = !currentTutor.priceNegotiable
    && Number.isFinite(Number(currentTutor.hourlyRate))
    && Number(currentTutor.hourlyRate) > 0;
  const verificationLabel = verificationStatus === 'APPROVED'
    ? 'Đã xác minh'
    : verificationStatus === 'REJECTED'
      ? 'Chưa được duyệt'
      : 'Đang chờ duyệt';

  const availableDays = [
    'T2 14/09',
    'T4 16/09',
    'T6 18/09',
    'T7 19/09',
    'T2 21/09'
  ];

  const availableTimes = [
    '9:00 SA',
    '10:00 SA',
    '11:00 SA',
    '2:00 CH',
    '3:00 CH',
    '4:00 CH',
    '6:00 CH',
    '7:00 CH'
  ];

  const reviews = [
    {
      id: 1,
      name: 'Trần Văn Minh (Lớp 12)',
      rating: 5,
      date: '10/09/2026',
      content: 'Thầy dạy cực kỳ có tâm! Các bài toán tích phân và lượng giác khó thầy hướng dẫn phương pháp giải rất ngắn gọn và dễ hiểu.'
    },
    {
      id: 2,
      name: 'Nguyễn Phương Thảo (Lớp 11)',
      rating: 5,
      date: '04/09/2026',
      content: 'Em từ mất gốc môn Vật lý mà sau 2 tháng học cùng thầy đã đạt 8.5 điểm kiểm tra 1 tiết. Cảm ơn thầy rất nhiều ạ!'
    }
  ];

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const getSubjectId = (subjName) => {
    const s = (subjName || '').toLowerCase();
    if (s.includes('toán')) return 1;
    if (s.includes('lý') || s.includes('vật lý')) return 2;
    if (s.includes('hóa')) return 3;
    if (s.includes('anh')) return 4;
    if (s.includes('sinh')) return 5;
    if (s.includes('tin')) return 6;
    if (s.includes('văn')) return 7;
    if (s.includes('sử')) return 8;
    return 1;
  };

  if (showCheckout) {
    return (
      <CheckoutFlow 
        tutor={currentTutor}
        user={user}
        bookingDetails={{
          subject: selectedSubject,
          subjectId: getSubjectId(selectedSubject),
          allSubjects: currentTutor.subjects?.join(', ') || 'Toán học, Vật lý, Tin học',
          date: selectedDay ? selectedDay + '/2026' : '14/09/2026',
          time: selectedTime,
          duration: '60 phút',
          format: 'Gọi video (Google Meet)',
          lessonPrice: hasHourlyRate ? currentTutor.hourlyRate : 250000,
          bookingFeeRate: 0.05,
          meetLink: 'meet.google.com/abc-def-ghi'
        }}
        onBack={() => setShowCheckout(false)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '85vh', padding: '16px 0 60px 0' }}>
      {/* Floating Geometric Shapes (Figma 61:2053) */}
      <div className="figma-shape shape-yellow-circle" />
      <div className="figma-shape shape-peach-box" />
      <div className="figma-shape shape-pink-pill" />
      <div className="figma-shape shape-peach-wireframe" />
      <div className="figma-shape shape-lavender-diamond" />
      <div className="figma-shape shape-yellow-black-square" />
      <div className="figma-shape shape-mint-circle" />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb back link */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            type="button" 
            className="figma-back-link"
            onClick={onBack}
          >
            ← Quay lại Tìm kiếm
          </button>
        </div>

        {/* Main Grid: Left Profile Details + Right Booking Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.15fr)', gap: '28px', alignItems: 'flex-start' }}>
          {/* LEFT COLUMN: PROFILE CARD + SUBTABS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Profile Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px 28px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                {/* Avatar with Chicken illustration */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '16px',
                    border: '1.5px solid #0f172a',
                    background: '#fef08a',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="56" height="56" viewBox="0 0 42 42" fill="none">
                      <rect width="42" height="42" rx="10" fill="#fef08a" />
                      <circle cx="21" cy="17" r="8" fill="#f59e0b" />
                      <path d="M10 35C10 29.5 15 26 21 26C27 26 32 29.5 32 35" fill="#f59e0b" />
                      <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                      <circle cx="24" cy="16" r="1.5" fill="#ffffff" />
                      <path d="M19 20C20 21 22 21 23 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{
                    background: verificationStatus === 'APPROVED' ? '#e6fffa' : '#fff7ed',
                    color: verificationStatus === 'APPROVED' ? '#059669' : '#c2410c',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '2px 8px',
                    border: verificationStatus === 'APPROVED' ? '1px solid #34d399' : '1px solid #fdba74'
                  }}>
                    {verificationLabel}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {currentTutor.fullName}
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '8px' }}>
                    {currentTutor.school} · {currentTutor.experienceYears} năm kinh nghiệm
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', marginBottom: '12px' }}>
                    <span style={{ color: '#f59e0b' }}>★★★★★</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{currentTutor.rating}</span>
                    <span style={{ color: '#64748b' }}>({currentTutor.reviewsCount} đánh giá)</span>
                    <span style={{ color: '#cbd5e1' }}>·</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentTutor.studentsCount} học sinh đã dạy</span>
                  </div>

                  {/* Subject Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {currentTutor.subjects.map((sub, i) => (
                      <span 
                        key={i}
                        style={{
                          background: i === 0 ? '#fee2e2' : i === 1 ? '#f3e8ff' : '#e0f2fe',
                          color: i === 0 ? '#ea580c' : i === 1 ? '#7c3aed' : '#0284c7',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '999px',
                          padding: '3px 12px'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={14} /> Tiếng Việt, Tiếng Anh
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Laptop size={14} /> Trực tuyến
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={14} /> Thường trả lời trong 1h
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Tabs Container */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '14px',
              padding: '4px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('intro')}
                style={{
                  border: 'none',
                  background: activeTab === 'intro' ? '#0f172a' : 'transparent',
                  color: activeTab === 'intro' ? '#ffffff' : '#64748b',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Giới thiệu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                style={{
                  border: 'none',
                  background: activeTab === 'reviews' ? '#0f172a' : 'transparent',
                  color: activeTab === 'reviews' ? '#ffffff' : '#64748b',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Đánh giá ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('slots')}
                style={{
                  border: 'none',
                  background: activeTab === 'slots' ? '#0f172a' : 'transparent',
                  color: activeTab === 'slots' ? '#ffffff' : '#64748b',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Lịch trống
              </button>
            </div>

            {/* Sub Tab Content Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              {activeTab === 'intro' && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    GIỚI THIỆU
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                    {currentTutor.bio}
                  </p>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '10px' }}>
                    SỞ THÍCH
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {currentTutor.hobbies.map((hb, i) => (
                      <span 
                        key={i}
                        style={{
                          border: '1.5px solid #0f172a',
                          borderRadius: '999px',
                          padding: '4px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a'
                        }}
                      >
                        {hb}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '12px' }}>
                    THỐNG KÊ
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <div style={{
                      background: '#f3e8ff',
                      border: '1.5px solid #0f172a',
                      borderRadius: '14px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {currentTutor.studentsCount}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                        Học sinh
                      </div>
                    </div>

                    <div style={{
                      background: '#ffedd5',
                      border: '1.5px solid #0f172a',
                      borderRadius: '14px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {currentTutor.reviewsCount}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                        Đánh giá
                      </div>
                    </div>

                    <div style={{
                      background: '#e6fffa',
                      border: '1.5px solid #0f172a',
                      borderRadius: '14px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {currentTutor.experienceYears}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                        Năm KN
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{rev.name}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{rev.date}</span>
                      </div>
                      <div style={{ color: '#f59e0b', fontSize: '0.85rem', marginBottom: '6px' }}>★★★★★</div>
                      <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                        {rev.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'slots' && (
                <div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
                    Gia sư đang mở các khung giờ cố định trong tuần. Hãy chọn thời gian bạn mong muốn ở bảng bên phải để đặt lịch học ngay.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {availableDays.map((d) => (
                      <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.88rem' }}>
                        <strong style={{ color: '#0f172a' }}>{d}</strong>
                        <span style={{ color: '#059669', fontWeight: 700 }}>9:00 - 11:00 SA & 2:00 - 7:00 CH</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING BOX (Exact Figma 61:2053 with Neo-Brutalist Shadow) */}
          <aside style={{
            background: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            boxShadow: '4px 4px 0px #000000',
            padding: '24px 28px'
          }}>
            {/* Price Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                    {hasHourlyRate ? formatVND(currentTutor.hourlyRate) : 'Trao đổi thêm'}
                  </span>
                  {hasHourlyRate && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/buổi</span>}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                  (Học phí tham khảo · Tự thỏa thuận trực tiếp)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem' }}>
                <span style={{ color: '#f59e0b' }}>★★★★★</span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{currentTutor.rating}</span>
              </div>
            </div>

            {/* Platform connection fee badge */}
            <div style={{
              background: '#ecfdf5',
              border: '1.5px dashed #059669',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '18px',
              fontSize: '0.8rem',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚡ Phí kết nối nền tảng:</span>
              <strong style={{ fontSize: '0.9rem', color: '#047857' }}>5.000đ (Thử nghiệm)</strong>
            </div>

            {/* MÔN HỌC */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '6px' }}>
                MÔN HỌC
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  padding: '0 14px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {currentTutor.subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* NGÀY */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '8px' }}>
                NGÀY
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {availableDays.map((d) => {
                  const isSel = selectedDay === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      style={{
                        border: '1.5px solid #0f172a',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: isSel ? '#0f172a' : '#ffffff',
                        color: isSel ? '#ffffff' : '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GIỜ (2-Column Grid) */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '8px' }}>
                GIỜ
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {availableTimes.map((t) => {
                  const isSel = selectedTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      style={{
                        height: '40px',
                        border: '1.5px solid #0f172a',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: isSel ? '#7c3aed' : '#ffffff',
                        color: isSel ? '#ffffff' : '#0f172a',
                        cursor: 'pointer',
                        transition: 'all 0.1s'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="button"
              className={selectedTime ? "figma-btn-primary" : "figma-btn-disabled"}
              disabled={!selectedTime}
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth(`đặt lịch học với ${currentTutor.fullName}`);
                  return;
                }
                setShowCheckout(true);
              }}
            >
              Đặt lịch ngay
            </button>

            {/* Guarantee note */}
            <div style={{
              marginTop: '16px',
              fontSize: '0.78rem',
              color: '#64748b',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              Thanh toán an toàn · Hủy miễn phí trước 24 giờ
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
