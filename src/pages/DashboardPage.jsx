import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LessonList from '../components/LessonList';
import ClassManagement from '../components/ClassManagement';
import TutorCatalog from '../components/TutorCatalog';
import AssignmentView from '../components/AssignmentView';
import MaterialView from '../components/MaterialView';
import ProfileView from '../components/ProfileView';
import PaymentView from '../components/PaymentView';
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
  TrendingUp
} from 'lucide-react';

export default function DashboardPage({ activeTab = 'default', onNavigate }) {
  const { user } = useAuth();
  const isTutor = user?.role === 'TUTOR';

  // Internal tab state if activeTab is 'default' or 'dashboard'
  const [internalTab, setInternalTab] = useState(isTutor ? 'dashboard' : 'classes');

  // Determine which tab to actually display
  const currentTab = (activeTab && activeTab !== 'default' && activeTab !== 'home') 
    ? activeTab 
    : internalTab;

  const handleTabChange = (tab) => {
    setInternalTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '500px' }}>
        <h3>Phiên đăng nhập chưa sẵn sàng</h3>
        <p className="subtitle">Vui lòng đăng nhập để tiếp tục trải nghiệm hệ thống.</p>
        <button onClick={() => onNavigate && onNavigate('login')} className="btn btn-primary">
          Đi đến Đăng nhập
        </button>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'TUTOR': return 'Gia sư';
      case 'PARENT': return 'Phụ huynh';
      case 'STUDENT': return 'Học sinh';
      default: return role;
    }
  };

  return (
    <div>
      {/* Banner nhắc nhở bổ sung thông tin cá nhân (đặc biệt cho người dùng đăng nhập qua Google) */}
      {(!user?.phone || user.phone.trim() === '') && currentTab !== 'profile' && (
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
        <div>
          {/* Hero Greeting Card */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd', fontWeight: 800 }}>
                  CHÀO BUỔI SÁNG
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 8px 0' }}>
                  {user.fullName}
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>
                  Đại học Bách Khoa • Chuyên ngành Toán, Vật lý, Tin học
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ gap: '8px', padding: '10px 20px', fontWeight: 700 }}
                  onClick={() => handleTabChange('lessons')}
                >
                  <Calendar size={18} /> Xem Lịch Dạy Đầy Đủ
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metrics from Figma 16:2 */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Clock size={26} />
              </div>
              <div>
                <strong>3</strong>
                <span>Buổi dạy hôm nay</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <Users size={26} />
              </div>
              <div>
                <strong>243</strong>
                <span>Tổng học sinh đã dạy</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                <TrendingUp size={26} />
              </div>
              <div>
                <strong>10.000.000 đ</strong>
                <span>Thu nhập tháng này (dự kiến)</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <Star size={26} />
              </div>
              <div>
                <strong>4.9 ★</strong>
                <span>Đánh giá trung bình</span>
              </div>
            </div>
          </div>

          {/* Upcoming Lessons Today */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Buổi Dạy Sắp Tới
              </h3>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                onClick={() => handleTabChange('lessons')}
              >
                Xem tất cả lịch dạy →
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    MA
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 800 }}>Minh Anh • Toán 12</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Chủ đề: Tích phân từng phần và ứng dụng
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Hôm nay • 19:00</div>
                    <span>Thời lượng: 90 phút</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.88rem', gap: '6px' }}
                    onClick={() => window.open('https://meet.google.com/new', '_blank')}
                  >
                    <Video size={16} /> Vào lớp dạy
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#ede9fe',
                    color: '#6d28d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    PL
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 800 }}>Phương Linh • Vật lý 11</h4>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Chủ đề: Định luật Cu-lông và điện trường đều
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#475569' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>Ngày mai • 18:00</div>
                    <span>Thời lượng: 60 phút</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                    onClick={() => handleTabChange('lessons')}
                  >
                    Xem chi tiết
                  </button>
                </div>
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
            />
          )}

          {currentTab === 'tutors' && (
            <TutorCatalog />
          )}

          {currentTab === 'lessons' && (
            <LessonList user={user} />
          )}

          {currentTab === 'assignments' && (
            <AssignmentView user={user} />
          )}

          {currentTab === 'materials' && (
            <MaterialView user={user} />
          )}

          {currentTab === 'payment' && (
            <PaymentView />
          )}

          {currentTab === 'profile' && (
            <ProfileView />
          )}
        </div>
      )}
    </div>
  );
}
