import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { classService } from '../services/classService';
import { lessonService } from '../services/lessonService';
import progressService from '../services/progressService';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

const metricCard = (icon, label, value, color, background) => ({
  icon,
  label,
  value,
  color,
  background
});

const normalizeStatus = (value) => String(value || '').trim().toUpperCase();

const normalizeRole = (value) => normalizeStatus(value).replace(/^ROLE_/, '');

const CONNECTED_CLASS_STATUSES = new Set(['ACTIVE', 'PAUSED', 'COMPLETED']);

const getClassEntity = (item) => item?.classEntity || item?.tutoringClass || {};

const getClassId = (item) => item?.id ?? item?.classId ?? getClassEntity(item)?.id;

const getClassStatus = (item) => normalizeStatus(item?.status ?? getClassEntity(item)?.status);

const hasRecordedPayment = (item) => {
  const entity = getClassEntity(item);
  return Boolean(item?.paidAt || entity?.paidAt)
    || Number(item?.paidAmount ?? entity?.paidAmount ?? 0) > 0;
};

const isAvailabilitySlot = (item) => {
  const text = [item?.className, item?.studentName, item?.subjectName]
    .filter(Boolean)
    .join(' ');
  return Boolean(item?.isFreeSlot || item?.freeSlot)
    || /lịch\s*rảnh|sẵn\s*sàng\s*nhận\s*lớp/i.test(text);
};

const isConnectedClass = (item) => {
  if (item == null || getClassId(item) == null || isAvailabilitySlot(item)) return false;
  return hasRecordedPayment(item) || CONNECTED_CLASS_STATUSES.has(getClassStatus(item));
};

const getResponseItems = (response) => {
  if (Array.isArray(response)) return response;
  return Array.isArray(response?.data) ? response.data : [];
};

const readLocalClasses = (user) => {
  if (!user?.id || typeof window === 'undefined') return [];

  try {
    const key = `giasuhq_custom_classes_${user.id}`;
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    if (!Array.isArray(parsed)) return [];

    const role = normalizeRole(user.role);
    const currentUserId = String(user.id);
    return parsed.filter((item) => {
      if (!item || getClassId(item) == null) return false;
      if (role === 'ADMIN') return true;
      if (role === 'TUTOR') return String(item.tutorId ?? '') === currentUserId;
      return [item.parentId, item.studentId].some((id) => String(id ?? '') === currentUserId);
    });
  } catch (error) {
    return [];
  }
};

const getClassIdentity = (item) => {
  const entity = getClassEntity(item);
  const classId = getClassId(item);
  const orderCode = item?.paymentOrderCode
    || item?.orderCode
    || entity?.paymentOrderCode
    || entity?.orderCode;
  return [
    classId != null ? `id:${String(classId)}` : null,
    orderCode ? `order:${String(orderCode).trim().toUpperCase()}` : null
  ].filter(Boolean);
};

const deriveClassesFromLessons = (lessons) => {
  const derived = new Map();
  (lessons || []).forEach((lesson) => {
    const classId = getLessonClassId(lesson);
    if (classId == null) return;

    const entity = getClassEntity(lesson);
    const key = String(classId);
    if (!derived.has(key)) {
      derived.set(key, {
        id: classId,
        className: lesson.className || entity.className || `Lớp #${classId}`,
        subjectName: lesson.subjectName || lesson.subject || entity.subjectName || entity.subject?.name || 'Môn học',
        studentName: lesson.studentName || entity.studentName || 'Học sinh',
        tutorId: lesson.tutorId || entity.tutorId,
        parentId: lesson.parentId || entity.parentId,
        status: entity.status || 'ACTIVE',
        paidAt: entity.paidAt,
        paidAmount: entity.paidAmount
      });
    }
  });
  return Array.from(derived.values());
};

const mergeConnectedClasses = (...sources) => {
  const merged = [];
  const seen = new Set();

  sources.flat().forEach((item) => {
    if (!isConnectedClass(item)) return;
    const identities = getClassIdentity(item);
    if (identities.length === 0 || identities.some((identity) => seen.has(identity))) return;
    identities.forEach((identity) => seen.add(identity));
    merged.push(item);
  });

  return merged;
};

