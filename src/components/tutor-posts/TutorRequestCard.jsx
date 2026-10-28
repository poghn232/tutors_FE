import React from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function TutorRequestCard({ post, onSelect, user }) {
  const isTutor = user?.role === 'TUTOR';
  const hasApplied = post.hasApplied;

  return (
    <div 
      onClick={() => onSelect(post)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '22px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#93c5fd';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div>
        {/* Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {post.subjectName}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {post.gradeLevel}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: post.teachingMode === 'ONLINE' ? '#f3e8ff' : '#fef3c7',
              color: post.teachingMode === 'ONLINE' ? '#7e22ce' : '#b45309',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {post.teachingMode === 'ONLINE' ? 'Online' : (post.teachingMode === 'OFFLINE' ? 'Tại nhà' : 'Hybrid')}
            </span>
          </div>

          {hasApplied && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              <CheckCircle size={13} />
              Đã ứng tuyển
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 10px',
          lineHeight: 1.4
        }}>
          {post.title}
        </h3>

        {/* Location & Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', fontSize: '13px', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#2563eb" />
            <span>{post.district ? `${post.district}, ` : ''}{post.city || 'Toàn quốc'}</span>
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
            fontSize: '13px',
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
        borderTop: '1px solid #f1f5f9',
        paddingTop: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Học phí dự kiến</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>
            {post.budgetAmount ? `${Number(post.budgetAmount).toLocaleString('vi-VN')} đ` : 'Thỏa thuận'}
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}> /buổi</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={14} />
            {post.applicationsCount || 0} ứng tuyển
          </span>
          <button
            type="button"
            style={{
              padding: '8px 14px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
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
