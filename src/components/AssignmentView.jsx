import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Paperclip, 
  Plus, 
  X, 
  Download, 
  Award,
  Check,
  FileCheck,
  Send,
  RefreshCw,
  Eye,
  AlertTriangle
} from 'lucide-react';
import fileService from '../services/fileService';

const DEFAULT_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Bài tập tích phân từng phần',
      subject: 'Toán học',
      tutor: 'TS. Nguyễn Thị Hoa',
      studentName: 'Nguyễn Minh Anh',
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
      studentName: 'Trần Bảo Long',
      desc: 'Giải 10 bài tập về cơ học lượng tử bao gồm: nguyên lý bất định Heisenberg, hàm sóng và phương trình Schrödinger cơ bản.',
      assignedDate: '05/09/2026',
      dueDate: '15/09/2026',
      status: 'submitted',
      statusLabel: 'Đã nộp',
      tagColor: '#f3e8ff',
      tagTextColor: '#7c3aed',
      submittedFile: 'bai_tap_co_hoc_luong_tu.pdf',
      submittedTime: '11/09/2026 lúc 21:34',
      attachments: [
        { name: 'de_bai_luong_tu.pdf', size: '1.1MB' }
      ]
    },
    {
      id: 3,
      title: 'Phản ứng hóa học chuỗi',
      subject: 'Hóa học',
      tutor: 'TS. Phạm Thị Lan',
      studentName: 'Lê Thùy Dương',
      desc: 'Hoàn thành chuỗi phản ứng hóa học vô cơ và hữu cơ. Viết phương trình ion rút gọn và xác định điều kiện phản ứng cho từng bước.',
      assignedDate: '01/09/2026',
      dueDate: '10/09/2026',
      status: 'overdue',
      statusLabel: 'Quá hạn',
      badgeExtra: 'Quá hạn 3 ngày',
      tagColor: '#fee2e2',
      tagTextColor: '#ef4444',
      attachments: [
        { name: 'chuyen_de_chuoi_phan_ung.pdf', size: '820KB' }
      ]
    },
    {
      id: 4,
      title: 'Phân tích đề đọc hiểu THPT',
      subject: 'Tiếng Anh',
      tutor: 'Trần Minh Đức',
      studentName: 'Nguyễn Minh Anh',
      desc: 'Phân tích đoạn văn đọc hiểu trong đề thi THPT 2025, trả lời các câu hỏi và viết đoạn nhận xét 150 từ về chủ đề bài đọc.',
      assignedDate: '01/09/2026',
      dueDate: '08/09/2026',
      status: 'graded',
      statusLabel: 'Đã chấm',
      tagColor: '#fee2e2',
      tagTextColor: '#ea580c',
      score: '18/20',
      scoreColor: '#00c288',
      feedback: 'Bài làm tốt, phân tích câu hỏi suy luận sâu. Cần chú ý mở rộng vốn từ vựng học thuật trong đoạn bình luận 150 từ.',
      submittedFile: 'bai_lam_tieng_anh_minhanh.docx',
      submittedTime: '06/09/2026 lúc 19:15'
    },
    {
      id: 5,
      title: 'Bài tập Di truyền học & Đột biến gen',
      subject: 'Sinh học',
      tutor: 'TS. Lê Thị Thu',
      studentName: 'Phạm Hồng Quân',
      desc: 'Giải 8 bài tập di truyền học bao gồm: quy luật Mendel, di truyền liên kết giới tính, di truyền ngoài nhân và đột biến gen.',
      assignedDate: '09/09/2026',
      dueDate: '20/09/2026',
      status: 'pending',
      statusLabel: 'Chờ nộp',
      tagColor: '#dcfce7',
      tagTextColor: '#15803d',
      attachments: [
        { name: 'so_tay_di_truyen_hoc.pdf', size: '1.4MB' }
      ]
    },
    {
      id: 6,
      title: 'Ôn tập tổng hợp Hóa hữu cơ',
      subject: 'Hóa học',
      tutor: 'TS. Phạm Thị Lan',
      studentName: 'Nguyễn Minh Anh',
      desc: 'Ôn tập toàn bộ chương trình Hóa hữu cơ lớp 11-12, đặc biệt chú trọng phản ứng este hóa, xà phòng hóa và tổng hợp hữu cơ.',
      assignedDate: '01/08/2026',
      dueDate: '22/09/2026',
      status: 'graded',
      statusLabel: 'Đã chấm',
      tagColor: '#e0f2fe',
      tagTextColor: '#0284c7',
      score: '15/20',
      scoreColor: '#facc15',
      feedback: 'Cần xem lại phần phản ứng thủy phân este trong môi trường kiềm và tính toán lượng muối thu được.',
      submittedFile: 'hoa_huu_co_tong_hop.pdf',
      submittedTime: '20/08/2026 lúc 20:00'
    }
];

