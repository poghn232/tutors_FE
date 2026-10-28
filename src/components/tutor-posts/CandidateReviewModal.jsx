import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Star, 
  Award, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

export default function CandidateReviewModal({ isOpen, post, onClose, onPostUpdated }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !post) return;
    setErrorMessage('');
    setSuccessMessage('');
    loadApplications();
  }, [isOpen, post]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await tutorPostService.getApplicationsForPost(post.id);
      setApplications(res?.data || []);
    } catch (err) {
      console.error('Error fetching applications', err);
      setErrorMessage(err?.response?.data?.message || 'Không thể tải danh sách ứng viên.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  const handleAccept = async (appId) => {
    if (!window.confirm('Bạn có chắc chắn muốn chọn gia sư này cho lớp học? Các ứng viên khác sẽ tự động được thông báo từ chối.')) {
      return;
    }
    try {
      setActionLoadingId(appId);
      setErrorMessage('');
      const res = await tutorPostService.acceptApplication(post.id, appId);
      if (res?.success) {
        setSuccessMessage('Tuyệt vời! Bạn đã chọn gia sư thành công. Hệ thống đã khởi tạo lớp học cho bạn.');
        await loadApplications();
        if (onPostUpdated) onPostUpdated();
      } else {
        setErrorMessage(res?.message || 'Không thể chọn gia sư.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi duyệt gia sư.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (appId) => {
    const note = window.prompt('Nhập lý do từ chối (tùy chọn):', 'Rất tiếc hồ sơ chưa phù hợp với lịch học mong muốn của gia đình.');
    if (note === null) return;

    try {
      setActionLoadingId(appId);
      setErrorMessage('');
      const res = await tutorPostService.rejectApplication(post.id, appId, note);
      if (res?.success) {
        await loadApplications();
        if (onPostUpdated) onPostUpdated();
      } else {
        setErrorMessage(res?.message || 'Không thể từ chối hồ sơ.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Có lỗi xảy ra khi từ chối hồ sơ.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const isPostOpen = post.status === 'OPEN';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Danh sách gia sư ứng tuyển
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
              Bài đăng: <strong>{post.title}</strong>
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              color: '#047857',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#64748b', gap: '10px' }}>
              <Loader2 size={24} className="spin" />
              <span>Đang tải danh sách ứng viên...</span>
            </div>
          ) : applications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1'
            }}>
              <User size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: '0 0 6px' }}>
                Chưa có gia sư nào ứng tuyển
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto' }}>
                Bài đăng của bạn đang được hiển thị trên bảng tin công khai. Các gia sư phù hợp sẽ xem và nộp hồ sơ sớm.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map((app) => {
                const isAccepted = app.status === 'ACCEPTED';
                const isRejected = app.status === 'REJECTED';
                const isPending = app.status === 'PENDING';
                const isActioning = actionLoadingId === app.id;

                return (
                  <div 
                    key={app.id}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: isAccepted ? '2px solid #10b981' : '1px solid #e2e8f0',
                      backgroundColor: isAccepted ? '#f0fdf4' : '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    {/* Top Row: Tutor info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          backgroundColor: '#e0e7ff',
                          color: '#4338ca',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '18px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          {app.tutorAvatar ? (
                            <img src={app.tutorAvatar} alt={app.tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            app.tutorName?.charAt(0) || 'G'
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                              {app.tutorName}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '13px', fontWeight: 600 }}>
                              <Star size={14} fill="#f59e0b" />
                              <span>{app.tutorRating || 5.0}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>
                            {app.tutorQualification && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Award size={13} />
                                {app.tutorQualification}
                              </span>
                            )}
                            {app.tutorExperienceYears && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={13} />
                                {app.tutorExperienceYears} năm kinh nghiệm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge & Proposed Rate */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>
                          {app.proposedRate ? `${Number(app.proposedRate).toLocaleString('vi-VN')} đ` : 'Theo thỏa thuận'}
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}> /buổi</span>
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          {isAccepted && (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>
                              ✓ ĐÃ CHỌN GIA SƯ
                            </span>
                          )}
                          {isRejected && (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                              Đã từ chối
                            </span>
                          )}
                          {isPending && (
                            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#b45309' }}>
                              Chờ phản hồi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <div style={{
                        padding: '12px 14px',
                        backgroundColor: isAccepted ? '#ffffff' : '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                        color: '#334155',
                        lineHeight: 1.5
                      }}>
                        <div style={{ fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MessageSquare size={13} />
                          <span>Lời chào & Năng lực giảng dạy:</span>
                        </div>
                        {app.coverLetter}
                      </div>
                    )}

                    {/* Unlocked Contact Info for Accepted Tutor */}
                    {isAccepted && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#d1fae5',
                        borderRadius: '8px',
                        border: '1px solid #86efac',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        fontSize: '13px',
                        color: '#065f46'
                      }}>
                        {app.tutorPhone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={15} />
                            <strong>SĐT: {app.tutorPhone}</strong>
                          </div>
                        )}
                        {app.tutorEmail && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={15} />
                            <strong>Email: {app.tutorEmail}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions if pending */}
                    {isPending && isPostOpen && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          disabled={isActioning}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#64748b',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: isActioning ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <XCircle size={15} />
                          <span>Từ chối</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAccept(app.id)}
                          disabled={isActioning}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isActioning ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          {isActioning ? (
                            <Loader2 size={15} className="spin" />
                          ) : (
                            <CheckCircle size={15} />
                          )}
                          <span>Chấp nhận gia sư</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
