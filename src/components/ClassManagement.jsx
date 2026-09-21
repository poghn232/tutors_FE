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
  Plus,
  PlusCircle,
  Bell,
  X
} from 'lucide-react';

export default function ClassManagement({ user, onNavigateToTutors, onNavigateToVip, onRequireAuth }) {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [calendarDay, setCalendarDay] = useState(10);
  const [dbClasses, setDbClasses] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Modal State for Adding Class / Free Schedule Slot
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmittingClass, setIsSubmittingClass] = useState(false);
  const [newClassForm, setNewClassForm] = useState({
    className: '',
    subjectName: 'Toán học',
    partnerName: '',
    date: '2026-09-22',
    time: '18:00 - 20:00',
    duration: '60 phút',
    isFreeSlot: false,
    notes: ''
  });

  const getLocalStorageClasses = () => {
    try {
      const key = `giasuhq_custom_classes_${user?.id || 'guest'}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  const saveLocalStorageClass = (newCls) => {
    try {
      const key = `giasuhq_custom_classes_${user?.id || 'guest'}`;
      const existing = getLocalStorageClasses();
      const updated = [newCls, ...existing.filter(item => item.id !== newCls.id)];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('Cannot save to localStorage', e);
    }
  };

  const loadClasses = async () => {
    try {
      setLoadingDb(true);
      const localClasses = getLocalStorageClasses();
      let remoteClasses = [];
      try {
        const res = await classService.getClasses();
        if (res && res.data && Array.isArray(res.data)) {
          remoteClasses = res.data;
        }
      } catch (err) {
        console.warn('API getClasses warning, using local data fallback:', err);
      }

      // Merge remote and local without duplicate IDs
      const merged = [...localClasses];
      remoteClasses.forEach(rc => {
        if (!merged.some(mc => mc.id === rc.id || (mc.orderCode && mc.orderCode === rc.orderCode))) {
          merged.push(rc);
        }
      });
      setDbClasses(merged);
    } catch (err) {
      // quiet fallback
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  const handleCreateCustomClass = async (e) => {
    e.preventDefault();
    if (!user && onRequireAuth) {
      onRequireAuth('thêm lớp học hoặc lịch rảnh');
      return;
    }
    setIsSubmittingClass(true);
    setActionMessage('');
    try {
      const isTutor = user?.role === 'TUTOR';
      const isFreeSlot = isTutor && newClassForm.isFreeSlot;
      const sName = isFreeSlot 
        ? 'Lịch rảnh (Sẵn sàng nhận lớp)' 
        : (isTutor 
            ? (newClassForm.partnerName || 'Học sinh mới') 
            : (user?.fullName || 'Học sinh'));
      const tName = isTutor 
        ? (user?.fullName || 'Gia sư') 
        : (newClassForm.partnerName || 'TS. Nguyễn Thị Hoa');

      const cName = newClassForm.className.trim() || 
        (isFreeSlot 
          ? `Lịch rảnh: Môn ${newClassForm.subjectName} (${tName})` 
          : `Lớp ${newClassForm.subjectName} cùng ${tName}`);

      const payload = {
        className: cName,
        subjectName: newClassForm.subjectName,
        subjectId: 1,
        tutorId: isTutor ? user?.id : 1,
        tutorName: tName,
        studentName: sName,
        studentId: isTutor ? null : user?.id,
        studentEmail: user?.email,
        scheduleDescription: `${newClassForm.date} lúc ${newClassForm.time}`,
        date: newClassForm.date,
        time: newClassForm.time,
        duration: newClassForm.duration,
        notes: newClassForm.notes,
        status: 'ACTIVE',
        isFreeSlot: isFreeSlot
      };

      let savedItem = null;
      try {
        const res = await classService.createClass(payload);
        if (res && res.data) {
          savedItem = res.data;
        }
      } catch (err) {
        console.warn('Backend API createClass warning, using local persistence:', err);
      }

      if (!savedItem) {
        savedItem = {
          id: Date.now(),
          ...payload,
          status: 'ACTIVE',
          connectionFee: 5000
        };
      }

      saveLocalStorageClass(savedItem);
      setDbClasses(prev => [savedItem, ...prev.filter(item => item.id !== savedItem.id)]);
      setShowAddModal(false);
      setActionMessage(
        isFreeSlot
          ? '✅ Đã thêm lịch rảnh thành công! Khung giờ đã xuất hiện trên thời khóa biểu của bạn.'
          : '✅ Đã thêm lớp học mới vào lịch học thành công!'
      );
      // Reset form
      setNewClassForm({
        className: '',
        subjectName: 'Toán học',
        partnerName: '',
        date: '2026-09-22',
        time: '18:00 - 20:00',
        duration: '60 phút',
        isFreeSlot: false,
        notes: ''
      });
    } catch (err) {
      setActionMessage('Không thể tạo lớp học. Vui lòng thử lại.');
    } finally {
      setIsSubmittingClass(false);
    }
  };

  const handleClassAction = async (action, classId, isPayment = false) => {
    try {
      setActionMessage('');
      const res = await action(classId);
      setActionMessage(res?.message || 'Cập nhật lớp học thành công.');
      if (isPayment && user && user.balance !== undefined) {
        updateUser({ balance: Math.max(0, (user.balance || 0) - 5000) });
      }
      await loadClasses();
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Không thể cập nhật lớp học.');
    }
  };

  const getClassStatusMeta = (status, isFreeSlot = false) => {
    if (isFreeSlot) {
      return { label: '🟢 Lịch rảnh nhận lớp', color: '#059669', bg: '#ecfdf5' };
    }
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
    const isFreeSlot = c.isFreeSlot || (c.studentName && c.studentName.includes('Lịch rảnh'));
    const sDesc = c.scheduleDescription || '';
    const datePart = sDesc.includes('lúc') ? sDesc.split('lúc')[0].trim() : (sDesc || 'Sắp tới');
    const timePart = sDesc.includes('lúc') ? sDesc.split('lúc')[1].trim() : '10:00';
    const statusMeta = getClassStatusMeta(c.status, isFreeSlot);
    return {
      id: 'db-' + c.id,
      classId: c.id,
      tutorName: c.tutorName || 'Gia sư chuyên môn',
      studentName: c.studentName || 'Học sinh',
      subject: c.subjectName || 'Môn học',
      subjectTagColor: isFreeSlot ? '#ecfdf5' : '#e0f2fe',
      subjectTextColor: isFreeSlot ? '#059669' : '#0284c7',
      date: datePart,
      time: timePart,
      duration: c.duration || '60 phút',
      topic: c.className || `Lớp ${c.subjectName} cùng ${c.tutorName}`,
      roomUrl: 'https://meet.google.com/tutora-class-' + c.id,
      rawStatus: c.status,
      connectionFee: c.connectionFee,
      isFreeSlot: isFreeSlot,
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

  const upcomingCount = upcomingClasses.length;
  const completedCount = historyClasses.length;
  const activeTutorCount = new Set(allMappedClasses.map(c => c.tutorName).filter(Boolean)).size;
  const currentSubjectsCount = new Set(allMappedClasses.map(c => c.subject).filter(Boolean)).size;

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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {user?.role === 'TUTOR' ? (
            <button 
              type="button"
              className="figma-btn-primary"
              style={{ width: 'auto', padding: '12px 22px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth('thêm lịch rảnh hoặc lớp học');
                  return;
                }
                setNewClassForm(prev => ({ ...prev, isFreeSlot: true }));
                setShowAddModal(true);
              }}
            >
              <PlusCircle size={18} /> + Thêm Lịch Rảnh / Tạo Lớp
            </button>
          ) : (
            <>
              <button 
                type="button"
                className="figma-btn-primary"
                style={{ width: 'auto', padding: '12px 22px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  if (!user && onRequireAuth) {
                    onRequireAuth('tự thêm lớp học vào hệ thống');
                    return;
                  }
                  setNewClassForm(prev => ({ ...prev, isFreeSlot: false }));
                  setShowAddModal(true);
                }}
              >
                <Plus size={18} /> + Thêm Lớp Học Mới
              </button>

              <button 
                type="button"
                className="figma-btn-outline"
                style={{ width: 'auto', padding: '11px 20px', fontSize: '0.92rem' }}
                onClick={() => {
                  if (onNavigateToTutors) onNavigateToTutors();
                }}
              >
                Tìm Gia Sư
              </button>
            </>
          )}
        </div>
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
                  {!user ? 'Bạn đang xem danh sách lớp học ở chế độ Khách' : 'Chưa có lớp học nào trong danh sách này'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                  {!user 
                    ? 'Đăng nhập vào hệ thống để đặt lịch học với gia sư hoặc quản lý các lớp học cá nhân của bạn!'
                    : (user?.role === 'TUTOR' 
                        ? 'Bạn hiện chưa có yêu cầu kết nối hoặc lớp học nào trong mục này.' 
                        : 'Hãy tìm kiếm gia sư phù hợp và gửi yêu cầu kết nối lịch học!')}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={onNavigateToTutors}
                    className="figma-btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', width: 'auto' }}
                  >
                    Tìm gia sư ngay →
                  </button>
                  {!user && onRequireAuth && (
                    <button
                      type="button"
                      onClick={() => onRequireAuth('quản lý lớp học')}
                      style={{
                        padding: '10px 24px',
                        borderRadius: '12px',
                        border: '2px solid #0f172a',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Đăng nhập
                    </button>
                  )}
                </div>
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
                        Thanh toán phí kết nối (5.000đ)
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

          {/* "Thông báo" Section */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Thông báo
          </h3>

          {allMappedClasses.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '24px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <Bell size={24} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Chưa có thông báo mới</div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                Khi bạn gửi yêu cầu kết nối gia sư hoặc có cập nhật về lớp học, các thông báo sẽ hiển thị ở đây.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allMappedClasses.map((item, idx) => {
                if (item.rawStatus === 'PENDING_TUTOR_APPROVAL') {
                  return (
                    <div key={item.id || idx} style={{
                      background: '#fffbeb',
                      border: '1.5px solid #fde68a',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Clock size={18} color="#d97706" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>
                          Yêu cầu lớp {item.subject} với {item.tutorName} đang chờ gia sư xác nhận lịch.
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '2px' }}>Lịch dự kiến: {item.date} {item.time}</div>
                      </div>
                    </div>
                  );
                }
                if (item.rawStatus === 'PENDING_PAYMENT') {
                  return (
                    <div key={item.id || idx} style={{
                      background: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle2 size={18} color="#2563eb" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e40af' }}>
                            {item.tutorName} đã chấp nhận lịch học môn {item.subject}!
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#3b82f6', marginTop: '2px' }}>
                            Vui lòng thanh toán phí kết nối (5.000đ) để nhận link phòng học.
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClassAction(classService.payConnectionFee, item.classId, true)}
                        className="figma-btn-primary"
                        style={{ width: 'auto', padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        Nộp phí ngay
                      </button>
                    </div>
                  );
                }
                if (item.rawStatus === 'ACTIVE') {
                  return (
                    <div key={item.id || idx} style={{
                      background: '#ecfdf5',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065f46' }}>
                          Lớp học {item.subject} cùng {item.tutorName} đã được kích hoạt.
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '2px' }}>Thời gian: {item.date} lúc {item.time}</div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
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
            {upcomingClasses.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>
                Chưa có lịch học trong tuần này
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                {upcomingClasses.slice(0, 3).map((uc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: i % 2 === 0 ? '#ea580c' : '#0284c7' }} />
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{uc.date} {uc.time}</span>
                    <span style={{ color: '#64748b' }}>{uc.subject}</span>
                  </div>
                ))}
              </div>
            )}
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

            {allMappedClasses.length === 0 ? (
              <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', padding: '12px 0', lineHeight: 1.5 }}>
                Chưa có tiến trình học tập. Tiến trình sẽ được tự động cập nhật khi bạn tham gia các buổi học cùng gia sư.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Array.from(new Set(allMappedClasses.map(c => c.subject).filter(Boolean))).map((subj, idx) => {
                  const subjectClasses = allMappedClasses.filter(c => c.subject === subj);
                  const completedInSubj = subjectClasses.filter(c => c.rawStatus === 'COMPLETED').length;
                  const percent = Math.round((completedInSubj / subjectClasses.length) * 100);
                  const colors = ['#ea580c', '#0284c7', '#059669', '#7c3aed'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={subj}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                        <span style={{ color: '#0f172a' }}>{subj}</span>
                        <span style={{ color: barColor }}>{percent}%</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.max(5, percent)}%`, height: '100%', background: barColor, borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        {completedInSubj}/{subjectClasses.length} buổi hoàn thành
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 3: Lộ trình học tập (VIP Card) */}
          <div style={{
            background: '#facc15',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Lộ trình học tập
              </h4>
              <span style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '999px' }}>
                VIP
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#0f172a', margin: '0 0 16px 0', lineHeight: 1.4, fontWeight: 600 }}>
              Xây dựng lộ trình ôn tập và luyện thi chuẩn mục tiêu cùng đội ngũ gia sư hàng đầu.
            </p>

            <button
              type="button"
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth('nâng cấp gói VIP để nhận ưu đãi');
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
              Xem các gói VIP →
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

            {(() => {
              const myTutors = Array.from(new Set(allMappedClasses.map(c => c.tutorName).filter(Boolean)));
              if (myTutors.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '12px 0', color: '#64748b', fontSize: '0.82rem' }}>
                    <div>Bạn chưa kết nối với gia sư nào.</div>
                    <button
                      type="button"
                      onClick={() => onNavigateToTutors && onNavigateToTutors()}
                      style={{
                        marginTop: '10px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Khám phá gia sư →
                    </button>
                  </div>
                );
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {myTutors.map((tutName, i) => (
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
                          {tutName.charAt(tutName.lastIndexOf(' ') + 1) || 'G'}
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {tutName}
                        </span>
                      </div>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Modal Thêm Lớp Học / Lịch Rảnh */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #0f172a',
            padding: '32px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {user?.role === 'TUTOR' 
                    ? (newClassForm.isFreeSlot ? 'Thêm Lịch Rảnh Mới' : 'Tạo Lớp Học Mới') 
                    : 'Thêm Lớp Học Mới'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
                  {user?.role === 'TUTOR' 
                    ? 'Thiết lập khung giờ rảnh nhận dạy hoặc lên lịch cho học sinh mới'
                    : 'Lên lịch học sau khi đã kết nối và trao đổi với gia sư'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#475569" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCustomClass}>
              {/* Option for Tutor: Free slot toggle */}
              {user?.role === 'TUTOR' && (
                <div style={{
                  background: newClassForm.isFreeSlot ? '#ecfdf5' : '#f8fafc',
                  border: newClassForm.isFreeSlot ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => setNewClassForm(prev => ({ ...prev, isFreeSlot: !prev.isFreeSlot }))}
                >
                  <input
                    type="checkbox"
                    checked={newClassForm.isFreeSlot}
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, isFreeSlot: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: newClassForm.isFreeSlot ? '#065f46' : '#0f172a' }}>
                      📅 Thiết lập làm Lịch Rảnh (Sẵn sàng nhận học sinh mới)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Khung giờ này sẽ hiển thị là lịch rảnh trên thời khóa biểu của bạn
                    </div>
                  </div>
                </div>
              )}

              {/* Field: Subject */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Môn học *
                </label>
                <select
                  className="figma-text-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                  value={newClassForm.subjectName}
                  onChange={(e) => setNewClassForm(prev => ({ ...prev, subjectName: e.target.value }))}
                >
                  {['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 'Tin học', 'Ngữ Văn', 'Lịch sử'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Field: Class Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Tên lớp học / Tiêu đề (Tùy chọn)
                </label>
                <input
                  type="text"
                  className="figma-text-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                  placeholder={newClassForm.isFreeSlot ? "Ví dụ: Lịch rảnh dạy Toán cấp tốc" : "Ví dụ: Lớp Toán 12 - Ôn thi THPT"}
                  value={newClassForm.className}
                  onChange={(e) => setNewClassForm(prev => ({ ...prev, className: e.target.value }))}
                />
              </div>

              {/* Field: Partner Name */}
              {user?.role === 'TUTOR' && !newClassForm.isFreeSlot && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Tên học sinh / Phụ huynh
                  </label>
                  <input
                    type="text"
                    className="figma-text-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                    placeholder="Ví dụ: Em Trần Văn C"
                    value={newClassForm.partnerName}
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, partnerName: e.target.value }))}
                  />
                </div>
              )}

              {user?.role !== 'TUTOR' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Gia sư phụ trách *
                  </label>
                  <select
                    className="figma-text-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                    value={newClassForm.partnerName}
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, partnerName: e.target.value }))}
                  >
                    <option value="">-- Chọn gia sư đã kết nối --</option>
                    {[
                      'TS. Nguyễn Thị Hoa',
                      'TS. Phạm Thị Lan',
                      'TS. Lê Thị Thu',
                      'Trần Minh Đức',
                      'Vũ Thị Mai',
                      'Lê Văn Hùng',
                      'Đỗ Thanh Tùng',
                      'Nguyễn Quốc Bảo'
                    ].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Field: Date and Time Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Ngày học *
                  </label>
                  <input
                    type="date"
                    className="figma-text-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                    value={newClassForm.date}
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Khung giờ *
                  </label>
                  <select
                    className="figma-text-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                    value={newClassForm.time}
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, time: e.target.value }))}
                  >
                    <option value="08:00 - 10:00">08:00 - 10:00 (Sáng)</option>
                    <option value="10:00 - 12:00">10:00 - 12:00 (Trưa)</option>
                    <option value="14:00 - 16:00">14:00 - 16:00 (Chiều)</option>
                    <option value="16:00 - 18:00">16:00 - 18:00 (Chiều)</option>
                    <option value="18:00 - 20:00">18:00 - 20:00 (Tối)</option>
                    <option value="19:30 - 21:00">19:30 - 21:00 (Tối)</option>
                    <option value="20:00 - 22:00">20:00 - 22:00 (Tối)</option>
                  </select>
                </div>
              </div>

              {/* Field: Duration & Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Thời lượng mỗi buổi
                </label>
                <select
                  className="figma-text-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                  value={newClassForm.duration}
                  onChange={(e) => setNewClassForm(prev => ({ ...prev, duration: e.target.value }))}
                >
                  <option value="60 phút">60 phút (1 tiếng)</option>
                  <option value="90 phút">90 phút (1.5 tiếng)</option>
                  <option value="120 phút">120 phút (2 tiếng)</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Ghi chú / Link Google Meet
                </label>
                <input
                  type="text"
                  className="figma-text-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #0f172a' }}
                  placeholder="meet.google.com/abc-xyz hoặc địa chỉ học kèm"
                  value={newClassForm.notes}
                  onChange={(e) => setNewClassForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingClass}
                  className="figma-btn-primary"
                  style={{ width: 'auto', padding: '12px 28px', fontSize: '0.95rem' }}
                >
                  {isSubmittingClass 
                    ? 'Đang lưu...' 
                    : (user?.role === 'TUTOR' && newClassForm.isFreeSlot ? 'Lưu Lịch Rảnh' : 'Lưu Lớp Học')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
