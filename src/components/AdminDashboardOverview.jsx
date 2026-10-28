import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  TicketPercent, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';
import { tutorService } from '../services/tutorService';
import { classService } from '../services/classService';
import userService from '../services/userService';
import voucherService from '../services/voucherService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminDashboardOverview({ onNavigate }) {
  const [tutors, setTutors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tutorsRes, classesRes, usersRes, vouchersRes] = await Promise.allSettled([
        tutorService.getAdminTutors(),
        classService.getClasses(),
        userService.getAllUsersForAdmin(),
        voucherService.getAllVouchersForAdmin()
      ]);

      if (tutorsRes.status === 'fulfilled' && tutorsRes.value?.data) {
        setTutors(tutorsRes.value.data);
      }
      if (classesRes.status === 'fulfilled' && classesRes.value?.data) {
        setClasses(classesRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (vouchersRes.status === 'fulfilled' && vouchersRes.value?.data) {
        setVouchers(vouchersRes.value.data);
      }
    } catch (err) {
      setError('Không thể tải toàn bộ số liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute stats
  const pendingTutors = tutors.filter(t => (t.verificationStatus || 'PENDING') === 'PENDING');
  const approvedTutors = tutors.filter(t => t.verificationStatus === 'APPROVED');
  const activeClasses = classes.filter(c => c.status === 'ACTIVE');
  const pendingApprovalClasses = classes.filter(c => c.status === 'PENDING_TUTOR_APPROVAL');
  const activeVouchers = vouchers.filter(v => v.active);

  // Revenue from connection fees
  const totalConnectionFees = classes
    .filter(c => c.paidAt || (c.paidAmount && Number(c.paidAmount) > 0))
    .reduce((sum, c) => sum + Number(c.paidAmount || 5000), 0);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Hero Welcome Card */}
      <div style={{
        backgroundColor: '#181b2a',
        border: '2px solid #0f172a',
        borderRadius: '24px',
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '4px 4px 0px #0f172a',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{
          position: 'absolute',
          right: '260px',
          top: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 214, 0, 0.15)',
            border: '1px solid #ffd600',
            color: '#ffd600',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            fontWeight: 900,
            marginBottom: '10px'
          }}>
            <Sparkles size={14} /> TRUNG TÂM ĐIỀU HÀNH TUTORA
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 6px 0', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Tổng Quan Hệ Thống Quản Trị
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '640px', lineHeight: 1.5 }}>
            Theo dõi tình trạng vận hành nền tảng theo thời gian thực: xét duyệt hồ sơ gia sư, giám sát lớp học, điều phối tài khoản và phát hành các chương trình khuyến mãi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', zIndex: 1 }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '2px solid #0f172a',
              boxShadow: '2px 2px 0px #0f172a',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Đang cập nhật...' : 'Cập nhật số liệu'}
          </button>
        </div>
      </div>

      {/* Alert if pending tutors waiting */}
      {pendingTutors.length > 0 && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: '3px 3px 0px #0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#92400e' }}>
                Có {pendingTutors.length} hồ sơ gia sư đang chờ duyệt bằng cấp
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: '#b45309' }}>
                Các gia sư đã tải lên chứng chỉ và thông tin giảng dạy, cần Ban quản trị kiểm tra trước khi hiển thị công khai.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tutors')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#92400e',
              border: '2px solid #0f172a',
              boxShadow: '2px 2px 0px #0f172a',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Duyệt hồ sơ ngay <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* 4 Core KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Users */}
        <div 
          onClick={() => onNavigate('users')}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: '4px 4px 0px #0f172a',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Người dùng hệ thống
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Phụ huynh: <b>{users.filter(u => u.role === 'PARENT').length}</b></span>
            <span>Gia sư: <b>{users.filter(u => u.role === 'TUTOR').length}</b></span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.82rem', fontWeight: 800, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xem danh sách người dùng →
          </div>
        </div>

        {/* Card 2: Tutor Verification */}
        <div 
          onClick={() => onNavigate('tutors')}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: '4px 4px 0px #0f172a',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Duyệt hồ sơ gia sư
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>
            {approvedTutors.length} / {tutors.length}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Đã duyệt: <b>{approvedTutors.length}</b></span>
            <span style={{ color: pendingTutors.length > 0 ? '#d97706' : '#64748b' }}>
              Chờ duyệt: <b>{pendingTutors.length}</b>
            </span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.82rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Quản lý hồ sơ gia sư →
          </div>
        </div>

        {/* Card 3: Classes / Bookings */}
        <div 
          onClick={() => onNavigate('classes')}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: '4px 4px 0px #0f172a',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Lớp học & Yêu cầu
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
            {classes.length}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Đang học: <b>{activeClasses.length}</b></span>
            <span>Chờ gia sư: <b>{pendingApprovalClasses.length}</b></span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.82rem', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xem danh sách lớp học →
          </div>
        </div>

        {/* Card 4: Promotions / Vouchers */}
        <div 
          onClick={() => onNavigate('promotions')}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: '4px 4px 0px #0f172a',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Khuyến mãi & Voucher
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TicketPercent size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ea580c' }}>
            {activeVouchers.length} <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>/ {vouchers.length}</span>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Đang chạy: <b>{activeVouchers.length}</b></span>
            <span>Phí kết nối: <b>{formatVND(totalConnectionFees)}</b></span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.82rem', fontWeight: 800, color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Quản lý & tạo khuyến mãi →
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Recent Bookings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Recent Classes */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Lớp học mới kết nối gần đây
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                5 lớp học được đăng ký mới nhất trên nền tảng
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('classes')}
              style={{
                border: 'none',
                background: 'none',
                color: '#7c3aed',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Xem tất cả →
            </button>
          </div>

          {classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
              Chưa có lớp học nào trong hệ thống.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {classes.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {c.studentName ? `Học sinh: ${c.studentName}` : `Lớp #${c.id}`} · {c.subjectName || 'Gia sư'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Gia sư: <b>{c.tutorName || 'Chưa nhận'}</b> · Phụ huynh: {c.parentName || 'Hệ thống'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: c.status === 'ACTIVE' ? '#ecfdf5' : '#fffbeb',
                      color: c.status === 'ACTIVE' ? '#047857' : '#b45309',
                      border: `1px solid ${c.status === 'ACTIVE' ? '#a7f3d0' : '#fde68a'}`,
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      {c.status === 'ACTIVE' ? 'Đang học' : c.status === 'PENDING_TUTOR_APPROVAL' ? 'Chờ gia sư nhận' : c.status}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Shortcuts & Actions */}
        <div style={{ display: 'grid', gap: '20px' }}>
          
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '3px 3px 0px #0f172a'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0' }}>
              Thao Tác Nhanh
            </h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onNavigate('promotions')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  boxShadow: '2px 2px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} /> Tạo khuyến mãi mới
                </span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('tutors')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  boxShadow: '2px 2px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#059669" /> Duyệt hồ sơ gia sư ({pendingTutors.length})
                </span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('classes')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  boxShadow: '2px 2px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="#7c3aed" /> Quản lý tất cả lớp học ({classes.length})
                </span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('users')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  boxShadow: '2px 2px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="#2563eb" /> Xem danh sách người dùng ({users.length})
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
