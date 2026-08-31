import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, FileText, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();

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
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Xin chào, {user.fullName}!</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Tài khoản: <strong>{user.email}</strong> • Vai trò: <span className="badge badge-tutor" style={{ textTransform: 'none' }}>{getRoleLabel(user.role)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Security / Auth Status */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldCheck style={{ color: '#10b981' }} size={22} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Xác thực & Bảo mật</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Tài khoản đã được bảo mật với mật khẩu mã hóa BCrypt và phiên đăng nhập JWT hợp lệ.
          </p>
          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Mật khẩu đăng nhập đã mã hóa
          </div>
        </div>

        {/* Core Feature Quick Access */}
        {user.role === 'TUTOR' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <FileText style={{ color: '#2563eb' }} size={22} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Quản lý Buổi học & AI Note</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Nhập ghi chú sau buổi học để AI Note tự động chuẩn hóa và gửi báo cáo rõ ràng cho phụ huynh.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: '16px', width: '100%', fontSize: '0.85rem' }}>
              Tạo ghi chú buổi học mới
            </button>
          </div>
        )}

        {user.role === 'PARENT' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Calendar style={{ color: '#059669' }} size={22} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Tiến độ Học tập của Con</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Xem tóm tắt nội dung bài học và nhận xét tiến độ từ Gia sư được tổng hợp bởi AI Note.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: '16px', width: '100%', fontSize: '0.85rem' }}>
              Xem báo cáo buổi học gần nhất
            </button>
          </div>
        )}

        {user.role === 'STUDENT' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <FileText style={{ color: '#d97706' }} size={22} />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Ghi nhớ Bài giảng</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Theo dõi các kiến thức trọng tâm đã học và hướng dẫn ôn tập từ Gia sư.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: '16px', width: '100%', fontSize: '0.85rem' }}>
              Xem nhật ký bài học
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
