import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Mail,
  Phone,
  ArrowRight,
  BookOpen,
  MapPin
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

export default function MyApplicationsView({ onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadMyApplications();
  }, []);

  const loadMyApplications = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await tutorPostService.getMyApplications();
      setApplications(res?.data || []);
    } catch (err) {
      console.error('Error loading my applications', err);
      setErrorMessage(err?.response?.data?.message || 'Không thể tải danh sách đơn ứng tuyển.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;
    try {
      setActionLoadingId(appId);
      const res = await tutorPostService.withdrawApplication(appId);
      if (res?.success) {
        await loadMyApplications();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Không thể rút đơn ứng tuyển.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1.5px solid #d97706' }}>
            ⏳ Chờ phụ huynh duyệt
          </span>
        );
      case 'ACCEPTED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', border: '1.5px solid #16a34a' }}>
            ✓ Trúng tuyển nhận lớp
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1.5px solid #ef4444' }}>
            ✕ Chưa được chọn
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', border: '1.5px solid #cbd5e1' }}>
            Đã rút hồ sơ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '16px 0 60px 0', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            border: '1.5px solid #7dd3fc',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '6px'
          }}>
            <MapPin size={13} /> GIA SƯ HÀ NỘI
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 6px'
          }}>
            Đơn Ứng Tuyển Nhận Lớp Của Tôi
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
            Theo dõi trạng thái các bài đăng tìm gia sư mà bạn đã nộp hồ sơ tại khu vực Hà Nội.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMyApplications}
          style={{
            height: '42px',
            padding: '0 16px',
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            boxShadow: '2px 2px 0px #0f172a',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 800,
            color: '#0f172a',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fca5a5',
          borderRadius: '12px',
          color: '#b91c1c',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div style={{
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#64748b',
          gap: '10px',
          background: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Loader2 size={22} className="animate-spin" />
          <span>Đang tải danh sách đơn ứng tuyển...</span>
        </div>
      ) : applications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #0f172a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <BookOpen size={44} color="#94a3b8" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Bạn chưa nộp đơn ứng tuyển nào
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
            Khám phá ngay Bảng Tin Lớp Cần Gia Sư để chọn lớp học phù hợp với chuyên môn của bạn tại Hà Nội.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('tutor-requests')}
            style={{
              padding: '10px 22px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '2px solid #0f172a',
              boxShadow: '3px 3px 0px #0f172a',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Duyệt bảng tin tìm lớp</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map(app => {
            const isPending = app.status === 'PENDING';
            const isAccepted = app.status === 'ACCEPTED';
            const isActioning = actionLoadingId === app.id;

            return (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: isAccepted ? '2px solid #16a34a' : '1.5px solid #0f172a',
                  padding: '22px 24px',
                  boxShadow: '3px 3px 0px #0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {app.postTitle}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem',
                  color: '#334155',
                  lineHeight: 1.6
                }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    Thư giới thiệu đã gửi:
                  </div>
                  {app.coverLetter}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: '#475569',
                  borderTop: '1.5px solid #f1f5f9',
                  paddingTop: '12px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 900, color: '#0f172a' }}>
                      Đề xuất: {app.proposedRate ? formatVND(app.proposedRate) + '/buổi' : 'Theo thỏa thuận'}
                    </span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span>Nộp ngày: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id)}
                        disabled={isActioning}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #0f172a',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: isActioning ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isActioning ? 'Đang rút...' : 'Rút đơn'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
