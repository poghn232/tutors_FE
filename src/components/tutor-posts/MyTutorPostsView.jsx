import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  Eye,
  XCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';
import CreateTutorPostModal from './CreateTutorPostModal';
import CandidateReviewModal from './CandidateReviewModal';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

export default function MyTutorPostsView({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, OPEN, PENDING_APPROVAL, MATCHED, CLOSED
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reviewingPost, setReviewingPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await tutorPostService.getMyPosts();
      setPosts(res?.data || []);
    } catch (err) {
      console.error('Error loading my posts', err);
      setErrorMessage(err?.response?.data?.message || 'Không thể tải danh sách bài đăng.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn đóng bài đăng này? Sau khi đóng bài sẽ không nhận thêm hồ sơ gia sư mới.')) {
      return;
    }
    try {
      const res = await tutorPostService.closePost(postId);
      if (res?.success) {
        loadMyPosts();
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Không thể đóng bài đăng.');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'ALL') return true;
    return p.status === activeFilter;
  });

  const getStatusBadge = (status, reason) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1.5px solid #d97706' }}>
            ⏳ Chờ duyệt
          </span>
        );
      case 'OPEN':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', border: '1.5px solid #16a34a' }}>
            🟢 Đang nhận gia sư
          </span>
        );
      case 'MATCHED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#dbeafe', color: '#1d4ed8', border: '1.5px solid #2563eb' }}>
            ✓ Đã ghép lớp
          </span>
        );
      case 'REJECTED':
        return (
          <span title={reason || 'Không đạt chuẩn kiểm duyệt'} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1.5px solid #ef4444' }}>
            ✕ Bị từ chối
          </span>
        );
      case 'CLOSED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', border: '1.5px solid #cbd5e1' }}>
            Đã đóng
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '16px 0 60px 0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
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
            <MapPin size={13} /> KHU VỰC HÀ NỘI
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 6px'
          }}>
            Bài Đăng Tìm Gia Sư Của Tôi
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
            Quản lý các bài đăng tìm gia sư, theo dõi tiến độ duyệt và chọn ứng viên gia sư phù hợp tại Hà Nội.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            height: '46px',
            padding: '0 24px',
            backgroundColor: '#00e599',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} />
          <span>Đăng bài mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'ALL', label: `Tất cả (${posts.length})` },
          { id: 'OPEN', label: `Đang tuyển (${posts.filter(p => p.status === 'OPEN').length})` },
          { id: 'PENDING_APPROVAL', label: `Chờ duyệt (${posts.filter(p => p.status === 'PENDING_APPROVAL').length})` },
          { id: 'MATCHED', label: `Đã chọn gia sư (${posts.filter(p => p.status === 'MATCHED').length})` },
          { id: 'CLOSED', label: `Đã đóng (${posts.filter(p => p.status === 'CLOSED').length})` },
        ].map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                border: '1.5px solid #0f172a',
                backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                color: isSelected ? '#ffffff' : '#0f172a',
                boxShadow: isSelected ? '2px 2px 0px #0f172a' : 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Error notification */}
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

      {/* Posts List */}
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
          <span>Đang tải danh sách bài đăng của bạn...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #0f172a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <FileText size={44} color="#94a3b8" style={{ marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Không có bài đăng nào trong mục này
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
            Bạn có thể tạo bài đăng mô tả nhu cầu học tập tại Hà Nội để các gia sư nộp đơn ứng tuyển.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 22px',
              backgroundColor: '#00e599',
              color: '#000000',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Đăng bài ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1.5px solid #0f172a',
                padding: '22px 24px',
                boxShadow: '3px 3px 0px #0f172a',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
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

                {getStatusBadge(post.status, post.rejectionReason)}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {post.title}
              </h3>

              {/* Meta details in Hanoi */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '0.86rem',
                color: '#475569',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} color="#2563eb" />
                  <span>{post.sessionsPerWeek} buổi/tuần • {post.preferredSchedule || 'Linh hoạt'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#2563eb" />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {post.district ? `${post.district}, ` : ''}Hà Nội
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a' }}>
                  <DollarSign size={15} color="#2563eb" />
                  <span>{post.budgetAmount ? formatVND(post.budgetAmount) : 'Thỏa thuận'} /buổi</span>
                </div>
              </div>

              {/* Rejection reason if any */}
              {post.status === 'REJECTED' && post.rejectionReason && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '10px',
                  border: '1.5px solid #fecaca',
                  fontSize: '0.82rem',
                  color: '#b91c1c'
                }}>
                  <strong>Lý do từ chối:</strong> {post.rejectionReason}
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1.5px solid #f1f5f9',
                paddingTop: '14px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Đăng ngày: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {post.status === 'OPEN' && (
                    <button
                      type="button"
                      onClick={() => handleClosePost(post.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: '10px',
                        color: '#64748b',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Đóng bài
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setReviewingPost(post)}
                    style={{
                      padding: '8px 18px',
                      backgroundColor: post.applicationsCount > 0 ? '#0f172a' : '#f8fafc',
                      color: post.applicationsCount > 0 ? '#ffffff' : '#64748b',
                      border: '2px solid #0f172a',
                      boxShadow: post.applicationsCount > 0 ? '2px 2px 0px #0f172a' : 'none',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Users size={15} />
                    <span>Xem ứng viên ({post.applicationsCount || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal create */}
      <CreateTutorPostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadMyPosts();
        }}
      />

      {/* Modal candidate review */}
      <CandidateReviewModal
        isOpen={!!reviewingPost}
        post={reviewingPost}
        onClose={() => setReviewingPost(null)}
        onPostUpdated={() => {
          loadMyPosts();
        }}
      />
    </div>
  );
}
