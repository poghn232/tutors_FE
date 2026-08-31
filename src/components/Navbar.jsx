import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, BookOpen } from 'lucide-react';

export default function Navbar({ onNavigate }) {
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

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>GiaSuHQ</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '-2px' }}>
              Quản lý Dạy kèm & AI Note
            </span>
          </div>
        </div>

        {/* User Status / Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>{user.fullName}</div>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <button 
                onClick={logout}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', gap: '6px' }}
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
