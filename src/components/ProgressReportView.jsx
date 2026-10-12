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
import progressService from '../services/progressService';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

const metricCard = (icon, label, value, color, background) => ({
  icon,
  label,
  value,
  color,
  background
});

export default function ProgressReportView({ user }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadClasses = async () => {
    try {
      const response = await classService.getClasses();
      const items = response?.success && Array.isArray(response.data) ? response.data : [];
      setClasses(items);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách lớp học.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  const generateReport = async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await progressService.generateReport(selectedClassId ? Number(selectedClassId) : null);
      if (response?.success) {
        setReport(response.data);
      } else {
        setError(response?.message || 'Không thể tạo báo cáo tiến độ.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo báo cáo tiến độ.');
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
          <h1 style={{ margin: '6px 0', color: '#0f172a', fontSize: '2rem', fontFamily: 'serif', fontWeight: 900 }}>Báo Cáo Tiến Độ</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Tổng hợp buổi học, bài tập và khuyến nghị học tập từ dữ liệu thực tế.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            style={{ minWidth: '230px', border: '1.5px solid #0f172a', borderRadius: '10px', padding: '10px 12px', background: '#fff', color: '#0f172a', fontWeight: 700 }}
          >
            <option value="">Tất cả lớp học</option>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.className || `Lớp #${item.id}`}</option>)}
          </select>
          <button
            type="button"
            onClick={generateReport}
            disabled={generating || loading}
            className="figma-btn-primary"
            style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          >
            <RefreshCw size={16} className={generating ? 'spin' : ''} />
            {generating ? 'Đang phân tích...' : 'Tạo báo cáo AI'}
          </button>
        </div>
      </div>

      {error && <div style={{ border: '1.5px solid #fecaca', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontWeight: 700 }}>{error}</div>}

      {!report ? (
        <div style={{ background: '#fff', border: '1.5px solid #0f172a', borderRadius: '18px', padding: '48px 24px', textAlign: 'center' }}>
          <BarChart3 size={42} color="#7c3aed" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.2rem' }}>Chưa có báo cáo trong phiên này</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Chọn một lớp hoặc toàn bộ lớp học rồi bấm “Tạo báo cáo AI”.</p>
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
                  <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 900 }}>Phân tích từ Gemini</h2>
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
        </>
      )}
    </div>
  );
}
