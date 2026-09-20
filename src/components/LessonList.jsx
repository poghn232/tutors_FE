import React, { useState, useEffect } from 'react';
import { lessonService } from '../services/lessonService';
import { classService } from '../services/classService';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Plus, 
  Sparkles, 
  User, 
  Users,
  DollarSign,
  ChevronDown, 
  ChevronUp, 
  X,
  Video,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function LessonList({ user }) {
  const [lessons, setLessons] = useState([]);
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View toggle: 'list' or 'week'
  const [viewMode, setViewMode] = useState('list');
  // Filter tab: 'all', 'upcoming', 'completed'
  const [filterTab, setFilterTab] = useState('all');

  // State cho Form tạo buổi học mới (Gia sư)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
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
  const [aiGenerating, setAiGenerating] = useState(false);

  // Default Figma mockup lessons (Node 16:399)
  const figmaMockLessons = [
    {
      id: 'figma-1',
      studentName: 'Minh Anh',
      subject: 'Toán học',
      subjectColor: { bg: '#fff1ed', text: '#e05638' },
      date: '12/09/2026',
      time: '10:00',
      duration: '60 phút',
      status: 'upcoming',
      statusLabel: 'Sắp tới',
      canJoin: true
    },
    {
      id: 'figma-2',
      studentName: 'Phương Linh',
      subject: 'Vật lý',
      subjectColor: { bg: '#f4f0ff', text: '#8b5cf6' },
      date: '12/09/2026',
      time: '14:00',
      duration: '60 phút',
      status: 'upcoming',
      statusLabel: 'Sắp tới',
      canJoin: true
    },
    {
      id: 'figma-3',
      studentName: 'Quốc Khánh',
      subject: 'Tin học',
      subjectColor: { bg: '#e0f2fe', text: '#0284c7' },
      date: '14/09/2026',
      time: '11:00',
      duration: '90 phút',
      status: 'upcoming',
      statusLabel: 'Sắp tới',
      canJoin: true
    },
    {
      id: 'figma-4',
      studentName: 'Thu Hà',
      subject: 'Toán học',
      subjectColor: { bg: '#fff1ed', text: '#e05638' },
      date: '09/09/2026',
      time: '10:00',
      duration: '60 phút',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      canJoin: false
    },
    {
      id: 'figma-5',
      studentName: 'Bảo Châu',
      subject: 'Vật lý',
      subjectColor: { bg: '#f4f0ff', text: '#8b5cf6' },
      date: '17/09/2026',
      time: '16:00',
      duration: '60 phút',
      status: 'upcoming',
      statusLabel: 'Sắp tới',
      canJoin: true
    }
  ];

  // Active students list (from Figma 16:399 right sidebar)
  const activeStudents = [
    { initials: 'MA', name: 'Minh Anh', subject: 'Toán học', sessions: '1 buổi' },
    { initials: 'PL', name: 'Phương Linh', subject: 'Vật lý', sessions: '1 buổi' },
    { initials: 'QK', name: 'Quốc Khánh', subject: 'Tin học', sessions: '1 buổi' },
    { initials: 'TH', name: 'Thu Hà', subject: 'Toán học', sessions: '1 buổi' },
    { initials: 'BC', name: 'Bảo Châu', subject: 'Vật lý', sessions: '1 buổi' },
  ];

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await lessonService.getLessons();
      if (res.success && res.data && res.data.length > 0) {
        setLessons(res.data);
      } else {
        // Fallback to Figma default lessons
        setLessons(figmaMockLessons);
      }
    } catch (err) {
      setLessons(figmaMockLessons);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await classService.getClasses();
      if (res.success && res.data) {
        setClassList(res.data);
        if (res.data.length > 0) {
          setSelectedClassId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Không thể lấy danh sách lớp học:', err);
    }
  };

  useEffect(() => {
    fetchLessons();
    if (user?.role === 'TUTOR') {
      fetchClasses();
    }
  }, [user]);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !newTitle.trim() || !newStartTime || !newEndTime) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    try {
      setCreateSubmitting(true);
      const payload = {
        classId: Number(selectedClassId),
        title: newTitle.trim(),
        startTime: newStartTime,
        endTime: newEndTime
      };
      const res = await lessonService.createLesson(payload);
      if (res.success) {
        alert('Tạo buổi học mới thành công!');
        setShowCreateModal(false);
        setNewTitle('');
        setNewStartTime('');
        setNewEndTime('');
        fetchLessons();
      } else {
        alert(res.message || 'Tạo buổi học thất bại.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo buổi học.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleOpenNoteModal = (lesson) => {
    setSelectedLessonForNote(lesson);
    setRawNoteInput(lesson.rawNote || '');
    setAiSummaryInput(lesson.aiSummary || '');
    setKeyLearningsInput(lesson.keyLearnings || '');
    setAreasImprovementInput(lesson.areasForImprovement || '');
    setNoteSuccessMsg('');
  };

  const handleGenerateAINote = async () => {
    if (!rawNoteInput.trim()) {
      alert('Vui lòng nhập nội dung ghi chú thô của buổi học trước khi dùng AI!');
      return;
    }

    try {
      setAiGenerating(true);
      const res = await lessonService.generateAINote(selectedLessonForNote.id, rawNoteInput);
      if (res.success && res.data) {
        setAiSummaryInput(res.data.aiSummary || '');
        setKeyLearningsInput(res.data.keyLearnings || '');
        setAreasImprovementInput(res.data.areasForImprovement || '');
        setNoteSuccessMsg('AI đã tạo tóm tắt thông minh thành công!');
      } else {
        alert(res.message || 'Không thể tạo bản tóm tắt AI.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi gọi API AI tóm tắt.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      setNoteSubmitting(true);
      const payload = {
        rawNote: rawNoteInput,
        aiSummary: aiSummaryInput,
        keyLearnings: keyLearningsInput,
        areasForImprovement: areasImprovementInput
      };
      const res = await lessonService.updateLessonNote(selectedLessonForNote.id, payload);
      if (res.success) {
        setNoteSuccessMsg('Lưu thông tin ghi chú thành công!');
        fetchLessons();
        setTimeout(() => setSelectedLessonForNote(null), 1500);
      } else {
        alert(res.message || 'Lưu ghi chú thất bại.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu ghi chú.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Filter lessons based on filterTab
  const filteredLessons = lessons.filter(l => {
    if (filterTab === 'upcoming') {
      return l.status === 'upcoming' || l.status === 'SCHEDULED' || !l.status;
    }
    if (filterTab === 'completed') {
      return l.status === 'completed' || l.status === 'COMPLETED';
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px', position: 'relative' }}>
      
      {/* Floating Background Decorative Shapes (matching Figma) */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '-30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#fff4cc',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '180px',
        right: '-20px',
        width: '70px',
        height: '70px',
        backgroundColor: '#f3e8ff',
        transform: 'rotate(45deg)',
        borderRadius: '16px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '120px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        backgroundColor: '#d1fae5',
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '28px', 
        position: 'relative', 
        zIndex: 1,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            color: '#0f172a', 
            margin: '0 0 6px 0',
            fontFamily: 'serif'
          }}>
            Lịch Dạy Của Tôi
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
            Quản lý tất cả buổi học và học sinh của bạn
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* List / Week Toggle */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '999px',
            padding: '3px',
            boxShadow: '2px 2px 0px #0f172a'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                border: 'none',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: viewMode === 'list' ? '#181b2a' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              Danh sách
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              style={{
                border: 'none',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: viewMode === 'week' ? '#181b2a' : 'transparent',
                color: viewMode === 'week' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              Tuần
            </button>
          </div>

          {user?.role === 'TUTOR' && (
            <button
              type="button"
              className="btn-brutal-black"
              style={{ padding: '8px 18px', fontSize: '0.88rem', gap: '6px' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} /> Lên lịch buổi mới
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Cards (Figma 16:399) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Card 1: Peach */}
        <div style={{
          backgroundColor: '#fff1ed',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ color: '#ea580c' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ea580c', lineHeight: 1.1, fontFamily: 'serif' }}>
              4
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Tổng buổi học
            </div>
          </div>
        </div>

        {/* Card 2: Lavender */}
        <div style={{
          backgroundColor: '#f4f0ff',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ color: '#7c3aed' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1.1, fontFamily: 'serif' }}>
              5.5h
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Giờ đã dạy
            </div>
          </div>
        </div>

        {/* Card 3: Mint */}
        <div style={{
          backgroundColor: '#eefaf6',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ color: '#059669' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', lineHeight: 1.1, fontFamily: 'serif' }}>
              5
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Học sinh đang học
            </div>
          </div>
        </div>

        {/* Card 4: Yellow */}
        <div style={{
          backgroundColor: '#fffce8',
          border: '1.5px solid #0f172a',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ color: '#ca8a04' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ca8a04', lineHeight: 1.1, fontFamily: 'serif' }}>
              1.250.000đ
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Thu nhập hiện tại
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid (2 Columns: Left ~65%, Right ~35%) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 360px',
        gap: '24px',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Column: Lesson Cards & Filter Tabs */}
        <div>
          {/* Filter Bar (Figma Pill Tab style) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '6px',
            display: 'flex',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: filterTab === 'all' ? '#181b2a' : 'transparent',
                color: filterTab === 'all' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('upcoming')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: filterTab === 'upcoming' ? '#181b2a' : 'transparent',
                color: filterTab === 'upcoming' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              Sắp tới (4)
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('completed')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: filterTab === 'completed' ? '#181b2a' : 'transparent',
                color: filterTab === 'completed' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              Đã hoàn thành (1)
            </button>
          </div>

          {/* Lessons Container Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {filteredLessons.map((lesson) => {
              const name = lesson.studentName || (lesson.classEntity?.studentName) || 'Học sinh';
              const subject = lesson.subject || (lesson.classEntity?.subjectName) || 'Toán học';
              const timeDisplay = lesson.time 
                ? `${lesson.date} · ${lesson.time} · ${lesson.duration}`
                : `${lesson.startTime ? new Date(lesson.startTime).toLocaleString('vi-VN') : '10:00'}`;
              const isCompleted = lesson.status === 'completed' || lesson.status === 'COMPLETED';

              return (
                <div
                  key={lesson.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0f172a';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* User Icon Box */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7c3aed',
                      backgroundColor: '#f8fafc',
                      flexShrink: 0
                    }}>
                      <User size={22} />
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '2px' }}>
                        {name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {timeDisplay}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Subject badge */}
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: subject.includes('Vật') ? '#f4f0ff' : subject.includes('Tin') ? '#e0f2fe' : '#fff1ed',
                      color: subject.includes('Vật') ? '#7c3aed' : subject.includes('Tin') ? '#0284c7' : '#ea580c'
                    }}>
                      {subject}
                    </span>

                    {/* Status badge */}
                    {isCompleted ? (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: '#ede9fe',
                        color: '#7c3aed'
                      }}>
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: '#eefaf6',
                        color: '#059669'
                      }}>
                        Sắp tới
                      </span>
                    )}

                    {/* Action Button: Tham gia */}
                    {!isCompleted && (
                      <button
                        type="button"
                        style={{
                          backgroundColor: '#7c3aed',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 18px',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                        onClick={() => window.open('https://meet.google.com/new', '_blank')}
                      >
                        Tham gia
                      </button>
                    )}

                    {/* Button AI Note if real lesson */}
                    {lesson.classEntity && (
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => handleOpenNoteModal(lesson)}
                      >
                        <Sparkles size={14} color="#7c3aed" /> Note AI
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3 Cards matching Figma */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Học sinh Đang học */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '22px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Học sinh Đang học
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeStudents.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.78rem'
                    }}>
                      {st.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                        {st.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {st.subject}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 700 }}>
                    {st.sessions}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Lịch Trống Của Tôi */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Lịch Trống Của Tôi
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Chỉnh sửa
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Thứ 2: 9-12h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Thứ 4: 14-18h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Thứ 6: 10-16h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Thứ 7: 9-14h</span>
              </div>
            </div>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                border: '1.5px dashed #cbd5e1',
                backgroundColor: 'transparent',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0f172a';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              + Thêm khung giờ
            </button>
          </div>

          {/* Card 3: THU NHẬP THÁNG 9 (Figma Yellow Card) */}
          <div style={{
            backgroundColor: '#ffd600',
            border: '2px solid #0f172a',
            borderRadius: '20px',
            padding: '24px',
            position: 'relative',
            boxShadow: '4px 4px 0px #0f172a'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#451a03'
            }}>
              THU NHẬP THÁNG 9
            </span>

            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#0f172a',
              marginTop: '6px',
              marginBottom: '2px',
              fontFamily: 'serif'
            }}>
              1.250.000đ
            </div>

            <div style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600, marginBottom: '16px' }}>
              5 buổi · 250.000đ/giờ
            </div>

            {/* Progress Bar */}
            <div style={{
              height: '8px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0,0,0,0.15)',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                height: '100%',
                width: '72%',
                backgroundColor: '#0f172a',
                borderRadius: '999px'
              }} />
            </div>

            <div style={{ fontSize: '0.78rem', color: '#78350f', fontWeight: 700 }}>
              72% mục tiêu tháng (10.000.000đ)
            </div>

            {/* Diamond outline illustration */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '32px',
              height: '32px',
              border: '1.5px solid #0f172a',
              transform: 'rotate(45deg)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>

      {/* Bottom Section: "Phân tích" (Analysis - Figma 16:399) */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px', fontFamily: 'serif' }}>
          Phân tích
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          
          {/* Analysis Card 1: Tỉ lệ hoàn thành */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
              Tỉ lệ hoàn thành
            </div>

            {/* Circular Gauge */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '8px solid #00e599',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              color: '#0f172a',
              marginBottom: '14px'
            }}>
              100%
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Buổi học hoàn thành
            </div>
          </div>

          {/* Analysis Card 2: Thời gian phản hồi */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
              Thời gian phản hồi
            </div>

            <div style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              color: '#7c3aed',
              fontFamily: 'serif',
              marginBottom: '14px'
            }}>
              &lt; 1 giờ
            </div>

            <span style={{
              backgroundColor: '#fef08a',
              color: '#713f12',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '4px 16px',
              borderRadius: '999px'
            }}>
              Xuất sắc
            </span>
          </div>

          {/* Analysis Card 3: Học sinh quay lại */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Học sinh quay lại
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#ea580c',
                  fontFamily: 'serif',
                  marginTop: '4px'
                }}>
                  78%
                </div>
              </div>
            </div>

            {/* Horizontal bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>Tháng 7</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>72%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#f1f5f9' }}>
                  <div style={{ height: '100%', width: '72%', borderRadius: '999px', backgroundColor: '#ea580c' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>Tháng 8</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>75%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#f1f5f9' }}>
                  <div style={{ height: '100%', width: '75%', borderRadius: '999px', backgroundColor: '#ea580c' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>Tháng 9</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>78%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#f1f5f9' }}>
                  <div style={{ height: '100%', width: '78%', borderRadius: '999px', backgroundColor: '#ea580c' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ghi chú & Note AI (Gia sư) */}
      {selectedLessonForNote && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '24px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles color="#7c3aed" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Ghi chú & Trợ lý AI buổi học
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLessonForNote(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            {noteSuccessMsg && (
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                {noteSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveNote}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  1. Ghi chú thô của Gia sư
                </label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    minHeight: '90px'
                  }}
                  placeholder="Ghi nhanh nội dung dạy học, thái độ học tập, bài tập giao..."
                  value={rawNoteInput}
                  onChange={(e) => setRawNoteInput(e.target.value)}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button
                  type="button"
                  className="btn-brutal-black"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
                  onClick={handleGenerateAINote}
                  disabled={aiGenerating}
                >
                  <Sparkles size={16} />
                  {aiGenerating ? 'AI đang tổng hợp...' : 'Dùng AI tóm tắt thông minh'}
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  2. Tóm tắt của AI
                </label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    minHeight: '70px',
                    backgroundColor: '#f8fafc'
                  }}
                  placeholder="Bản tóm tắt do AI tạo..."
                  value={aiSummaryInput}
                  onChange={(e) => setAiSummaryInput(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  3. Kiến thức trọng tâm đạt được
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ví dụ: Nắm vững công thức nguyên hàm"
                  value={keyLearningsInput}
                  onChange={(e) => setKeyLearningsInput(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  4. Điểm cần cải thiện / Bài tập về nhà
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ví dụ: Bài 1-5 trang 42 SGK"
                  value={areasImprovementInput}
                  onChange={(e) => setAreasImprovementInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLessonForNote(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-brutal-black"
                  style={{ padding: '10px 24px' }}
                  disabled={noteSubmitting}
                >
                  {noteSubmitting ? 'Đang lưu...' : 'Lưu Ghi chú & AI Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm buổi học mới (Gia sư) */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Lên lịch buổi học mới
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateLesson}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Chọn Lớp học (*)
                </label>
                {classList.length === 0 ? (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                    Chưa có lớp học được tạo trong hệ thống. Lớp mẫu sẽ được áp dụng.
                  </p>
                ) : (
                  <select
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.9rem'
                    }}
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    required
                  >
                    {classList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.className} ({c.subjectName}) - {c.studentName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tên bài học / Tiêu đề (*)
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ví dụ: Buổi 3: Luyện giải đề Cực trị Hàm số"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Thời gian bắt đầu (*)
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.85rem'
                    }}
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Thời gian kết thúc (*)
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.85rem'
                    }}
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #0f172a',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-brutal-black"
                  style={{ padding: '10px 24px' }}
                  disabled={createSubmitting}
                >
                  {createSubmitting ? 'Đang tạo...' : 'Tạo buổi học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
