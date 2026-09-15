import React, { useState, useEffect } from 'react';
import { tutorService } from '../services/tutorService';
import { 
  Search, 
  Star, 
  Award, 
  CheckCircle2, 
  DollarSign, 
  User, 
  BookOpen, 
  Calendar, 
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import BookingView from './BookingView';

export default function TutorCatalog({ onSelectTutor }) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [activeBookingTutor, setActiveBookingTutor] = useState(null);

  // Mock list matching Figma EXE-2 frame 15:2008
  const defaultTutors = [
    {
      id: 1,
      fullName: 'Hoàng Thiên Ưng',
      degree: 'Thạc sĩ Toán học',
      school: 'Đại học Bách Khoa Hà Nội',
      experienceYears: 8,
      rating: 4.9,
      reviewsCount: 127,
      studentsCount: 243,
      hourlyRate: 250000,
      gender: 'male',
      educationLevel: 'master',
      subjects: ['Toán học', 'Vật lý', 'Tin học'],
      bio: 'Tiến sĩ Toán học ứng dụng tại ĐH Quốc gia Hà Nội. Tôi giúp học sinh hiểu toán học qua các ứng dụng thực tế. 8+ năm kinh nghiệm từ THCS đến đại học.',
      verified: true,
    },
    {
      id: 2,
      fullName: 'TS. Nguyễn Thị Hoa',
      degree: 'Tiến sĩ Sư phạm Toán',
      school: 'Đại học Sư phạm Hà Nội',
      experienceYears: 10,
      rating: 5.0,
      reviewsCount: 184,
      studentsCount: 310,
      hourlyRate: 300000,
      gender: 'female',
      educationLevel: 'doctor',
      subjects: ['Toán học', 'Luyện thi THPT'],
      bio: 'Chuyên gia luyện thi THPT Quốc gia môn Toán với hơn 10 năm kinh nghiệm. Đã giúp hơn 150 học sinh đạt 9+ môn Toán trong các kỳ thi đại học.',
      verified: true,
    },
    {
      id: 3,
      fullName: 'TS. Phạm Thị Lan',
      degree: 'Tiến sĩ Hóa học',
      school: 'Đại học Khoa học Tự nhiên',
      experienceYears: 7,
      rating: 4.9,
      reviewsCount: 96,
      studentsCount: 180,
      hourlyRate: 280000,
      gender: 'female',
      educationLevel: 'doctor',
      subjects: ['Hóa học', 'Sinh học'],
      bio: 'Giảng viên chuyên ngành Hóa học hữu cơ. Phương pháp dạy học trực quan, biến các phương trình hóa học phức tạp thành sơ đồ tư duy sinh động.',
      verified: true,
    },
    {
      id: 4,
      fullName: 'Trần Minh Đức',
      degree: 'Cử nhân Kinh tế Quốc tế - IELTS 8.5',
      school: 'Đại học Ngoại Thương',
      experienceYears: 5,
      rating: 4.8,
      reviewsCount: 112,
      studentsCount: 205,
      hourlyRate: 250000,
      gender: 'male',
      educationLevel: 'bachelor',
      subjects: ['Tiếng Anh', 'Luyện thi THPT'],
      bio: 'Cựu học sinh Chuyên Anh Amsterdam, đạt IELTS 8.5 từ năm 20 tuổi. Chuyên dạy phát âm chuẩn, tư duy phản biện tiếng Anh và mẹo giải đề đọc hiểu.',
      verified: true,
    },
  ];

  useEffect(() => {
    async function loadTutors() {
      try {
        setLoading(true);
        const res = await tutorService.getTutors();
        if (res.success && res.data && res.data.length > 0) {
          setTutors(res.data);
        } else {
          setTutors(defaultTutors);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách gia sư, dùng dữ liệu mẫu Figma:', err);
        setTutors(defaultTutors);
      } finally {
        setLoading(false);
      }
    }
    loadTutors();
  }, []);

  const subjectsList = [
    { id: 'all', label: 'Tất cả môn học' },
    { id: 'Toán học', label: 'Toán học' },
    { id: 'Vật lý', label: 'Vật lý' },
    { id: 'Hóa học', label: 'Hóa học' },
    { id: 'Sinh học', label: 'Sinh học' },
    { id: 'Tiếng Anh', label: 'Tiếng Anh' },
    { id: 'Tin học', label: 'Tin học' },
    { id: 'Luyện thi THPT', label: 'Luyện thi THPT' },
  ];

  const filteredTutors = tutors.filter((t) => {
    const term = searchQuery.toLowerCase();
    const matchSearch = (
      (t.fullName && t.fullName.toLowerCase().includes(term)) ||
      (t.school && t.school.toLowerCase().includes(term)) ||
      (t.bio && t.bio.toLowerCase().includes(term)) ||
      (t.subjects && t.subjects.some(s => s.toLowerCase().includes(term)))
    );

    const matchSubject = selectedSubject === 'all' || (t.subjects && t.subjects.includes(selectedSubject));
    const matchGender = selectedGender === 'all' || t.gender === selectedGender;
    const matchDegree = selectedDegree === 'all' || t.educationLevel === selectedDegree;

    return matchSearch && matchSubject && matchGender && matchDegree;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  if (activeBookingTutor) {
    return (
      <BookingView 
        tutor={activeBookingTutor} 
        onBack={() => setActiveBookingTutor(null)} 
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Tìm Gia Sư Phù Hợp</h2>
          <p className="section-desc">
            Kết nối với hơn 2.400+ gia sư chất lượng cao, đúng môn, đúng trình độ trên toàn quốc
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '40px', height: '44px' }}
            placeholder="Tìm theo tên gia sư, môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Catalog Layout: Left Filter Sidebar + Right Tutor Grid (Figma 15:2008) */}
      <div className="catalog-layout">
        {/* Filter Sidebar */}
        <aside className="filter-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#0f172a', fontWeight: '800' }}>
            <SlidersHorizontal size={18} />
            <span>BỘ LỌC TÌM KIẾM</span>
          </div>

          {/* Subjects */}
          <div className="filter-group">
            <span className="filter-label">Môn Học</span>
            <div className="filter-chip-grid">
              {subjectsList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`filter-chip ${selectedSubject === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="filter-group">
            <span className="filter-label">Giới Tính</span>
            <div className="filter-chip-grid">
              <button
                type="button"
                className={`filter-chip ${selectedGender === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedGender('all')}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`filter-chip ${selectedGender === 'male' ? 'active' : ''}`}
                onClick={() => setSelectedGender('male')}
              >
                Nam
              </button>
              <button
                type="button"
                className={`filter-chip ${selectedGender === 'female' ? 'active' : ''}`}
                onClick={() => setSelectedGender('female')}
              >
                Nữ
              </button>
            </div>
          </div>

          {/* Education Level */}
          <div className="filter-group">
            <span className="filter-label">Học Vấn</span>
            <div className="filter-chip-grid">
              <button
                type="button"
                className={`filter-chip ${selectedDegree === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedDegree('all')}
              >
                Mọi trình độ
              </button>
              <button
                type="button"
                className={`filter-chip ${selectedDegree === 'bachelor' ? 'active' : ''}`}
                onClick={() => setSelectedDegree('bachelor')}
              >
                Cử nhân
              </button>
              <button
                type="button"
                className={`filter-chip ${selectedDegree === 'master' ? 'active' : ''}`}
                onClick={() => setSelectedDegree('master')}
              >
                Thạc sĩ
              </button>
              <button
                type="button"
                className={`filter-chip ${selectedDegree === 'doctor' ? 'active' : ''}`}
                onClick={() => setSelectedDegree('doctor')}
              >
                Tiến sĩ
              </button>
            </div>
          </div>
        </aside>

        {/* Right: Tutor Grid */}
        <section>
          <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            Hiển thị <strong>{filteredTutors.length}</strong> gia sư phù hợp
          </div>

          {filteredTutors.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              <BookOpen size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không tìm thấy gia sư nào theo tiêu chí đã chọn.</p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setSelectedSubject('all');
                  setSelectedGender('all');
                  setSelectedDegree('all');
                  setSearchQuery('');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="tutor-grid">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="tutor-card">
                  <div>
                    {/* Header: Avatar & Name */}
                    <div className="tutor-header">
                      <div className="tutor-avatar" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.4rem',
                        color: '#2563eb',
                        background: '#eff6ff'
                      }}>
                        {tutor.fullName.charAt(0)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="tutor-name">
                          {tutor.fullName}
                          {tutor.verified && (
                            <span title="Đã xác minh danh tính và bằng cấp">
                              <CheckCircle2 size={17} className="verified-icon" />
                            </span>
                          )}
                        </div>
                        <div className="tutor-school">
                          {tutor.school} • {tutor.experienceYears} năm kinh nghiệm
                        </div>
                      </div>
                    </div>

                    {/* Rating & Stats */}
                    <div className="tutor-meta">
                      <span className="tutor-rating">
                        <Star size={15} fill="#f59e0b" /> {tutor.rating}
                      </span>
                      <span>({tutor.reviewsCount} đánh giá)</span>
                      <span>•</span>
                      <span>{tutor.studentsCount} học sinh</span>
                    </div>

                    {/* Bio */}
                    <p className="tutor-bio">
                      {tutor.bio}
                    </p>

                    {/* Subject Tags */}
                    <div className="tutor-tags">
                      {tutor.subjects && tutor.subjects.map((sub, idx) => (
                        <span key={idx} className="tutor-tag">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="tutor-footer">
                    <div className="tutor-price">
                      <strong>{formatCurrency(tutor.hourlyRate)}</strong>
                      <span> / buổi</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                      onClick={() => setActiveBookingTutor(tutor)}
                    >
                      Đặt lịch học
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
