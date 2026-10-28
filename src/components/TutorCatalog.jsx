import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingView from './BookingView';
import { tutorService } from '../services/tutorService';

const DEFAULT_SUBJECTS = [
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Tiếng Anh',
  'Ngữ văn',
  'Lịch sử',
  'Tin học',
  'Địa lý',
  'Luyện thi THPT'
];

const DEFAULT_HOBBIES = [
  'Cờ vua',
  'Âm nhạc',
  'Thể thao',
  'Nghệ thuật',
  'Công nghệ',
  'Gaming',
  'Nấu ăn',
  'Du lịch',
  'Hoạt động ngoài trời',
  'Điện ảnh'
];

const AVATAR_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f97316'];

const getText = (value, fallback = '') => (
  typeof value === 'string' && value.trim() ? value.trim() : fallback
);

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => getText(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(/[,;|\n]+/).map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getOptionalRate = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
};

const formatVND = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

const getDegree = (qualification) => {
  const match = qualification.match(/(Cử nhân|Thạc sĩ|Tiến sĩ|Bác sĩ|Kỹ sư)/i);
  return match ? match[1] : 'Chưa cập nhật';
};

const normalizeTutor = (rawTutor, index) => {
  const qualification = getText(rawTutor?.qualification) || getText(rawTutor?.subject);
  const fullName = getText(rawTutor?.fullName, 'Gia sư chưa cập nhật tên');

  // Real subjects from API
  let subjects = toList(rawTutor?.subjects);

  // Clean out any qualifications, schools, or non-subject strings from subjects list
  subjects = subjects.filter((s) => {
    if (!s || s === 'Chưa cập nhật môn dạy') return false;
    if (/(Thạc sĩ|Tiến sĩ|Cử nhân|Bác sĩ|ĐH |Đại học)/i.test(s)) return false;
    return true;
  });

  // If subjects is empty, check if qualification or bio specifically mentions known subjects
  if (!subjects.length) {
    const textToCheck = `${qualification} ${rawTutor?.bio || ''}`;
    const detected = DEFAULT_SUBJECTS.filter((sub) => {
      const regex = new RegExp(`\\b${sub}\\b`, 'i');
      return regex.test(textToCheck);
    });
    subjects = detected.length ? detected : ['Chưa cập nhật môn dạy'];
  }

  const hourlyRate = getOptionalRate(rawTutor?.hourlyRate);
  const priceNegotiable = rawTutor?.priceNegotiable === true
    || rawTutor?.priceNegotiable === 'true'
    || rawTutor?.isNegotiable === true
    || rawTutor?.isNegotiable === 'true'
    || hourlyRate === null;

  return {
    id: rawTutor?.id ?? `tutor-${index}`,
    fullName,
    school: qualification || 'Chưa cập nhật hồ sơ',
    degree: getDegree(qualification),
    gender: getText(rawTutor?.gender, 'Khác'),
    rating: toNumber(rawTutor?.rating),
    reviewsCount: toNumber(rawTutor?.reviewsCount),
    experienceYears: toNumber(rawTutor?.experienceYears),
    studentsCount: toNumber(rawTutor?.studentsCount),
    subjects,
    hobbies: toList(rawTutor?.hobbies),
    phone: getText(rawTutor?.phone),
    facebookUrl: getText(rawTutor?.facebookUrl),
    email: getText(rawTutor?.email),
    avatarUrl: getText(rawTutor?.avatarUrl),
    bio: getText(rawTutor?.bio, 'Gia sư chưa cập nhật phần giới thiệu.'),
    avatarColor: getText(rawTutor?.avatarColor, AVATAR_COLORS[index % AVATAR_COLORS.length]),
    hourlyRate,
    priceNegotiable,
    verificationStatus: getText(rawTutor?.verificationStatus, 'PENDING').toUpperCase(),
    availableDaysJson: rawTutor?.availableDaysJson || null,
    availableTimesJson: rawTutor?.availableTimesJson || null,
    createdAt: rawTutor?.createdAt || null
  };
};

