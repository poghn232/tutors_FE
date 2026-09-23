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
  AlertTriangle,
  Search,
  UserCheck,
  Lock
} from 'lucide-react';
import fileService from '../services/fileService';
import assignmentService from '../services/assignmentService';

export default function AssignmentView({ user, onRequireAuth }) {
  const isTutor = user?.role === 'TUTOR' || user?.role === 'ADMIN';
  const isParent = user?.role === 'PARENT';
  const [filter, setFilter] = useState('all'); // 'all', 'PENDING', 'SUBMITTED', 'GRADED', 'NOT_SUBMITTED'
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

  // Search Parents state for tutor create assignment
  const [parentSearchQuery, setParentSearchQuery] = useState('');
  const [parentSearchResults, setParentSearchResults] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isSearchingParents, setIsSearchingParents] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  // Create Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Toán học');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFile, setNewFile] = useState(null);

  // Grading Form State
  const [gradingAssignment, setGradingAssignment] = useState(null);
  const [gradeRating, setGradeRating] = useState('9.0'); // 0.0 - 10.0
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // Submission Confirmation Modal States (Parent)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitModalData, setSubmitModalData] = useState(null); // { assignment, file, note }
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [dragOverId, setDragOverId] = useState(null);

  // Parent upload ref
  const parentFileInputRef = useRef(null);
  const [uploadTargetId, setUploadTargetId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Format Date String helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa xác định';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Load Assignments from Backend
  const loadAssignments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await assignmentService.getAssignments();
      if (res && res.data && Array.isArray(res.data)) {
        setAssignments(res.data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.warn('Cannot load assignments from backend, using cache:', err);
      // Fallback to local storage cache if API failed
      try {
        const saved = localStorage.getItem(`tutora_asg_${user.id}`);
        if (saved) {
          setAssignments(JSON.parse(saved));
        } else {
          setAssignments([]);
        }
      } catch (e) {
        setAssignments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [user]);

  // Save to local storage as cache
  useEffect(() => {
    if (user && assignments.length > 0) {
      try {
        localStorage.setItem(`tutora_asg_${user.id}`, JSON.stringify(assignments));
      } catch (e) {}
    }
  }, [assignments, user]);

  // Live Parent Search for Tutor
  useEffect(() => {
    if (!showCreateModal) return;
    const timer = setTimeout(async () => {
      try {
        setIsSearchingParents(true);
        const res = await assignmentService.searchParents(parentSearchQuery);
        if (res && res.data) {
          setParentSearchResults(res.data);
        }
      } catch (e) {
        console.warn('Search parent error:', e);
      } finally {
        setIsSearchingParents(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [parentSearchQuery, showCreateModal]);

  // Guard: guests should not see this view (App.jsx already redirects, but extra safety here)
  if (!user) return null;

  // Tutor: Handle Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Vui lòng nhập tiêu đề bài tập.', 'error');
      return;
    }
    if (!selectedParent) {
      showToast('Vui lòng tìm kiếm và chọn tài khoản Phụ huynh nhận bài tập!', 'error');
      return;
    }
    if (!newDueDate) {
      showToast('Vui lòng chọn hạn nộp bài tập.', 'error');
      return;
    }

    if (newFile) {
      const validation = fileService.validateFile(newFile);
      if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
      }
    }

    try {
      setIsCreatingAssignment(true);
      let attachmentUrl = '';
      let attachmentName = '';
      let attachmentSize = '';

      if (newFile) {
        const uploadRes = await fileService.uploadFile(newFile);
        if (uploadRes && uploadRes.data) {
          attachmentUrl = uploadRes.data.fileUrl || '';
          attachmentName = newFile.name;
          attachmentSize = fileService.formatBytes(newFile.size);
        }
      }

      const payload = {
        title: newTitle.trim(),
        description: newDesc.trim(),
        subjectName: newSubject,
        parentId: selectedParent.id,
        dueDate: newDueDate.includes('T') ? newDueDate : `${newDueDate}T23:59:00`,
        attachmentUrl: attachmentUrl,
        attachmentName: attachmentName,
        attachmentSize: attachmentSize
      };

      try {
        const res = await assignmentService.createAssignment(payload);
        if (res && res.data) {
          setAssignments(prev => [res.data, ...prev]);
        }
      } catch (err) {
        console.warn('Backend createAssignment failed, using local item:', err);
        const localItem = {
          id: Date.now(),
          ...payload,
          tutorName: user?.fullName || 'Gia sư',
          parentName: selectedParent.fullName,
          studentName: selectedParent.studentName || selectedParent.fullName,
          status: 'PENDING',
          statusLabel: 'Đang mở (Chờ nộp)',
          isOverdue: false,
          createdAt: new Date().toISOString()
        };
        setAssignments(prev => [localItem, ...prev]);
      }

      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewDueDate('');
      setNewFile(null);
      setSelectedParent(null);
      setParentSearchQuery('');
      showToast(`Đã giao bài tập thành công cho phụ huynh ${selectedParent.fullName}!`);
    } catch (err) {
      console.error('Error creating assignment:', err);
      showToast('Có lỗi khi tạo bài tập. Vui lòng thử lại.', 'error');
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  // Tutor: Open Grading Modal
  const openGradingModal = (asg) => {
    setGradingAssignment(asg);
    setGradeRating(asg.rating ? asg.rating.toString() : '9.0');
    setGradeFeedback(asg.tutorComment || 'Bài làm rất tốt, lập luận chặt chẽ và trình bày khoa học.');
  };

  // Tutor: Save Grade & Rating (0-10)
  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingAssignment) return;

    const ratingNum = parseFloat(gradeRating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      showToast('Điểm đánh giá phải là số từ 0.0 đến 10.0', 'error');
      return;
    }
    if (!gradeFeedback.trim()) {
      showToast('Vui lòng nhập nhận xét bài tập.', 'error');
      return;
    }

    try {
      setIsSavingGrade(true);
      const payload = {
        rating: ratingNum,
        tutorComment: gradeFeedback.trim()
      };

      try {
        const res = await assignmentService.gradeAssignment(gradingAssignment.id, payload);
        if (res && res.data) {
          setAssignments(prev => prev.map(a => a.id === gradingAssignment.id ? res.data : a));
        }
      } catch (err) {
        console.warn('Backend gradeAssignment failed, updating locally:', err);
        setAssignments(prev => prev.map(a => {
          if (a.id === gradingAssignment.id) {
            return {
              ...a,
              status: 'GRADED',
              statusLabel: 'Đã chấm',
              rating: ratingNum,
              tutorComment: gradeFeedback.trim(),
              gradedAt: new Date().toISOString()
            };
          }
          return a;
        }));
      }

      setGradingAssignment(null);
      showToast(`Đã chấm điểm (${ratingNum}/10) và lưu nhận xét thành công!`);
    } catch (err) {
      console.error('Error saving grade:', err);
      showToast('Có lỗi khi lưu kết quả chấm điểm.', 'error');
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Parent: Trigger File Upload
  const handleParentUploadClick = (asg) => {
    if (!user && onRequireAuth) {
      onRequireAuth('nộp bài tập');
      return;
    }
    // Check if overdue
    const isOverdue = asg.status === 'NOT_SUBMITTED' || (asg.dueDate && new Date() > new Date(asg.dueDate));
    if (isOverdue) {
      showToast('Bài tập này đã quá hạn nộp. Hệ thống đã khóa và không cho phép nộp bù!', 'error');
      return;
    }

    setUploadTargetId(asg.id);
    if (parentFileInputRef.current) {
      parentFileInputRef.current.value = '';
      parentFileInputRef.current.click();
    }
  };

  // Parent: File selected from dialog
  const handleParentFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetId) return;

    const validation = fileService.validateFile(file);
    if (!validation.valid) {
      showToast(validation.message, 'error');
      return;
    }

    const targetAsg = assignments.find(a => a.id === uploadTargetId);
    if (!targetAsg) return;

    setSubmitModalData({
      assignment: targetAsg,
      file: file,
      note: ''
    });
    setShowSubmitModal(true);
  };

  // Parent: Drag & Drop file
  const handleDropFile = (asg, e) => {
    e.preventDefault();
    setDragOverId(null);
    if (!user && onRequireAuth) {
      onRequireAuth('nộp bài tập');
      return;
    }

    const isOverdue = asg.status === 'NOT_SUBMITTED' || (asg.dueDate && new Date() > new Date(asg.dueDate));
    if (isOverdue) {
      showToast('Bài tập này đã quá hạn nộp. Hệ thống đã khóa và không cho phép nộp bù!', 'error');
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = fileService.validateFile(file);
    if (!validation.valid) {
      showToast(validation.message, 'error');
      return;
    }

    setUploadTargetId(asg.id);
    setSubmitModalData({
      assignment: asg,
      file: file,
      note: ''
    });
    setShowSubmitModal(true);
  };

  // Parent: Confirm Submit in Modal
  const handleConfirmSubmit = async () => {
    if (!submitModalData || !submitModalData.file) return;

    try {
      setIsSubmittingFile(true);
      const { assignment, file, note } = submitModalData;

      // 1. Upload to backend (up to 20MB)
      const uploadRes = await fileService.uploadFile(file);
      const fileDownloadUrl = uploadRes.data?.fileUrl || URL.createObjectURL(file);

      const payload = {
        submittedFileUrl: fileDownloadUrl,
        submittedFileName: file.name,
        submittedFileSize: fileService.formatBytes(file.size),
        submissionNote: note.trim()
      };

      // 2. Submit to backend API
      try {
        const res = await assignmentService.submitAssignment(assignment.id, payload);
        if (res && res.data) {
          setAssignments(prev => prev.map(a => a.id === assignment.id ? res.data : a));
        }
      } catch (err) {
        console.warn('Backend submitAssignment error, updating locally:', err);
        const errMsg = err.response?.data?.message;
        if (errMsg && errMsg.includes('quá hạn')) {
          showToast(errMsg, 'error');
          setShowSubmitModal(false);
          setSubmitModalData(null);
          loadAssignments();
          return;
        }

        setAssignments(prev => prev.map(a => {
          if (a.id === assignment.id) {
            return {
              ...a,
              status: 'SUBMITTED',
              statusLabel: 'Đã nộp',
              submittedFileName: file.name,
              submittedFileSize: fileService.formatBytes(file.size),
              submittedFileUrl: fileDownloadUrl,
              submittedAt: new Date().toISOString(),
              submissionNote: note.trim()
            };
          }
          return a;
        }));
      }

      setShowSubmitModal(false);
      setSubmitModalData(null);
      setUploadTargetId(null);
      showToast(`Đã nộp bài tập "${file.name}" thành công!`);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      showToast('Có lỗi khi nộp bài tập. Vui lòng thử lại.', 'error');
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
  const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
  const submittedCount = assignments.filter(a => a.status === 'SUBMITTED').length;
  const gradedCount = assignments.filter(a => a.status === 'GRADED').length;
  const overdueCount = assignments.filter(a => a.status === 'NOT_SUBMITTED').length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      
      {/* Hidden File Input for Parent Submission */}
      <input 
        type="file" 
        ref={parentFileInputRef} 
        accept={fileService.ACCEPTED_FILE_TYPES}
        style={{ display: 'none' }} 
        onChange={handleParentFileChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toastType === 'error' ? '#991b1b' : '#0f172a',
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
          {toastType === 'error' ? (
            <AlertCircle size={20} color="#fca5a5" />
          ) : (
            <CheckCircle2 size={20} color="#10b981" />
          )}
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
            {isTutor ? 'Quản lý Bài tập (Gia sư)' : 'Bài tập Của Con'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {isTutor 
              ? 'Giao bài tập mới, tìm kiếm gán phụ huynh, nhận bài nộp và đánh giá nhận xét thang điểm 0-10' 
              : 'Theo dõi bài tập được giao từ gia sư, nộp bài làm trước hạn và xem nhận xét điểm số'}
          </p>
        </div>

        {/* Tutor Action: "+ Giao bài tập mới" */}
        {isTutor && (
          <button
            type="button"
            onClick={() => {
              if (!user && onRequireAuth) {
                onRequireAuth('giao bài tập mới');
                return;
              }
              setShowCreateModal(true);
            }}
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
            <span>+ Giao bài tập mới</span>
          </button>
        )}
      </div>

      {/* 4 Status Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#ffedd5', border: '1.5px solid #fb923c', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '1.5rem' }}>
            <Clock size={20} /> {pendingCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#c2410c', marginTop: '4px', fontWeight: 600 }}>
            {isTutor ? 'Học sinh đang làm' : 'Đang chờ nộp'}
          </div>
        </div>

        <div style={{ background: '#f3e8ff', border: '1.5px solid #a855f7', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '1.5rem' }}>
            <FileText size={20} /> {submittedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>
            {isTutor ? 'Đã nộp (Cần chấm)' : 'Đã nộp bài'}
          </div>
        </div>

        <div style={{ background: '#e6fffa', border: '1.5px solid #34d399', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 800, fontSize: '1.5rem' }}>
            <CheckCircle2 size={20} /> {gradedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>
            {isTutor ? 'Đã hoàn tất chấm' : 'Đã có điểm & nhận xét'}
          </div>
        </div>

        <div style={{ background: '#fee2e2', border: '1.5px solid #f87171', borderRadius: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '1.5rem' }}>
            <AlertCircle size={20} /> {overdueCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '4px', fontWeight: 600 }}>
            Quá hạn (Không nộp)
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { id: 'all', label: `Tất cả (${assignments.length})` },
          { id: 'PENDING', label: `Chờ nộp (${pendingCount})` },
          { id: 'SUBMITTED', label: `Đã nộp (${submittedCount})` },
          { id: 'GRADED', label: `Đã chấm (${gradedCount})` },
          { id: 'NOT_SUBMITTED', label: `Không nộp / Quá hạn (${overdueCount})` }
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
        {filteredAssignments.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '20px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              Chưa có bài tập nào trong mục này
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
              {isTutor 
                ? 'Bấm nút "+ Giao bài tập mới" để tạo bài tập và gán phụ huynh trên hệ thống.'
                : 'Bạn chưa có bài tập nào được giao từ gia sư.'}
            </p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const isOverdueLocked = asg.status === 'NOT_SUBMITTED' || (asg.status === 'PENDING' && asg.dueDate && new Date() > new Date(asg.dueDate));
            const isGraded = asg.status === 'GRADED';
            const isSubmitted = asg.status === 'SUBMITTED';
            const isPending = asg.status === 'PENDING' && !isOverdueLocked;

            return (
              <div
                key={asg.id}
                style={{
                  background: '#ffffff',
                  border: isOverdueLocked 
                    ? '2px solid #ef4444' 
                    : isSubmitted 
                      ? '2px solid #7c3aed' 
                      : isGraded 
                        ? '2px solid #059669' 
                        : '1.5px solid #0f172a',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  position: 'relative'
                }}
              >
                {/* Top row: Subject & Status Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '3px 12px',
                      border: '1px solid #bae6fd'
                    }}>
                      {asg.subjectName || 'Môn học'}
                    </span>

                    {/* Status Badge */}
                    <span style={{
                      background: isOverdueLocked 
                        ? '#fee2e2' 
                        : isSubmitted 
                          ? '#f3e8ff' 
                          : isGraded 
                            ? '#dcfce7' 
                            : '#ffedd5',
                      color: isOverdueLocked 
                        ? '#dc2626' 
                        : isSubmitted 
                          ? '#7c3aed' 
                          : isGraded 
                            ? '#15803d' 
                            : '#c2410c',
                      borderRadius: '999px',
                      padding: '3px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: '1px solid currentColor'
                    }}>
                      {isOverdueLocked 
                        ? '⛔ Quá hạn (Không nộp)' 
                        : isSubmitted 
                          ? '📄 Đã nộp (Chờ chấm)' 
                          : isGraded 
                            ? '✓ Đã chấm điểm' 
                            : '⏳ Đang mở (Chờ nộp)'}
                    </span>
                  </div>

                  {/* Rating Badge (0 - 10) for graded items */}
                  {asg.rating !== null && asg.rating !== undefined && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#ecfdf5',
                      border: '2px solid #059669',
                      borderRadius: '14px',
                      padding: '6px 14px',
                      color: '#047857',
                      fontWeight: 900,
                      fontSize: '1rem'
                    }}>
                      <Award size={18} color="#059669" />
                      <span>{Number(asg.rating).toFixed(1)} / 10</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {asg.title}
                </h3>

                {/* Tutor / Parent details */}
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px', fontWeight: 600 }}>
                  {isTutor 
                    ? `Phụ huynh: ${asg.parentName || 'Phụ huynh'} (Học sinh: ${asg.studentName || 'Học sinh'})`
                    : `Gia sư giao bài: ${asg.tutorName || 'Gia sư Tutora'}`}
                </div>

                {/* Description */}
                {asg.description && (
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                    {asg.description}
                  </p>
                )}

                {/* Dates */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748b', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span>📅 Hạn nộp: <b style={{ color: isOverdueLocked ? '#dc2626' : '#0f172a' }}>{formatDate(asg.dueDate)}</b></span>
                  {asg.submittedAt && (
                    <span>🕒 Thời gian nộp: <b>{formatDate(asg.submittedAt)}</b></span>
                  )}
                </div>

                {/* Attachments (Tutor materials / problem sheet to download) */}
                {asg.attachmentName && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                      Đề bài đính kèm từ gia sư (Nhấn để tải về):
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(asg.attachmentUrl, asg.attachmentName)}
                      title="Nhấn để tải đề bài về máy tính"
                      style={{
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#f8fafc',
                        borderRadius: '999px',
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#ea580c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Download size={14} />
                      {asg.attachmentName} {asg.attachmentSize && <span style={{ color: '#94a3b8' }}>({asg.attachmentSize})</span>}
                    </button>
                  </div>
                )}

                {/* OVERDUE LOCKED BANNER: No Late Submission Allowed */}
                {isOverdueLocked && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1.5px solid #ef4444',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    fontSize: '0.85rem',
                    color: '#991b1b',
                    fontWeight: 700,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <Lock size={20} color="#dc2626" />
                    <div>
                      <div>ĐÃ QUÁ HẠN NỘP BÀI - BÀI TẬP ĐÃ BỊ ĐÁNH DẤU KHÔNG NỘP</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#b91c1c', marginTop: '2px' }}>
                        Hệ thống đã tự động khóa bài tập này theo quy định. Phụ huynh/học sinh không được phép nộp bù sau hạn.
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Box (for graded items) */}
                {isGraded && (asg.tutorComment || asg.rating !== null) && (
                  <div style={{
                    background: '#ecfdf5',
                    border: '1.5px solid #34d399',
                    borderRadius: '14px',
                    padding: '16px',
                    fontSize: '0.88rem',
                    color: '#065f46',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={16} color="#059669" /> Nhận xét & Đánh giá từ Gia sư:
                      </strong>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857' }}>
                        Thang điểm: {Number(asg.rating).toFixed(1)} / 10
                      </span>
                    </div>
                    <div style={{ lineHeight: '1.5' }}>
                      {asg.tutorComment || 'Gia sư chưa để lại nhận xét chi tiết.'}
                    </div>
                  </div>
                )}

                {/* SUBMITTED STATE: Display submitted file details */}
                {isSubmitted && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      border: '1.5px solid #a855f7',
                      borderRadius: '12px',
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
                        <span>Bài nộp: <b>{asg.submittedFileName || 'bai_lam.pdf'}</b></span>
                        {asg.submittedFileSize && (
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({asg.submittedFileSize})</span>
                        )}
                      </div>

                      {asg.submittedFileUrl && (
                        <button
                          type="button"
                          onClick={() => handleDownload(asg.submittedFileUrl, asg.submittedFileName || 'bai_lam.pdf')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#ffffff',
                            border: '1px solid #a855f7',
                            borderRadius: '8px',
                            padding: '4px 12px',
                            color: '#7c3aed',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={13} /> Tải bài nộp
                        </button>
                      )}
                    </div>

                    {asg.submissionNote && (
                      <div style={{
                        background: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        color: '#475569'
                      }}>
                        💬 <b>Lời nhắn của phụ huynh:</b> "{asg.submissionNote}"
                      </div>
                    )}
                  </div>
                )}

                {/* ACTION BUTTON FOR TUTOR: Chấm điểm bài nộp */}
                {isTutor && (isSubmitted || isGraded) && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => openGradingModal(asg)}
                      style={{
                        background: isGraded ? '#ffffff' : '#059669',
                        color: isGraded ? '#0f172a' : '#ffffff',
                        border: '2px solid #0f172a',
                        borderRadius: '10px',
                        padding: '9px 18px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 0px #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={16} />
                      {isGraded ? 'Sửa điểm & nhận xét (0-10)' : 'Chấm điểm & Nhận xét bài làm (0-10)'}
                    </button>
                  </div>
                )}

                {/* PARENT PERSPECTIVE FOR PENDING (SUBMISSION DROPZONE) */}
                {isPending && !isTutor && (
                  <div 
                    onClick={() => handleParentUploadClick(asg)}
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
                      size={28} 
                      color={dragOverId === asg.id ? "#ff5f38" : "#64748b"} 
                      style={{ margin: '0 auto 6px auto', display: 'block' }} 
                    />
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: dragOverId === asg.id ? '#ea580c' : '#0f172a' }}>
                      {dragOverId === asg.id ? 'Thả tệp vào đây để nộp bài!' : 'Tải lên hoặc Kéo thả bài làm của con'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                      Hỗ trợ tệp PDF, DOCX, JPG, ZIP tối đa <b>20MB</b> · Có bước xem lại trước khi nộp
                    </div>
                  </div>
                )}

                {/* TUTOR PERSPECTIVE FOR PENDING: Waiting student */}
                {isPending && isTutor && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.82rem',
                    color: '#64748b'
                  }}>
                    ⏳ Đang chờ phụ huynh/học sinh nộp bài trước hạn: <b>{formatDate(asg.dueDate)}</b>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* MODAL: TUTOR CREATE ASSIGNMENT */}
      {showCreateModal && (
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
            maxWidth: '600px',
            width: '100%',
            padding: '28px',
            boxShadow: '8px 8px 0px #0f172a',
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
              
              {/* Tiêu đề */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tiêu đề bài tập *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập Giải tích 12 - Tích phân từng phần..."
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

              {/* Phụ huynh (Tìm kiếm & Gán) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Gán Phụ huynh nhận bài tập *
                </label>
                
                {selectedParent ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#eff6ff',
                    border: '1.5px solid #2563eb',
                    borderRadius: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <UserCheck size={20} color="#2563eb" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e40af' }}>
                          {selectedParent.fullName} ({selectedParent.email})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#3b82f6' }}>
                          Học sinh: <b>{selectedParent.studentName || selectedParent.fullName}</b> {selectedParent.phone && `· SĐT: ${selectedParent.phone}`}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedParent(null)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#b91c1c',
                        cursor: 'pointer'
                      }}
                    >
                      Đổi phụ huynh
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        placeholder="Tìm theo tên phụ huynh, email hoặc tên học sinh..."
                        value={parentSearchQuery}
                        onChange={(e) => setParentSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          border: '1.5px solid #0f172a',
                          borderRadius: '10px',
                          padding: '0 12px 0 38px',
                          fontSize: '0.88rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    <div style={{
                      maxHeight: '160px',
                      overflowY: 'auto',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      marginTop: '6px',
                      background: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}>
                      {isSearchingParents ? (
                        <div style={{ padding: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                          Đang tìm phụ huynh...
                        </div>
                      ) : parentSearchResults.length === 0 ? (
                        <div style={{ padding: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                          {parentSearchQuery ? 'Không tìm thấy phụ huynh phù hợp.' : 'Nhập từ khóa để tìm phụ huynh'}
                        </div>
                      ) : (
                        parentSearchResults.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setSelectedParent(p)}
                            style={{
                              padding: '8px 12px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                                {p.fullName} <span style={{ fontWeight: 400, color: '#64748b' }}>({p.email})</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Con em: <b>{p.studentName || 'N/A'}</b>
                              </div>
                            </div>
                            <span style={{
                              background: '#e0f2fe',
                              color: '#0284c7',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}>
                              Chọn
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Môn học & Hạn nộp */}
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
                    Hạn nộp bài (Ngày & Giờ) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '0 10px',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Yêu cầu */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Yêu cầu & Hướng dẫn làm bài
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi rõ yêu cầu, số lượng câu hỏi và hướng dẫn trình bày..."
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

              {/* Tệp đề bài đính kèm */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tệp đính kèm đề bài (Tối đa 20MB)
                </label>
                <input
                  type="file"
                  accept={fileService.ACCEPTED_FILE_TYPES}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const validation = fileService.validateFile(f);
                      if (!validation.valid) {
                        showToast(validation.message, 'error');
                        e.target.value = '';
                        setNewFile(null);
                        return;
                      }
                    }
                    setNewFile(f || null);
                  }}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
                {newFile && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Đã chọn: {newFile.name} ({fileService.formatBytes(newFile.size)})
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
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
                  disabled={isCreatingAssignment}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#ff5f38',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: isCreatingAssignment ? 'wait' : 'pointer'
                  }}
                >
                  {isCreatingAssignment ? 'Đang gửi bài tập...' : 'Giao bài tập ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TUTOR GRADING & RATING (0-10) */}
      {gradingAssignment && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '8px 8px 0px #0f172a',
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
              Chấm điểm & Nhận xét bài tập
            </h2>

            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', border: '1.5px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{gradingAssignment.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                Học sinh: <b>{gradingAssignment.studentName || 'Học sinh'}</b> (Phụ huynh: {gradingAssignment.parentName || 'Phụ huynh'})
              </div>
              {gradingAssignment.submittedFileName && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>
                    📄 {gradingAssignment.submittedFileName}
                  </span>
                  {gradingAssignment.submittedFileUrl && (
                    <button
                      type="button"
                      onClick={() => handleDownload(gradingAssignment.submittedFileUrl, gradingAssignment.submittedFileName)}
                      style={{
                        background: '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      Tải về máy
                    </button>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Điểm số đánh giá (Thang điểm 0.0 - 10.0) *
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={gradeRating}
                    onChange={(e) => setGradeRating(e.target.value)}
                    placeholder="9.0"
                    style={{
                      width: '120px',
                      height: '44px',
                      border: '2px solid #059669',
                      borderRadius: '10px',
                      padding: '0 12px',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: '#059669',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#64748b' }}>/ 10.0</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Nhận xét & Hướng dẫn sửa bài cho học sinh/phụ huynh *
                </label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Ghi nhận xét chi tiết về bài làm, ưu điểm, các lỗi cần sửa..."
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
                  disabled={isSavingGrade}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: isSavingGrade ? 'wait' : 'pointer'
                  }}
                >
                  {isSavingGrade ? 'Đang lưu...' : 'Hoàn tất chấm điểm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STUDENT/PARENT CONFIRM SUBMISSION */}
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
                  Xác nhận Nộp bài tập
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Bài tập: <b>{submitModalData.assignment.title}</b> ({submitModalData.assignment.subjectName})
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
                      Kích thước: {fileService.formatBytes(submitModalData.file.size)} (Tối đa 20MB)
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (parentFileInputRef.current) {
                      parentFileInputRef.current.click();
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
                placeholder="Ví dụ: Con đã hoàn thành 10 bài tập, phần bài 8 con có trình bày 2 cách giải ở trang cuối..."
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
                  <>Đang nộp bài...</>
                ) : (
                  <>
                    <Send size={16} /> Xác nhận Nộp bài
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
