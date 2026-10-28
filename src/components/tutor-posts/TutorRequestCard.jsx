import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ';

export default function TutorRequestCard({ post, onSelect, user }) {
  const isTutor = user?.role === 'TUTOR';
  const hasApplied = post.hasApplied;

  return (
    <div 
      onClick={() => onSelect(post)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #0f172a',
        padding: '22px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '4px 4px 0px #0f172a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
      }}
    >
      <div>
        {/* Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1.5px solid #2563eb',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.subjectName}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              border: '1.5px solid #0f172a',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.gradeLevel}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: post.teachingMode === 'ONLINE' ? '#faf5ff' : '#fef3c7',
              color: post.teachingMode === 'ONLINE' ? '#6d28d9' : '#b45309',
              border: `1.5px solid ${post.teachingMode === 'ONLINE' ? '#7c3aed' : '#d97706'}`,
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              {post.teachingMode === 'ONLINE' ? 'Online' : (post.teachingMode === 'OFFLINE' ? 'Tại nhà' : 'Hybrid')}
            </span>
          </div>

          {hasApplied && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 800,
              backgroundColor: '#dcfce7',
              color: '#15803d',
              border: '1.5px solid #16a34a',
              padding: '4px 8px',
              borderRadius: '8px'
            }}>
              <CheckCircle size={13} />
              Đã nộp đơn
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 10px',
          lineHeight: 1.4
        }}>
          {post.title}
        </h3>

        {/* Location & Schedule in Hanoi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', fontSize: '0.85rem', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#2563eb" />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {post.district ? `${post.district}, ` : ''}Hà Nội
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="#2563eb" />
            <span>{post.sessionsPerWeek} buổi/tuần • {post.preferredSchedule || 'Lịch thỏa thuận'}</span>
          </div>
          {post.tutorTypePreference && post.tutorTypePreference !== 'ANY' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={15} color="#2563eb" />
              <span>Yêu cầu: {post.tutorTypePreference === 'TEACHER' ? 'Giáo viên / Thạc sĩ' : 'Sinh viên'}</span>
            </div>
          )}
        </div>

        {/* Notes preview if present */}
        {post.studentNotes && (
          <p style={{
            fontSize: '0.84rem',
            color: '#64748b',
            lineHeight: 1.5,
            margin: '0 0 16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.studentNotes}
          </p>
        )}
      </div>

      {/* Footer info: Budget & Action */}
      <div style={{
        borderTop: '1.5px solid #f1f5f9',
        paddingTop: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Học phí dự kiến</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
            {post.budgetAmount ? formatVND(post.budgetAmount) : 'Thỏa thuận'}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              {post.budgetType === 'PER_MONTH' ? ' / tháng' : ' / buổi'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Users size={14} />
            {post.applicationsCount || 0}
          </span>
          <button
            type="button"
            style={{
              padding: '8px 14px',
              backgroundColor: isTutor ? '#0f172a' : '#ffffff',
              color: isTutor ? '#ffffff' : '#0f172a',
              border: '2px solid #0f172a',
              boxShadow: '2px 2px 0px #0f172a',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{isTutor ? 'Ứng tuyển' : 'Chi tiết'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
