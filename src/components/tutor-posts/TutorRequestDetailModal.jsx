import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  Loader2,
  GraduationCap,
  Info,
  Clock,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

export default function TutorRequestDetailModal({ isOpen, post, onClose, user, onRequireAuth, onApplicationSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedRate, setProposedRate] = useState(() => post?.budgetAmount || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen || !post) return null;

  const isTutor = user?.role === 'TUTOR';
  const hasApplied = post.hasApplied;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      if (onRequireAuth) onRequireAuth('ứng tuyển bài đăng tìm gia sư');
      return;
    }
    if (!isTutor) {
      setErrorMessage('Chỉ tài khoản Gia sư mới có quyền nộp đơn ứng tuyển nhận lớp.');
      return;
    }
    if (!coverLetter.trim()) {
      setErrorMessage('Vui lòng viết đôi lời giới thiệu về năng lực và kinh nghiệm của bạn.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const res = await tutorPostService.applyToPost(post.id, {
        coverLetter: coverLetter.trim(),
        proposedRate: proposedRate ? Number(proposedRate) : post.budgetAmount
      });
      if (res?.success) {
        setSuccessMessage('Nộp đơn ứng tuyển thành công! Phụ huynh sẽ xem hồ sơ và liên hệ với bạn sớm.');
        if (onApplicationSuccess) onApplicationSuccess();
      } else {
        setErrorMessage(res?.message || 'Không thể gửi đơn ứng tuyển.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi nộp đơn.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!post.myApplicationId) return;
    if (!window.confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;

    try {
      setSubmitting(true);
      const res = await tutorPostService.withdrawApplication(post.myApplicationId);
      if (res?.success) {
        setSuccessMessage('Đã rút đơn ứng tuyển thành công.');
        if (onApplicationSuccess) onApplicationSuccess();
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Không thể rút đơn ứng tuyển.');
    } finally {
      setSubmitting(false);
    }
  };

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
        maxWidth: '780px',
        maxHeight: '90vh',
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {post.subjectName}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {post.gradeLevel}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: post.teachingMode === 'ONLINE' ? '#f3e8ff' : '#fef3c7',
              color: post.teachingMode === 'ONLINE' ? '#7e22ce' : '#b45309',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {post.teachingMode === 'ONLINE' ? 'Online' : (post.teachingMode === 'OFFLINE' ? 'Tại nhà' : 'Hybrid')}
            </span>
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

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>
              {post.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b' }}>
              <span>Đăng bởi: <strong>{post.creatorName || 'Phụ huynh'}</strong></span>
              <span>•</span>
              <span>{post.applicationsCount || 0} gia sư đã nộp hồ sơ</span>
            </div>
          </div>

          {/* Key Parameters Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Học phí dự kiến</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>
                {post.budgetAmount ? `${Number(post.budgetAmount).toLocaleString('vi-VN')} đ` : 'Thỏa thuận'}
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}> /buổi</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Thời lượng & Lịch học</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {post.sessionsPerWeek} buổi/tuần
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                {post.preferredSchedule || 'Linh hoạt theo thỏa thuận'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>Khu vực</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {post.district ? `${post.district}, ` : ''}{post.city || 'Toàn quốc'}
              </div>
              <div style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <ShieldCheck size={13} />
                <span>Số nhà & SĐT bảo mật</span>
              </div>
            </div>
          </div>

          {/* Student Status & Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {post.studentNotes && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={16} color="#2563eb" />
                  <span>Tình trạng học lực của học sinh</span>
                </h4>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.6
                }}>
                  {post.studentNotes}
                </div>
              </div>
            )}

            {post.requirements && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} color="#2563eb" />
                  <span>Yêu cầu đối với gia sư</span>
                </h4>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.6
                }}>
                  {post.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
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

          {/* Apply Section for Tutor */}
          {hasApplied ? (
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontSize: '14px', fontWeight: 600 }}>
                <CheckCircle size={20} color="#16a34a" />
                <span>Bạn đã gửi đơn ứng tuyển cho bài đăng này.</span>
              </div>
              {post.myApplicationId && (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={submitting}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Rút đơn
                </button>
              )}
            </div>
          ) : !user ? (
            <div style={{
              padding: '18px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 12px' }}>
                Đăng nhập tài khoản Gia sư để nộp hồ sơ ứng tuyển và kết nối với học viên này.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequireAuth) onRequireAuth('ứng tuyển nhận lớp');
                }}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Đăng nhập để ứng tuyển
              </button>
            </div>
          ) : isTutor ? (
            <form onSubmit={handleApply} style={{
              padding: '20px',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 700, fontSize: '15px' }}>
                <Send size={18} />
                <span>Nộp đơn ứng tuyển lớp này</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Học phí đề xuất của bạn (VNĐ/buổi)
                </label>
                <input
                  type="number"
                  step="10000"
                  min="50000"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  placeholder="VD: 250000"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #93c5fd',
                    fontSize: '14px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Thư giới thiệu & Năng lực giảng dạy <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Chào quý phụ huynh, tôi tốt nghiệp Sư phạm với 4 năm kinh nghiệm dạy môn này. Tôi có phương pháp trực quan giúp học sinh nắm vững kiến thức..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #93c5fd',
                    fontSize: '13px',
                    backgroundColor: '#ffffff',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Đang gửi đơn...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Gửi đơn ứng tuyển</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
