import React, { useEffect, useMemo, useState } from 'react';
import CheckoutFlow from './CheckoutFlow';
import { tutorService } from '../services/tutorService';
import { 
  Star, 
  ArrowLeft, 
  Globe, 
  Laptop, 
  Zap, 
  ShieldCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  RefreshCw
} from 'lucide-react';

export default function BookingView({ tutor, onBack, onNavigate, user, onRequireAuth }) {
  const currentTutor = tutor || {
    id: 1,
    fullName: 'Hoàng Thiên Ứng',
    school: 'Đại học Bách Khoa',
    experienceYears: 8,
    rating: 0,
    reviewsCount: 0,
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
  const scheduleStorageKey = `tutora_schedule_${currentTutor.id || currentTutor.email}`;
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
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

  const schedule = useMemo(() => {
    try {
      const fromTutor = {
        days: currentTutor.availableDaysJson ? JSON.parse(currentTutor.availableDaysJson) : [],
        times: currentTutor.availableTimesJson ? JSON.parse(currentTutor.availableTimesJson) : []
      };
      if (fromTutor.days.length || fromTutor.times.length) return fromTutor;
      return JSON.parse(localStorage.getItem(scheduleStorageKey) || '{}');
    } catch (error) {
      return {};
    }
  }, [scheduleStorageKey, currentTutor.availableDaysJson, currentTutor.availableTimesJson]);

  const availableDays = useMemo(() => {
    const selectedDays = Array.isArray(schedule.days) ? schedule.days : [];
    const dayIndex = { T2: 1, T3: 2, T4: 3, T5: 4, T6: 5, T7: 6, CN: 0 };
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let offset = 0; offset < 28 && result.length < 8; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const dayCode = Object.keys(dayIndex).find((key) => dayIndex[key] === date.getDay());
      if (selectedDays.includes(dayCode)) {
        result.push({
          value: date.toISOString().slice(0, 10),
          label: `${dayCode} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
        });
      }
    }
    return result;
  }, [schedule]);

  const availableTimes = useMemo(() => {
    const times = Array.isArray(schedule.times) ? schedule.times : [];
    return times.map((time) => {
      const [hour, minute = '00'] = String(time).split(':');
      const numericHour = Number(hour);
      const suffix = numericHour >= 12 ? 'CH' : 'SA';
      const displayHour = numericHour > 12 ? numericHour - 12 : numericHour;
      return `${displayHour}:${minute} ${suffix}`;
    });
  }, [schedule]);

  useEffect(() => {
    setSelectedDay((current) => current || availableDays[0]?.value || '');
    setSelectedTime((current) => current || availableTimes[0] || '');
  }, [availableDays, availableTimes]);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [dynamicRating, setDynamicRating] = useState(
    Number(currentTutor.rating) > 0 ? Number(currentTutor.rating) : 0
  );
  const [dynamicReviewsCount, setDynamicReviewsCount] = useState(
    Number(currentTutor.reviewsCount) || 0
  );

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newAuthorName, setNewAuthorName] = useState(user?.fullName || '');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });

  const loadReviews = async () => {
    if (!currentTutor?.id) return;
    try {
      setReviewsLoading(true);
      const res = await tutorService.getTutorReviews(currentTutor.id);
      if (res && res.data) {
        const data = res.data;
        setReviews(data.reviews || []);
        if (data.averageRating !== undefined && data.averageRating !== null) {
          setDynamicRating(Number(data.averageRating));
        }
        if (data.reviewsCount !== undefined && data.reviewsCount !== null) {
          setDynamicReviewsCount(Number(data.reviewsCount));
        }
      }
    } catch (err) {
      console.error('Lỗi tải đánh giá gia sư:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [currentTutor?.id]);

  useEffect(() => {
    if (user?.fullName && !newAuthorName) {
      setNewAuthorName(user.fullName);
    }
  }, [user]);

  const handleSubmitReview = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) {
      setReviewMsg({ type: 'error', text: 'Vui lòng nhập nội dung đánh giá của bạn.' });
      return;
    }
    setSubmittingReview(true);
    setReviewMsg({ type: '', text: '' });
    try {
      const author = newAuthorName.trim() || user?.fullName || 'Phụ huynh học sinh';
      await tutorService.createTutorReview(currentTutor.id, {
        rating: newRating,
        comment: newComment.trim(),
        authorName: author
      });
      setReviewMsg({ type: 'success', text: 'Cảm ơn bạn! Đánh giá đã được ghi nhận thành công.' });
      setNewComment('');
      await loadReviews();
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewMsg({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!';
      setReviewMsg({ type: 'error', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (ratingVal, size = 16) => {
    const rounded = Math.round(ratingVal);
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rounded ? '#f59e0b' : 'none'}
            color={star <= rounded ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    );
  };

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
        tutor={{
          ...currentTutor,
          rating: dynamicRating > 0 ? dynamicRating : 0,
          reviewsCount: dynamicReviewsCount
        }}
        user={user}
        bookingDetails={{
          subject: selectedSubject,
          subjectId: getSubjectId(selectedSubject),
          allSubjects: currentTutor.subjects?.join(', ') || 'Toán học, Vật lý, Tin học',
          date: selectedDay,
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
                    {renderStars(dynamicRating, 16)}
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>
                      {dynamicRating > 0 ? dynamicRating.toFixed(1) : 'Chưa có'}
                    </span>
                    <span style={{ color: '#64748b' }}>({dynamicReviewsCount} đánh giá)</span>
                    <span style={{ color: '#cbd5e1' }}>·</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentTutor.studentsCount || 0} học sinh đã dạy</span>
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
                Đánh giá ({dynamicReviewsCount})
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
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', fontFamily: "var(--font-display)" }}>
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
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', fontFamily: "var(--font-display)" }}>
                        {dynamicReviewsCount}
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
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', fontFamily: "var(--font-display)" }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Reviews Summary Banner */}
                  <div style={{
                    background: '#fffdf5',
                    border: '1.5px solid #0f172a',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '3px 3px 0px #0f172a',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: '#fef3c7',
                        border: '1.5px solid #0f172a',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '2px 2px 0px #0f172a'
                      }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>
                          {dynamicRating > 0 ? dynamicRating.toFixed(1) : '—'}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#78350f' }}>/ 5.0</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          {renderStars(dynamicRating, 18)}
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                            {dynamicRating >= 4.8 ? 'Rất xuất sắc' : dynamicRating >= 4.0 ? 'Rất tốt' : dynamicRating > 0 ? 'Tốt' : 'Chưa có xếp hạng'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          Dựa trên <strong>{dynamicReviewsCount}</strong> đánh giá chân thực từ phụ huynh & học sinh
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      style={{
                        background: showReviewForm ? '#f1f5f9' : '#0f172a',
                        color: showReviewForm ? '#0f172a' : '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: '10px',
                        padding: '10px 18px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '2px 2px 0px #0f172a',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {showReviewForm ? <X size={16} /> : <Plus size={16} />}
                      <span>{showReviewForm ? 'Đóng biểu mẫu' : 'Viết đánh giá'}</span>
                    </button>
                  </div>

                  {/* Review Submission Form Modal / Box */}
                  {showReviewForm && (
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '16px',
                      padding: '22px',
                      boxShadow: '4px 4px 0px #0f172a'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageSquare size={20} color="#7c3aed" />
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                            Đánh giá trải nghiệm học cùng {currentTutor.fullName}
                          </h4>
                        </div>
                      </div>

                      {reviewMsg.text && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: reviewMsg.type === 'error' ? '1px solid #f87171' : '1px solid #34d399',
                          background: reviewMsg.type === 'error' ? '#fef2f2' : '#ecfdf5',
                          color: reviewMsg.type === 'error' ? '#991b1b' : '#065f46',
                          fontSize: '0.86rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {reviewMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                          <span>{reviewMsg.text}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmitReview}>
                        {/* Star Rating Picker */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                            CHỌN SỐ SAO ĐÁNH GIÁ *
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map((s) => {
                              const activeStar = (hoverRating || newRating) >= s;
                              return (
                                <button
                                  type="button"
                                  key={s}
                                  onMouseEnter={() => setHoverRating(s)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setNewRating(s)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    transition: 'transform 0.15s ease'
                                  }}
                                >
                                  <Star
                                    size={28}
                                    fill={activeStar ? '#f59e0b' : 'none'}
                                    color={activeStar ? '#f59e0b' : '#cbd5e1'}
                                    strokeWidth={2}
                                  />
                                </button>
                              );
                            })}
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309', marginLeft: '6px' }}>
                              {newRating === 5 ? '5/5 - Cực kỳ hài lòng' : newRating === 4 ? '4/5 - Hài lòng' : newRating === 3 ? '3/5 - Bình thường' : newRating === 2 ? '2/5 - Chưa tốt' : '1/5 - Kém'}
                            </span>
                          </div>
                        </div>

                        {/* Author Name */}
                        <div style={{ marginBottom: '14px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                            TÊN PHỤ HUYNH / HỌC SINH
                          </label>
                          <input
                            type="text"
                            value={newAuthorName}
                            onChange={(e) => setNewAuthorName(e.target.value)}
                            placeholder="Ví dụ: Phụ huynh em Tuấn (Lớp 11)"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1.5px solid #0f172a',
                              fontSize: '0.88rem',
                              fontFamily: 'inherit',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Comment Textarea */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                            NỘI DUNG NHẬN XÉT *
                          </label>
                          <textarea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Chia sẻ về phương pháp giảng dạy, sự tận tâm, tiến bộ của học sinh..."
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1.5px solid #0f172a',
                              fontSize: '0.88rem',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            style={{
                              background: '#f8fafc',
                              border: '1.5px solid #cbd5e1',
                              borderRadius: '10px',
                              padding: '9px 18px',
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              color: '#64748b',
                              cursor: 'pointer'
                            }}
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="submit"
                            disabled={submittingReview}
                            style={{
                              background: '#0f172a',
                              color: '#ffffff',
                              border: '1.5px solid #0f172a',
                              borderRadius: '10px',
                              padding: '9px 22px',
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              cursor: submittingReview ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '2px 2px 0px #0f172a'
                            }}
                          >
                            <Send size={15} />
                            <span>{submittingReview ? 'Đang gửi...' : 'Đăng đánh giá'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.88rem' }}>Đang tải danh sách đánh giá...</div>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div style={{
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '16px',
                      border: '1.5px dashed #cbd5e1'
                    }}>
                      <div style={{ color: '#94a3b8', marginBottom: '8px' }}>
                        <Star size={32} style={{ margin: '0 auto', opacity: 0.5 }} />
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                        Chưa có đánh giá nào cho gia sư này
                      </h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: '#64748b' }}>
                        Bạn đã từng học cùng {currentTutor.fullName}? Hãy là người đầu tiên để lại cảm nhận giúp các phụ huynh khác!
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(true)}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: '1.5px solid #0f172a',
                          borderRadius: '10px',
                          padding: '8px 18px',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '2px 2px 0px #0f172a'
                        }}
                      >
                        <Plus size={15} />
                        <span>Viết đánh giá đầu tiên</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '16px 18px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                color: '#475569'
                              }}>
                                {(rev.authorName || 'P').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                                    {rev.authorName}
                                  </span>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    background: '#ecfdf5',
                                    color: '#059669',
                                    padding: '1px 6px',
                                    borderRadius: '6px',
                                    border: '1px solid #a7f3d0'
                                  }}>
                                    Đã xác thực
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                                  {rev.dateFormatted || (rev.createdAt ? rev.createdAt.substring(0, 10) : '')}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {renderStars(rev.rating, 14)}
                            </div>
                          </div>

                          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.55', margin: 0 }}>
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'slots' && (
                <div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
                    Gia sư đang mở các khung giờ cố định trong tuần. Hãy chọn thời gian bạn mong muốn ở bảng bên phải để đặt lịch học ngay.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {availableDays.map((d) => (
                      <div key={d.value} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.88rem' }}>
                        <strong style={{ color: '#0f172a' }}>{d.label}</strong>
                        <span style={{ color: '#059669', fontWeight: 700 }}>{availableTimes.join(' · ')}</span>
                      </div>
                    ))}
                    {availableDays.length === 0 && (
                      <div style={{ color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', fontSize: '0.86rem' }}>
                        Gia sư chưa mở ngày dạy trên hồ sơ.
                      </div>
                    )}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                {renderStars(dynamicRating, 14)}
                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                  {dynamicRating > 0 ? dynamicRating.toFixed(1) : 'Chưa có'}
                </span>
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
                  const isSel = selectedDay === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDay(d.value)}
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
                      {d.label}
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
              {availableTimes.length === 0 && (
                <div style={{ color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem', marginTop: '8px' }}>
                  Gia sư chưa khai báo khung giờ nhận lớp.
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="button"
              className={selectedTime ? "figma-btn-primary" : "figma-btn-disabled"}
              disabled={!selectedTime || !selectedDay}
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
