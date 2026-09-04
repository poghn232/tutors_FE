import React, { useState, useEffect } from 'react';
import { classService } from '../services/classService';
import { subjectService } from '../services/subjectService';
import { BookOpen, Plus, User, Calendar, Clock, CheckCircle2, X } from 'lucide-react';

export default function ClassManagement({ user }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal tạo lớp học
  const [showModal, setShowModal] = useState(false);
  const [classNameInput, setClassNameInput] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentEmailInput, setStudentEmailInput] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchClassesAndSubjects = async () => {
    try {
      setLoading(true);
      const [classRes, subjectRes] = await Promise.all([
        classService.getClasses(),
        subjectService.getSubjects()
      ]);

      if (classRes.success) setClasses(classRes.data || []);
      if (subjectRes.success && subjectRes.data) {
        setSubjects(subjectRes.data);
        if (subjectRes.data.length > 0) {
          setSelectedSubjectId(subjectRes.data[0].id);
        }
      }
    } catch (err) {
      setError('Lỗi khi lấy dữ liệu lớp học.');
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

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách lớp học...</div>;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
            Quản lý Lớp học ({classes.length} lớp)
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Xem thông tin chi tiết các lớp dạy kèm, môn học và lịch giảng dạy.
          </p>
        </div>

        {(user.role === 'TUTOR' || user.role === 'PARENT') && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '6px' }}>
            <Plus size={18} /> Tạo lớp học mới
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {classes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <BookOpen size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Hiện tại chưa có lớp học nào.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {classes.map((cls) => (
            <div key={cls.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-tutor">{cls.subjectName}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: cls.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                    color: cls.status === 'ACTIVE' ? '#15803d' : '#64748b',
                    fontWeight: '600'
                  }}>
                    {cls.status === 'ACTIVE' ? 'Đang hoạt động' : cls.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#0f172a' }}>{cls.className}</h4>

                <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="#2563eb" />
                    <span>Gia sư: <strong>{cls.tutorName}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="#10b981" />
                    <span>Học sinh: <strong>{cls.studentName}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="#8b5cf6" />
                    <span>Phụ huynh: <strong>{cls.parentName}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Clock size={16} color="#f59e0b" />
                    <span>Lịch học: {cls.scheduleDescription || 'Thứ 2 & Thứ 4 (19:00 - 21:00)'}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Mã lớp: #{cls.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tạo lớp mới */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Tạo Lớp Học Dạy Kèm Mới</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label>Tên Lớp học (*)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Lớp Toán 12 - Luyện đề ĐHQG"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Chọn Môn học (*)</label>
                <select
                  className="form-control"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  required
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tên Học sinh</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Trần Bảo Nam"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Học sinh (Tùy chọn)</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="hocsinh@example.com"
                  value={studentEmailInput}
                  onChange={(e) => setStudentEmailInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mô tả lịch học</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Thứ 3 & 5 (19:00 - 21:00)"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Đang khởi tạo...' : 'Khởi tạo Lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
