import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  Calendar,
  CreditCard,
  User,
  ExternalLink
} from 'lucide-react';
import { classService } from '../services/classService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await classService.getClasses();
      if (res && res.data) {
        setClasses(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách lớp học toàn hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Đang học</span>;
      case 'PENDING_TUTOR_APPROVAL':
        return <span style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Chờ gia sư nhận</span>;
      case 'PENDING_PAYMENT':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Chờ thanh toán phí</span>;
      case 'COMPLETED':
        return <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Đã hoàn thành</span>;
      case 'DECLINED':
        return <span style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Gia sư từ chối</span>;
      case 'CANCELLED':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>Đã hủy</span>;
      default:
        return <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>{status}</span>;
    }
  };

  const filteredClasses = classes.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchStudent = (c.studentName || '').toLowerCase().includes(q);
      const matchTutor = (c.tutorName || '').toLowerCase().includes(q);
      const matchParent = (c.parentName || '').toLowerCase().includes(q);
      const matchSubject = (c.subjectName || '').toLowerCase().includes(q);
      return matchStudent || matchTutor || matchParent || matchSubject;
    }
    return true;
  });

  const totalCount = classes.length;
  const activeCount = classes.filter(c => c.status === 'ACTIVE').length;
  const pendingTutorCount = classes.filter(c => c.status === 'PENDING_TUTOR_APPROVAL').length;
  const pendingPaymentCount = classes.filter(c => c.status === 'PENDING_PAYMENT').length;

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
            <BookOpen size={16} /> Quản Lý Đào Tạo
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'serif' }}>
            Tất Cả Lớp Học & Yêu Cầu Kết Nối
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Giám sát danh sách lớp học toàn hệ thống, theo dõi tiến độ gia sư nhận lớp và tình trạng thanh toán phí kết nối.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchClasses}
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

      {/* Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#fff', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>TỔNG LỚP HỌC</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{totalCount}</div>
        </div>

        <div style={{ background: '#ecfdf5', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }}>ĐANG HỌC (ACTIVE)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46', marginTop: '2px' }}>{activeCount}</div>
        </div>

        <div style={{ background: '#fffbeb', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309' }}>CHỜ GIA SƯ DUYỆT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#92400e', marginTop: '2px' }}>{pendingTutorCount}</div>
        </div>

        <div style={{ background: '#eff6ff', border: '2px solid #0f172a', borderRadius: '16px', padding: '16px 20px', boxShadow: '3px 3px 0px #0f172a' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8' }}>CHỜ THANH TOÁN</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', marginTop: '2px' }}>{pendingPaymentCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
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
            placeholder="Tìm theo học sinh, gia sư, phụ huynh, môn học..."
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
            { id: 'ACTIVE', label: 'Đang học' },
            { id: 'PENDING_TUTOR_APPROVAL', label: 'Chờ gia sư nhận' },
            { id: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
            { id: 'DECLINED', label: 'Đã từ chối' }
          ].map((item) => {
            const isSel = filterStatus === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterStatus(item.id)}
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

      {/* Classes Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Đang tải danh sách lớp học...
        </div>
      ) : filteredClasses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '16px', color: '#64748b' }}>
          Không tìm thấy lớp học nào phù hợp với bộ lọc hiện tại.
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
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>ID Lớp</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Học sinh & Môn</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Gia sư phụ trách</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Phụ huynh</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Học phí / Buổi</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Phí kết nối</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Trạng thái</th>
                <th style={{ padding: '14px 18px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls, idx) => (
                <tr 
                  key={cls.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                    #{cls.id}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {cls.studentName || 'Chưa đặt tên'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>
                      {cls.subjectName || 'Gia sư chuyên môn'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {cls.tutorName || 'Chưa phân công'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {cls.tutorPhone || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {cls.parentName || 'Phụ huynh'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {cls.parentPhone || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                    {cls.hourlyRate ? formatVND(cls.hourlyRate) : 'Thỏa thuận'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: cls.paidAt ? '#047857' : '#b45309', fontSize: '0.85rem' }}>
                      {cls.paidAt ? 'Đã thu: 5.000đ' : 'Chưa thu'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {getStatusBadge(cls.status)}
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: '#64748b' }}>
                    {cls.createdAt ? new Date(cls.createdAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
