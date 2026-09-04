import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LessonList from '../components/LessonList';
import ClassManagement from '../components/ClassManagement';
import TutorCatalog from '../components/TutorCatalog';
import ProfileView from '../components/ProfileView';
import PaymentView from '../components/PaymentView';
import { User, Calendar, BookOpen, Users, CreditCard, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lessons');

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '500px' }}>
        <h3>Phiên đăng nhập chưa sẵn sàng</h3>
        <p className="subtitle">Vui lòng đăng nhập để tiếp tục.</p>
        <button onClick={() => onNavigate('login')} className="btn btn-primary">
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
      {/* Welcome Banner */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '2px', color: '#0f172a' }}>Xin chào, {user.fullName}!</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Tài khoản: <strong>{user.email}</strong> • Vai trò: <span className="badge badge-tutor" style={{ textTransform: 'none' }}>{getRoleLabel(user.role)}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Hệ thống Bảo mật JWT & BCrypt
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('lessons')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'lessons' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'lessons' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Calendar size={18} /> Buổi học & AI Note
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'classes' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'classes' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <BookOpen size={18} /> Lớp học của tôi
        </button>

        <button
          onClick={() => setActiveTab('tutors')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'tutors' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'tutors' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Users size={18} /> Danh mục Gia sư
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'payment' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'payment' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <CreditCard size={18} /> Học phí (Chờ API Payment)
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 18px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            color: activeTab === 'profile' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'profile' ? '3px solid #2563eb' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <UserCheck size={18} /> Hồ sơ cá nhân
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'lessons' && <LessonList user={user} />}
      {activeTab === 'classes' && <ClassManagement user={user} />}
      {activeTab === 'tutors' && <TutorCatalog />}
      {activeTab === 'payment' && <PaymentView />}
      {activeTab === 'profile' && <ProfileView />}
    </div>
  );
}
