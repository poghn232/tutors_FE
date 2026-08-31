import React, { useState, useEffect } from 'react';
import { lessonService } from '../services/lessonService';
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, FileText, Plus, Sparkles, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function LessonList({ user }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State cho Form tạo buổi học mới (Gia sư)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // State cho Modal Ghi chú & AI Note (Gia sư)
  const [selectedLessonForNote, setSelectedLessonForNote] = useState(null);
  const [rawNoteInput, setRawNoteInput] = useState('');
  const [aiSummaryInput, setAiSummaryInput] = useState('');
  const [keyLearningsInput, setKeyLearningsInput] = useState('');
  const [areasImprovementInput, setAreasImprovementInput] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteSuccessMsg, setNoteSuccessMsg] = useState('');

  // State xem chi tiết ghi chú đối với Phụ huynh / Học sinh
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await lessonService.getLessons();
      if (res.success) {
        setLessons(res.data || []);
      } else {
        setError(res.message || 'Không thể tải danh sách buổi học.');
      }
    } catch (err) {
      setError('Lỗi khi kết nối với hệ thống backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleStatusChange = async (lessonId, newStatus) => {
    try {
      const res = await lessonService.updateLessonStatus(lessonId, newStatus);
      if (res.success) {
        fetchLessons();
      }
    } catch (err) {
      alert('Không thể cập nhật trạng thái buổi học.');
    }
  };

  const handleOpenNoteModal = (lesson) => {
    setSelectedLessonForNote(lesson);
    const existingNote = lesson.lessonNote;
    if (existingNote) {
      setRawNoteInput(existingNote.rawTutorNote || '');
      setAiSummaryInput(existingNote.aiSummary || '');
      setKeyLearningsInput(existingNote.keyLearnings || '');
      setAreasImprovementInput(existingNote.areasForImprovement || '');
    } else {
      setRawNoteInput('');
      setAiSummaryInput('');
      setKeyLearningsInput('');
      setAreasImprovementInput('');
    }
    setNoteSuccessMsg('');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!rawNoteInput.trim()) {
      alert('Vui lòng nhập ghi chú của gia sư.');
      return;
    }

    try {
      setNoteSubmitting(true);
      const notePayload = {
        rawTutorNote: rawNoteInput,
        aiSummary: aiSummaryInput.trim() ? aiSummaryInput : `📌 [AI Note Tóm tắt]: ${rawNoteInput}`,
        keyLearnings: keyLearningsInput.trim() ? keyLearningsInput : 'Kiến thức trọng tâm bài học',
        areasForImprovement: areasImprovementInput.trim() ? areasImprovementInput : 'Cần rèn luyện bài tập ứng dụng'
      };

      const res = await lessonService.saveLessonNote(selectedLessonForNote.id, notePayload);
      if (res.success) {
        setNoteSuccessMsg('Đã lưu Ghi chú & AI Note thành công!');
        setTimeout(() => {
          setSelectedLessonForNote(null);
          fetchLessons();
        }, 1200);
      }
    } catch (err) {
      alert('Lưu ghi chú thất bại.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleSimulateAiProcessing = () => {
    if (!rawNoteInput.trim()) {
      alert('Vui lòng nhập ghi chú thô trước khi sinh tóm tắt AI.');
      return;
    }
    setAiSummaryInput(`📌 [AI Note Tóm tắt]: Buổi học hoàn thành tốt. Gia sư đã giảng dạy các phần: ${rawNoteInput}`);
    setKeyLearningsInput('Nắm chắc định lý, công thức cốt lõi và các dạng bài tập thực hành.');
    setAreasImprovementInput('Cần chú ý ôn lại bài tập trắc nghiệm và chuẩn bị bài mới trước buổi học sau.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>Đã lên lịch</span>;
      case 'COMPLETED':
        return <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>Đã hoàn thành</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>Đã hủy</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách buổi học...</div>;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
            Quản lý Buổi học & Tiến độ ({lessons.length} buổi)
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0 0 0' }}>
            {user.role === 'TUTOR' && 'Theo dõi danh sách giảng dạy, cập nhật trạng thái và ghi chú AI Note cho từng buổi học.'}
            {user.role === 'PARENT' && 'Theo dõi lịch học của con và xem tóm tắt kết quả buổi học từ Gia sư.'}
            {user.role === 'STUDENT' && 'Xem lịch học cá nhân và ghi chú ôn tập trọng tâm.'}
          </p>
        </div>

        {user.role === 'TUTOR' && (
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn btn-primary"
            style={{ gap: '6px', fontSize: '0.875rem' }}
          >
            <Plus size={18} /> Thêm buổi học mới
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Lesson List Display */}
      {lessons.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Chưa có buổi học nào trong hệ thống.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {lessons.map((lesson) => {
            const isExpanded = expandedLessonId === lesson.id;
            return (
              <div key={lesson.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  
                  {/* Lesson Info Left */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f172a' }}>
                        {lesson.title}
                      </span>
                      {getStatusBadge(lesson.status)}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <BookOpen size={15} color="#2563eb" /> Lớp: <strong>{lesson.className}</strong> ({lesson.subjectName})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={15} color="#64748b" /> Gia sư: {lesson.tutorName} • Học sinh: {lesson.studentName}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                      <Clock size={15} /> {formatDate(lesson.startTime)} - {formatDate(lesson.endTime)}
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {user.role === 'TUTOR' && (
                      <>
                        {lesson.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleStatusChange(lesson.id, 'COMPLETED')}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '6px 10px', gap: '4px', color: '#15803d', borderColor: '#bbf7d0' }}
                          >
                            <CheckCircle size={15} /> Hoàn thành
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenNoteModal(lesson)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
                        >
                          <Sparkles size={15} />
                          {lesson.lessonNote ? 'Sửa AI Note' : 'Nhập AI Note'}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 10px', gap: '4px' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Thu gọn' : 'Xem Ghi chú'}
                    </button>
                  </div>
                </div>

                {/* Expanded AI Note Section */}
                {(isExpanded || (lesson.lessonNote && user.role !== 'TUTOR')) && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '6px'
                  }}>
                    {lesson.lessonNote ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <Sparkles size={18} color="#2563eb" />
                          <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>Báo cáo tóm tắt bài học (AI Note)</strong>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', marginBottom: '12px' }}>
                          <strong>📌 Tóm tắt kết quả:</strong> {lesson.lessonNote.aiSummary}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                          <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#065f46', display: 'block', marginBottom: '4px' }}>✅ Kiến thức trọng tâm:</strong>
                            <span style={{ color: '#475569' }}>{lesson.lessonNote.keyLearnings}</span>
                          </div>

                          <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#92400e', display: 'block', marginBottom: '4px' }}>💡 Điểm cần lưu ý / Bài tập về nhà:</strong>
                            <span style={{ color: '#475569' }}>{lesson.lessonNote.areasForImprovement}</span>
                          </div>
                        </div>

                        {user.role === 'TUTOR' && (
                          <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Ghi chú thô của bạn: <em>"{lesson.lessonNote.rawTutorNote}"</em>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center' }}>
                        Buổi học này chưa có ghi chú từ Gia sư.
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nhập Ghi chú & Tóm tắt AI Note (Gia sư) */}
      {selectedLessonForNote && (
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
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
              Cập nhật Ghi chú & AI Note
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
              Buổi học: <strong>{selectedLessonForNote.title}</strong> ({selectedLessonForNote.className})
            </p>

            {noteSuccessMsg && <div className="alert alert-success">{noteSuccessMsg}</div>}

            <form onSubmit={handleSaveNote}>
              <div className="form-group">
                <label>1. Nhập ghi chú thô của Gia sư (*)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Ví dụ: Đã dạy xong chương 2 Đạo hàm. Học sinh làm bài nhanh nhưng cần chú ý trắc nghiệm..."
                  value={rawNoteInput}
                  onChange={(e) => setRawNoteInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleSimulateAiProcessing}
                  className="btn btn-secondary"
                  style={{ gap: '6px', fontSize: '0.85rem', width: '100%', borderColor: '#2563eb', color: '#2563eb' }}
                >
                  <Sparkles size={16} /> Tự động sinh tóm tắt AI Note từ ghi chú thô
                </button>
              </div>

              <div className="form-group">
                <label>2. Tóm tắt AI Note (Phụ huynh & Học sinh sẽ nhìn thấy)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn kết quả bài học..."
                  value={aiSummaryInput}
                  onChange={(e) => setAiSummaryInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>3. Kiến thức trọng tâm</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Công thức tính đạo hàm hàm hợp"
                  value={keyLearningsInput}
                  onChange={(e) => setKeyLearningsInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>4. Điểm cần cải thiện / Bài tập về nhà</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Bài 1-5 trang 42 SGK"
                  value={areasImprovementInput}
                  onChange={(e) => setAreasImprovementInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLessonForNote(null)}
                  className="btn btn-secondary"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={noteSubmitting}
                >
                  {noteSubmitting ? 'Đang lưu...' : 'Lưu Ghi chú & AI Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
