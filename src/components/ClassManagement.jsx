import React, { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import { subjectService } from '../services/subjectService';
import { 
  BookOpen, 
  Plus, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Video, 
  GraduationCap, 
  Layers, 
  ArrowRight,
  X
} from 'lucide-react';

export default function ClassManagement({ user, onNavigateToTutors }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('upcoming'); // 'upcoming', 'completed', 'all'

  // Modal tạo lớp học
  const [showModal, setShowModal] = useState(false);
  const [classNameInput, setClassNameInput] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentEmailInput, setStudentEmailInput] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sample classes matching Figma EXE-2 frame 15:2994
  const defaultClasses = [
    {
      id: 101,
      className: 'Toán 12 - Luyện thi Đại học Chuyên sâu',
      subjectName: 'Toán học',
      tutorName: 'TS. Nguyễn Thị Hoa',
      date: '16/09/2026',
      time: '19:00',
      durationMinutes: 90,
      topic: 'Chương 5: Phương pháp Tích phân từng phần và ứng dụng thể tích khối tròn xoay',
      status: 'upcoming',
      roomUrl: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: 102,
      className: 'Hóa học 11 - Phản ứng este hóa nâng cao',
      subjectName: 'Hóa học',
      tutorName: 'TS. Phạm Thị Lan',
      date: '18/09/2026',
      time: '18:00',
      durationMinutes: 90,
      topic: 'Hóa hữu cơ: Cơ chế phản ứng xà phòng hóa và dạng bài toán đốt cháy este tạp chức',
      status: 'upcoming',
      roomUrl: 'https://meet.google.com/xyz-uvwx-rst',
    },
    {
      id: 103,
      className: 'Tiếng Anh 12 - Chiến thuật Đọc hiểu',
      subjectName: 'Tiếng Anh',
      tutorName: 'Trần Minh Đức',
      date: '20/09/2026',
      time: '20:00',
      durationMinutes: 60,
      topic: 'Skimming & Scanning trong các bài đọc văn hóa xã hội dài 800 từ',
      status: 'upcoming',
      roomUrl: 'https://meet.google.com/eng-read-101',
    },
    {
      id: 104,
      className: 'Vật lý 12 - Dao động điều hòa cơ bản',
      subjectName: 'Vật lý',
      tutorName: 'ThS. Hoàng Thiên Ưng',
      date: '10/09/2026',
      time: '15:00',
      durationMinutes: 90,
      topic: 'Khảo sát con lắc lò xo và bài toán năng lượng cơ học',
      status: 'completed',
      roomUrl: null,
    },
    {
      id: 105,
      className: 'Toán 12 - Khảo sát và vẽ đồ thị hàm số',
      subjectName: 'Toán học',
      tutorName: 'TS. Nguyễn Thị Hoa',
      date: '08/09/2026',
      time: '19:00',
      durationMinutes: 90,
      topic: 'Cực trị của hàm số chứa dấu giá trị tuyệt đối',
      status: 'completed',
      roomUrl: null,
    }
  ];

  const fetchClassesAndSubjects = async () => {
    try {
      setLoading(true);
      const [classRes, subjectRes] = await Promise.all([
        classService.getClasses(),
        subjectService.getSubjects()
      ]);

      if (classRes.success && classRes.data && classRes.data.length > 0) {
        setClasses(classRes.data);
      } else {
        setClasses(defaultClasses);
      }

      if (subjectRes.success && subjectRes.data) {
        setSubjects(subjectRes.data);
        if (subjectRes.data.length > 0) {
          setSelectedSubjectId(subjectRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Dùng dữ liệu mẫu Figma do backend chưa có lớp học:', err);
      setClasses(defaultClasses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndSubjects();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classNameInput.trim() || !selectedSubjectId) {
      alert('Vui lòng nhập tên lớp và chọn môn học.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        className: classNameInput.trim(),
        subjectId: Number(selectedSubjectId),
        studentName: studentNameInput.trim(),
        studentEmail: studentEmailInput.trim(),
        scheduleDescription: scheduleInput.trim() || 'Thứ 2 & Thứ 4 (19:00 - 21:00)'
      };

      const res = await classService.createClass(payload);
      if (res.success) {
        alert('Tạo lớp học thành công!');
        setShowModal(false);
        setClassNameInput('');
        setStudentNameInput('');
        setStudentEmailInput('');
        setScheduleInput('');
        fetchClassesAndSubjects();
      } else {
        alert(res.message || 'Tạo lớp học thất bại.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingList = classes.filter(c => c.status === 'upcoming');
  const completedList = classes.filter(c => c.status === 'completed');

  const filteredClasses = classes.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  return (
    <div>
      {/* Header matching Figma 15:2994 */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Lớp Học Của Tôi</h2>
          <p className="section-desc">Theo dõi buổi học, lịch giảng dạy và tiến trình học tập chi tiết</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {(user?.role === 'TUTOR' || user?.role === 'PARENT') && (
            <button 
              type="button" 
              onClick={() => setShowModal(true)} 
              className="btn btn-secondary" 
              style={{ gap: '6px' }}
            >
              <Plus size={16} /> Tạo lớp mới
            </button>
          )}

          {onNavigateToTutors && (
            <button 
              type="button" 
              onClick={onNavigateToTutors} 
              className="btn btn-primary" 
              style={{ gap: '6px' }}
            >
              <Plus size={16} /> Đặt Lịch Học Mới
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Cards matching Figma 15:2994 */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Calendar size={26} />
          </div>
          <div>
            <strong>{upcomingList.length}</strong>
            <span>Buổi học sắp tới</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <strong>{completedList.length}</strong>
            <span>Buổi đã hoàn thành</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <strong>3</strong>
            <span>Gia sư đang học</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Layers size={26} />
          </div>
          <div>
            <strong>4</strong>
            <span>Môn đang học</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs matching Figma 15:2994 */}
      <div className="sub-tabs">
        <button
          type="button"
          className={`sub-tab-btn ${statusFilter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setStatusFilter('upcoming')}
        >
          Sắp tới ({upcomingList.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          Đã hoàn thành ({completedList.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Tất cả ({classes.length})
        </button>
      </div>

      {/* Class Cards Grid matching Figma 15:2994 */}
      {filteredClasses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          <BookOpen size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không có lớp học nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="class-grid">
          {filteredClasses.map((item) => (
            <div key={item.id} className="class-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="tutor-tag">{item.subjectName || item.className}</span>
                  <span className={`class-status-pill ${item.status === 'upcoming' ? 'status-upcoming' : 'status-completed'}`}>
                    {item.status === 'upcoming' ? 'Sắp tới' : 'Đã hoàn thành'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {item.tutorName || item.className}
                </h3>

                {item.topic && (
                  <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '14px', lineHeight: 1.5 }}>
                    {item.topic}
                  </p>
                )}

                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  display: 'grid',
                  gap: '6px',
                  color: '#475569'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#2563eb" />
                    <span>Ngày học: <strong>{item.date || 'Theo thỏa thuận'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} color="#10b981" />
                    <span>Thời gian: <strong>{item.time || '19:00'} ({item.durationMinutes || 90} phút)</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {item.status === 'upcoming' ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    style={{ gap: '8px' }}
                    onClick={() => {
                      if (item.roomUrl) {
                        window.open(item.roomUrl, '_blank');
                      } else {
                        alert('Phòng học trực tuyến sẽ mở trước 10 phút giờ học.');
                      }
                    }}
                  >
                    <Video size={16} /> Tham gia buổi học
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    style={{ gap: '6px' }}
                    onClick={() => alert('Đang mở bản ghi hình và AI Note của buổi học...')}
                  >
                    Xem lại ghi chú AI
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal tạo lớp học */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Tạo Lớp Học Mới</h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label>Tên lớp học / Mục tiêu:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Ôn thi Đại học môn Toán 12"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Môn học:</label>
                <select
                  className="form-control"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tên học sinh:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ và tên học sinh"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Lịch học mong muốn:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Thứ 3 & Thứ 6 (19:30 - 21:00)"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Đang tạo...' : 'Tạo lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
