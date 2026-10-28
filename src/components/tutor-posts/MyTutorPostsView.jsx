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
  FileText
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';
import CreateTutorPostModal from './CreateTutorPostModal';
import CandidateReviewModal from './CandidateReviewModal';

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
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#b45309' }}>
            ⏳ Chờ Admin duyệt
          </span>
        );
      case 'OPEN':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#15803d' }}>
            🟢 Đang nhận gia sư
          </span>
        );
      case 'MATCHED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
            ✓ Đã ghép lớp thành công
          </span>
        );
      case 'REJECTED':
        return (
          <span title={reason || 'Không đạt chuẩn kiểm duyệt'} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            ✕ Bị từ chối
          </span>
        );
      case 'CLOSED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#64748b' }}>
            Đã đóng
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px 0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Quản lý Bài đăng tìm gia sư
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Theo dõi tiến độ duyệt bài và danh sách các gia sư nộp hồ sơ ứng tuyển
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 22px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>Đăng bài tìm gia sư mới</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px',
        marginBottom: '20px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'ALL', label: `Tất cả (${posts.length})` },
          { id: 'OPEN', label: `Đang tuyển (${posts.filter(p => p.status === 'OPEN').length})` },
          { id: 'PENDING_APPROVAL', label: `Chờ duyệt (${posts.filter(p => p.status === 'PENDING_APPROVAL').length})` },
          { id: 'MATCHED', label: `Đã chọn gia sư (${posts.filter(p => p.status === 'MATCHED').length})` },
          { id: 'CLOSED', label: `Đã đóng (${posts.filter(p => p.status === 'CLOSED').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeFilter === tab.id ? 'none' : '1px solid #e2e8f0',
              backgroundColor: activeFilter === tab.id ? '#2563eb' : '#ffffff',
              color: activeFilter === tab.id ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error notification */}
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

      {/* Posts List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#64748b', gap: '10px' }}>
          <Loader2 size={24} className="spin" />
          <span>Đang tải danh sách bài đăng của bạn...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <FileText size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>
            Không có bài đăng nào trong mục này
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px' }}>
            Bạn có thể tạo bài đăng mô tả nhu cầu học tập để các gia sư tài năng nộp đơn ứng tuyển.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Đăng bài ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {post.subjectName}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {post.gradeLevel}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    backgroundColor: post.teachingMode === 'ONLINE' ? '#f3e8ff' : '#fef3c7',
                    color: post.teachingMode === 'ONLINE' ? '#7e22ce' : '#b45309',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {post.teachingMode === 'ONLINE' ? 'Online' : (post.teachingMode === 'OFFLINE' ? 'Tại nhà' : 'Hybrid')}
                  </span>
                </div>

                {getStatusBadge(post.status, post.rejectionReason)}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {post.title}
              </h3>

              {/* Meta details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '13px',
                color: '#475569',
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} color="#2563eb" />
                  <span>{post.sessionsPerWeek} buổi/tuần • {post.preferredSchedule || 'Linh hoạt'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#2563eb" />
                  <span>{post.district ? `${post.district}, ` : ''}{post.city || 'Toàn quốc'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#2563eb' }}>
                  <DollarSign size={15} />
                  <span>{post.budgetAmount ? `${Number(post.budgetAmount).toLocaleString('vi-VN')} đ` : 'Thỏa thuận'} /buổi</span>
                </div>
              </div>

              {/* Rejection reason if any */}
              {post.status === 'REJECTED' && post.rejectionReason && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  fontSize: '12px',
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
                borderTop: '1px solid #f1f5f9',
                paddingTop: '12px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Đăng ngày: {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {post.status === 'OPEN' && (
                    <button
                      onClick={() => handleClosePost(post.id)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        color: '#64748b',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Đóng bài
                    </button>
                  )}

                  <button
                    onClick={() => setReviewingPost(post)}
                    style={{
                      padding: '8px 18px',
                      backgroundColor: post.applicationsCount > 0 ? '#2563eb' : '#f1f5f9',
                      color: post.applicationsCount > 0 ? '#ffffff' : '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
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
