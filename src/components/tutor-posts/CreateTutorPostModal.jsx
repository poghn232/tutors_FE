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

const HANOI_DISTRICTS = [
  'Quận Cầu Giấy',
  'Quận Đống Đa',
  'Quận Ba Đình',
  'Quận Hoàn Kiếm',
  'Quận Hai Bà Trưng',
  'Quận Thanh Xuân',
  'Quận Tây Hồ',
  'Quận Nam Từ Liêm',
  'Quận Bắc Từ Liêm',
  'Quận Hoàng Mai',
  'Quận Long Biên',
  'Quận Hà Đông',
  'Huyện Thanh Trì',
  'Huyện Gia Lâm',
  'Huyện Đông Anh',
  'Huyện Hoài Đức',
  'Khu vực khác tại Hà Nội'
];

export default function CreateTutorPostModal({ isOpen, onClose, onSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    gradeLevel: 'Lớp 10',
    teachingMode: 'OFFLINE',
    city: 'Hà Nội',
    district: 'Quận Cầu Giấy',
    detailedAddress: '',
    sessionsPerWeek: 2,
    preferredSchedule: '',
    budgetAmount: '',
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
        city: 'Hà Nội',
        subjectId: Number(formData.subjectId),
        budgetAmount: formData.budgetAmount ? Number(formData.budgetAmount) : null,
        sessionsPerWeek: Number(formData.sessionsPerWeek || 2)
      });
      if (res?.success) {
        if (onSuccess) onSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res?.message || 'Không thể tạo bài đăng.');
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
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '2.5px solid #0f172a',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '32px 28px',
        boxShadow: '8px 8px 0px #0f172a',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          borderBottom: '1.5px solid #e2e8f0',
          paddingBottom: '16px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              border: '1.5px solid #7dd3fc',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '6px'
            }}>
              <MapPin size={13} /> ÁP DỤNG KHU VỰC HÀ NỘI
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 4px 0',
              letterSpacing: '-0.015em'
            }}>
              Đăng Tin Tìm Gia Sư
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Điền thông tin lớp học cần tìm gia sư. Bài đăng sẽ được Admin duyệt trước khi công khai.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #0f172a',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: '12px',
            color: '#b91c1c',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: Thông tin cơ bản */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '2px 2px 0px #0f172a'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '14px' }}>
              1. THÔNG TIN YÊU CẦU LỚP HỌC
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Tiêu đề bài đăng <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="VD: Cần tìm gia sư kèm Toán 10 tại nhà quận Cầu Giấy"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 14px',
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    Môn học <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      height: '44px',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '0 12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    required
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    Khối lớp <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      height: '44px',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '0 12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: '#ffffff',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    required
                  >
                    {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Ôn thi THPT Quốc Gia', 'Đại học / Người đi làm'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Hình thức học <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { value: 'OFFLINE', label: 'Tại nhà (Hà Nội)' },
                    { value: 'ONLINE', label: 'Học Online' },
                    { value: 'HYBRID', label: 'Kết hợp linh hoạt' }
                  ].map(mode => {
                    const isSelected = formData.teachingMode === mode.value;
                    return (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, teachingMode: mode.value }))}
                        style={{
                          height: '42px',
                          border: '1.5px solid #0f172a',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '2px 2px 0px #0f172a' : 'none'
                        }}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Địa điểm học tập (Hà Nội) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '2px 2px 0px #0f172a'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '14px' }}>
              2. ĐỊA ĐIỂM HỌC TẬP (HÀ NỘI)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Tỉnh / Thành phố
                </label>
                <input
                  type="text"
                  value="TP. Hà Nội (Dự án hoạt động tại Hà Nội)"
                  disabled
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#475569',
                    backgroundColor: '#f1f5f9',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Quận / Huyện tại Hà Nội <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                  required
                >
                  {HANOI_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Địa chỉ cụ thể (Số nhà, tên đường, khu đô thị)
              </label>
              <input
                type="text"
                name="detailedAddress"
                value={formData.detailedAddress}
                onChange={handleChange}
                placeholder="VD: 88 Đường Xuân Thủy, Dịch Vọng Hậu"
                style={{
                  width: '100%',
                  height: '44px',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  padding: '0 14px',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Bảo mật: Địa chỉ chi tiết và số điện thoại được ẩn an toàn, chỉ hiển thị sau khi bạn đồng ý ghép lớp.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Học phí & Thời gian học */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '2px 2px 0px #0f172a'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '14px' }}>
              3. HỌC PHÍ & LỊCH HỌC DỰ KIẾN
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Học phí đề xuất (VNĐ)
                </label>
                <input
                  type="number"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleChange}
                  placeholder="VD: 250000"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 14px',
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Tính theo
                </label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: '#ffffff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="PER_SESSION">VNĐ / Buổi học</option>
                  <option value="PER_MONTH">VNĐ / Tháng</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Số buổi / tuần
                </label>
                <input
                  type="number"
                  name="sessionsPerWeek"
                  min="1"
                  max="7"
                  value={formData.sessionsPerWeek}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.92rem',
                    textAlign: 'center',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Khung giờ mong muốn
                </label>
                <input
                  type="text"
                  name="preferredSchedule"
                  value={formData.preferredSchedule}
                  onChange={handleChange}
                  placeholder="VD: Tối T2, T4, T6 (19:30 - 21:00)"
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 14px',
                    fontSize: '0.92rem',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Yêu cầu thêm */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '2px 2px 0px #0f172a'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em', marginBottom: '14px' }}>
              4. MÔ TẢ TÌNH TRẠNG & TIÊU CHÍ GIA SƯ
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Giới tính gia sư ưu tiên
                </label>
                <select
                  name="tutorGenderPreference"
                  value={formData.tutorGenderPreference}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: '#ffffff'
                  }}
                >
                  <option value="ANY">Nam hoặc Nữ đều được</option>
                  <option value="FEMALE">Ưu tiên Gia sư Nữ</option>
                  <option value="MALE">Ưu tiên Gia sư Nam</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  Đối tượng gia sư
                </label>
                <select
                  name="tutorTypePreference"
                  value={formData.tutorTypePreference}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid #0f172a',
                    borderRadius: '10px',
                    padding: '0 12px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: '#ffffff'
                  }}
                >
                  <option value="ANY">Sinh viên hoặc Giáo viên</option>
                  <option value="TEACHER">Ưu tiên Giáo viên / Giảng viên</option>
                  <option value="STUDENT">Ưu tiên Sinh viên các trường ĐH</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Tình hình học lực của học sinh
              </label>
              <textarea
                name="studentNotes"
                rows="3"
                value={formData.studentNotes}
                onChange={handleChange}
                placeholder="VD: Cháu đang hổng kiến thức căn bản, tiếp thu hơi chậm, cần gia sư kiên nhẫn giảng lại các dạng bài..."
                style={{
                  width: '100%',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Yêu cầu riêng đối với gia sư
              </label>
              <textarea
                name="requirements"
                rows="2"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="VD: Có kinh nghiệm luyện thi, chuẩn bị bài giảng trước buổi học..."
                style={{
                  width: '100%',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                height: '48px',
                padding: '0 20px',
                borderRadius: '12px',
                border: '2px solid #0f172a',
                background: '#ffffff',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                height: '48px',
                padding: '0 28px',
                borderRadius: '12px',
                border: '2px solid #000000',
                backgroundColor: '#00e599',
                color: '#000000',
                boxShadow: '3px 3px 0px #000000',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang gửi bài...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Gửi bài đăng xét duyệt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
