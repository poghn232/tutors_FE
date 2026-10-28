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
  Sparkles
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

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
        maxWidth: '720px',
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1.5px solid #2563eb',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.subjectName}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              border: '1.5px solid #0f172a',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.gradeLevel}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: post.teachingMode === 'ONLINE' ? '#faf5ff' : '#fef3c7',
              color: post.teachingMode === 'ONLINE' ? '#6d28d9' : '#b45309',
              border: `1.5px solid ${post.teachingMode === 'ONLINE' ? '#7c3aed' : '#d97706'}`,
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.teachingMode === 'ONLINE' ? 'Online' : (post.teachingMode === 'OFFLINE' ? 'Tại nhà' : 'Hybrid')}
            </span>
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

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 8px',
              lineHeight: 1.35
            }}>
              {post.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: '#64748b' }}>
              <span>Đăng bởi: <strong style={{ color: '#0f172a' }}>{post.creatorName || 'Phụ huynh'}</strong></span>
              <span>•</span>
              <span style={{ fontWeight: 700, color: '#0369a1' }}>{post.applicationsCount || 0} gia sư đã nộp đơn</span>
            </div>
          </div>

          {/* Key Parameters Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px'
          }}>
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: '2px 2px 0px #0f172a'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                Học phí dự kiến
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                {post.budgetAmount ? formatVND(post.budgetAmount) : 'Thỏa thuận'}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                  {post.budgetType === 'PER_MONTH' ? ' / tháng' : ' / buổi'}
                </span>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: '2px 2px 0px #0f172a'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                Thời lượng & Lịch học
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {post.sessionsPerWeek} buổi / tuần
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                {post.preferredSchedule || 'Linh hoạt theo thỏa thuận'}
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '14px',
              padding: '14px 16px',
              boxShadow: '2px 2px 0px #0f172a'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                Địa điểm tại Hà Nội
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {post.district ? `${post.district}, ` : ''}Hà Nội
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 600 }}>
                <ShieldCheck size={13} />
                <span>Bảo mật địa chỉ chi tiết</span>
              </div>
            </div>
          </div>

          {/* Student Status & Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {post.studentNotes && (
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '2px 2px 0px #0f172a'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={15} color="#2563eb" />
                  <span>Tình trạng học lực của học sinh</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                  {post.studentNotes}
                </div>
              </div>
            )}

            {post.requirements && (
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '2px 2px 0px #0f172a'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={15} color="#2563eb" />
                  <span>Yêu cầu đối với gia sư</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
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

          {/* Apply Section for Tutor */}
          {hasApplied ? (
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#f0fdf4',
              borderRadius: '14px',
              border: '1.5px solid #16a34a',
              boxShadow: '2px 2px 0px #16a34a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontSize: '0.9rem', fontWeight: 800 }}>
                <CheckCircle size={20} color="#16a34a" />
                <span>Bạn đã gửi đơn ứng tuyển cho bài đăng này.</span>
              </div>
              {post.myApplicationId && (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={submitting}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #0f172a',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Rút đơn
                </button>
              )}
            </div>
          ) : !user ? (
            <div style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #0f172a',
              boxShadow: '3px 3px 0px #0f172a',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.92rem', color: '#475569', margin: '0 0 14px', fontWeight: 600 }}>
                Đăng nhập tài khoản Gia sư để nộp hồ sơ ứng tuyển và kết nối với học viên này.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequireAuth) onRequireAuth('ứng tuyển nhận lớp');
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '2px solid #0f172a',
                  boxShadow: '3px 3px 0px #0f172a',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Đăng nhập để ứng tuyển
              </button>
            </div>
          ) : isTutor ? (
            <form onSubmit={handleApply} style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #0f172a',
              boxShadow: '3px 3px 0px #0f172a',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '1rem' }}>
                <Send size={18} color="#2563eb" />
                <span>Nộp đơn ứng tuyển nhận lớp</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
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
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Thư giới thiệu & Năng lực giảng dạy <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Chào quý phụ huynh, tôi tốt nghiệp Sư phạm và có kinh nghiệm giảng dạy môn này tại khu vực Hà Nội. Tôi có phương pháp trực quan giúp học sinh nắm vững kiến thức..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.88rem',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 26px',
                    backgroundColor: '#00e599',
                    color: '#000000',
                    border: '2px solid #000000',
                    boxShadow: '3px 3px 0px #000000',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
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