const getLessonClassId = (lesson) => lesson?.classId ?? lesson?.classEntity?.id;

const getLessonNote = (lesson) => lesson?.lessonNote || lesson?.note || null;

const getLessonHours = (lesson) => {
  if (!lesson?.startTime || !lesson?.endTime) return 0;
  const start = new Date(lesson.startTime);
  const end = new Date(lesson.endTime);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return 0;
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  return minutes / 60;
};

const buildLocalProgressReport = (classes, lessons, selectedClassId) => {
  const selectedId = selectedClassId ? String(selectedClassId) : '';
  const scopedClasses = (classes || []).filter((item) => !selectedId || String(item.id) === selectedId);
  const scopedLessons = (lessons || []).filter((item) => !selectedId || String(getLessonClassId(item)) === selectedId);
  const classMap = new Map(scopedClasses.map((item) => [String(item.id), item]));

  scopedLessons.forEach((lesson) => {
    const classId = getLessonClassId(lesson);
    if (classId !== null && classId !== undefined && !classMap.has(String(classId))) {
      classMap.set(String(classId), {
        id: classId,
        className: lesson.className || `Lớp #${classId}`,
        subjectName: lesson.subjectName || 'Môn học',
        studentName: lesson.studentName || 'Học sinh'
      });
    }
  });

  const reportClasses = Array.from(classMap.values()).map((item) => {
    const itemLessons = scopedLessons.filter((lesson) => String(getLessonClassId(lesson)) === String(item.id));
    const completedLessons = itemLessons.filter((lesson) => normalizeStatus(lesson.status) === 'COMPLETED').length;
    const totalHours = itemLessons.reduce((total, lesson) => total + getLessonHours(lesson), 0);
    const recentTopics = itemLessons
      .map((lesson) => {
        const note = getLessonNote(lesson);
        return note?.keyLearnings || lesson.title;
      })
      .filter(Boolean)
      .slice(0, 3);

    return {
      classId: item.id,
      className: item.className || `Lớp #${item.id}`,
      subjectName: item.subjectName || 'Môn học',
      studentName: item.studentName || 'Học sinh',
      totalLessons: itemLessons.length,
      completedLessons,
      upcomingLessons: itemLessons.filter((lesson) => normalizeStatus(lesson.status) === 'SCHEDULED').length,
      completionRate: itemLessons.length ? Number(((completedLessons * 100) / itemLessons.length).toFixed(1)) : 0,
      totalHours: Number(totalHours.toFixed(1)),
      totalAssignments: 0,
      gradedAssignments: 0,
      overdueAssignments: 0,
      averageAssignmentScore: null,
      recentTopics
    };
  });

  const lessonNotes = scopedLessons
    .map((lesson) => {
      const note = getLessonNote(lesson);
      if (!note || (!note.aiSummary && !note.rawTutorNote && !note.keyLearnings && !note.areasForImprovement)) return null;
      return {
        lessonId: lesson.id,
        classId: getLessonClassId(lesson),
        className: lesson.className || classMap.get(String(getLessonClassId(lesson)))?.className || 'Lớp học',
        title: lesson.title || 'Buổi học',
        startTime: lesson.startTime,
        status: lesson.status,
        aiSummary: note.aiSummary || note.rawTutorNote,
        keyLearnings: note.keyLearnings,
        areasForImprovement: note.areasForImprovement
      };
    })
    .filter(Boolean)
    .sort((left, right) => new Date(right.startTime || 0) - new Date(left.startTime || 0));

  const completedLessons = scopedLessons.filter((lesson) => normalizeStatus(lesson.status) === 'COMPLETED').length;
  const totalHours = scopedLessons.reduce((total, lesson) => total + getLessonHours(lesson), 0);
  const learnings = lessonNotes.map((note) => note.keyLearnings).filter(Boolean).slice(0, 3);
  const improvements = lessonNotes.map((note) => note.areasForImprovement).filter(Boolean).slice(0, 3);
  const firstClass = reportClasses[0] || {};
  const studentNames = reportClasses.map((item) => item.studentName).filter(Boolean);
  const subjects = reportClasses.map((item) => item.subjectName).filter(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    studentName: selectedId ? (firstClass.studentName || 'Học sinh') : (studentNames.length === 1 ? studentNames[0] : 'Các học sinh'),
    subjectName: selectedId ? (firstClass.subjectName || 'Môn học') : [...new Set(subjects)].join(', ') || 'Tổng hợp',
    scopeLabel: selectedId ? 'Báo cáo lớp học được chọn' : 'Tổng hợp dữ liệu đã lưu',
    totalClasses: reportClasses.length,
    totalLessons: scopedLessons.length,
    completedLessons,
    upcomingLessons: scopedLessons.filter((lesson) => normalizeStatus(lesson.status) === 'SCHEDULED').length,
    completionRate: scopedLessons.length ? Number(((completedLessons * 100) / scopedLessons.length).toFixed(1)) : 0,
    totalHours: Number(totalHours.toFixed(1)),
    totalAssignments: 0,
    submittedAssignments: 0,
    gradedAssignments: 0,
    overdueAssignments: 0,
    averageAssignmentScore: null,
    classes: reportClasses,
    lessonNotes,
    aiReport: {
      overallSummary: lessonNotes.length
        ? `Đã ghi nhận ${lessonNotes.length} báo cáo sau buổi học. Phụ huynh có thể theo dõi nội dung đã học và phần cần rèn luyện bên dưới.`
        : 'Chưa có ghi chú cuối buổi nào được lưu trên hệ thống.',
      strengths: learnings.length ? learnings.join(' ') : 'Chưa có dữ liệu về kiến thức trọng tâm.',
      areasForImprovement: improvements.length ? improvements.join(' ') : 'Chưa có dữ liệu về phần cần cải thiện.',
      nextSteps: 'Xem lại nhận xét của buổi gần nhất và hoàn thành bài tập gia sư giao trước buổi tiếp theo.',
      motivation: 'Duy trì lịch học đều đặn và trao đổi sớm khi học sinh gặp khó khăn.',
      aiGenerated: false
    }
  };
};

