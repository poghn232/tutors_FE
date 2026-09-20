import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  ChevronDown, 
  SlidersHorizontal 
} from 'lucide-react';
import BookingView from './BookingView';

export default function TutorCatalog({ onSelectTutor, onNavigate, user, onRequireAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedEducation, setSelectedEducation] = useState('all');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState('all');
  const [selectedHobby, setSelectedHobby] = useState('all');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [activeBookingTutor, setActiveBookingTutor] = useState(null);

  // 8 Tutors exactly matching Figma 15:2008
  const tutorsList = [
    {
      id: 1,
      fullName: 'TS. Nguyễn Thị Hoa',
      school: 'Tiến sĩ · ĐH Quốc gia Hà Nội',
      degree: 'Tiến sĩ',
      gender: 'Nữ',
      hourlyRate: 250000,
      rating: 4.9,
      reviewsCount: 127,
      experienceYears: 8,
      studentsCount: 243,
      subjects: ['Toán học', 'Vật lý', 'Tin học'],
      hobbies: ['Cờ vua', 'Đọc sách'],
      bio: 'Tiến sĩ Toán học ứng dụng tại ĐH Quốc gia Hà Nội. Tôi giúp học sinh hiểu toán học qua các ứng dụng thực tế. 8+ năm kinh nghiệm từ THCS đến đại học.',
      avatarColor: '#22c55e'
    },
    {
      id: 2,
      fullName: 'TS. Phạm Thị Lan',
      school: 'Tiến sĩ · ĐH Y Hà Nội',
      degree: 'Tiến sĩ',
      gender: 'Nữ',
      hourlyRate: 300000,
      rating: 4.9,
      reviewsCount: 203,
      experienceYears: 10,
      studentsCount: 312,
      subjects: ['Hóa học', 'Sinh học'],
      hobbies: ['Nấu ăn', 'Du lịch'],
      bio: 'Tiến sĩ Y khoa tại ĐH Y Hà Nội. Chuyên luyện thi y dược và khoa học tự nhiên. 96% học sinh đậu kỳ thi quốc gia.',
      avatarColor: '#f59e0b'
    },
    {
      id: 3,
      fullName: 'TS. Lê Thị Thu',
      school: 'Tiến sĩ · ĐH Stanford (Hoa Kỳ)',
      degree: 'Tiến sĩ',
      gender: 'Nữ',
      hourlyRate: 280000,
      rating: 4.9,
      reviewsCount: 158,
      experienceYears: 12,
      studentsCount: 289,
      subjects: ['Sinh học', 'Hóa học', 'Luyện thi THPT'],
      hobbies: ['Thể thao', 'Nghệ thuật'],
      bio: 'Cựu giảng viên đại học với niềm đam mê làm cho khoa học trở nên thú vị. Sử dụng thí nghiệm thực hành và ví dụ thực tế để xây dựng hiểu biết sâu.',
      avatarColor: '#ef4444'
    },
    {
      id: 4,
      fullName: 'Trần Minh Đức',
      school: 'Thạc sĩ · ĐH Ngoại Thương',
      degree: 'Thạc sĩ',
      gender: 'Nam',
      hourlyRate: 200000,
      rating: 4.8,
      reviewsCount: 89,
      experienceYears: 6,
      studentsCount: 178,
      subjects: ['Tiếng Anh', 'Lịch sử', 'Luyện thi THPT'],
      hobbies: ['Du lịch', 'Điện ảnh'],
      bio: 'Thạc sĩ Giáo dục tại ĐH Ngoại Thương. Cựu giáo viên THPT, chuyên gia luyện thi đại học với tỉ lệ học sinh đậu 95%.',
      avatarColor: '#8b5cf6'
    },
    {
      id: 5,
      fullName: 'Vũ Thị Mai',
      school: 'Thạc sĩ · ĐH Sorbonne',
      degree: 'Thạc sĩ',
      gender: 'Nữ',
      hourlyRate: 180000,
      rating: 4.8,
      reviewsCount: 76,
      experienceYears: 7,
      studentsCount: 134,
      subjects: ['Tiếng Pháp', 'Tiếng Tây Ban Nha', 'Mỹ thuật'],
      hobbies: ['Nghệ thuật', 'Du lịch'],
      bio: 'Người Pháp gốc Việt, Thạc sĩ Lịch sử Nghệ thuật tại Sorbonne. Dạy ngôn ngữ qua văn hóa - nghệ thuật, điện ảnh, ẩm thực và văn học.',
      avatarColor: '#ec4899'
    },
    {
      id: 6,
      fullName: 'Lê Văn Hùng',
      school: 'Cử nhân · ĐH Bách Khoa TP.HCM',
      degree: 'Cử nhân',
      gender: 'Nam',
      hourlyRate: 220000,
      rating: 4.7,
      reviewsCount: 54,
      experienceYears: 4,
      studentsCount: 87,
      subjects: ['Tin học', 'Toán học'],
      hobbies: ['Công nghệ', 'Gaming'],
      bio: 'Kỹ sư phần mềm tại VNG. Dạy lập trình theo phương pháp thực hành - học viên tạo ra sản phẩm thật sau mỗi khóa học.',
      avatarColor: '#06b6d4'
    },
    {
      id: 7,
      fullName: 'Đỗ Thanh Tùng',
      school: 'Thạc sĩ · ĐH Bách Khoa Hà Nội',
      degree: 'Thạc sĩ',
      gender: 'Nam',
      hourlyRate: 230000,
      rating: 4.7,
      reviewsCount: 93,
      experienceYears: 6,
      studentsCount: 201,
      subjects: ['Toán học', 'Vật lý', 'Luyện thi THPT'],
      hobbies: ['Cờ vua', 'Thể thao'],
      bio: 'Thạc sĩ Vật lý tại ĐH Bách Khoa. Chuyên luyện thi THPT quốc gia và Olympic Toán. Hơn 200 học sinh tăng điểm trung bình 2.5 điểm.',
      avatarColor: '#10b981'
    },
    {
      id: 8,
      fullName: 'Nguyễn Quốc Bảo',
      school: 'Cử nhân · Nhạc viện Hà Nội',
      degree: 'Cử nhân',
      gender: 'Nam',
      hourlyRate: 190000,
      rating: 4.6,
      reviewsCount: 41,
      experienceYears: 5,
      studentsCount: 62,
      subjects: ['Âm nhạc', 'Toán học'],
      hobbies: ['Âm nhạc', 'Hoạt động ngoài trời'],
      bio: 'Tốt nghiệp Nhạc viện Hà Nội và yêu thích Toán học. Tìm ra mối liên hệ giữa lý thuyết âm nhạc và toán học để truyền cảm hứng cho học sinh.',
      avatarColor: '#f97316'
    }
  ];

  const subjectsList = [
    'Tất cả môn học',
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

  const hobbiesList = [
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
    const matchPrice = t.hourlyRate <= maxPrice;
    const matchRating = minRating === 'all' || t.rating >= parseFloat(minRating);
    const matchHobby = selectedHobby === 'all' || (t.hobbies && t.hobbies.includes(selectedHobby));

    return matchSearch && matchSubject && matchGender && matchEducation && matchPrice && matchRating && matchHobby;
  });

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ/giờ';
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
              <option value="price_asc">Học phí: Thấp đến cao</option>
              <option value="price_desc">Học phí: Cao đến thấp</option>
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

          {/* SECTION 4: GIÁ TỐI ĐA */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
              GIÁ TỐI ĐA: {new Intl.NumberFormat('vi-VN').format(maxPrice)}Đ/GIỜ
            </div>
            <input 
              type="range"
              min="100000"
              max="500000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              <span>100.000đ</span>
              <span>500.000đ</span>
            </div>
          </div>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }} />

          {/* SECTION 5: ĐÁNH GIÁ TỐI THIỂU */}
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
            {filteredTutors.length} gia sư được tìm thấy
          </div>

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
                        {tutor.fullName.charAt(tutor.fullName.lastIndexOf(' ') + 1)}
                      </div>

                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.2 }}>
                          {tutor.fullName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                          {tutor.school}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★★★★★</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{tutor.rating}</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({tutor.reviewsCount})</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#059669', whiteSpace: 'nowrap' }}>
                      {formatVND(tutor.hourlyRate)}
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
                    {tutor.experienceYears} năm kinh nghiệm · {tutor.studentsCount} học sinh
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
        </div>
      </div>
    </div>
  );
}