export default function AssignmentView({ user, onRequireAuth }) {
  const isTutor = user?.role === 'TUTOR';
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'submitted', 'graded', 'overdue'

  const userStorageKey = `tutora_assignments_${user?.id || user?.email || 'default'}`;

  // Persistent assignments state using localStorage
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Cannot read assignments from localStorage:', e);
    }
    return DEFAULT_ASSIGNMENTS;
  });

  // Save assignments whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(assignments));
    } catch (e) {
      console.warn('localStorage full, saving sanitized assignments without large base64 payloads:', e);
      try {
        const lightweight = assignments.map(a => ({
          ...a,
          submittedFileUrl: (a.submittedFileUrl && a.submittedFileUrl.length > 1000) ? '' : a.submittedFileUrl
        }));
        localStorage.setItem(userStorageKey, JSON.stringify(lightweight));
      } catch (innerErr) {
        console.error('Failed to save to localStorage:', innerErr);
      }
    }
  }, [assignments, userStorageKey]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Submission Confirmation Modal States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null); // { assignment, file, note, isResubmit }
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [isResubmitMode, setIsResubmitMode] = useState(false);
  const [dragOverId, setDragOverId] = useState(null);

  // Create Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Toán học');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFile, setNewFile] = useState(null);

  // Grading Form State
  const [gradeScore, setGradeScore] = useState('18/20');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Student upload ref
  const studentFileInputRef = useRef(null);
  const [uploadTargetId, setUploadTargetId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Convert file to Base64 so offline / reload download never breaks
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file || file.size > 8 * 1024 * 1024) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Tutor: Handle Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Vui lòng nhập tiêu đề bài tập.');
      return;
    }

    let attachmentObj = null;
    if (newFile) {
      const uploadRes = await fileService.uploadFile(newFile);
      attachmentObj = {
        name: newFile.name,
        size: fileService.formatBytes(newFile.size),
        url: uploadRes.data?.fileUrl
      };
    }

    const created = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      tutor: user?.fullName || 'Gia sư Tutora',
      studentName: 'Lớp 12A - Toàn bộ học sinh',
      desc: newDesc || 'Hoàn thành bài tập đúng thời hạn.',
      assignedDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: newDueDate || '30/09/2026',
      status: 'pending',
      statusLabel: 'Đang mở',
      tagColor: '#e0f2fe',
      tagTextColor: '#0284c7',
      attachments: attachmentObj ? [attachmentObj] : []
    };

    setAssignments([created, ...assignments]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setNewFile(null);
    showToast('Đã giao bài tập mới thành công cho học sinh!');
  };

  // Tutor: Open Grading Modal
  const openGradingModal = (asg) => {
    setGradingAssignment(asg);
    setGradeScore(asg.score || '19/20');
    setGradeFeedback(asg.feedback || 'Bài làm rất tốt, lập luận chặt chẽ và trình bày khoa học.');
  };

  // Tutor: Save Grade & Feedback
  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!gradingAssignment) return;

    setAssignments(assignments.map(a => {
      if (a.id === gradingAssignment.id) {
        return {
          ...a,
          status: 'graded',
          statusLabel: 'Đã chấm',
          score: gradeScore,
          scoreColor: '#00c288',
          feedback: gradeFeedback
        };
      }
      return a;
    }));

    setGradingAssignment(null);
    showToast(`Đã lưu chấm điểm (${gradeScore}) cho bài tập!`);
  };

  // Student: Trigger File Input (Clicking dropzone or Re-submit button)
  const handleStudentUploadClick = (asgId, isResubmit = false) => {
    if (!user && onRequireAuth) {
      onRequireAuth('nộp bài tập');
      return;
    }
    setUploadTargetId(asgId);
    setIsResubmitMode(isResubmit);
    if (studentFileInputRef.current) {
      studentFileInputRef.current.value = '';
      studentFileInputRef.current.click();
    }
  };

  // Student: When file selected from file picker -> DO NOT SUBMIT YET, OPEN CONFIRM MODAL!
  const handleStudentFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetId) return;

    const targetAsg = assignments.find(a => a.id === uploadTargetId);
    if (!targetAsg) return;

    setSubmitModalData({
      assignment: targetAsg,
      file: file,
      note: '',
      isResubmit: isResubmitMode || targetAsg.status === 'submitted'
    });
    setShowSubmitModal(true);
  };

  // Student: When file dropped on dropzone -> DO NOT SUBMIT YET, OPEN CONFIRM MODAL!
  const handleDropFile = (asg, e) => {
    e.preventDefault();
    setDragOverId(null);
    if (!user && onRequireAuth) {
      onRequireAuth('nộp bài tập');
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadTargetId(asg.id);
    setSubmitModalData({
      assignment: asg,
      file: file,
      note: '',
      isResubmit: asg.status === 'submitted'
    });
    setShowSubmitModal(true);
  };

  // Student: CONFIRMED SUBMIT in Modal
  const handleConfirmSubmit = async () => {
    if (!submitModalData || !submitModalData.file) return;

    try {
      setIsSubmittingFile(true);
      const { assignment, file, note } = submitModalData;

      // 1. Upload to backend
      const uploadRes = await fileService.uploadFile(file);

      // 2. Prioritize backend server URL, fallback to local URL
      let fileDownloadUrl = uploadRes?.data?.fileUrl;
      if (!fileDownloadUrl) {
        if (file.size < 500 * 1024) {
          try {
            fileDownloadUrl = await fileToBase64(file);
          } catch (e) {
            fileDownloadUrl = URL.createObjectURL(file);
          }
        } else {
          fileDownloadUrl = URL.createObjectURL(file);
        }
      }

      const nowStr = new Date().toLocaleDateString('vi-VN') + ' lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      // 3. Update assignment state & persist
      setAssignments(prev => prev.map(a => {
        if (a.id === assignment.id) {
          return {
            ...a,
            status: 'submitted',
            statusLabel: 'Đã nộp',
            submittedFile: file.name,
            submittedFileSize: fileService.formatBytes(file.size),
            submittedFileUrl: fileDownloadUrl,
            submittedTime: nowStr,
            studentNote: note
          };
        }
        return a;
      }));

      setShowSubmitModal(false);
      setSubmitModalData(null);
      setUploadTargetId(null);
      showToast(`Đã nộp bài tập "${file.name}" thành công!`);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Có lỗi khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmittingFile(false);
    }
  };

  // File Download Action
  const handleDownload = (fileUrl, fileName) => {
    fileService.downloadFile(fileUrl, fileName);
    showToast(`Đang tải tệp: ${fileName}`);
  };

  // Filtered List
  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  // Calculate stats
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const overdueCount = assignments.filter(a => a.status === 'overdue').length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      
      {/* Hidden File Input for Student Submission */}
      <input 
        type="file" 
        ref={studentFileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleStudentFileChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '0.9rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 6px 0'
          }}>
            {isTutor ? 'Quản lý Bài tập' : 'Bài tập'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {isTutor 
              ? 'Tạo bài tập, theo dõi tiến độ và chấm bài của học sinh' 
              : 'Nộp và theo dõi kết quả bài tập từ gia sư'}
          </p>
        </div>

        {/* Tutor Action: "+ Giao bài tập mới" */}
        {isTutor && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: '#ff5f38',
              color: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '12px',
              padding: '12px 22px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '3px 3px 0px #0f172a',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={18} strokeWidth={3} />
            <span>Giao bài tập mới</span>
          </button>
        )}
      </div>

      {/* 4 Status Stat Cards */}
      {isTutor ? (
        // Tutor Perspective Stats
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#e0f2fe', border: '1.5px solid #0284c7', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '1.5rem' }}>
              <FileText size={20} /> {assignments.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '4px', fontWeight: 600 }}>Bài tập đã giao</div>
          </div>

          <div style={{ background: '#f3e8ff', border: '1.5px solid #a855f7', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '1.5rem' }}>
              <Clock size={20} /> {submittedCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>Đã nộp (Cần chấm)</div>
          </div>

          <div style={{ background: '#e6fffa', border: '1.5px solid #34d399', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 800, fontSize: '1.5rem' }}>
              <CheckCircle2 size={20} /> {gradedCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>Đã hoàn tất chấm</div>
          </div>

          <div style={{ background: '#ffedd5', border: '1.5px solid #fb923c', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '1.5rem' }}>
              <Award size={20} /> 85%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c2410c', marginTop: '4px', fontWeight: 600 }}>Tỷ lệ hoàn thành</div>
          </div>
        </div>
      ) : (
        // Student Perspective Stats
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#ffedd5', border: '1.5px solid #fb923c', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '1.5rem' }}>
              <Clock size={20} /> {pendingCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#c2410c', marginTop: '4px', fontWeight: 600 }}>Đang chờ nộp</div>
          </div>

          <div style={{ background: '#f3e8ff', border: '1.5px solid #a855f7', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '1.5rem' }}>
              <FileText size={20} /> {submittedCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>Đã nộp</div>
          </div>

          <div style={{ background: '#e6fffa', border: '1.5px solid #34d399', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 800, fontSize: '1.5rem' }}>
              <CheckCircle2 size={20} /> {gradedCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>Đã chấm</div>
          </div>

          <div style={{ background: '#fee2e2', border: '1.5px solid #f87171', borderRadius: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '1.5rem' }}>
              <AlertCircle size={20} /> {overdueCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px', fontWeight: 600 }}>Quá hạn</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { id: 'all', label: `Tất cả (${assignments.length})` },
          { id: 'pending', label: `Chờ nộp (${pendingCount})` },
          { id: 'submitted', label: `Đã nộp (${submittedCount})` },
          { id: 'graded', label: `Đã chấm (${gradedCount})` },
          { id: 'overdue', label: `Quá hạn (${overdueCount})` }
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
                cursor: 'pointer',
                transition: 'all 0.15s ease'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                  border: `2.5px solid ${asg.scoreColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  color: asg.scoreColor,
                  background: '#f0fdf4'
                }}>
                  {asg.score}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              {asg.title}
            </h3>

            {/* Tutor / Student details */}
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
              {isTutor ? `Học sinh: ${asg.studentName || 'Nguyễn Minh Anh'}` : `Gia sư: ${asg.tutor}`}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: '0 0 14px 0' }}>
              {asg.desc}
            </p>

            {/* Dates */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span>📅 Giao: {asg.assignedDate}</span>
              <span style={{ color: asg.status === 'overdue' ? '#dc2626' : '#64748b', fontWeight: asg.status === 'overdue' ? 800 : 400 }}>
                ⏰ Hạn nộp: {asg.dueDate}
              </span>
            </div>

            {/* Attachments (Tutor materials / exercises to download) */}
            {asg.attachments && asg.attachments.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Tệp đính kèm bài tập (Nhấn để tải về):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {asg.attachments.map((att, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDownload(att.url, att.name)}
                      title="Nhấn để tải tệp về máy tính"
                      style={{
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#f8fafc',
                        borderRadius: '999px',
                        padding: '5px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#ea580c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Download size={13} />
                      {att.name} <span style={{ color: '#94a3b8' }}>({att.size})</span>
                    </button>
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
                marginBottom: '14px'
              }}>
                <strong>Nhận xét từ gia sư:</strong> {asg.feedback}
              </div>
            )}

            {/* SUBMITTED STATE */}
            {asg.status === 'submitted' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  border: '1.5px solid #a855f7',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  background: '#faf5ff',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Bài làm: {asg.submittedFile}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>
                      ({asg.submittedTime})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(asg.submittedFileUrl, asg.submittedFile)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#ffffff',
                      border: '1px solid #a855f7',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: '#7c3aed',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} /> Tải bài nộp
                  </button>
                </div>

                {isTutor ? (
                  // Tutor Action: Chấm điểm & Nhận xét
                  <button
                    type="button"
                    onClick={() => openGradingModal(asg)}
                    style={{
                      width: '100%',
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '10px',
                      padding: '11px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0px #0f172a'
                    }}
                  >
                    Chấm điểm & Nhận xét bài làm
                  </button>
                ) : (
                  // Student Perspective
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      flex: 1,
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                      color: '#64748b',
                      border: '1px solid #e2e8f0'
                    }}>
                      Đang chờ gia sư chấm điểm...
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStudentUploadClick(asg.id, true)}
                      style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        border: '1.5px solid #0f172a',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Nộp lại
                    </button>
                  </div>
                )}

                {/* Display Student Note if provided */}
                {asg.studentNote && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#475569'
                  }}>
                    💬 <b>Lời nhắn của bạn:</b> "{asg.studentNote}"
                  </div>
                )}
              </div>
            )}

            {/* GRADED STATE ACTIONS FOR TUTOR */}
            {asg.status === 'graded' && isTutor && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => openGradingModal(asg)}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1.5px solid #0f172a',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '1.5px 1.5px 0px #0f172a'
                  }}
                >
                  Sửa điểm & nhận xét
                </button>
              </div>
            )}

            {/* PENDING / OVERDUE: ONLY STUDENTS HAVE UPLOAD DROPZONE */}
            {!isTutor && (asg.status === 'pending' || asg.status === 'overdue') && (
              <div 
                onClick={() => handleStudentUploadClick(asg.id, false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(asg.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDropFile(asg, e)}
                style={{
                  border: dragOverId === asg.id ? '2.5px dashed #ff5f38' : '2px dashed #cbd5e1',
                  borderRadius: '14px',
                  padding: '24px',
                  textAlign: 'center',
                  background: dragOverId === asg.id ? '#fff7ed' : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <UploadCloud 
                  size={26} 
                  color={dragOverId === asg.id ? "#ff5f38" : "#64748b"} 
                  style={{ margin: '0 auto 6px auto', display: 'block' }} 
                />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: dragOverId === asg.id ? '#ea580c' : '#0f172a' }}>
                  {dragOverId === asg.id ? 'Thả tệp vào đây để nộp bài!' : 'Tải lên hoặc Kéo thả bài làm'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                  Nhấn vào để chọn tệp hoặc kéo thả (PDF, DOC, DOCX, JPG, ZIP) · Có bước xem lại xác nhận
                </div>
              </div>
            )}

            {/* FOR TUTORS ON PENDING / OVERDUE: Show waiting status rather than dropzone */}
            {isTutor && (asg.status === 'pending' || asg.status === 'overdue') && (
              <div style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
                fontSize: '0.82rem',
                color: '#64748b'
              }}>
                ⏳ Học sinh chưa nộp bài. Hệ thống sẽ tự động nhắc nhở khi sắp đến hạn nộp ({asg.dueDate}).
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL: TUTOR CREATE ASSIGNMENT */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px 0' }}>
              + Giao bài tập mới
            </h2>

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tiêu đề bài tập *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập Hình học không gian Oxyz..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Môn học
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '0 10px',
                      fontSize: '0.88rem',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Hạn nộp bài
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '0 10px',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Yêu cầu & Hướng dẫn làm bài
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi rõ yêu cầu, các bước cần hoàn thành..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Đính kèm tệp đề bài (Tùy chọn)
                </label>
                <input
                  type="file"
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    fontSize: '0.85rem'
                  }}
                />
                {newFile && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Đã chọn: {newFile.name} ({fileService.formatBytes(newFile.size)})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    background: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#ff5f38',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TUTOR GRADING & FEEDBACK */}
      {gradingAssignment && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setGradingAssignment(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 14px 0' }}>
              Chấm điểm bài tập
            </h2>

            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{gradingAssignment.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                Học sinh: <b>{gradingAssignment.studentName || 'Nguyễn Minh Anh'}</b>
              </div>
              {gradingAssignment.submittedFile && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>
                    📄 {gradingAssignment.submittedFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(gradingAssignment.submittedFileUrl, gradingAssignment.submittedFile)}
                    style={{
                      background: '#fff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    Tải về máy
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Điểm số (Ví dụ: 19/20 hoặc 9.5/10) *
                </label>
                <input
                  type="text"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  placeholder="19/20"
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#059669',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Nhận xét & Hướng dẫn sửa bài
                </label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Nhận xét chi tiết về bài làm, ưu điểm và các lỗi cần lưu ý..."
                  style={{
                    width: '100%',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    background: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Hoàn tất chấm điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT CONFIRM SUBMISSION (Xem lại & Xác nhận nộp bài) */}
      {showSubmitModal && submitModalData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '24px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: '8px 8px 0px #0f172a',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => {
                setShowSubmitModal(false);
                setSubmitModalData(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                border: '2px solid #0f172a'
              }}>
                <FileCheck size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  {submitModalData.isResubmit ? 'Xác nhận Nộp lại bài tập' : 'Xác nhận Nộp bài tập'}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Bài tập: <b>{submitModalData.assignment.title}</b> ({submitModalData.assignment.subject})
                </div>
              </div>
            </div>

            {/* File Info Card */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #0f172a',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Tệp bài làm bạn đã chọn:
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    border: '1.5px solid #0284c7'
                  }}>
                    {submitModalData.file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', wordBreak: 'break-all' }}>
                      {submitModalData.file.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Kích thước: {fileService.formatBytes(submitModalData.file.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (studentFileInputRef.current) {
                      studentFileInputRef.current.click();
                    }
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Đổi tệp khác
                </button>
              </div>
            </div>

            {/* Note Textarea */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Ghi chú / Lời nhắn gửi cho gia sư (Tùy chọn)
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Em đã hoàn thành 10 bài tập, phần câu hỏi số 7 em có ghi chú lời giải chi tiết ở trang cuối..."
                value={submitModalData.note}
                onChange={(e) => setSubmitModalData({ ...submitModalData, note: e.target.value })}
                style={{
                  width: '100%',
                  border: '1.5px solid #0f172a',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Reassurance note */}
            <div style={{
              background: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#854d0e',
              marginBottom: '20px',
              lineHeight: 1.4
            }}>
              💡 <b>Lưu ý:</b> Sau khi nộp, bài tập sẽ được lưu vĩnh viễn trên hệ thống. Bạn vẫn có thể bấm <b>Nộp lại</b> bất kỳ lúc nào trước khi gia sư bắt đầu chấm bài.
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  setSubmitModalData(null);
                }}
                disabled={isSubmittingFile}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid #0f172a',
                  background: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmittingFile}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  border: '2px solid #0f172a',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: isSubmittingFile ? 'wait' : 'pointer',
                  boxShadow: '3px 3px 0px #0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmittingFile ? (
                  <>Đang lưu bài làm...</>
                ) : (
                  <>
                    <Send size={16} />
                    {submitModalData.isResubmit ? 'Xác nhận Nộp lại' : 'Xác nhận Nộp bài'}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