export default function ProgressReportView({ user }) {
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!user?.id) {
        setClasses([]);
        setLessons([]);
        setSelectedClassId('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const [classResult, lessonResult] = await Promise.allSettled([
        classService.getClasses(),
        lessonService.getLessons()
      ]);
      if (!mounted) return;

      const apiClasses = classResult.status === 'fulfilled'
        ? getResponseItems(classResult.value)
        : [];
      const apiLessons = lessonResult.status === 'fulfilled'
        ? getResponseItems(lessonResult.value)
        : [];
      const localClasses = readLocalClasses(user);
      const lessonClasses = deriveClassesFromLessons(apiLessons);
      const mergedClasses = mergeConnectedClasses(apiClasses, localClasses, lessonClasses);

      setClasses(mergedClasses);
      setLessons(apiLessons);
      setSelectedClassId((current) => (
        current && mergedClasses.some((item) => String(getClassId(item)) === String(current))
          ? current
          : ''
      ));

      if (classResult.status === 'rejected' && mergedClasses.length === 0) {
        setError(classResult.reason?.response?.data?.message || 'Không thể tải danh sách lớp học.');
      } else if (lessonResult.status === 'rejected') {
        console.warn('Không thể tải ghi chú buổi học để dự phòng báo cáo:', lessonResult.reason);
      }

      setLoading(false);
    };

    loadData();
    return () => { mounted = false; };
  }, [user?.id, user?.role]);

  const generateReport = async () => {
    setGenerating(true);
    setError('');
    setNotice('');
    try {
      const numericClassId = selectedClassId && Number.isFinite(Number(selectedClassId))
        ? Number(selectedClassId)
        : null;
      const response = await progressService.generateReport(numericClassId);
      const hasFallbackData = classes.length > 0 || lessons.length > 0;
      const backendHasClasses = Array.isArray(response?.data?.classes) && response.data.classes.length > 0;

      if (response?.success && response.data && (backendHasClasses || !hasFallbackData)) {
        setReport(response.data);
        if (response.data.aiReport?.aiGenerated === false) {
          setNotice('Gemini chưa được cấu hình hoặc đang lỗi API key. Báo cáo vẫn được dựng từ dữ liệu đã lưu và nhận xét của gia sư.');
        }
      } else {
        if (hasFallbackData) {
          setReport(buildLocalProgressReport(classes, lessons, selectedClassId));
          setNotice('Không gọi được báo cáo AI, đã hiển thị bản tổng hợp từ dữ liệu đã lưu.');
        } else {
          setError(response?.message || 'Không thể tạo báo cáo tiến độ.');
        }
      }
    } catch (err) {
      if (lessons.length > 0 || classes.length > 0) {
        setReport(buildLocalProgressReport(classes, lessons, selectedClassId));
        setNotice('Không gọi được báo cáo AI, có thể do API key. Đã hiển thị bản tổng hợp từ dữ liệu đã lưu.');
      } else {
        setError(err.response?.data?.message || 'Không thể tạo báo cáo tiến độ.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const metrics = useMemo(() => {
    if (!report) return [];
    return [
      metricCard(<BookOpen size={20} />, 'Buổi học hoàn thành', `${report.completedLessons}/${report.totalLessons}`, '#ea580c', '#fff1ed'),
      metricCard(<Clock3 size={20} />, 'Tổng thời lượng', `${report.totalHours || 0} giờ`, '#7c3aed', '#f4f0ff'),
      metricCard(<Target size={20} />, 'Tỷ lệ hoàn thành', `${report.completionRate || 0}%`, '#059669', '#eefaf6'),
      metricCard(<FileCheck2 size={20} />, 'Điểm bài tập TB', report.averageAssignmentScore == null ? 'Chưa có' : `${report.averageAssignmentScore}/10`, '#2563eb', '#eff6ff')
    ];
  }, [report]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Sparkles size={16} /> AI học tập
          </div>
          <h1 style={{ margin: '6px 0', color: '#0f172a', fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.02em' }}>Báo Cáo Tiến Độ</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Tổng hợp buổi học, bài tập và khuyến nghị học tập từ dữ liệu thực tế.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            disabled={loading || classes.length === 0}
            style={{ minWidth: '230px', border: '1.5px solid #0f172a', borderRadius: '10px', padding: '10px 12px', background: '#fff', color: '#0f172a', fontWeight: 700 }}
          >
            <option value="">Tất cả lớp học</option>
            {classes.map((item) => {
              const classId = getClassId(item);
              const label = [item.className || `Lớp #${classId}`, item.studentName].filter(Boolean).join(' · ');
              return <option key={classId} value={classId}>{label}</option>;
            })}
          </select>
          <button
            type="button"
            onClick={generateReport}
            disabled={generating || loading || classes.length === 0}
            className="figma-btn-primary"
            style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          >
            <RefreshCw size={16} className={generating ? 'spin' : ''} />
            {generating ? 'Đang phân tích...' : 'Tạo báo cáo AI'}
          </button>
        </div>
      </div>

      {error && <div style={{ border: '1.5px solid #fecaca', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontWeight: 700 }}>{error}</div>}
      {notice && <div style={{ border: '1.5px solid #fcd34d', background: '#fffbeb', color: '#92400e', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontWeight: 700 }}>{notice}</div>}

      {!loading && classes.length === 0 && !error && (
        <div style={{ border: '1.5px solid #fcd34d', background: '#fffbeb', color: '#92400e', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontWeight: 700 }}>
          Chưa tìm thấy lớp đã kết nối cho tài khoản này. Lớp sẽ xuất hiện sau khi thanh toán phí kết nối hoặc khi gia sư đã tạo buổi học thuộc lớp.
        </div>
      )}

      {!report ? (
        <div style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '48px 24px', textAlign: 'center' }}>
          <BarChart3 size={42} color="#7c3aed" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.2rem' }}>{classes.length === 0 ? 'Chưa có lớp để lập báo cáo' : 'Chưa có báo cáo trong phiên này'}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>{classes.length === 0 ? 'Kiểm tra lại trạng thái kết nối hoặc tạo buổi học đầu tiên cho lớp.' : 'Chọn một lớp hoặc toàn bộ lớp học rồi bấm “Tạo báo cáo AI”.'}</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            {metrics.map((metric) => (
              <div key={metric.label} style={{ background: metric.background, border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px' }}>
                <div style={{ color: metric.color, marginBottom: '12px' }}>{metric.icon}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: metric.color }}>{metric.value}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700, marginTop: '3px' }}>{metric.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '18px', alignItems: 'start' }}>
            <section style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 900 }}>{report.aiReport?.aiGenerated === false ? 'Tổng hợp tiến độ' : 'Phân tích từ AI'}</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>{report.scopeLabel} · {report.generatedAt ? new Date(report.generatedAt).toLocaleString('vi-VN') : ''}</p>
                </div>
                <Activity size={22} color="#7c3aed" />
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  ['Tổng quan', report.aiReport?.overallSummary, '#f4f0ff', '#6d28d9'],
                  ['Điểm mạnh', report.aiReport?.strengths, '#eefaf6', '#047857'],
                  ['Cần cải thiện', report.aiReport?.areasForImprovement, '#fff7ed', '#c2410c'],
                  ['Bước tiếp theo', report.aiReport?.nextSteps, '#eff6ff', '#1d4ed8'],
                  ['Động viên', report.aiReport?.motivation, '#fffce8', '#a16207']
                ].map(([label, text, background, color]) => (
                  <div key={label} style={{ background, borderRadius: '12px', padding: '13px 15px' }}>
                    <div style={{ color, fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '5px' }}>{label}</div>
                    <div style={{ color: '#334155', lineHeight: 1.55, fontSize: '0.9rem' }}>{text || 'Chưa có dữ liệu.'}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: '#181c2e', color: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#ffd600', marginBottom: '14px' }}>
                <TrendingUp size={20} />
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900 }}>Tóm tắt bài tập</h2>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div><strong style={{ color: '#ffd600', fontSize: '1.3rem' }}>{formatNumber(report.totalAssignments)}</strong><div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Tổng bài tập</div></div>
                <div><strong style={{ color: '#86efac', fontSize: '1.3rem' }}>{formatNumber(report.gradedAssignments)}</strong><div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Đã được chấm</div></div>
                <div><strong style={{ color: '#fca5a5', fontSize: '1.3rem' }}>{formatNumber(report.overdueAssignments)}</strong><div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Quá hạn/chưa nộp</div></div>
              </div>
            </section>
          </div>

          <section style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px', marginTop: '18px' }}>
            <h2 style={{ margin: '0 0 16px', color: '#0f172a', fontSize: '1.1rem', fontWeight: 900 }}>Tiến độ theo lớp</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {(report.classes || []).map((item) => (
                <div key={item.classId} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 900 }}>{item.className}</div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '3px' }}>{item.subjectName} · {item.studentName} · {item.completedLessons}/{item.totalLessons} buổi hoàn thành</div>
                    <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '99px', marginTop: '10px', overflow: 'hidden' }}><div style={{ width: `${Math.min(100, Number(item.completionRate || 0))}%`, height: '100%', background: '#7c3aed', borderRadius: '99px' }} /></div>
                  </div>
                  <div style={{ color: '#7c3aed', fontWeight: 900, fontSize: '1.05rem' }}>{item.completionRate || 0}%</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '22px', marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
              <CheckCircle2 size={21} color="#059669" />
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: 900 }}>Nhận xét sau từng buổi học</h2>
            </div>
            {(report.lessonNotes || []).length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Gia sư chưa lưu báo cáo cuối buổi nào cho phạm vi lớp học này.</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {report.lessonNotes.map((note) => (
                  <article key={note.lessonId} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <div style={{ color: '#0f172a', fontWeight: 900 }}>{note.title || 'Buổi học'}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{note.startTime ? new Date(note.startTime).toLocaleString('vi-VN') : ''}</div>
                    </div>
                    <div style={{ color: '#334155', lineHeight: 1.55, fontSize: '0.9rem' }}>{note.aiSummary || 'Chưa có tóm tắt.'}</div>
                    {note.keyLearnings && <div style={{ marginTop: '8px', color: '#047857', fontSize: '0.85rem' }}><strong>Kiến thức trọng tâm:</strong> {note.keyLearnings}</div>}
                    {note.areasForImprovement && <div style={{ marginTop: '5px', color: '#c2410c', fontSize: '0.85rem' }}><strong>Cần cải thiện:</strong> {note.areasForImprovement}</div>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
