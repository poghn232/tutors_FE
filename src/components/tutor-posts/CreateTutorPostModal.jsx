import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  MapPin, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { tutorPostService } from '../../services/tutorPostService';
import { subjectService } from '../../services/subjectService';

export default function CreateTutorPostModal({ isOpen, onClose, onSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    gradeLevel: 'Lớp 10',
    teachingMode: 'ONLINE',
    city: 'TP. Hồ Chí Minh',
    district: '',
    detailedAddress: '',
    sessionsPerWeek: 2,
    preferredSchedule: '',
    budgetAmount: 200000,
    budgetType: 'PER_SESSION',
    tutorGenderPreference: 'ANY',
    tutorTypePreference: 'ANY',
    studentNotes: '',
    requirements: ''
  });

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage('');
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await subjectService.getSubjects();
        const list = res?.data || [];
        setSubjects(list);
        if (list.length > 0 && !formData.subjectId) {
          setFormData(prev => ({ ...prev, subjectId: list[0].id }));
        }
      } catch (err) {
        console.error('Error fetching subjects', err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề bài đăng');
      return;
    }
    if (!formData.subjectId) {
      setErrorMessage('Vui lòng chọn môn học');
      return;
    }
    if (!formData.gradeLevel) {
      setErrorMessage('Vui lòng chọn khối lớp');
      return;
    }

    try {
      setSubmitting(true);
      const res = await tutorPostService.createPost({
        ...formData,
        subjectId: Number(formData.subjectId),
        budgetAmount: formData.budgetAmount ? Number(formData.budgetAmount) : null,
        sessionsPerWeek: Number(formData.sessionsPerWeek || 2)
      });
      if (res?.success) {
        if (onSuccess) onSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res?.message || 'Không thể tạo bài đăng. Vui lòng thử lại.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tạo bài đăng.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '760px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Đăng bài tìm gia sư mới
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Nhận hồ sơ và đề xuất học phí từ các gia sư chất lượng cao
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMessage && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Tiêu đề & Môn học */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Tiêu đề bài đăng <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Cần tìm gia sư kèm Toán 12 ôn thi THPT Quốc Gia mục tiêu 8+"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Môn học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Khối lớp / Trình độ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Ôn thi Đại học / THPT', 'Sinh viên / Người đi làm'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Hình thức học <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="teachingMode"
                value={formData.teachingMode}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="ONLINE">Học Online (Trực tuyến)</option>
                <option value="OFFLINE">Học tại nhà (Gia sư đến nhà)</option>
                <option value="HYBRID">Kết hợp Online & Tại nhà</option>
              </select>
            </div>
          </div>

          {/* Section 2: Địa điểm */}
          <div style={{
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 600, fontSize: '13px' }}>
              <MapPin size={16} color="#2563eb" />
              <span>Địa điểm học tập</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tỉnh / Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="VD: TP. Hồ Chí Minh"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Quận / Huyện</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="VD: Quận 1, Cầu Giấy..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Địa chỉ chi tiết (Số nhà, tên đường)
              </label>
              <input
                type="text"
                name="detailedAddress"
                value={formData.detailedAddress}
                onChange={handleChange}
                placeholder="VD: 123 Đường Nguyễn Huệ, Phường Bến Nghé"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', color: '#059669' }}>
                <ShieldCheck size={14} />
                <span>Bảo mật: Địa chỉ chi tiết và số điện thoại được ẩn an toàn, chỉ hiển thị sau khi bạn đồng ý chọn gia sư.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Lịch học & Ngân sách */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Số buổi / tuần
              </label>
              <input
                type="number"
                min="1"
                max="7"
                name="sessionsPerWeek"
                value={formData.sessionsPerWeek}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Lịch học mong muốn
              </label>
              <input
                type="text"
                name="preferredSchedule"
                value={formData.preferredSchedule}
                onChange={handleChange}
                placeholder="VD: Tối T2, T4, T6 (19:30 - 21:00)"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Học phí dự kiến (VNĐ/buổi)
              </label>
              <input
                type="number"
                step="10000"
                min="50000"
                name="budgetAmount"
                value={formData.budgetAmount}
                onChange={handleChange}
                placeholder="VD: 250000"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Section 4: Tiêu chí gia sư */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Yêu cầu giới tính
              </label>
              <select
                name="tutorGenderPreference"
                value={formData.tutorGenderPreference}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
              >
                <option value="ANY">Không yêu cầu</option>
                <option value="MALE">Gia sư Nam</option>
                <option value="FEMALE">Gia sư Nữ</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Trình độ gia sư
              </label>
              <select
                name="tutorTypePreference"
                value={formData.tutorTypePreference}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
              >
                <option value="ANY">Không yêu cầu</option>
                <option value="STUDENT">Sinh viên đại học</option>
                <option value="TEACHER">Giáo viên / Thạc sĩ / Tiến sĩ</option>
              </select>
            </div>
          </div>

          {/* Section 5: Ghi chú học lực & Yêu cầu */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Tình trạng học tập của học sinh
            </label>
            <textarea
              name="studentNotes"
              rows={3}
              value={formData.studentNotes}
              onChange={handleChange}
              placeholder="VD: Học sinh đang học lớp 10, nắm cơ bản tốt nhưng hay ẩu trong bài toán hình học..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Yêu cầu cụ thể đối với gia sư
            </label>
            <textarea
              name="requirements"
              rows={2}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="VD: Cần gia sư kiên nhẫn, có tài liệu tổng ôn phương pháp giải nhanh..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '10px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Đăng bài ngay</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
