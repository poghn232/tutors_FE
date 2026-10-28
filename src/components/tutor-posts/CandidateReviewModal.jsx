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

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

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
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '2.5px solid #0f172a',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '8px 8px 0px #0f172a',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '2px solid #0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          zIndex: 10
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0
            }}>
              Danh Sách Gia Sư Ứng Tuyển
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '4px 0 0' }}>
              Bài đăng: <strong style={{ color: '#0f172a' }}>{post.title}</strong>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #0f172a',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
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
              border: '1.5px solid #fca5a5',
              borderRadius: '12px',
              color: '#b91c1c',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: '12px',
              color: '#047857',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div style={{
              minHeight: '180px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#64748b',
              gap: '10px'
            }}>
              <Loader2 size={22} className="animate-spin" />
              <span>Đang tải danh sách hồ sơ ứng viên...</span>
            </div>
          ) : applications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1.5px dashed #cbd5e1'
            }}>
              <User size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Chưa có gia sư nào nộp đơn
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', margin: '0 auto' }}>
                Bài đăng của bạn đang hiển thị công khai trên Bảng Tin tại Hà Nội. Các gia sư phù hợp sẽ nộp hồ sơ sớm.
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
                      padding: '20px 22px',
                      borderRadius: '16px',
                      border: isAccepted ? '2px solid #16a34a' : '1.5px solid #0f172a',
                      backgroundColor: isAccepted ? '#f0fdf4' : '#ffffff',
                      boxShadow: '3px 3px 0px #0f172a',
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
                          borderRadius: '12px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.15rem',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1.5px solid #0f172a'
                        }}>
                          {app.tutorAvatar ? (
                            <img src={app.tutorAvatar} alt={app.tutorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            app.tutorName?.charAt(0) || 'G'
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                              {app.tutorName}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                              <Star size={14} fill="#f59e0b" />
                              <span>{app.tutorRating || 5.0}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.82rem', color: '#64748b' }}>
                            {app.tutorQualification && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Award size={13} color="#2563eb" />
                                {app.tutorQualification}
                              </span>
                            )}
                            {app.tutorExperienceYears && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={13} color="#2563eb" />
                                {app.tutorExperienceYears} năm kinh nghiệm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge & Proposed Rate */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                          {app.proposedRate ? formatVND(app.proposedRate) : 'Theo thỏa thuận'}
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}> /buổi</span>
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          {isAccepted && (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', border: '1.5px solid #16a34a' }}>
                              ✓ ĐÃ CHỌN GIA SƯ
                            </span>
                          )}
                          {isRejected && (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1.5px solid #ef4444' }}>
                              Đã từ chối
                            </span>
                          )}
                          {isPending && (
                            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1.5px solid #d97706' }}>
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
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '0.86rem',
                        color: '#334155',
                        lineHeight: 1.55
                      }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                          <MessageSquare size={13} color="#2563eb" />
                          <span>Lời chào & Năng lực giảng dạy:</span>
                        </div>
                        {app.coverLetter}
                      </div>
                    )}

                    {/* Unlocked Contact Info for Accepted Tutor */}
                    {isAccepted && (
                      <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#ecfdf5',
                        borderRadius: '10px',
                        border: '1.5px solid #86efac',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        fontSize: '0.88rem',
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
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          disabled={isActioning}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid #ef4444',
                            backgroundColor: '#ffffff',
                            color: '#ef4444',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            cursor: isActioning ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
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
                            borderRadius: '10px',
                            border: '2px solid #000000',
                            backgroundColor: '#00e599',
                            color: '#000000',
                            boxShadow: '2px 2px 0px #000000',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            cursor: isActioning ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isActioning ? (
                            <Loader2 size={15} className="animate-spin" />
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
