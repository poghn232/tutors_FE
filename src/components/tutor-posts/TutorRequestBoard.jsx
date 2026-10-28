import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Loader2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';
import { subjectService } from '../../services/subjectService';
import TutorRequestCard from './TutorRequestCard';
import TutorRequestDetailModal from './TutorRequestDetailModal';
import CreateTutorPostModal from './CreateTutorPostModal';

export default function TutorRequestBoard({ user, onRequireAuth, onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, selectedSubject, selectedGrade, selectedMode, selectedCity]);

  const loadSubjects = async () => {
    try {
      const res = await subjectService.getSubjects();
      setSubjects(res?.data || []);
    } catch (err) {
      console.error('Error fetching subjects', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9,
        subjectId: selectedSubject || undefined,
        gradeLevel: selectedGrade || undefined,
        teachingMode: selectedMode || undefined,
        city: selectedCity || undefined,
        keyword: searchKeyword.trim() || undefined
      };
      const res = await tutorPostService.getPublicPosts(params);
      const pageData = res?.data;
      setPosts(pageData?.content || []);
      setTotalPages(pageData?.totalPages || 1);
      setTotalElements(pageData?.totalElements || 0);
    } catch (err) {
      console.error('Error loading tutor posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadPosts();
  };

  const handleResetFilters = () => {
    setSelectedSubject('');
    setSelectedGrade('');
    setSelectedMode('');
    setSelectedCity('');
    setSearchKeyword('');
    setPage(0);
  };

  const isParent = user?.role === 'PARENT' || user?.role === 'STUDENT';

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
        borderRadius: '24px',
        padding: '36px 32px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            <Sparkles size={16} />
            <span>Thị trường gia sư 2 chiều trực tiếp</span>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.3 }}>
            Bảng Tin Tìm Lớp Mới
          </h1>
          <p style={{ fontSize: '15px', color: '#e0e7ff', margin: '0 0 24px', lineHeight: 1.6 }}>
            Hàng trăm phụ huynh và học sinh đang cần tìm gia sư tâm huyết. Duyệt yêu cầu, nộp hồ sơ ứng tuyển và thương lượng học phí linh hoạt.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (!user) {
                  if (onRequireAuth) onRequireAuth('đăng bài tìm gia sư');
                  return;
                }
                setShowCreateModal(true);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Plus size={18} />
              <span>Đăng bài tìm gia sư ngay</span>
            </button>

            {isParent && (
              <button
                onClick={() => onNavigate && onNavigate('my-requests')}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Quản lý bài đăng của tôi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        marginBottom: '28px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
      }}>
        {/* Keyword Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề bài đăng, môn học, tình trạng học sinh..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Tìm kiếm
          </button>
        </form>

        {/* Dropdown Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setPage(0); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">Tất cả môn học</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedGrade}
              onChange={(e) => { setSelectedGrade(e.target.value); setPage(0); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">Tất cả khối lớp</option>
              {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Ôn thi Đại học / THPT'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedMode}
              onChange={(e) => { setSelectedMode(e.target.value); setPage(0); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">Tất cả hình thức</option>
              <option value="ONLINE">Học Online</option>
              <option value="OFFLINE">Học tại nhà</option>
              <option value="HYBRID">Kết hợp Online / Tại nhà</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setPage(0); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">Tất cả khu vực</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleResetFilters}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Danh sách lớp học đang cần gia sư ({totalElements})
        </h3>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '13px', fontWeight: 600 }}>
            <Loader2 size={16} className="spin" />
            <span>Đang cập nhật...</span>
          </div>
        )}
      </div>

      {/* Grid of Request Cards */}
      {loading && posts.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', color: '#64748b', gap: '10px' }}>
          <Loader2 size={28} className="spin" />
          <span style={{ fontSize: '15px' }}>Đang tải bảng tin lớp mới...</span>
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '14px' }} />
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
            Không tìm thấy bài đăng phù hợp
          </h4>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', margin: '0 auto 16px' }}>
            Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm để xem nhiều bài đăng hơn.
          </p>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '8px 18px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {posts.map(post => (
            <TutorRequestCard
              key={post.id}
              post={post}
              user={user}
              onSelect={(p) => setSelectedPost(p)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: page === 0 ? '#cbd5e1' : '#334155',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={16} />
            <span>Trang trước</span>
          </button>

          <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569', padding: '0 8px' }}>
            Trang {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: page >= totalPages - 1 ? '#cbd5e1' : '#334155',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <span>Trang sau</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Detail & Apply Modal */}
      <TutorRequestDetailModal
        isOpen={!!selectedPost}
        post={selectedPost}
        user={user}
        onClose={() => setSelectedPost(null)}
        onRequireAuth={onRequireAuth}
        onApplicationSuccess={() => {
          loadPosts();
        }}
      />

      {/* Create Modal */}
      <CreateTutorPostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadPosts();
        }}
      />
    </div>
  );
}
