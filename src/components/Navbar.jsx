import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TutoraLogo from './TutoraLogo';
import { 
  LogOut, 
  UserCheck, 
  CreditCard,
  User,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ activeTab = 'classes', onNavigate }) {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isTutor = user?.role === 'TUTOR';

  // Define tabs matching Figma screenshots
  const guestNavItems = [
    { id: 'tutors', label: 'Tìm Gia Sư' },
    { id: 'classes', label: 'Khóa Học' },
    { id: 'materials', label: 'Tài Liệu' },
    { id: 'vip', label: 'Bảng Giá VIP' },
  ];

  const parentNavItems = [
    { id: 'tutors', label: 'Tìm Gia Sư' },
    { id: 'classes', label: 'Lớp Học Của Tôi' },
    { id: 'payment', label: 'Ví Kết Nối' },
    { id: 'materials', label: 'Tài Liệu' },
    { id: 'assignments', label: 'Bài Tập' },
  ];

  const tutorNavItems = [
    { id: 'dashboard', label: 'Tổng Quan' },
    { id: 'classes', label: 'Lớp Dạy & Yêu Cầu' },
    { id: 'materials', label: 'Tài Liệu' },
    { id: 'assignments', label: 'Bài Tập' },
    { id: 'profile', label: 'Hồ Sơ' },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Tổng Quan' },
    { id: 'classes', label: 'Tất Cả Lớp Học' },
    { id: 'tutors', label: 'Danh Sách Gia Sư' },
    { id: 'materials', label: 'Tài Liệu' },
    { id: 'payment', label: 'Ví Kết Nối' },
  ];

  const navItems = !user 
    ? guestNavItems 
    : (user.role === 'ADMIN' 
        ? adminNavItems 
        : (isTutor ? tutorNavItems : studentNavItems));

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>Admin</span>;
      case 'TUTOR':
        return <span className="badge badge-tutor">Gia sư</span>;
      case 'PARENT':
        return <span className="badge badge-parent">Phụ huynh</span>;
      default:
        return <span className="badge badge-tutor">{role}</span>;
    }
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eef2f6',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Brand Logo (Figma totora style) */}
        <div 
          onClick={() => onNavigate(user ? (isTutor ? 'dashboard' : 'classes') : 'tutors')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <TutoraLogo size="md" />
        </div>

        {/* Centered Pill Nav Tabs (Figma style) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          padding: '2px'
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'tutors' && activeTab === 'checkout');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                style={{
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: isActive ? '#f3e8ff' : 'transparent',
                  color: isActive ? '#7c3aed' : '#475569',
                  letterSpacing: '-0.01em'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: User Avatar matching Figma Circular Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Profile Avatar circle with border */}
              <div 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '2px solid #e2e8f0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                }}
                title={`${user.fullName} (${getRoleBadge(user.role)})`}
              >
                {/* User avatar or photo representation */}
                <div style={{
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#7c3aed'
                }}>
                  {user.fullName?.charAt(0) || 'U'}
                </div>
              </div>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '220px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #0f172a',
                  borderRadius: '14px',
                  boxShadow: '4px 4px 0px #000000',
                  padding: '12px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ padding: '4px 8px 8px 8px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      {user.email}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigate('profile');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <UserCheck size={16} color="#7c3aed" /> Hồ sơ cá nhân
                  </button>

                  {!isTutor && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigate('payment');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <CreditCard size={16} color="#059669" /> Ví kết nối ({new Intl.NumberFormat('vi-VN').format(user?.balance || 0)}đ)
                    </button>
                  )}

                  <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#ef4444',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                type="button"
                onClick={() => onNavigate('login')} 
                style={{
                  padding: '8px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '2px solid #0f172a',
                  boxShadow: '2px 2px 0px #0f172a',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #0f172a';
                }}
              >
                Đăng nhập
              </button>
              <button 
                type="button"
                onClick={() => onNavigate('register')} 
                style={{
                  padding: '8px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: '2px solid #0f172a',
                  boxShadow: '2px 2px 0px #0f172a',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-1px, -1px)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px #0f172a';
                  e.currentTarget.style.backgroundColor = '#6d28d9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px #0f172a';
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
