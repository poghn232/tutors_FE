import React from 'react';
import { useAuth } from '../context/AuthContext';
import TutoraLogo from './TutoraLogo';
import { 
  LogOut, 
  BookOpen, 
  Search, 
  GraduationCap, 
  FileText, 
  CheckSquare, 
  Calendar, 
  UserCheck, 
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ activeTab = 'classes', onNavigate }) {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'TUTOR':
        return <span className="badge badge-tutor">Gia sư</span>;
      case 'PARENT':
        return <span className="badge badge-parent">Phụ huynh</span>;
      case 'STUDENT':
        return <span className="badge badge-student">Học sinh</span>;
      default:
        return <span className="badge badge-tutor">{role}</span>;
    }
  };

  // Define tabs based on role matching Figma EXE-2 design
  const isTutor = user?.role === 'TUTOR';

  const navItems = isTutor
    ? [
        { id: 'dashboard', label: 'Tổng Quan', icon: <LayoutDashboard size={18} /> },
        { id: 'lessons', label: 'Lịch Dạy', icon: <Calendar size={18} /> },
        { id: 'materials', label: 'Tài Liệu', icon: <FileText size={18} /> },
        { id: 'assignments', label: 'Bài Tập', icon: <CheckSquare size={18} /> },
        { id: 'profile', label: 'Hồ Sơ', icon: <UserCheck size={18} /> },
        { id: 'payment', label: 'Thanh Toán', icon: <CreditCard size={18} /> },
      ]
    : [
        { id: 'tutors', label: 'Tìm Gia Sư', icon: <Search size={18} /> },
        { id: 'classes', label: 'Lớp Học Của Tôi', icon: <GraduationCap size={18} /> },
        { id: 'materials', label: 'Tài Liệu', icon: <FileText size={18} /> },
        { id: 'assignments', label: 'Bài Tập', icon: <CheckSquare size={18} /> },
        { id: 'profile', label: 'Hồ Sơ', icon: <UserCheck size={18} /> },
      ];

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate(isTutor ? 'dashboard' : 'classes')} 
          style={{ cursor: 'pointer' }}
        >
          <TutoraLogo size="md" subtitleText="Dạy kèm & AI Note" />
        </div>

        {/* Role-based Nav Tabs */}
        {user && (
          <nav className="nav-links-wrap">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-tab-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* User Status / Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                  {user.fullName}
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <button 
                onClick={logout}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', gap: '6px' }}
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => onNavigate('login')} 
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Đăng nhập
              </button>
              <button 
                onClick={() => onNavigate('register')} 
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
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
