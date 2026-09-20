import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LessonList from '../components/LessonList';
import ClassManagement from '../components/ClassManagement';
import TutorCatalog from '../components/TutorCatalog';
import AssignmentView from '../components/AssignmentView';
import MaterialView from '../components/MaterialView';
import ProfileView from '../components/ProfileView';
import PaymentView from '../components/PaymentView';
import CheckoutFlow from '../components/CheckoutFlow';
import VipPricingView from '../components/VipPricingView';
import PaymentResultView from '../components/PaymentResultView';
import { 
  User, 
  Calendar, 
  BookOpen, 
  Users, 
  CreditCard, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  FileText,
  CheckSquare,
  DollarSign,
  Star,
  Clock,
  Video,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage({ activeTab = 'default', onNavigate, onRequireAuth }) {
  const { user } = useAuth();
  const isTutor = user?.role === 'TUTOR';

  // Internal tab state if activeTab is 'default' or 'dashboard'
  const [internalTab, setInternalTab] = useState(user ? (isTutor ? 'dashboard' : 'classes') : 'tutors');

  // Determine which tab to actually display
  const currentTab = (activeTab && activeTab !== 'default' && activeTab !== 'home') 
    ? activeTab 
    : internalTab;

  const handleTabChange = (tab) => {
    setInternalTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  return (
    <div>
      {/* Banner dành riêng cho Khách chưa đăng nhập */}
      {!user && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px auto',
          backgroundColor: '#eff6ff',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          boxShadow: '3px 3px 0px #0f172a',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#ffd600',
              border: '2px solid #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0
            }}>
              👋
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Bạn đang xem hệ thống với vai trò Khách (Guest)</span>
                <span style={{
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  border: '1px solid #bfdbfe'
                }}>
                  Khám phá tự do
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
                Bạn có thể tự do tìm gia sư, xem khóa học, tài liệu và bảng giá VIP. Đăng nhập để sử dụng các dịch vụ đặt lịch và nộp bài.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '2px solid #0f172a',
                boxShadow: '2px 2px 0px #0f172a',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: '2px solid #0f172a',
                boxShadow: '2px 2px 0px #0f172a',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      )}

      {/* Banner nhắc nhở bổ sung thông tin cá nhân (đặc biệt cho người dùng đăng nhập qua Google) */}
      {user && (!user?.phone || user.phone.trim() === '') && currentTab !== 'profile' && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1.5px solid #bfdbfe',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a' }}>
                  Bổ sung thông tin cá nhân tài khoản
                </h4>
                <span style={{
                  background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 800,
                  padding: '2px 8px', borderRadius: '999px', border: '1px solid #fde68a'
                }}>
                  Cần bổ sung
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#3b82f6', lineHeight: '1.5' }}>
                Chào <b>{user.fullName || user.email}</b>! Tài khoản vừa được kết nối từ Google. Vui lòng bổ sung Số điện thoại và thông tin hồ sơ để nhận thông báo lịch học và kích hoạt đầy đủ tính năng.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              gap: '8px',
              backgroundColor: '#2563eb',
              borderColor: '#2563eb',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
            }}
            onClick={() => handleTabChange('profile')}
          >
            <UserCheck size={18} /> Cập nhật hồ sơ ngay
          </button>
        </div>
      )}

      {/* Tutor Overview matching Figma Frame 16:2 when currentTab is 'dashboard' */}
      {isTutor && currentTab === 'dashboard' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px', position: 'relative' }}>
          
          {/* Floating Background Shapes */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '-30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fff4cc',
            zIndex: 0,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '160px',
            right: '-20px',
            width: '75px',
            height: '75px',
            backgroundColor: '#f3e8ff',
            transform: 'rotate(45deg)',
            borderRadius: '16px',
            zIndex: 0,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '120px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: '#d1fae5',
            opacity: 0.6,
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          {/* Hero Greeting Card (Dark Card matching Figma 16:2) */}
          <div style={{
            backgroundColor: '#181b2a',
            border: '2px solid #0f172a',
            color: '#ffffff',
            padding: '32px 36px',
            borderRadius: '24px',
            marginBottom: '28px',
            position: 'relative',
            boxShadow: '4px 4px 0px #0f172a',
            overflow: 'hidden',
            zIndex: 1
          }}>
            {/* Subtle dark circle illustration in background */}
            <div style={{
              position: 'absolute',
              right: '280px',
              top: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffd600', fontWeight: 900 }}>
                  CHÀO BUỔI SÁNG
                </span>
                <h1 style={{ fontFamily: 'serif', fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '6px 0 8px 0' }}>
                  {user.fullName || 'Hoàng Thiên Ứng'}
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>
                  ĐH Bách Khoa · Toán, Vật lý, Tin học
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Illustrated Chicken Avatar */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  border: '1.5px solid #0f172a',
                  backgroundColor: '#ffd600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '2px 2px 0px #000'
                }}>
                  🐔
                </div>

                <button
                  type="button"
                  onClick={() => handleTabChange('lessons')}
                  style={{
                    backgroundColor: '#ff5f38',
                    color: '#ffffff',
                    border: '2px solid #0f172a',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px #0f172a',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  Xem Lịch Đầy đủ
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metrics from Figma 16:2 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Metric 1: Mint */}
            <div style={{
              backgroundColor: '#eefaf6',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}>
              <div style={{ color: '#059669' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', lineHeight: 1.1, fontFamily: 'serif' }}>
                  4
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                  Buổi học sắp tới
                </div>
              </div>
            </div>

            {/* Metric 2: Lavender */}
            <div style={{
              backgroundColor: '#f4f0ff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}>
              <div style={{ color: '#7c3aed' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1.1, fontFamily: 'serif' }}>
                  243
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                  Tổng học sinh
                </div>
              </div>
            </div>

            {/* Metric 3: Peach */}
            <div style={{
              backgroundColor: '#fff1ed',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}>
              <div style={{ color: '#ea580c' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', lineHeight: 1.1, fontFamily: 'serif' }}>
                  10.000.000đ
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                  Tháng này (dự kiến)
                </div>
              </div>
            </div>

            {/* Metric 4: Yellow */}
            <div style={{
              backgroundColor: '#fffce8',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}>
              <div style={{ color: '#ca8a04' }}>
                <Star size={22} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ca8a04', lineHeight: 1.1, fontFamily: 'serif' }}>
                  4.9
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                  Đánh giá trung bình
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid (2 Columns: Left ~65%, Right ~35%) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '24px',
            alignItems: 'start',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Column: Upcoming Sessions + Recent Notifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Upcoming Sessions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, fontFamily: 'serif' }}>
                    Buổi học Sắp tới
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleTabChange('lessons')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ea580c',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Xem tất cả →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Minh Anh', subject: 'Toán học', subBg: '#fff1ed', subColor: '#ea580c', duration: '60 phút', date: '12/09/2026', time: '10:00' },
                    { name: 'Phương Linh', subject: 'Vật lý', subBg: '#f4f0ff', subColor: '#7c3aed', duration: '60 phút', date: '12/09/2026', time: '14:00' },
                    { name: 'Quốc Khánh', subject: 'Tin học', subBg: '#e0f2fe', subColor: '#0284c7', duration: '90 phút', date: '14/09/2026', time: '11:00' },
                    { name: 'Bảo Châu', subject: 'Vật lý', subBg: '#f4f0ff', subColor: '#7c3aed', duration: '60 phút', date: '17/09/2026', time: '16:00' },
                  ].map((sess, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: sess.subColor
                        }}>
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
                            {sess.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: sess.subBg,
                              color: sess.subColor
                            }}>
                              {sess.subject}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              {sess.duration}
                            </span>
                            <button
                              type="button"
                              onClick={() => window.open('https://meet.google.com/new', '_blank')}
                              style={{
                                backgroundColor: '#7c3aed',
                                color: '#ffffff',
                                border: 'none',
                                padding: '2px 10px',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Tham gia
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                          {sess.date}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#ea580c', fontWeight: 700 }}>
                          {sess.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notifications (Figma 16:2) */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0', fontFamily: 'serif' }}>
                  Thông báo Gần đây
                </h3>

                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #0f172a',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <RefreshCw size={18} color="#ea580c" />
                      <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                        Minh Anh đã đặt lịch học Toán ngày 12/09 lúc 10:00
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#059669', backgroundColor: '#eefaf6', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                      2 giờ trước
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Star size={18} color="#ca8a04" fill="#ca8a04" />
                      <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                        Phương Linh để lại đánh giá 5 sao cho buổi học Vật lý
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#059669', backgroundColor: '#eefaf6', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                      Hôm qua
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <DollarSign size={18} color="#059669" />
                      <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>
                        Thanh toán 212.500đ từ Quốc Khánh đã được xử lý
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#059669', backgroundColor: '#eefaf6', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                      2 ngày trước
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: 3 Cards from Figma 16:2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Card 1: BUỔI HỌC TIẾP THEO (Coral Card) */}
              <div style={{
                backgroundColor: '#ff5f38',
                border: '2px solid #0f172a',
                borderRadius: '20px',
                padding: '24px',
                color: '#ffffff',
                boxShadow: '4px 4px 0px #0f172a'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#fff1ed'
                }}>
                  BUỔI HỌC TIẾP THEO
                </span>

                <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '8px', marginBottom: '2px', fontFamily: 'serif' }}>
                  Minh Anh
                </div>

                <div style={{ fontSize: '0.95rem', color: '#ffe2da', fontWeight: 600 }}>
                  Toán học
                </div>

                <div style={{ fontSize: '0.82rem', color: '#fff1ed', margin: '8px 0 20px 0' }}>
                  12/09/2026 lúc 10:00 · 60 phút
                </div>

                <button
                  type="button"
                  onClick={() => window.open('https://meet.google.com/new', '_blank')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#181b2a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 0 #000'
                  }}
                >
                  Bắt đầu buổi học
                </button>
              </div>

              {/* Card 2: Môn học tôi dạy */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
                  Môn học tôi dạy
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff1ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Toán</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>0 buổi</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c' }}>0%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f4f0ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Vật lý</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>2 buổi</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed' }}>40%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Tin học</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>1 buổi</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7' }}>20%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Thao tác Nhanh */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '20px',
                padding: '24px',
                position: 'relative'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                  Thao tác Nhanh
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange('lessons')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#059669" /> Quản lý Lịch dạy
                    </span>
                    <ArrowRight size={16} color="#94a3b8" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('payment')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} color="#7c3aed" /> Xem Thống kê
                    </span>
                    <ArrowRight size={16} color="#94a3b8" />
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Chức năng nhắn tin đang hoạt động.')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#ea580c" /> Nhắn tin Học sinh
                    </span>
                    <ArrowRight size={16} color="#94a3b8" />
                  </button>
                </div>

                {/* Tilted Yellow Square */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#ffd600',
                  border: '1.5px solid #0f172a',
                  transform: 'rotate(15deg)',
                  pointerEvents: 'none'
                }} />
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Render Target Component based on currentTab */
        <div>
          {currentTab === 'classes' && (
            <ClassManagement 
              user={user} 
              onNavigateToTutors={() => handleTabChange('tutors')} 
              onNavigateToVip={() => handleTabChange('vip')}
              onRequireAuth={onRequireAuth}
            />
          )}

          {currentTab === 'tutors' && (
            <TutorCatalog 
              onNavigate={handleTabChange} 
              user={user}
              onRequireAuth={onRequireAuth}
            />
          )}

          {currentTab === 'lessons' && (
            user ? (
              <LessonList user={user} />
            ) : (
              <div className="card" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '500px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px #0f172a', borderRadius: '16px', padding: '36px 24px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Lịch học cá nhân</h3>
                <p className="subtitle" style={{ color: '#64748b', marginBottom: '24px' }}>Vui lòng đăng nhập để xem và quản lý lịch học riêng của bạn.</p>
                <button 
                  onClick={() => onRequireAuth ? onRequireAuth('xem lịch học cá nhân') : onNavigate('login')} 
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: '2px solid #0f172a',
                    boxShadow: '2px 2px 0px #0f172a',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            )
          )}

          {currentTab === 'assignments' && (
            <AssignmentView 
              user={user} 
              onRequireAuth={onRequireAuth}
            />
          )}

          {currentTab === 'materials' && (
            <MaterialView 
              user={user} 
              onNavigateToVip={() => handleTabChange('vip')}
              onRequireAuth={onRequireAuth}
            />
          )}

          {currentTab === 'vip' && (
            <VipPricingView 
              user={user}
              onBack={() => handleTabChange(user ? 'classes' : 'tutors')} 
              onSelectVip={() => handleTabChange(user ? 'classes' : 'tutors')}
              onRequireAuth={onRequireAuth}
            />
          )}

          {currentTab === 'payment' && (
            user ? (
              <PaymentView />
            ) : (
              <div className="card" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '500px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px #0f172a', borderRadius: '16px', padding: '36px 24px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Quản lý thanh toán</h3>
                <p className="subtitle" style={{ color: '#64748b', marginBottom: '24px' }}>Vui lòng đăng nhập để kiểm tra số dư và lịch sử giao dịch.</p>
                <button 
                  onClick={() => onRequireAuth ? onRequireAuth('quản lý thanh toán') : onNavigate('login')} 
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: '2px solid #0f172a',
                    boxShadow: '2px 2px 0px #0f172a',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            )
          )}

          {currentTab === 'checkout' && (
            <CheckoutFlow 
              onNavigate={handleTabChange}
              onBack={() => handleTabChange('tutors')}
            />
          )}

          {currentTab === 'profile' && (
            user ? (
              <ProfileView onBack={() => handleTabChange(isTutor ? 'dashboard' : 'classes')} />
            ) : (
              <div className="card" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '500px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px #0f172a', borderRadius: '16px', padding: '36px 24px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Hồ sơ tài khoản</h3>
                <p className="subtitle" style={{ color: '#64748b', marginBottom: '24px' }}>Vui lòng đăng nhập để xem và cập nhật thông tin cá nhân.</p>
                <button 
                  onClick={() => onRequireAuth ? onRequireAuth('xem hồ sơ cá nhân') : onNavigate('login')} 
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: '2px solid #0f172a',
                    boxShadow: '2px 2px 0px #0f172a',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            )
          )}

          {currentTab === 'payment-result' && (
            <PaymentResultView onNavigate={handleTabChange} />
          )}
        </div>
      )}
    </div>
  );
}
