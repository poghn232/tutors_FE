import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Loader2, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Filter
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';
import { subjectService } from '../../services/subjectService';
import TutorRequestCard from './TutorRequestCard';
import TutorRequestDetailModal from './TutorRequestDetailModal';
import CreateTutorPostModal from './CreateTutorPostModal';

const HANOI_DISTRICTS = [
  'Quận Cầu Giấy',
  'Quận Đống Đa',
  'Quận Ba Đình',
  'Quận Hoàn Kiếm',
  'Quận Hai Bà Trưng',
  'Quận Thanh Xuân',
  'Quận Tây Hồ',
  'Quận Nam Từ Liêm',
  'Quận Bắc Từ Liêm',
  'Quận Hoàng Mai',
  'Quận Long Biên',
  'Quận Hà Đông'
];

const GRADE_LEVELS = [
  'Tất cả khối lớp',
  'Tiểu học (Lớp 1-5)',
  'THCS (Lớp 6-9)',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
  'Ôn thi THPT Quốc Gia'
];

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
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, selectedSubject, selectedGrade, selectedMode, selectedDistrict]);

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
        size: 8,
        city: 'Hà Nội',
        district: selectedDistrict || undefined,
        subjectId: selectedSubject || undefined,
        gradeLevel: (selectedGrade && selectedGrade !== 'Tất cả khối lớp') ? selectedGrade : undefined,
        teachingMode: selectedMode || undefined,
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
    setSelectedDistrict('');
    setSearchKeyword('');
    setPage(0);
  };

  const isParent = user?.role === 'PARENT' || user?.role === 'STUDENT';
  const isTutor = user?.role === 'TUTOR';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Top Title & Search / Action bar (Matching TutorCatalog.jsx) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
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
              <MapPin size={13} /> ÁP DỤNG TẠI HÀ NỘI
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.3rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px 0'
            }}>
              Lớp Cần Gia Sư
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
              Bảng tin bài đăng tìm gia sư trực tiếp từ phụ huynh & học sinh tại khu vực Hà Nội. Nộp đơn nhanh, thỏa thuận học phí linh hoạt.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  if (onRequireAuth) onRequireAuth('đăng bài tìm gia sư');
                  return;
                }
                setShowCreateModal(true);
              }}
              style={{
                height: '46px',
                padding: '0 20px',
                borderRadius: '12px',
                backgroundColor: '#00e599',
                color: '#000000',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Đăng Tin Tìm Gia Sư
            </button>

            {isParent && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('my-requests')}
                style={{
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '2px solid #0f172a',
                  boxShadow: '3px 3px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={16} /> Bài Đăng Của Tôi
              </button>
            )}

            {isTutor && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('my-applications')}
                style={{
                  height: '46px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '2px solid #0f172a',
                  boxShadow: '3px 3px 0px #0f172a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <GraduationCap size={16} /> Đơn Ứng Tuyển
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={18} 
              color="#64748b" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              type="text"
              placeholder="Tìm theo môn học, khối lớp, tiêu đề bài đăng tại Hà Nội..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                border: '1.5px solid #0f172a',
                borderRadius: '12px',
                padding: '0 16px 0 46px',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: '12px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: '2px solid #0f172a',
              boxShadow: '3px 3px 0px #0f172a',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Main 2-Column Grid: Filter Sidebar + Request Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 280px) minmax(0, 1fr)', gap: '28px', alignItems: 'flex-start' }}>
        {/* LEFT SIDEBAR: BỘ LỌC (Matching TutorCatalog.jsx) */}
        <aside style={{
          background: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '24px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bộ lọc
            </h3>
            {(selectedSubject || selectedGrade || selectedMode || selectedDistrict || searchKeyword) && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} /> Đặt lại
              </button>
            )}
          </div>

          {/* SECTION 1: QUẬN / HUYỆN HÀ NỘI */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
              QUẬN / HUYỆN (HÀ NỘI)
            </div>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setPage(0); }}
              style={{
                width: '100%',
                height: '42px',
                border: '1.5px solid #0f172a',
                borderRadius: '10px',
                padding: '0 12px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="">Tất cả quận / huyện</option>
              {HANOI_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 2: MÔN HỌC */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
              MÔN HỌC
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              <div
                onClick={() => { setSelectedSubject(''); setPage(0); }}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: selectedSubject === '' ? 800 : 500,
                  color: selectedSubject === '' ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedSubject === '' ? '#0f172a' : '#cbd5e1'
                }} />
                <span>Tất cả môn học</span>
              </div>
              {subjects.map(s => {
                const isSelected = String(selectedSubject) === String(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => { setSelectedSubject(s.id); setPage(0); }}
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 800 : 500,
                      color: isSelected ? '#0f172a' : '#64748b',
                      cursor: 'pointer',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isSelected ? '#0f172a' : '#cbd5e1'
                    }} />
                    <span>{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 3: KHỐI LỚP */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
              KHỐI LỚP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {GRADE_LEVELS.map(g => {
                const isSel = (g === 'Tất cả khối lớp' && !selectedGrade) || selectedGrade === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setSelectedGrade(g === 'Tất cả khối lớp' ? '' : g); setPage(0); }}
                    style={{
                      textAlign: 'left',
                      border: isSel ? '1.5px solid #0f172a' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '7px 10px',
                      fontSize: '0.84rem',
                      fontWeight: isSel ? 800 : 600,
                      background: isSel ? '#0f172a' : 'transparent',
                      color: isSel ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 4: HÌNH THỨC HỌC */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
              HÌNH THỨC HỌC
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { id: '', label: 'Tất cả' },
                { id: 'OFFLINE', label: 'Tại nhà' },
                { id: 'ONLINE', label: 'Online' },
                { id: 'HYBRID', label: 'Hybrid' }
              ].map(m => {
                const isSel = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setSelectedMode(m.id); setPage(0); }}
                    style={{
                      border: '1.5px solid #0f172a',
                      borderRadius: '8px',
                      padding: '8px 6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: isSel ? '#0f172a' : '#ffffff',
                      color: isSel ? '#ffffff' : '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: REQUEST CARDS GRID */}
        <div>
          {/* Header Info */}
          <div style={{
            fontSize: '0.88rem',
            color: '#64748b',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              Đang hiển thị <strong style={{ color: '#0f172a' }}>{posts.length}</strong> / <strong>{totalElements}</strong> lớp cần gia sư tại Hà Nội
            </div>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '0.84rem', fontWeight: 700 }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang tải...</span>
              </div>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading && posts.length === 0 && (
            <div style={{
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#64748b',
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <Loader2 size={24} className="animate-spin" />
              <span>Đang tải danh sách bài đăng từ hệ thống...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div style={{
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b',
              background: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '36px 20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <BookOpen size={44} color="#94a3b8" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Chưa có lớp nào phù hợp
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', margin: '0 0 16px' }}>
                Chưa tìm thấy bài đăng tìm gia sư nào với tiêu chí hiện tại ở khu vực Hà Nội. Bạn có thể đặt lại bộ lọc hoặc tự đăng tin mới.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{
                    padding: '9px 18px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Đặt lại bộ lọc
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: '9px 18px',
                    backgroundColor: '#00e599',
                    color: '#000000',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Đăng tin tìm gia sư
                </button>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && posts.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '28px'
            }}>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #0f172a',
                  backgroundColor: page === 0 ? '#f1f5f9' : '#ffffff',
                  color: page === 0 ? '#94a3b8' : '#0f172a',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  boxShadow: page === 0 ? 'none' : '2px 2px 0px #0f172a'
                }}
              >
                <ChevronLeft size={16} />
                <span>Trang trước</span>
              </button>

              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', padding: '0 8px' }}>
                Trang {page + 1} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #0f172a',
                  backgroundColor: page >= totalPages - 1 ? '#f1f5f9' : '#ffffff',
                  color: page >= totalPages - 1 ? '#94a3b8' : '#0f172a',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  boxShadow: page >= totalPages - 1 ? 'none' : '2px 2px 0px #0f172a'
                }}
              >
                <span>Trang sau</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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
