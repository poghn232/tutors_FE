import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar, 
  User, 
  ExternalLink,
  Upload,
  Send,
  Sparkles
} from 'lucide-react';

export default function AssignmentView({ user }) {
  const [filter, setFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState('');

  // Sample data matching Figma EXE-2 frames (15:9866 & 16:1285)
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: 'Tiếng Anh',
      title: 'Phân tích đề đọc hiểu THPT 2025',
      tutor: 'Trần Minh Đức',
      description: 'Phân tích đoạn văn đọc hiểu trong đề thi thử THPT 2025, trả lời các câu hỏi và viết đoạn nhận xét 150 từ về chủ đề bài đọc.',
      assignedDate: '01/09/2026',
      dueDate: '08/09/2026',
      status: 'graded', // 'waiting', 'submitted', 'graded', 'overdue'
      score: '18/20',
      feedback: 'Bài làm rất tốt, phân tích sâu và dùng từ vựng phong phú. Cần cải thiện phần liên kết câu trong kết luận.',
    },
    {
      id: 2,
      subject: 'Hóa học',
      title: 'Ôn tập tổng hợp Hóa hữu cơ',
      tutor: 'TS. Phạm Thị Lan',
      description: 'Ôn tập toàn bộ chương trình Hóa hữu cơ lớp 11-12, đặc biệt chú trọng phản ứng este hóa, xà phòng hóa và tổng hợp hữu cơ.',
      assignedDate: '05/09/2026',
      dueDate: '12/09/2026',
      status: 'graded',
      score: '15/20',
      feedback: 'Nắm vững lý thuyết cơ bản. Cần chú ý thêm phương pháp bảo toàn khối lượng trong các bài toán kim loại kiềm.',
    },
    {
      id: 3,
      subject: 'Toán học',
      title: 'Bài tập Tích phân từng phần nâng cao',
      tutor: 'TS. Nguyễn Thị Hoa',
      description: 'Hoàn thành 10 bài toán trắc nghiệm và 2 bài tự luận về phương pháp tích phân từng phần và ứng dụng tính diện tích hình phẳng.',
      assignedDate: '10/09/2026',
      dueDate: '16/09/2026',
      status: 'waiting',
      score: null,
      feedback: null,
    },
    {
      id: 4,
      subject: 'Vật lý',
      title: 'Dao động điều hòa và Sóng cơ',
      tutor: 'ThS. Hoàng Thiên Ưng',
      description: 'Giải các dạng bài tập đồ thị dao động điều hòa, xác định chu kỳ, pha ban đầu và độ lệch pha giữa hai dao động cùng phương.',
      assignedDate: '12/09/2026',
      dueDate: '19/09/2026',
      status: 'submitted',
      score: null,
      feedback: 'Đang đợi gia sư chấm điểm...',
    }
  ]);

  const filteredAssignments = assignments.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="class-status-pill" style={{ background: '#fef3c7', color: '#92400e' }}>Chờ nộp</span>;
      case 'submitted':
        return <span className="class-status-pill" style={{ background: '#e0e7ff', color: '#3730a3' }}>Đã nộp</span>;
      case 'graded':
        return <span className="class-status-pill status-completed">Đã chấm</span>;
      case 'overdue':
        return <span className="class-status-pill" style={{ background: '#fee2e2', color: '#991b1b' }}>Quá hạn</span>;
      default:
        return null;
    }
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText('');
    setSubmittedSuccess('');
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setAssignments(assignments.map(a => 
      a.id === selectedAssignment.id 
        ? { ...a, status: 'submitted', feedback: 'Đã nộp thành công. Gia sư sẽ chấm điểm sớm.' }
        : a
    ));

    setSubmittedSuccess('Đã nộp bài tập thành công!');
    setTimeout(() => {
      setSelectedAssignment(null);
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Quản Lý Bài Tập</h2>
          <p className="section-desc">Theo dõi hạn nộp, nộp bài giải và nhận phản hồi trực tiếp từ gia sư</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Clock size={26} />
          </div>
          <div>
            <strong>{assignments.filter(a => a.status === 'waiting').length}</strong>
            <span>Bài đang chờ nộp</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <strong>{assignments.filter(a => a.status === 'graded').length}</strong>
            <span>Bài đã được chấm</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <CheckSquare size={26} />
          </div>
          <div>
            <strong>{assignments.length}</strong>
            <span>Tổng số bài tập</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sub-tabs">
        <button
          type="button"
          className={`sub-tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({assignments.length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${filter === 'waiting' ? 'active' : ''}`}
          onClick={() => setFilter('waiting')}
        >
          Chờ nộp ({assignments.filter(a => a.status === 'waiting').length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${filter === 'submitted' ? 'active' : ''}`}
          onClick={() => setFilter('submitted')}
        >
          Đã nộp ({assignments.filter(a => a.status === 'submitted').length})
        </button>
        <button
          type="button"
          className={`sub-tab-btn ${filter === 'graded' ? 'active' : ''}`}
          onClick={() => setFilter('graded')}
        >
          Đã chấm ({assignments.filter(a => a.status === 'graded').length})
        </button>
      </div>

      {/* Assignments List */}
      <div>
        {filteredAssignments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <FileText size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không có bài tập nào trong mục này.</p>
          </div>
        ) : (
          filteredAssignments.map((item) => (
            <div key={item.id} className="assignment-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="tutor-tag">{item.subject}</span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {item.title}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '14px', lineHeight: 1.5 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} /> Gia sư: <strong style={{ color: '#1e293b' }}>{item.tutor}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} /> Giao: {item.assignedDate}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b91c1c' }}>
                    <Clock size={15} /> Hạn nộp: <strong>{item.dueDate}</strong>
                  </span>
                </div>

                {item.feedback && (
                  <div style={{
                    marginTop: '14px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    fontSize: '0.88rem'
                  }}>
                    <strong style={{ color: '#2563eb', display: 'block', marginBottom: '2px' }}>
                      Nhận xét từ gia sư:
                    </strong>
                    <span style={{ color: '#334155' }}>{item.feedback}</span>
                  </div>
                )}
              </div>

              {/* Right Side: Score or Action Button */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                {item.score && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                      Điểm số
                    </span>
                    <div className="score-badge">
                      {item.score}
                    </div>
                  </div>
                )}

                {item.status === 'waiting' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ gap: '6px' }}
                    onClick={() => handleOpenSubmit(item)}
                  >
                    <Upload size={16} /> Nộp bài tập
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
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
          <div className="card" style={{ maxWidth: '560px', width: '100%', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
              Nộp bài: {selectedAssignment.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
              Gia sư: <strong>{selectedAssignment.tutor}</strong> • Môn: {selectedAssignment.subject}
            </p>

            {submittedSuccess ? (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} /> {submittedSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitAssignment}>
                <div className="form-group">
                  <label>Nội dung câu trả lời / Liên kết bài làm:</label>
                  <textarea
                    rows={6}
                    className="form-control"
                    placeholder="Nhập nội dung bài giải, ghi chú hoặc dán đường dẫn Google Drive / file bài tập của bạn..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedAssignment(null)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ gap: '6px' }}
                  >
                    <Send size={16} /> Xác nhận nộp bài
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
