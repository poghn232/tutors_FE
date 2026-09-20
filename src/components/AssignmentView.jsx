import React, { useState } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Paperclip 
} from 'lucide-react';

export default function AssignmentView({ user }) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'submitted', 'graded', 'overdue'

  const assignmentsList = [
    {
      id: 1,
      title: 'Bài tập tích phân từng phần',
      subject: 'Toán học',
      tutor: 'TS. Nguyễn Thị Hoa',
      desc: 'Giải các bài tập tích phân từng phần trong chương trình Giải tích lớp 12. Chú ý trình bày rõ ràng từng bước tính toán và ghi rõ kết quả cuối cùng.',
      assignedDate: '07/09/2026',
      dueDate: '16/09/2026',
      status: 'pending',
      statusLabel: 'Chờ nộp',
      tagColor: '#fee2e2',
      tagTextColor: '#ea580c',
      attachments: [
        { name: 'bai_tap_tich_phan_1.pdf', size: '540KB' },
        { name: 'bai_tap_tich_phan_2.pdf', size: '230KB' }
      ]
    },
    {
      id: 2,
      title: 'Giải bài tập cơ học lượng tử',
      subject: 'Vật lý',
      tutor: 'TS. Nguyễn Thị Hoa',
      desc: 'Giải 10 bài tập về cơ học lượng tử bao gồm: nguyên lý bất định Heisenberg, hàm sóng và phương trình Schrödinger cơ bản.',
      assignedDate: '05/09/2026',
      dueDate: '15/09/2026',
      status: 'submitted',
      statusLabel: 'Đã nộp',
      tagColor: '#f3e8ff',
      tagTextColor: '#7c3aed',
      submittedFile: 'bai_tap_cl_hoc.pdf',
      submittedTime: '11/09/2026 lúc 21:34'
    },
    {
      id: 3,
      title: 'Phản ứng hóa học chuỗi',
      subject: 'Hóa học',
      tutor: 'TS. Phạm Thị Lan',
      desc: 'Hoàn thành chuỗi phản ứng hóa học tròn có cơ và vô cơ. Viết phương trình ion rút gọn và xác định điều kiện phản ứng cho từng bước.',
      assignedDate: '01/09/2026',
      dueDate: '10/09/2026',
      status: 'overdue',
      statusLabel: 'Quá hạn',
      badgeExtra: 'Quá hạn 3 ngày',
      tagColor: '#fee2e2',
      tagTextColor: '#ef4444'
    },
    {
      id: 4,
      title: 'Phân tích đề đọc hiểu',
      subject: 'Tiếng Anh',
      tutor: 'Trần Minh Đức',
      desc: 'Phân tích đoạn văn đọc hiểu trong đề thi THPT 2025, trả lời các câu hỏi và viết đoạn nhận xét 150 từ về chủ đề bài đọc.',
      assignedDate: '01/09/2026',
      dueDate: '08/09/2026',
      status: 'graded',
      statusLabel: 'Đã chấm',
      tagColor: '#fee2e2',
      tagTextColor: '#ea580c',
      score: '18/20',
      scoreColor: '#00c288',
      feedback: 'Bài làm tốt, phân tích sâu. Cần cải thiện phát âm hơn.'
    },
    {
      id: 5,
      title: 'Bài tập Di truyền học',
      subject: 'Sinh học',
      tutor: 'TS. Lê Thị Thu',
      desc: 'Giải 8 bài tập di truyền học bao gồm: quy luật Mendel, di truyền liên kết giới tính, di truyền ngoài nhân và đột biến gen.',
      assignedDate: '09/09/2026',
      dueDate: '20/09/2026',
      status: 'pending',
      statusLabel: 'Chờ nộp',
      tagColor: '#dcfce7',
      tagTextColor: '#15803d'
    },
    {
      id: 6,
      title: 'Ôn tập tổng hợp Hóa hữu cơ',
      subject: 'Hóa học',
      tutor: 'TS. Phạm Thị Lan',
      desc: 'Ôn tập toàn bộ chương trình Hóa hữu cơ lớp 11-12, đặc biệt chú trọng phản ứng este hóa, xà phòng hóa và tổng hợp hữu cơ.',
      assignedDate: '01/08/2026',
      dueDate: '22/09/2026',
      status: 'graded',
      statusLabel: 'Đã chấm',
      tagColor: '#e0f2fe',
      tagTextColor: '#0284c7',
      score: '15/20',
      scoreColor: '#facc15',
      feedback: 'Cần xem lại phần phản ứng este hóa.'
    }
  ];

  const filteredAssignments = assignmentsList.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 6px 0'
        }}>
          Bài tập
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Nộp và theo dõi bài tập từ gia sư
        </p>
      </div>

      {/* 4 Status Stat Cards (Exact Figma 15:9353) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Chờ nộp */}
        <div style={{ background: '#ffedd5', border: '1.5px solid #fb923c', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '1.5rem' }}>
            <Clock size={20} /> 2
          </div>
          <div style={{ fontSize: '0.78rem', color: '#c2410c', marginTop: '4px', fontWeight: 600 }}>Đang chờ nộp</div>
        </div>

        {/* Card 2: Đã nộp */}
        <div style={{ background: '#f3e8ff', border: '1.5px solid #a855f7', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '1.5rem' }}>
            <FileText size={20} /> 1
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>Đã nộp</div>
        </div>

        {/* Card 3: Đã chấm */}
        <div style={{ background: '#e6fffa', border: '1.5px solid #34d399', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 800, fontSize: '1.5rem' }}>
            <CheckCircle2 size={20} /> 2
          </div>
          <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>Đã chấm</div>
        </div>

        {/* Card 4: Quá hạn */}
        <div style={{ background: '#fee2e2', border: '1.5px solid #f87171', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '1.5rem' }}>
            <AlertCircle size={20} /> 1
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px', fontWeight: 600 }}>Quá hạn</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'Tất cả (6)' },
          { id: 'pending', label: 'Chờ nộp (2)' },
          { id: 'submitted', label: 'Đã nộp (1)' },
          { id: 'graded', label: 'Đã chấm (2)' },
          { id: 'overdue', label: 'Quá hạn (1)' }
        ].map((f) => {
          const isSel = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              style={{
                border: '1.5px solid #0f172a',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: isSel ? '#0f172a' : '#ffffff',
                color: isSel ? '#ffffff' : '#0f172a',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Assignment Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredAssignments.map((asg) => (
          <div
            key={asg.id}
            style={{
              background: '#ffffff',
              border: asg.status === 'overdue' ? '2px solid #ef4444' : asg.status === 'submitted' ? '2px solid #7c3aed' : '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              position: 'relative'
            }}
          >
            {/* Top row: Subject & Status Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: asg.tagColor,
                  color: asg.tagTextColor,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  borderRadius: '999px',
                  padding: '3px 12px'
                }}>
                  {asg.subject}
                </span>

                <span style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '2px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#475569'
                }}>
                  {asg.statusLabel}
                </span>

                {asg.badgeExtra && (
                  <span style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '2px 10px'
                  }}>
                    {asg.badgeExtra}
                  </span>
                )}
              </div>

              {/* Score badge for graded items */}
              {asg.score && (
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: `2px solid ${asg.scoreColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  color: asg.scoreColor
                }}>
                  {asg.score}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              {asg.title}
            </h3>

            {/* Tutor Name */}
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
              {asg.tutor}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: '0 0 14px 0' }}>
              {asg.desc}
            </p>

            {/* Dates */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
              <span>📅 Giao: {asg.assignedDate}</span>
              <span style={{ color: asg.status === 'overdue' ? '#dc2626' : '#64748b', fontWeight: asg.status === 'overdue' ? 800 : 400 }}>
                ⏰ Hạn nộp: {asg.dueDate}
              </span>
            </div>

            {/* Attachments (if any) */}
            {asg.attachments && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Tài liệu đính kèm:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {asg.attachments.map((att, i) => (
                    <span
                      key={i}
                      style={{
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '999px',
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#ea580c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Paperclip size={12} />
                      {att.name} <span style={{ color: '#94a3b8' }}>({att.size})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue Warning Alert */}
            {asg.status === 'overdue' && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #f87171',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                color: '#b91c1c',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                ❗ Bài nộp muộn có thể bị trừ điểm
              </div>
            )}

            {/* Feedback Box (for graded items) */}
            {asg.feedback && (
              <div style={{
                background: '#e6fffa',
                border: '1px solid #34d399',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.85rem',
                color: '#065f46',
                marginBottom: '12px'
              }}>
                <strong>Nhận xét từ gia sư:</strong> {asg.feedback}
              </div>
            )}

            {/* Submitted status box (for submitted items) */}
            {asg.status === 'submitted' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  border: '1.5px solid #a855f7',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700
                }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>{asg.submittedFile}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>
                    (Đã nộp lúc {asg.submittedTime})
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: '#64748b'
                }}>
                  Đang chờ chấm điểm...
                </div>

                <button
                  type="button"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Nộp lại
                </button>
              </div>
            )}

            {/* Upload Dropzone (for pending or overdue items) */}
            {(asg.status === 'pending' || asg.status === 'overdue') && (
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                background: '#fafafa',
                cursor: 'pointer',
                transition: 'border-color 0.15s'
              }}>
                <UploadCloud size={24} color="#64748b" style={{ margin: '0 auto 6px auto', display: 'block' }} />
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                  Tải lên bài làm
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  PDF, DOC, DOCX, JPG, ZIP
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
