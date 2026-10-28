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
  DollarSign,
  User
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

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
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1.5px solid #d97706' }}>
            ⏳ Chờ duyệt
          </span>
        );
      case 'OPEN':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', border: '1.5px solid #16a34a' }}>
            Công khai
          </span>
        );
      case 'MATCHED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#dbeafe', color: '#1d4ed8', border: '1.5px solid #2563eb' }}>
            Đã ghép lớp
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#b91c1c', border: '1.5px solid #ef4444' }}>
            Bị từ chối
          </span>
        );
      case 'CLOSED':
        return (
          <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', border: '1.5px solid #cbd5e1' }}>
            Đã đóng
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Header matching AdminTutorVerificationDashboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1.5px solid #fca5a5',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              CỔNG QUẢN TRỊ VIÊN
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Tutora Post Moderation (Khu vực Hà Nội)</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: '2rem',
            fontWeight: 900,
            color: '#0f172a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}>
            Kiểm Duyệt Bài Đăng Tìm Gia Sư
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Phê duyệt hoặc từ chối bài đăng của phụ huynh trước khi xuất hiện trên Bảng Tin lớp học công khai tại Hà Nội.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPosts}
          disabled={loading}
          style={{
            height: '44px',
            padding: '0 18px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            boxShadow: '3px 3px 0px #0f172a',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700,
          backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1.5px solid ${message.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
          color: message.type === 'success' ? '#047857' : '#b91c1c'
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

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
          { id: 'PENDING_APPROVAL', label: `Chờ duyệt (${posts.filter(p => p.status === 'PENDING_APPROVAL').length})` },
          { id: 'OPEN', label: `Đang công khai (${posts.filter(p => p.status === 'OPEN').length})` },
          { id: 'MATCHED', label: `Đã ghép lớp (${posts.filter(p => p.status === 'MATCHED').length})` },
          { id: 'REJECTED', label: `Bị từ chối (${posts.filter(p => p.status === 'REJECTED').length})` }
        ].map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '8px 16px',
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
          <Loader2 size={24} className="animate-spin" />
          <span>Đang tải danh sách kiểm duyệt bài đăng...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #0f172a',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          color: '#64748b',
          fontWeight: 600
        }}>
          Không có bài đăng nào trong danh mục này.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map(post => {
            const isPending = post.status === 'PENDING_APPROVAL';
            const isActioning = actionLoadingId === post.id;

            return (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: isPending ? '2px solid #eab308' : '1.5px solid #0f172a',
                  padding: '22px',
                  boxShadow: '3px 3px 0px #0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b' }}>#{post.id}</span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1.5px solid #2563eb', fontSize: '0.78rem', fontWeight: 800 }}>
                      {post.subjectName}
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#0f172a', border: '1.5px solid #0f172a', fontSize: '0.78rem', fontWeight: 800 }}>
                      {post.gradeLevel}
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: post.teachingMode === 'ONLINE' ? '#faf5ff' : '#fef3c7', color: post.teachingMode === 'ONLINE' ? '#6d28d9' : '#b45309', border: `1.5px solid ${post.teachingMode === 'ONLINE' ? '#7c3aed' : '#d97706'}`, fontSize: '0.78rem', fontWeight: 800 }}>
                      {post.teachingMode}
                    </span>
                  </div>

                  {getStatusBadge(post.status)}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {post.title}
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  fontSize: '0.84rem',
                  color: '#475569',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '12px 16px',
                  borderRadius: '10px'
                }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Người đăng:</strong> {post.creatorName} ({post.creatorEmail} • {post.creatorPhone || 'Chưa có SĐT'})
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Địa điểm (Hà Nội):</strong> {post.detailedAddress ? `${post.detailedAddress}, ` : ''}{post.district ? `${post.district}, ` : ''}Hà Nội
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Lịch & Học phí:</strong> {post.sessionsPerWeek} buổi/tuần • {post.budgetAmount ? formatVND(post.budgetAmount) + '/buổi' : 'Thỏa thuận'}
                  </div>
                </div>

                {post.studentNotes && (
                  <div style={{ fontSize: '0.86rem', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>Tình hình học sinh:</strong> {post.studentNotes}
                  </div>
                )}

                {post.requirements && (
                  <div style={{ fontSize: '0.86rem', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>Yêu cầu gia sư:</strong> {post.requirements}
                  </div>
                )}

                {post.rejectionReason && (
                  <div style={{ fontSize: '0.82rem', color: '#b91c1c', backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <strong>Lý do từ chối:</strong> {post.rejectionReason}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1.5px solid #f1f5f9', paddingTop: '12px' }}>
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleModerate(post.id, 'REJECT')}
                        disabled={isActioning}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: '1.5px solid #ef4444',
                          backgroundColor: '#ffffff',
                          color: '#ef4444',
                          fontSize: '0.82rem',
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
                        onClick={() => handleModerate(post.id, 'APPROVE')}
                        disabled={isActioning}
                        style={{
                          padding: '7px 18px',
                          borderRadius: '8px',
                          border: '2px solid #000000',
                          backgroundColor: '#00e599',
                          color: '#000000',
                          boxShadow: '2px 2px 0px #000000',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          cursor: isActioning ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {isActioning ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                        <span>Phê duyệt</span>
                      </button>
                    </>
                  )}
                  {post.status === 'OPEN' && (
                    <button
                      type="button"
                      onClick={() => handleModerate(post.id, 'REJECT')}
                      disabled={isActioning}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #fca5a5',
                        backgroundColor: '#fff1f2',
                        color: '#be123c',
                        fontSize: '0.82rem',
                        fontWeight: 800,
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
