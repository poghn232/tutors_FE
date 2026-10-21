import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Phone, 
  CreditCard,
  Gift,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import userService from '../services/userService';
import voucherService from '../services/voucherService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  // Gift modal
  const [giftModalUser, setGiftModalUser] = useState(null);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftError, setGiftError] = useState('');

  const loadUsersAndVouchers = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersRes, vouchersRes] = await Promise.allSettled([
        userService.getAllUsersForAdmin(),
        voucherService.getAllVouchersForAdmin()
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
        setUsers(usersRes.value.data || []);
      }
      if (vouchersRes.status === 'fulfilled' && vouchersRes.value?.success) {
        setVouchers(vouchersRes.value.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndVouchers();
  }, []);

  const handleSendVoucher = async (e) => {
    e.preventDefault();
    if (!selectedVoucherCode) {
      setGiftError('Vui lòng chọn mã voucher để tặng.');
      return;
    }
    try {
      setGiftLoading(true);
      setGiftError('');
      const res = await voucherService.issueVoucherToUser(giftModalUser.id, selectedVoucherCode);
      if (res?.success) {
        setSuccessMessage(`Đã tặng voucher ${selectedVoucherCode} cho người dùng ${giftModalUser.fullName || giftModalUser.email} thành công!`);
        setTimeout(() => setSuccessMessage(''), 4000);
        setGiftModalUser(null);
        setSelectedVoucherCode('');
      } else {
        setGiftError(res?.message || 'Không thể phát voucher.');
      }
    } catch (err) {
      setGiftError(err.response?.data?.message || 'Không thể phát voucher cho tài khoản này.');
    } finally {
      setGiftLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'ALL' && u.role !== filterRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (u.fullName || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  const totalUsers = users.length;
  const parentCount = users.filter(u => u.role === 'PARENT').length;
  const tutorCount = users.filter(u => u.role === 'TUTOR').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>Admin</span>;
      case 'TUTOR':
        return <span style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>Gia sư</span>;
      case 'PARENT':
        return <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>Phụ huynh</span>;
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Users size={16} /> Quản Trị Thành Viên
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'serif' }}>
            Quản Lý Danh Sách Người Dùng
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Tra cứu thông tin tài khoản phụ huynh, gia sư, theo dõi số dư ví và phát voucher ưu đãi trực tiếp.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsersAndVouchers}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            border: '2px solid #0f172a',
            backgroundColor: '#ffffff',
            boxShadow: '2px 2px 0px #0f172a',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {successMessage && (
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          color: '#991b1b',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          fontWeight: 700
        }}>
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#fff', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>TỔNG TÀI KHOẢN</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{totalUsers}</div>
        </div>

        <div style={{ background: '#eff6ff', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>PHỤ HUYNH</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', marginTop: '2px' }}>{parentCount}</div>
        </div>

        <div style={{ background: '#ecfdf5', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }}>GIA SƯ</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>{tutorCount}</div>
        </div>

        <div style={{ background: '#fef2f2', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b91c1c' }}>QUẢN TRỊ VIÊN</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#991b1b', marginTop: '2px' }}>{adminCount}</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #0f172a',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '2px 2px 0px #0f172a',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 14px 0 42px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'PARENT', label: 'Phụ huynh' },
            { id: 'TUTOR', label: 'Gia sư' },
            { id: 'ADMIN', label: 'Quản trị viên' }
          ].map((item) => {
            const isSel = filterRole === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterRole(item.id)}
                style={{
                  border: '1.5px solid #0f172a',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? 800 : 600,
                  backgroundColor: isSel ? '#0f172a' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Đang tải danh sách người dùng...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '16px', color: '#64748b' }}>
          Không tìm thấy tài khoản người dùng nào.
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: '18px',
          boxShadow: '3px 3px 0px #0f172a',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #0f172a', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Họ và tên</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Số điện thoại</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Vai trò</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Số dư ví</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Ngày tham gia</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr 
                  key={u.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                    #{u.id}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {u.fullName || 'Chưa cập nhật'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.88rem', color: '#475569' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.88rem', color: '#475569' }}>
                    {u.phone || 'Chưa có'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {getRoleBadge(u.role)}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                    {formatVND(u.balance || 0)}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: '#64748b' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setGiftModalUser(u);
                        setSelectedVoucherCode(vouchers.length > 0 ? vouchers[0].code : '');
                        setGiftError('');
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #0f172a',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Tặng voucher cho tài khoản này"
                    >
                      <Gift size={14} /> Tặng voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gift Voucher Modal */}
      {giftModalUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '24px',
            boxShadow: '6px 6px 0px #0f172a',
            maxWidth: '500px',
            width: '100%',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                  Phát Quà Tặng
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
                  Tặng Voucher Cho Người Dùng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGiftModalUser(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tài khoản nhận:</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                {giftModalUser.fullName || giftModalUser.email}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Email: {giftModalUser.email} · ID #{giftModalUser.id}
              </div>
            </div>

            {giftError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '16px'
              }}>
                {giftError}
              </div>
            )}

            <form onSubmit={handleSendVoucher} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  CHỌN MÃ VOUCHER *
                </label>
                <select
                  required
                  value={selectedVoucherCode}
                  onChange={(e) => setSelectedVoucherCode(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="">-- Chọn mã voucher --</option>
                  {vouchers.map((v) => (
                    <option key={v.id} value={v.code}>
                      {v.code} - {v.name} ({v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatVND(v.discountValue)})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setGiftModalUser(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    background: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={giftLoading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    boxShadow: '2px 2px 0px #0f172a',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} /> {giftLoading ? 'Đang gửi...' : 'Tặng Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
