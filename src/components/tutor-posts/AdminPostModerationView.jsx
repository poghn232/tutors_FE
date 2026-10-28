import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

export default function AdminPostModerationView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PENDING_APPROVAL, OPEN, REJECTED, MATCHED
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await tutorPostService.getAllPostsForAdmin({ page, size: 15 });
      const pageData = res?.data;
      setPosts(pageData?.content || []);
      setTotalPages(pageData?.totalPages || 1);
      setTotalElements(pageData?.totalElements || 0);
    } catch (err) {
      console.error('Error fetching admin posts', err);
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Không thể tải danh sách bài đăng.' });
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (postId, action) => {
    let reason = '';
    if (action === 'REJECT') {
      const inputReason = window.prompt('Nhập lý do từ chối bài đăng:', 'Bài đăng vi phạm quy định cộng đồng hoặc nội dung chưa rõ ràng.');
      if (inputReason === null) return;
      reason = inputReason.trim();
    } else {
      if (!window.confirm('Bạn có chắc chắn muốn phê duyệt bài đăng này để hiển thị công khai trên Bảng Tin?')) {
        return;
      }
    }

    try {
      setActionLoadingId(postId);
      const res = await tutorPostService.moderatePost(postId, action, reason);
      if (res?.success) {
        setMessage({ type: 'success', text: action === 'APPROVE' ? 'Đã phê duyệt bài đăng thành công!' : 'Đã từ chối bài đăng.' });
        loadPosts();
      } else {
        setMessage({ type: 'error', text: res?.message || 'Không thể cập nhật bài đăng.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Có lỗi xảy ra khi kiểm duyệt.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'ALL') return true;
    return p.status === activeFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#b45309' }}>⏳ Chờ duyệt</span>;
      case 'OPEN':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>Công khai</span>;
      case 'MATCHED':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1d4ed8' }}>Đã ghép lớp</span>;
      case 'REJECTED':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fee2e2', color: '#b91c1c' }}>Bị từ chối</span>;
      case 'CLOSED':
        return <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#64748b' }}>Đã đóng</span>;
      default:
        return status;
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#2563eb" />
            <span>Kiểm Duyệt Bài Đăng Tìm Gia Sư</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Phê duyệt hoặc từ chối bài đăng của phụ huynh trước khi xuất hiện trên Bảng Tin công khai
          </p>
        </div>

        <button
          onClick={loadPosts}
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

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#047857' : '#b91c1c'
        }}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

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
          { id: 'PENDING_APPROVAL', label: `Chờ duyệt (${posts.filter(p => p.status === 'PENDING_APPROVAL').length})` },
          { id: 'OPEN', label: `Đang công khai (${posts.filter(p => p.status === 'OPEN').length})` },
          { id: 'MATCHED', label: `Đã ghép lớp (${posts.filter(p => p.status === 'MATCHED').length})` },
          { id: 'REJECTED', label: `Bị từ chối (${posts.filter(p => p.status === 'REJECTED').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#64748b', gap: '10px' }}>
          <Loader2 size={24} className="spin" />
          <span>Đang tải danh sách kiểm duyệt...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          color: '#64748b'
        }}>
          Không có bài đăng nào trong danh mục này.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredPosts.map(post => {
            const isPending = post.status === 'PENDING_APPROVAL';
            const isActioning = actionLoadingId === post.id;

            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: isPending ? '2px solid #fde047' : '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>#{post.id}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700 }}>
                      {post.subjectName}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155', fontSize: '11px', fontWeight: 600 }}>
                      {post.gradeLevel}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: post.teachingMode === 'ONLINE' ? '#f3e8ff' : '#fef3c7', color: post.teachingMode === 'ONLINE' ? '#7e22ce' : '#b45309', fontSize: '11px', fontWeight: 600 }}>
                      {post.teachingMode}
                    </span>
                  </div>

                  {getStatusBadge(post.status)}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {post.title}
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#475569',
                  backgroundColor: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '6px'
                }}>
                  <div><strong>Người đăng:</strong> {post.creatorName} ({post.creatorEmail} • {post.creatorPhone || 'Chưa cập nhật SĐT'})</div>
                  <div><strong>Khu vực:</strong> {post.detailedAddress ? `${post.detailedAddress}, ` : ''}{post.district ? `${post.district}, ` : ''}{post.city}</div>
                  <div><strong>Lịch & Học phí:</strong> {post.sessionsPerWeek} buổi/tuần • {post.budgetAmount ? `${Number(post.budgetAmount).toLocaleString('vi-VN')} đ/buổi` : 'Thỏa thuận'}</div>
                </div>

                {post.studentNotes && (
                  <div style={{ fontSize: '13px', color: '#334155' }}>
                    <strong>Tình hình học sinh:</strong> {post.studentNotes}
                  </div>
                )}

                {post.requirements && (
                  <div style={{ fontSize: '13px', color: '#334155' }}>
                    <strong>Yêu cầu gia sư:</strong> {post.requirements}
                  </div>
                )}

                {post.rejectionReason && (
                  <div style={{ fontSize: '12px', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                    <strong>Lý do từ chối:</strong> {post.rejectionReason}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleModerate(post.id, 'REJECT')}
                        disabled={isActioning}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#b91c1c',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isActioning ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={14} />
                        <span>Từ chối</span>
                      </button>
                      <button
                        onClick={() => handleModerate(post.id, 'APPROVE')}
                        disabled={isActioning}
                        style={{
                          padding: '6px 18px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: isActioning ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isActioning ? <Loader2 size={14} className="spin" /> : <CheckCircle size={14} />}
                        <span>Phê duyệt</span>
                      </button>
                    </>
                  )}
                  {post.status === 'OPEN' && (
                    <button
                      onClick={() => handleModerate(post.id, 'REJECT')}
                      disabled={isActioning}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fca5a5',
                        backgroundColor: '#fff1f2',
                        color: '#be123c',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: isActioning ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Khóa / Gỡ bài
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