export default function TutorCatalog({ onSelectTutor, onNavigate, user, onRequireAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedEducation, setSelectedEducation] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [selectedHobby, setSelectedHobby] = useState('all');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [activeBookingTutor, setActiveBookingTutor] = useState(null);
  const [tutorsList, setTutorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const TUTORS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const loadTutors = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const response = await tutorService.getTutors();
        if (response?.success === false) {
          throw new Error(response.message || 'Không thể tải danh sách gia sư.');
        }

        const records = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        if (!cancelled) {
          setTutorsList(records.map(normalizeTutor));
        }
      } catch (error) {
        if (!cancelled) {
          setTutorsList([]);
          setLoadError(error.response?.data?.message || error.message || 'Không thể tải danh sách gia sư.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTutors();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const subjectsList = [
    'Tất cả môn học',
    ...Array.from(new Set([
      ...DEFAULT_SUBJECTS,
      ...tutorsList.flatMap((tutor) => tutor.subjects).filter((s) => s && s !== 'Chưa cập nhật môn dạy' && !/(Thạc sĩ|Tiến sĩ|Cử nhân|Bác sĩ|ĐH |Đại học)/i.test(s))
    ]))
  ];

  const hobbiesList = DEFAULT_HOBBIES;

  // Filtering
  const filteredTutors = tutorsList.filter((t) => {
    const term = searchQuery.toLowerCase().trim();
    const matchSearch = !term || (
      t.fullName.toLowerCase().includes(term) ||
      t.school.toLowerCase().includes(term) ||
      t.subjects.some(s => s.toLowerCase().includes(term))
    );

    const matchSubject = selectedSubject === 'all' || selectedSubject === 'Tất cả môn học' || t.subjects.some((sub) => {
      const s1 = sub.toLowerCase().trim();
      const s2 = selectedSubject.toLowerCase().trim();
      return s1 === s2 || s1.includes(s2) || s2.includes(s1);
    });
    const matchGender = selectedGender === 'all' || t.gender === selectedGender;
    const matchEducation = selectedEducation === 'all' || t.degree === selectedEducation;
    const matchRating = minRating === 'all' || t.rating >= parseFloat(minRating);
    const matchHobby = selectedHobby === 'all' || (t.hobbies && t.hobbies.includes(selectedHobby));

    return matchSearch && matchSubject && matchGender && matchEducation && matchRating && matchHobby;
  }).sort((a, b) => {
    if (sortBy === 'exp_desc') {
      return b.experienceYears - a.experienceYears;
    }

    const ratingDifference = b.rating - a.rating;
    if (ratingDifference !== 0) {
      return ratingDifference;
    }

    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Reset to first page whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSubject, selectedGender, selectedEducation, minRating, selectedHobby, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTutors.length / TUTORS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * TUTORS_PER_PAGE;
  const endIndex = Math.min(startIndex + TUTORS_PER_PAGE, filteredTutors.length);
  const paginatedTutors = filteredTutors.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (safeCurrentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (activeBookingTutor) {
    return (
      <BookingView 
        tutor={activeBookingTutor} 
        onBack={() => setActiveBookingTutor(null)} 
        onNavigate={onNavigate}
        user={user}
        onRequireAuth={onRequireAuth}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Top Title & Search bar (Figma 15:2008) */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: '2.3rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 16px 0',
          letterSpacing: '-0.02em'
        }}>
          Tìm Gia Sư
        </h1>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '280px'
          }}>
            <Search 
              size={18} 
              color="#64748b" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              type="text"
              placeholder="Tìm theo tên hoặc môn học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: '48px',
                border: '1.5px solid #0f172a',
                borderRadius: '12px',
                padding: '0 36px 0 16px',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none'
              }}
            >
              <option value="rating_desc">Đánh giá cao nhất</option>
              <option value="exp_desc">Kinh nghiệm nhiều nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Filter Sidebar + Tutor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) minmax(0, 1fr)', gap: '28px', alignItems: 'flex-start' }}>
        {/* LEFT SIDEBAR: BỘ LỌC (Exact Figma 15:2008) */}
        <aside style={{
          background: '#ffffff',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '24px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0' }}>
            Bộ lọc
          </h3>

          {/* SECTION 1: MÔN HỌC */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              MÔN HỌC
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {subjectsList.map((sub) => {
                const isSelected = selectedSubject === sub || (selectedSubject === 'all' && sub === 'Tất cả môn học');
                return (
                  <div
                    key={sub}
                    onClick={() => setSelectedSubject(sub === 'Tất cả môn học' ? 'all' : sub)}
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
                    {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a' }} />}
                    <span>{sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 2: GIỚI TÍNH */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              GIỚI TÍNH
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Nam', label: 'Nam' },
                { id: 'Nữ', label: 'Nữ' },
                { id: 'Khác', label: 'Khác' }
              ].map((g) => {
                const isSel = selectedGender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGender(g.id)}
                    style={{
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: isSel ? 800 : 600,
                      background: isSel ? '#0f172a' : '#ffffff',
                      color: isSel ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 3: HỌC VẤN */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              HỌC VẤN
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { id: 'all', label: 'Mọi trình độ' },
                { id: 'Cử nhân', label: 'Cử nhân' },
                { id: 'Thạc sĩ', label: 'Thạc sĩ' },
                { id: 'Tiến sĩ', label: 'Tiến sĩ' },
                { id: 'Bác sĩ', label: 'Bác sĩ' }
              ].map((ed) => {
                const isSel = selectedEducation === ed.id;
                return (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedEducation(ed.id)}
                    style={{
                      textAlign: 'left',
                      border: isSel ? 'none' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      fontWeight: isSel ? 800 : 600,
                      background: isSel ? '#f97316' : 'transparent',
                      color: isSel ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {ed.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 4: ĐÁNH GIÁ TỐI THIỂU */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              ĐÁNH GIÁ TỐI THIỂU
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '4', label: '4+ ★' },
                { id: '4.5', label: '4.5+ ★' },
                { id: '4.8', label: '4.8+ ★' }
              ].map((rt) => {
                const isSel = minRating === rt.id;
                return (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => setMinRating(rt.id)}
                    style={{
                      border: '1.5px solid #0f172a',
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: isSel ? '#facc15' : '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    {rt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 6: SỞ THÍCH GIA SƯ */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              SỞ THÍCH GIA SƯ
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {hobbiesList.map((hb) => {
                const isSel = selectedHobby === hb;
                return (
                  <button
                    key={hb}
                    type="button"
                    onClick={() => setSelectedHobby(isSel ? 'all' : hb)}
                    style={{
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: isSel ? '#0f172a' : '#ffffff',
                      color: isSel ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {hb}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: 2-COLUMN TUTOR CARDS GRID (Exact Figma 15:2008) */}
        <div>
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
            <span>
              {loading ? 'Đang tải danh sách gia sư...' : `${filteredTutors.length} gia sư được tìm thấy`}
            </span>
            {!loading && filteredTutors.length > 0 && (
              <span style={{ fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '3px 10px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                Trang {safeCurrentPage} / {totalPages} (8 gia sư/trang)
              </span>
            )}
          </div>

          {loading && (
            <div style={{
              minHeight: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#64748b',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '16px'
            }}>
              <Loader2 size={20} className="animate-spin" />
              Đang tải dữ liệu từ hệ thống...
            </div>
          )}

          {!loading && loadError && (
            <div style={{
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              textAlign: 'center',
              color: '#991b1b',
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div>{loadError}</div>
              <button
                type="button"
                onClick={() => setReloadToken((value) => value + 1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1.5px solid #991b1b',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  background: '#ffffff',
                  color: '#991b1b',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} /> Thử tải lại
              </button>
            </div>
          )}

          {!loading && !loadError && filteredTutors.length === 0 && (
            <div style={{
              minHeight: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '16px',
              padding: '24px'
            }}>
              {tutorsList.length === 0
                ? 'Chưa có gia sư nào được tạo trong hệ thống.'
                : 'Không tìm thấy gia sư phù hợp với bộ lọc hiện tại.'}
            </div>
          )}

          {!loading && !loadError && filteredTutors.length > 0 && (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {paginatedTutors.map((tutor) => (
              <div
                key={tutor.id}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #0f172a',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Top row: Avatar, Info, Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '1 1 220px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${tutor.avatarColor}22`,
                        border: `1.5px solid ${tutor.avatarColor}`,
                        color: tutor.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}>
                        {tutor.avatarUrl ? (
                          <img
                            src={tutor.avatarUrl}
                            alt={tutor.fullName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                          />
                        ) : (
                          tutor.fullName.charAt(tutor.fullName.lastIndexOf(' ') + 1)
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.2 }}>
                          {tutor.fullName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tutor.school}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          {tutor.rating > 0 ? (
                            <>
                              <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★★★★★</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{tutor.rating}</span>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({tutor.reviewsCount})</span>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Chưa có đánh giá</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px', flexShrink: 0 }}>
                      {tutor.verificationStatus !== 'APPROVED' && (
                        <span style={{
                          background: '#fff7ed',
                          color: '#c2410c',
                          border: '1px solid #fdba74',
                          borderRadius: '999px',
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          whiteSpace: 'nowrap'
                        }}>
                          {tutor.verificationStatus === 'REJECTED' ? 'Đã từ chối' : 'Đang chờ duyệt'}
                        </span>
                      )}
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#7c3aed' }}>
                          {tutor.priceNegotiable ? 'Thỏa thuận' : formatVND(tutor.hourlyRate)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                          {tutor.priceNegotiable ? 'Học phí' : '/buổi'}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {tutor.subjects.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#fee2e2',
                          color: '#ea580c',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '999px',
                          padding: '2px 10px'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#475569',
                    lineHeight: '1.5',
                    margin: '0 0 16px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {tutor.bio}
                  </p>
                </div>

                {/* Footer row: Experience & Action Link */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {tutor.experienceYears > 0 ? `${tutor.experienceYears} năm kinh nghiệm` : 'Gia sư chuyên môn'}
                    {tutor.studentsCount > 0 ? ` · ${tutor.studentsCount} học sinh` : ''}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTutor) onSelectTutor(tutor);
                      setActiveBookingTutor(tutor);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7c3aed',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Xem hồ sơ →
                  </button>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination Controls (Strictly 8 tutors per page) */}
            {totalPages > 1 && (
              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1.5px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
                  Hiển thị <b style={{ color: '#0f172a' }}>{startIndex + 1} - {endIndex}</b> trong số <b style={{ color: '#0f172a' }}>{filteredTutors.length}</b> gia sư (8 gia sư/trang)
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      background: safeCurrentPage === 1 ? '#f8fafc' : '#ffffff',
                      color: safeCurrentPage === 1 ? '#94a3b8' : '#0f172a',
                      boxShadow: safeCurrentPage === 1 ? 'none' : '2px 2px 0px #0f172a',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: safeCurrentPage === 1 ? 0.6 : 1,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ChevronLeft size={16} /> Trang trước
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getPageNumbers().map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`ellipsis-${idx}`} style={{ padding: '0 6px', color: '#94a3b8', fontWeight: 800 }}>
                            ...
                          </span>
                        );
                      }
                      const isCurrent = p === safeCurrentPage;
                      return (
                        <button
                          key={`page-${p}`}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          style={{
                            minWidth: '38px',
                            height: '38px',
                            padding: '0 8px',
                            borderRadius: '10px',
                            border: '1.5px solid #0f172a',
                            background: isCurrent ? '#7c3aed' : '#ffffff',
                            color: isCurrent ? '#ffffff' : '#0f172a',
                            boxShadow: isCurrent ? '2px 2px 0px #0f172a' : 'none',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      background: safeCurrentPage === totalPages ? '#f8fafc' : '#ffffff',
                      color: safeCurrentPage === totalPages ? '#94a3b8' : '#0f172a',
                      boxShadow: safeCurrentPage === totalPages ? 'none' : '2px 2px 0px #0f172a',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: safeCurrentPage === totalPages ? 0.6 : 1,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Trang sau <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
