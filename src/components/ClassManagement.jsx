import React, { useState } from 'react';
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

export default function ClassManagement({ user, onNavigateToTutors, onNavigateToVip }) {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [calendarDay, setCalendarDay] = useState(10);

  // Lesson list matching Figma 15:2994
  const upcomingLessons = [
    {
      id: 1,
      tutorName: 'TS. Nguyễn Thị Hoa',
      subject: 'Toán học',
      subjectTagColor: '#fee2e2',
      subjectTextColor: '#ea580c',
      date: '12/09/2026',
      time: '10:00',
      duration: '60 phút',
      topic: 'Ôn tập Chương 5 - Tích phân từng phần',
      roomUrl: 'https://meet.google.com/abc-def-ghi',
      status: 'Sắp tới',
      statusColor: '#059669',
      statusBg: '#e6fffa'
    },
    {
      id: 2,
      tutorName: 'TS. Phạm Thị Lan',
      subject: 'Hóa học',
      subjectTagColor: '#e0f2fe',
      subjectTextColor: '#0284c7',
      date: '15/09/2026',
      time: '18:00',
      duration: '90 phút',
      topic: 'Hóa hữu cơ - Cơ chế phản ứng',
      roomUrl: 'https://meet.google.com/hjk-lmno-pqr',
      status: 'Sắp tới',
      statusColor: '#059669',
      statusBg: '#e6fffa'
    },
    {
      id: 3,
      tutorName: 'TS. Lê Thị Thu',
      subject: 'Sinh học',
      subjectTagColor: '#dcfce7',
      subjectTextColor: '#15803d',
      date: '19/09/2026',
      time: '09:00',
      duration: '90 phút',
      topic: 'Phân bào và di truyền học',
      roomUrl: 'https://meet.google.com/stu-vwxy-zab',
      status: 'Sắp tới',
      statusColor: '#059669',
      statusBg: '#e6fffa'
    }
  ];

  const completedLessons = [
    {
      id: 4,
      tutorName: 'Trần Minh Đức',
      subject: 'Tiếng Anh',
      subjectTagColor: '#fee2e2',
      subjectTextColor: '#ea580c',
      date: '08/09/2026',
      time: '19:30',
      duration: '60 phút',
      topic: 'Skimming & Scanning trong các bài đọc xã hội dài 800 từ',
      status: 'Đã hoàn thành',
      statusColor: '#64748b',
      statusBg: '#f1f5f9'
    },
    {
      id: 5,
      tutorName: 'TS. Nguyễn Thị Hoa',
      subject: 'Toán học',
      subjectTagColor: '#fee2e2',
      subjectTextColor: '#ea580c',
      date: '05/09/2026',
      time: '10:00',
      duration: '60 phút',
      topic: 'Cực trị của hàm số bậc ba và bài toán tham số m',
      status: 'Đã hoàn thành',
      statusColor: '#64748b',
      statusBg: '#f1f5f9'
    }
  ];

  const displayLessons = activeTab === 'upcoming' 
    ? upcomingLessons 
    : activeTab === 'completed' 
      ? completedLessons 
      : [...upcomingLessons, ...completedLessons];

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
        </div>

        <button 
          type="button"
          className="figma-btn-primary"
          style={{ width: 'auto', padding: '12px 24px', fontSize: '0.95rem' }}
          onClick={() => onNavigateToTutors ? onNavigateToTutors() : null}
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
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>3</div>
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
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1.1 }}>2</div>
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
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ea580c', lineHeight: 1.1 }}>4</div>
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
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1 }}>5</div>
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
              Sắp tới (3)
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
              Đã hoàn thành (2)
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
              Tất cả
            </button>
          </div>

          {/* Lesson Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {displayLessons.map((item) => (
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
                      {item.tutorName.charAt(item.tutorName.lastIndexOf(' ') + 1)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{item.tutorName}</div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: '#64748b', marginBottom: '14px' }}>
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

                {/* Action button */}
                {item.roomUrl && (
                  <a
                    href={item.roomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="figma-btn-primary"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-block',
                      width: 'auto',
                      padding: '10px 22px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Tham gia buổi học
                  </a>
                )}
              </div>
            ))}
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
              onClick={() => onNavigateToVip && onNavigateToVip()}
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
