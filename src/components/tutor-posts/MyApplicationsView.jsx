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
  BookOpen
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

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
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#b45309' }}>
            ⏳ Chờ phụ huynh duyệt
          </span>
        );
      case 'ACCEPTED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>
            ✓ Trúng tuyển lớp
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            ✕ Chưa được chọn
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#64748b' }}>
            Đã rút hồ sơ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px 0', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Đơn Ứng Tuyển Nhận Lớp Của Tôi
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Theo dõi trạng thái các bài đăng tìm gia sư mà bạn đã nộp hồ sơ
          </p>
        </div>

        <button
          onClick={loadMyApplications}
          style={{
            padding: '8px 14px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} />
          <span>Làm mới</span>
        </button>
      </div>

      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#b91c1c',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#64748b', gap: '10px' }}>
          <Loader2 size={24} className="spin" />
          <span>Đang tải danh sách đơn ứng tuyển...</span>
        </div>
      ) : applications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
            Bạn chưa nộp đơn ứng tuyển nào
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
            Khám phá ngay Bảng Tin Tìm Lớp để chọn lớp học phù hợp với chuyên môn và thời gian của bạn.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('tutor-requests')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {applications.map(app => {
            const isPending = app.status === 'PENDING';
            const isAccepted = app.status === 'ACCEPTED';
            const isActioning = actionLoadingId === app.id;

            return (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: isAccepted ? '2px solid #10b981' : '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {app.postTitle}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{
                  padding: '12px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#334155',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 600, color: '#64748b', marginBottom: '2px' }}>
                    Thư giới thiệu đã gửi:
                  </div>
                  {app.coverLetter}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#475569',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '10px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#2563eb' }}>
                      Đề xuất: {app.proposedRate ? `${Number(app.proposedRate).toLocaleString('vi-VN')} đ/buổi` : 'Theo thỏa thuận'}
                    </span>
                    <span style={{ color: '#94a3b8' }}>•</span>
                    <span>Nộp lúc: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isPending && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        disabled={isActioning}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#64748b',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isActioning ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isActioning ? 'Đang xử lý...' : 'Rút đơn'}
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => onNavigate && onNavigate('classes')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Vào lớp học ngay</span>
                        <ArrowRight size={14} />
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
