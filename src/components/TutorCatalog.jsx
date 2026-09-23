import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import BookingView from './BookingView';
import { tutorService } from '../services/tutorService';

const DEFAULT_SUBJECTS = [
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Tiếng Anh',
  'Lịch sử',
  'Tin học',
  'Âm nhạc',
  'Mỹ thuật',
  'Tiếng Tây Ban Nha',
  'Tiếng Pháp',
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

const getDegree = (qualification) => {
  const match = qualification.match(/(Cử nhân|Thạc sĩ|Tiến sĩ|Bác sĩ|Kỹ sư)/i);
  return match ? match[1] : 'Chưa cập nhật';
};

const normalizeTutor = (rawTutor, index) => {
  const subject = getText(rawTutor?.subject);
  const qualification = getText(rawTutor?.qualification) || subject;
  const subjects = toList(rawTutor?.subjects);

  if (!subjects.length && subject && subject.toLowerCase() !== 'chưa cập nhật') {
    subjects.push(...toList(subject));
  }

  if (!subjects.length) {
    subjects.push('Chưa cập nhật môn dạy');
  }

  const fullName = getText(rawTutor?.fullName, 'Gia sư chưa cập nhật tên');

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
    hourlyRate: toNumber(rawTutor?.hourlyRate, 250000) || 250000,
    verificationStatus: getText(rawTutor?.verificationStatus, 'PENDING').toUpperCase(),
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
      ...tutorsList.flatMap((tutor) => tutor.subjects)
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

    const matchSubject = selectedSubject === 'all' || selectedSubject === 'Tất cả môn học' || t.subjects.includes(selectedSubject);
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
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.3rem',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 16px 0'
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
              <option value="rating_desc">Đánh giá cao nhất ⌄</option>
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
          <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
            {loading ? 'Đang tải danh sách gia sư...' : `${filteredTutors.length} gia sư được tìm thấy`}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredTutors.map((tutor) => (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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

                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.2 }}>
                          {tutor.fullName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
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
                    {tutor.experienceYears > 0 ? `${tutor.experienceYears} năm kinh nghiệm` : 'Chưa cập nhật kinh nghiệm'}
                    {' · '}
                    {tutor.studentsCount > 0 ? `${tutor.studentsCount} học sinh` : 'Chưa có học sinh'}
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
          )}
        </div>
      </div>
    </div>
  );
}
