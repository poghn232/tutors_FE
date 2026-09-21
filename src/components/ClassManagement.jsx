import React, { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  User, 
  BookOpen, 
  Clock, 
  Hourglass, 
  Lightbulb, 
  Star, 
  ArrowRight,
  Plus
} from 'lucide-react';

export default function ClassManagement({ user, onNavigateToTutors, onNavigateToVip, onRequireAuth }) {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [calendarDay, setCalendarDay] = useState(10);
  const [dbClasses, setDbClasses] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadClasses = async () => {
    try {
      setLoadingDb(true);
      const res = await classService.getClasses();
      if (res && res.data && Array.isArray(res.data)) {
        setDbClasses(res.data);
      }
    } catch (err) {
      // quiet fallback
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  const handleClassAction = async (action, classId, isPayment = false) => {
    try {
      setActionMessage('');
      const res = await action(classId);
      setActionMessage(res?.message || 'Cập nhật lớp học thành công.');
      if (isPayment && user && user.balance !== undefined) {
        updateUser({ balance: Math.max(0, (user.balance || 0) - 50000) });
      }
      await loadClasses();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Không thể cập nhật lớp học.');
    }
  };

  const getClassStatusMeta = (status) => {
    if (status === 'PENDING_TUTOR_APPROVAL') {
      return { label: 'Chờ gia sư duyệt', color: '#92400e', bg: '#fef3c7' };
    }
    if (status === 'PENDING_PAYMENT') {
      return { label: 'Chờ thanh toán phí kết nối', color: '#1d4ed8', bg: '#dbeafe' };
    }
    if (status === 'DECLINED') {
      return { label: 'Gia sư đã từ chối', color: '#b91c1c', bg: '#fee2e2' };
    }
    if (status === 'ACTIVE') {
      return { label: 'Đang học', color: '#059669', bg: '#e6fffa' };
    }
    if (status === 'COMPLETED') {
      return { label: 'Đã hoàn thành', color: '#475569', bg: '#f1f5f9' };
    }
    return { label: status || 'Đã cập nhật', color: '#64748b', bg: '#f1f5f9' };
  };

  const allMappedClasses = dbClasses.map((c) => {
    const sDesc = c.scheduleDescription || '';
    const datePart = sDesc.includes('lúc') ? sDesc.split('lúc')[0].trim() : (sDesc || 'Sắp tới');
    const timePart = sDesc.includes('lúc') ? sDesc.split('lúc')[1].trim() : '10:00';
    const statusMeta = getClassStatusMeta(c.status);
    return {
      id: 'db-' + c.id,
      classId: c.id,
      tutorName: c.tutorName || 'Gia sư chuyên môn',
      studentName: c.studentName || 'Học sinh',
      subject: c.subjectName || 'Môn học',
      subjectTagColor: '#e0f2fe',
      subjectTextColor: '#0284c7',
      date: datePart,
      time: timePart,
      duration: '60 phút',
      topic: c.className || `Lớp ${c.subjectName} cùng ${c.tutorName}`,
      roomUrl: 'https://meet.google.com/tutora-class-' + c.id,
      rawStatus: c.status,
      connectionFee: c.connectionFee,
      status: statusMeta.label,
      statusColor: statusMeta.color,
      statusBg: statusMeta.bg,
      isFromDb: true
    };
  });

  const upcomingClasses = allMappedClasses.filter(c => 
    ['PENDING_TUTOR_APPROVAL', 'PENDING_PAYMENT', 'ACTIVE', 'PAUSED'].includes(c.rawStatus)
  );
  const historyClasses = allMappedClasses.filter(c => 
    ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(c.rawStatus)
  );

  const displayLessons = activeTab === 'upcoming' 
    ? upcomingClasses 
    : activeTab === 'completed' 
      ? historyClasses 
      : allMappedClasses;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 6px 0'
          }}>
            Lớp Học Của Tôi
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            Theo dõi buổi học và tiến trình học tập
          </p>
          {actionMessage && (
            <p style={{ color: actionMessage.includes('Không thể') ? '#dc2626' : '#059669', fontSize: '0.9rem', margin: '8px 0 0', fontWeight: 700 }}>
              {actionMessage}
            </p>
          )}
        </div>

        <button 
          type="button"
          className="figma-btn-primary"
          style={{ width: 'auto', padding: '12px 24px', fontSize: '0.95rem' }}
          onClick={() => {
            if (!user && onRequireAuth) {
              onRequireAuth('đặt lịch học mới với gia sư');
              return;
            }
            if (onNavigateToTutors) onNavigateToTutors();
          }}
        >
          + Đặt Lịch Học Mới
        </button>
      </div>

      {/* 4 Top Stat Cards (Exact Figma 15:2994) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {/* Card 1: Mint */}
        <div style={{
          background: '#e6fffa',
          border: '1.5px solid #34d399',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <CalendarIcon size={20} color="#059669" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>{upcomingCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>Buổi học sắp tới</div>
        </div>

        {/* Card 2: Lavender */}
        <div style={{
          background: '#f3e8ff',
          border: '1.5px solid #a855f7',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <CheckCircle2 size={20} color="#7c3aed" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1.1 }}>{completedCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>Buổi đã hoàn thành</div>
        </div>

        {/* Card 3: Peach */}
        <div style={{
          background: '#ffedd5',
          border: '1.5px solid #fb923c',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <User size={20} color="#ea580c" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ea580c', lineHeight: 1.1 }}>{activeTutorCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#c2410c', marginTop: '4px', fontWeight: 600 }}>Gia sư đang học</div>
        </div>

        {/* Card 4: Light Blue */}
        <div style={{
          background: '#e0f2fe',
          border: '1.5px solid #38bdf8',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <BookOpen size={20} color="#0284c7" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1 }}>{currentSubjectsCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#0369a1', marginTop: '4px', fontWeight: 600 }}>Môn đang học</div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '28px', alignItems: 'flex-start' }}>
        {/* LEFT COLUMN: TABS + LESSON CARDS + NOTIFICATIONS */}
        <div>
          {/* Tabs Filter */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '14px',
            padding: '4px',
            display: 'inline-flex',
            gap: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              style={{
                border: 'none',
                background: activeTab === 'upcoming' ? '#0f172a' : 'transparent',
                color: activeTab === 'upcoming' ? '#ffffff' : '#64748b',
                padding: '8px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Lớp học & Yêu cầu ({upcomingClasses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              style={{
                border: 'none',
                background: activeTab === 'completed' ? '#0f172a' : 'transparent',
                color: activeTab === 'completed' ? '#ffffff' : '#64748b',
                padding: '8px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Lịch sử ({historyClasses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                border: 'none',
                background: activeTab === 'all' ? '#0f172a' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : '#64748b',
                padding: '8px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Tất cả ({allMappedClasses.length})
            </button>
          </div>

          {/* Lesson Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {displayLessons.length === 0 ? (
              <div style={{
                background: '#ffffff',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📚</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Chưa có lớp học nào trong danh sách này
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                  {user?.role === 'TUTOR' 
                    ? 'Bạn hiện chưa có yêu cầu kết nối hoặc lớp học nào trong mục này.' 
                    : 'Hãy tìm kiếm gia sư phù hợp và gửi yêu cầu kết nối lịch học!'}
                </p>
                {user?.role !== 'TUTOR' && (
                  <button
                    type="button"
                    onClick={onNavigateToTutors}
                    className="figma-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', width: 'auto' }}
                  >
                    Tìm gia sư ngay →
                  </button>
                )}
              </div>
            ) : (
              displayLessons.map((item) => {
                const isUserTutor = user?.role === 'TUTOR';
                const isUserAdmin = user?.role === 'ADMIN';
                const displayName = isUserTutor 
                  ? (item.studentName || 'Học sinh') 
                  : (isUserAdmin 
                      ? `${item.studentName || 'Học sinh'} (Phụ huynh: ${item.parentName || 'N/A'}) - Gia sư: ${item.tutorName}`
                      : item.tutorName);
                const roleBadgeText = isUserTutor ? 'Học sinh' : (isUserAdmin ? 'Quản trị' : 'Gia sư');
                const initialChar = displayName ? (displayName.trim().charAt(displayName.trim().lastIndexOf(' ') + 1) || displayName.charAt(0)) : 'G';

                return (
                  <div 
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #0f172a',
                      borderRadius: '20px',
                      padding: '24px 28px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          color: '#2563eb',
                          fontSize: '1.2rem'
                        }}>
                          {initialChar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                            {displayName}
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginLeft: '8px' }}>
                              ({roleBadgeText})
                            </span>
                          </div>
                          <span style={{
                            display: 'inline-block',
                            background: item.subjectTagColor,
                            color: item.subjectTextColor,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '999px',
                            padding: '2px 10px',
                            marginTop: '3px'
                          }}>
                            {item.subject}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        background: item.statusBg,
                        color: item.statusColor,
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        borderRadius: '999px',
                        padding: '4px 12px',
                        border: `1px solid ${item.statusColor}33`
                      }}>
                        {item.status}
                      </span>
                    </div>

                    {/* Time row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: '#64748b', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        📅 {item.date}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🕒 {item.time}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ⏳ {item.duration}
                      </span>
                    </div>

                    {/* Topic container */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      fontSize: '0.88rem',
                      color: '#475569',
                      marginBottom: '18px'
                    }}>
                      {item.topic}
                    </div>

                    {/* Action buttons & status-specific guidance */}
                    {item.isFromDb && (user?.role === 'TUTOR' || user?.role === 'ADMIN') && item.rawStatus === 'PENDING_TUTOR_APPROVAL' && (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleClassAction(classService.acceptClass, item.classId)}
                          className="figma-btn-primary"
                          style={{ width: 'auto', padding: '10px 18px', fontSize: '0.9rem' }}
                        >
                          Chấp nhận lịch học
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClassAction(classService.declineClass, item.classId)}
                          style={{ border: '1.5px solid #b91c1c', color: '#b91c1c', background: '#fff', borderRadius: '10px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}

                    {item.isFromDb && (user?.role === 'TUTOR' || user?.role === 'ADMIN') && item.rawStatus === 'PENDING_PAYMENT' && (
                      <div style={{ color: '#1d4ed8', fontSize: '0.88rem', fontWeight: 700, background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '10px', display: 'inline-block' }}>
                        ✓ Lịch học đã được chấp nhận. Đang chờ phụ huynh thanh toán phí kết nối để kích hoạt lớp.
                      </div>
                    )}

                    {item.isFromDb && user?.role === 'PARENT' && item.rawStatus === 'PENDING_TUTOR_APPROVAL' && (
                      <div style={{ color: '#92400e', fontSize: '0.88rem', fontWeight: 700, background: '#fef3c7', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '10px', display: 'inline-block' }}>
                        ⏳ Yêu cầu đã được gửi tới gia sư. Vui lòng chờ gia sư xác nhận lịch học.
                      </div>
                    )}

                    {item.isFromDb && (user?.role === 'PARENT' || user?.role === 'ADMIN') && item.rawStatus === 'PENDING_PAYMENT' && (
                      <button
                        type="button"
                        onClick={() => handleClassAction(classService.payConnectionFee, item.classId, true)}
                        className="figma-btn-primary"
                        style={{ display: 'inline-block', width: 'auto', padding: '10px 22px', fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        Thanh toán phí kết nối (50.000đ)
                      </button>
                    )}

                    {item.isFromDb && item.rawStatus === 'DECLINED' && (
                      <div style={{ color: '#b91c1c', fontSize: '0.88rem', fontWeight: 700, background: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '10px', display: 'inline-block' }}>
                        Gia sư đã từ chối yêu cầu kết nối này. Bạn có thể tìm kiếm gia sư khác để đăng ký lịch học.
                      </div>
                    )}

                    {item.roomUrl && (!item.isFromDb || item.rawStatus === 'ACTIVE') && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!user && onRequireAuth) {
                            onRequireAuth('tham gia phòng học trực tuyến');
                            return;
                          }
                          window.open(item.roomUrl, '_blank', 'noreferrer');
                        }}
                        className="figma-btn-primary"
                        style={{
                          display: 'inline-block',
                          width: 'auto',
                          padding: '10px 22px',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        Tham gia buổi học
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* "Thông báo" Section (Figma 15:2994) */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Thông báo
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Box 1: Purple */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #a855f7',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={18} color="#a855f7" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    TS. Nguyễn Thị Hoa xác nhận lịch học Toán ngày 12/09
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>1 giờ trước</div>
                </div>
              </div>
            </div>

            {/* Box 2: Orange */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #fb923c',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lightbulb size={18} color="#ea580c" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    Mẹo học: Ôn tập Hóa học 20 phút mỗi ngày sẽ giúp bạn tiến bộ nhanh hơn
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Hôm nay</div>
                </div>
              </div>
            </div>

            {/* Box 3: Yellow */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #facc15',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Star size={18} color="#ca8a04" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    Đánh giá buổi học Vật lý với TS. Nguyễn Thị Hoa
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>2 ngày trước</div>
                </div>
              </div>

              <button 
                type="button" 
                className="figma-btn-primary" 
                style={{ width: 'auto', padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Đánh giá ngay
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Widget 1: Tuần này (Mini Calendar) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Tuần này
            </h4>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>
              <span>CN</span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              {[6, 7, 8, 9, 10, 11, 12].map((d) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'center' }}>
                  <span 
                    onClick={() => setCalendarDay(d)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: calendarDay === d ? '#0f172a' : 'transparent',
                      color: calendarDay === d ? '#ffffff' : '#0f172a'
                    }}
                  >
                    {d}
                  </span>
                </div>
              ))}
            </div>

            {/* Event dots list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} />
                <span style={{ fontWeight: 700, color: '#0f172a' }}>12/09/2026 10:00</span>
                <span style={{ color: '#64748b' }}>Toán học</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                <span style={{ fontWeight: 700, color: '#0f172a' }}>15/09/2026 18:00</span>
                <span style={{ color: '#64748b' }}>Hóa học</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Tiến trình học tập */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Tiến trình học tập
            </h4>

            {/* Item 1: Toán học */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#0f172a' }}>Toán học</span>
                <span style={{ color: '#ea580c' }}>75%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#ea580c', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Đang tiến bộ tốt</span>
            </div>

            {/* Item 2: Hóa học */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#0f172a' }}>Hóa học</span>
                <span style={{ color: '#0284c7' }}>45%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#0284c7', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Cần cải thiện</span>
            </div>

            {/* Item 3: Sinh học */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#0f172a' }}>Sinh học</span>
                <span style={{ color: '#059669' }}>20%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#059669', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Mới bắt đầu</span>
            </div>
          </div>

          {/* Widget 3: Lộ trình Toán học (VIP Yellow Card) */}
          <div style={{
            background: '#facc15',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Lộ trình Toán học
              </h4>
              <span style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '999px' }}>
                Cao cấp
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Hiểu cơ bản Tích phân</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Bài tập Tích phân từng phần</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
                <span>Tích phân suy rộng</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #71717a', display: 'inline-block' }} />
                <span>Phương trình vi phân</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth('nâng cấp gói VIP để nhận ưu đãi học phí');
                  return;
                }
                if (onNavigateToVip) onNavigateToVip();
              }}
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Nâng cấp gói VIP →
            </button>
          </div>

          {/* Widget 4: Gia sư Của Tôi */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Gia sư Của Tôi
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'TS. Nguyễn Thị Hoa' },
                { name: 'TS. Phạm Thị Lan' },
                { name: 'Trần Minh Đức' },
                { name: 'TS. Lê Thị Thu' }
              ].map((tut, i) => (
                <div 
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNavigateToTutors ? onNavigateToTutors() : null}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.88rem'
                    }}>
                      {tut.name.charAt(tut.name.lastIndexOf(' ') + 1)}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {tut.name}
                    </span>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
