import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import fileService from '../services/fileService';
import { userService } from '../services/userService';
import { 
  Camera, 
  ArrowLeft, 
  Crown, 
  Key, 
  Check, 
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Globe,
  User,
  Sparkles,
  UploadCloud,
  Trash2,
  Download,
  Eye,
  Plus,
  X,
  FileCheck
} from 'lucide-react';

export default function ProfileView({ onBack }) {
  const { user, updateUser } = useAuth();
  const isTutor = user?.role === 'TUTOR';

  // State for Tutor Profile
  const [tutorNav, setTutorNav] = useState('personal'); // 'personal', 'expertise', 'rates', 'schedule', 'languages'
  const [tutorLastName, setTutorLastName] = useState(() => {
    if (!user?.fullName) return '';
    const parts = user.fullName.trim().split(' ');
    return parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
  });
  const [tutorFirstName, setTutorFirstName] = useState(() => {
    if (!user?.fullName) return '';
    const parts = user.fullName.trim().split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  });
  const [tutorDisplayName, setTutorDisplayName] = useState(user?.qualification || '');
  const [tutorEmail, setTutorEmail] = useState(user?.email || '');
  const [tutorPhone, setTutorPhone] = useState(user?.phone || '');
  const [tutorGender, setTutorGender] = useState('Nam');
  const [tutorShortBio, setTutorShortBio] = useState('');
  const [tutorFullBio, setTutorFullBio] = useState(user?.bio || '');
  const [tutorVideoUrl, setTutorVideoUrl] = useState('');

  const [tutorDegree, setTutorDegree] = useState(() => localStorage.getItem(`tutora_degree_${user?.id || user?.email}`) || '');
  const [tutorUniversity, setTutorUniversity] = useState(() => localStorage.getItem(`tutora_univ_${user?.id || user?.email}`) || '');
  const [tutorHourlyRate, setTutorHourlyRate] = useState(user?.hourlyRate || '');
  const [tutorSkills, setTutorSkills] = useState(() => {
    const s = localStorage.getItem(`tutora_skills_${user?.id || user?.email}`);
    return s ? JSON.parse(s) : [];
  });

  // Tutor Certificates State - Mặc định hoàn toàn rỗng để gia sư tự tải lên bằng cấp
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem(`giasuhq_tutor_certificates_${user?.id || user?.email}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [showCertModal, setShowCertModal] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertFile, setNewCertFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const certFileInputRef = useRef(null);

  // State for Student Profile - Bỏ trống toàn bộ các thông tin để người dùng tự điền
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dob, setDob] = useState(() => localStorage.getItem(`tutora_dob_${user?.id || user?.email}`) || '');
  const [gender, setGender] = useState('Nam');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [school, setSchool] = useState(user?.schoolName || '');
  const [address, setAddress] = useState(user?.address || '');
  const [grade, setGrade] = useState(user?.gradeLevel || '');

  // Parent info - Mặc định bỏ trống
  const [parentName, setParentName] = useState(() => localStorage.getItem(`tutora_parent_name_${user?.id || user?.email}`) || '');
  const [parentRelation, setParentRelation] = useState('');
  const [parentPhone, setParentPhone] = useState(user?.emergencyContact || '');
  const [parentEmail, setParentEmail] = useState(() => localStorage.getItem(`tutora_parent_email_${user?.id || user?.email}`) || '');
  const [reportEmail, setReportEmail] = useState(false);
  const [reportSms, setReportSms] = useState(false);

  // Study goals - Mặc định bỏ trống
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [preferredDays, setPreferredDays] = useState([]);
  const [preferredTimes, setPreferredTimes] = useState([]);
  const [note, setNote] = useState('');

  // Notification toggles
  const [notifyUpcoming, setNotifyUpcoming] = useState(true);
  const [notifyMsg, setNotifyMsg] = useState(true);
  const [notifyMaterials, setNotifyMaterials] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [notifySystem, setNotifySystem] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Modal xác nhận đã lưu thay đổi vào cơ sở dữ liệu MySQL
  const [dbConfirmationModal, setDbConfirmationModal] = useState({
    isOpen: false,
    savedAt: '',
    updatedSummary: []
  });

  // Tải hồ sơ thực tế từ Backend Database khi mở trang
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res?.success && res.data && isMounted) {
          const d = res.data;
          if (d.fullName) {
            setFullName(d.fullName);
            const parts = d.fullName.trim().split(' ');
            if (parts.length > 1) {
              setTutorLastName(parts.slice(0, -1).join(' '));
              setTutorFirstName(parts[parts.length - 1]);
            } else {
              setTutorFirstName(d.fullName);
            }
          }
          if (d.phone) {
            setPhone(d.phone);
            setTutorPhone(d.phone);
          }
          if (d.email) {
            setEmail(d.email);
            setTutorEmail(d.email);
          }
          if (d.schoolName !== undefined && d.schoolName !== null) setSchool(d.schoolName);
          if (d.gradeLevel !== undefined && d.gradeLevel !== null) setGrade(d.gradeLevel);
          if (d.address !== undefined && d.address !== null) setAddress(d.address);
          if (d.emergencyContact !== undefined && d.emergencyContact !== null) setParentPhone(d.emergencyContact);
          if (d.bio !== undefined && d.bio !== null) setTutorFullBio(d.bio);
          if (d.qualification !== undefined && d.qualification !== null) setTutorDisplayName(d.qualification);

          updateUser(d);
        }
      } catch (err) {
        console.warn('Could not load profile from backend:', err);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  // Cập nhật thông tin tài khoản vào MySQL Database (Lưu thay đổi)
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSaving(true);
      setSaveError('');

      let payload = {};
      if (isTutor) {
        payload = {
          fullName: `${tutorLastName} ${tutorFirstName}`.trim() || user?.fullName || 'Gia sư Tutora',
          phone: (tutorPhone || '').trim(),
          bio: tutorFullBio || tutorShortBio,
          qualification: tutorDisplayName
        };
      } else {
        payload = {
          fullName: (fullName || '').trim() || user?.fullName || 'Học viên Tutora',
          phone: (phone || '').trim(),
          schoolName: school,
          address: address,
          gradeLevel: grade,
          emergencyContact: parentPhone
        };
      }

      const res = await userService.updateProfile(payload);
      const savedData = (res && res.data) ? res.data : payload;
      const updatedUserObj = { ...user, ...savedData };

      updateUser(updatedUserObj);

      // Lưu các trường phụ phía client vào localStorage
      if (dob) localStorage.setItem(`tutora_dob_${user?.id || user?.email}`, dob);
      if (parentName) localStorage.setItem(`tutora_parent_name_${user?.id || user?.email}`, parentName);
      if (parentEmail) localStorage.setItem(`tutora_parent_email_${user?.id || user?.email}`, parentEmail);
      if (tutorDegree) localStorage.setItem(`tutora_degree_${user?.id || user?.email}`, tutorDegree);
      if (tutorUniversity) localStorage.setItem(`tutora_univ_${user?.id || user?.email}`, tutorUniversity);
      if (tutorSkills) localStorage.setItem(`tutora_skills_${user?.id || user?.email}`, JSON.stringify(tutorSkills));

      const nowStr = new Date().toLocaleTimeString('vi-VN') + ' · ' + new Date().toLocaleDateString('vi-VN');
      const summaryList = isTutor ? [
        { label: 'Họ và tên gia sư', value: payload.fullName },
        { label: 'Số điện thoại', value: payload.phone || '(Chưa cập nhật)' },
        { label: 'Học vị / Danh xưng', value: payload.qualification || '(Chưa cập nhật)' },
        { label: 'Trình độ đào tạo', value: tutorDegree ? `${tutorDegree} - ${tutorUniversity}` : '(Chưa cập nhật)' },
        { label: 'Giới thiệu bản thân', value: payload.bio ? `${payload.bio.substring(0, 45)}...` : '(Chưa cập nhật)' },
        { label: 'Ảnh bằng cấp đã tải', value: `${certificates.length} ảnh chứng chỉ` }
      ] : [
        { label: 'Họ và tên học sinh', value: payload.fullName },
        { label: 'Trường đang học', value: payload.schoolName || '(Chưa cập nhật)' },
        { label: 'Khối / Lớp', value: payload.gradeLevel || '(Chưa cập nhật)' },
        { label: 'Số điện thoại', value: payload.phone || '(Chưa cập nhật)' },
        { label: 'Địa chỉ cư trú', value: payload.address || '(Chưa cập nhật)' },
        { label: 'Phụ huynh liên hệ', value: parentName ? `${parentName} (${payload.emergencyContact || 'Chưa có SĐT'})` : '(Chưa cập nhật)' }
      ];

      setDbConfirmationModal({
        isOpen: true,
        savedAt: nowStr,
        updatedSummary: summaryList
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (err) {
      console.error('Error in handleSave:', err);
      setSaveError(err.response?.data?.message || 'Không thể lưu hồ sơ lên máy chủ. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const allSubjects = [
    'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Tiếng Anh', 
    'Lịch sử', 'Tin học', 'Âm nhạc', 'Mỹ thuật', 'Tiếng Tây Ban Nha', 'Tiếng Pháp', 'Luyện thi THPT'
  ];

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const toggleSubject = (s) => {
    if (selectedSubjects.includes(s)) {
      setSelectedSubjects(selectedSubjects.filter(item => item !== s));
    } else {
      setSelectedSubjects([...selectedSubjects, s]);
    }
  };

  const toggleDay = (d) => {
    if (preferredDays.includes(d)) {
      setPreferredDays(preferredDays.filter(item => item !== d));
    } else {
      setPreferredDays([...preferredDays, d]);
    }
  };

  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (certificates.length >= 5) {
      alert('Bạn đã tải lên tối đa 5 ảnh bằng cấp.');
      return;
    }
    if (!newCertFile) {
      alert('Vui lòng chọn ảnh bằng cấp cần tải lên.');
      return;
    }
    if (!newCertTitle.trim()) {
      alert('Vui lòng nhập tên bằng cấp hoặc chứng chỉ.');
      return;
    }

    try {
      setUploadingCert(true);
      const res = await fileService.uploadFile(newCertFile);
      const newCert = {
        id: Date.now(),
        title: newCertTitle.trim(),
        imageUrl: res.data?.fileUrl || URL.createObjectURL(newCertFile),
        date: new Date().getFullYear().toString(),
        verified: true
      };
      const updated = [...certificates, newCert];
      setCertificates(updated);
      localStorage.setItem('giasuhq_tutor_certificates', JSON.stringify(updated));
      setNewCertTitle('');
      setNewCertFile(null);
      if (certFileInputRef.current) certFileInputRef.current.value = '';
    } catch (err) {
      alert('Lỗi khi tải ảnh bằng cấp: ' + err.message);
    } finally {
      setUploadingCert(false);
    }
  };

  const handleDeleteCertificate = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh bằng cấp này không?')) {
      const updated = certificates.filter(c => c.id !== id);
      setCertificates(updated);
      localStorage.setItem('giasuhq_tutor_certificates', JSON.stringify(updated));
      if (previewCert && previewCert.id === id) setPreviewCert(null);
    }
  };

  const handleDownloadCertificate = (cert) => {
    const fileName = `${cert.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.jpg`;
    fileService.downloadFile(cert.imageUrl, fileName);
  };

  const renderCertificateGallery = () => (
    <div>
      <div style={{
        background: '#f0fdf4',
        border: '1.5px solid #86efac',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <FileCheck size={24} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
          <b>Hồ sơ bằng cấp gia sư (Tối đa 5 ảnh bằng cấp/chứng chỉ):</b><br />
          Đăng tải bằng tốt nghiệp đại học, chứng chỉ ngoại ngữ (IELTS, TOEFL, JLPT), hoặc chứng chỉ nghiệp vụ sư phạm để tăng mức độ uy tín với phụ huynh và học sinh.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '18px',
        marginBottom: '24px'
      }}>
        {certificates.map((cert, index) => (
          <div
            key={cert.id}
            style={{
              border: '2px solid #0f172a',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: '3px 3px 0px #0f172a',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div 
              style={{
                height: '170px',
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#f1f5f9',
                overflow: 'hidden'
              }}
              onClick={() => setPreviewCert(cert)}
              title="Nhấn để phóng to xem ảnh đầy đủ"
            >
              <img
                src={cert.imageUrl}
                alt={cert.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#059669',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={12} strokeWidth={3} /> Đã xác thực
              </div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Eye size={12} /> Xem ảnh lớn
              </div>
            </div>

            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                  Bằng cấp #{index + 1} ({cert.date || '2024'})
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: '1.4', marginBottom: '12px' }}>
                  {cert.title}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(cert)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #0f172a',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} /> Tải ảnh
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCertificate(cert.id)}
                  title="Xóa bằng cấp này"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #ef4444',
                    background: '#fef2f2',
                    color: '#dc2626',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '24px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '260px'
          }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', marginBottom: '4px' }}>
              Chưa có bằng cấp nào
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '280px' }}>
              Danh mục bằng cấp được để trống mặc định để bạn tự tải lên chứng chỉ và bằng cấp thực tế của mình.
            </div>
          </div>
        )}

        {certificates.length < 5 && (
          <div style={{
            border: '2px dashed #94a3b8',
            borderRadius: '16px',
            padding: '20px',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '260px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
              + Thêm ảnh bằng cấp ({certificates.length}/5)
            </h4>

            <form onSubmit={handleUploadCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Tên bằng (VD: Cử nhân Sư phạm, IELTS...)"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  required
                  ref={certFileInputRef}
                  onChange={(e) => setNewCertFile(e.target.files?.[0] || null)}
                  style={{ fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <button
                type="submit"
                disabled={uploadingCert}
                style={{
                  marginTop: '4px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <UploadCloud size={16} />
                {uploadingCert ? 'Đang tải lên...' : 'Tải lên bằng cấp'}
              </button>
            </form>
          </div>
        )}
      </div>

      {certificates.length >= 5 && (
        <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginBottom: '16px' }}>
          ✓ Đã đăng tối đa 5 ảnh bằng cấp. Bạn có thể xóa bớt bằng cấp cũ nếu muốn bổ sung bằng cấp mới.
        </div>
      )}
    </div>
  );

  // Modal xác nhận lưu thành công vào cơ sở dữ liệu MySQL
  const renderDbConfirmationModal = () => {
    if (!dbConfirmationModal.isOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '3.5px solid #0f172a',
          boxShadow: '8px 8px 0px #0f172a',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          animation: 'fadeInUp 0.25s ease-out'
        }}>
          {/* Modal Header */}
          <div style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #0f172a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                border: '2px solid #0f172a',
                boxShadow: '2px 2px 0px #0f172a'
              }}>
                💾
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                  Đã Lưu Vào Cơ Sở Dữ Liệu
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#d1fae5', fontWeight: 600 }}>
                  Ghi dữ liệu MySQL hoàn tất lúc: {dbConfirmationModal.savedAt}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDbConfirmationModal(prev => ({ ...prev, isOpen: false }))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ padding: '24px' }}>
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #a7f3d0',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <Check size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
                <strong>Xác nhận đồng bộ thành công!</strong> Mọi thông tin cập nhật của bạn đã được lưu trữ an toàn vào cơ sở dữ liệu ({isTutor ? 'Bảng `users` & `tutors`' : 'Bảng `users` & `students`'}).
              </div>
            </div>

            <h4 style={{ fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Chi tiết dữ liệu vừa được ghi nhận:
            </h4>

            <div style={{
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              {dbConfirmationModal.updatedSummary.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                    borderBottom: idx === dbConfirmationModal.updatedSummary.length - 1 ? 'none' : '1px solid #f1f5f9',
                    fontSize: '0.86rem'
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#475569' }}>{item.label}:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDbConfirmationModal(prev => ({ ...prev, isOpen: false }))}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '4px 4px 0px rgba(15, 23, 42, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              Đã hiểu & Đóng xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // TUTOR EDIT PROFILE (Figma Frame 16:1610)
  // -------------------------------------------------------------
  if (isTutor) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px', position: 'relative' }}>
        
        {/* Floating Background Shapes */}
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
          top: '140px',
          right: '-20px',
          width: '75px',
          height: '75px',
          backgroundColor: '#f3e8ff',
          transform: 'rotate(45deg)',
          borderRadius: '16px',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '80px',
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
              Chỉnh sửa Hồ sơ
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
              Giữ hồ sơ đầy đủ để thu hút nhiều học sinh hơn
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Award size={18} color="#059669" />
              <span>Bằng cấp ({certificates.length}/5)</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                backgroundColor: '#ff5f38',
                color: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #0f172a'
              }}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            ✓ Đã lưu thay đổi hồ sơ gia sư thành công!
          </div>
        )}

        {saveError && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '2px solid #ef4444',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            ⚠️ {saveError}
          </div>
        )}

        {/* 2 Column Layout (Left: Sidebar ~280px, Right: Form ~1fr) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Tutor Status Card */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  border: '1.5px solid #0f172a',
                  backgroundColor: '#ffd600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  position: 'relative'
                }}>
                  🐔
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ff5733',
                    border: '1.5px solid #ffffff'
                  }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                    {tutorLastName} {tutorFirstName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                    ● Đang hoạt động
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                Độ hoàn thiện hồ sơ
              </div>
              <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#f1f5f9', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '100%', width: '85%', borderRadius: '999px', backgroundColor: '#00c282' }} />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#00c282', fontWeight: 800 }}>
                85% hoàn thiện
              </div>
            </div>

            {/* Vertical Menu */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #0f172a',
              borderRadius: '20px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {[
                { id: 'personal', label: 'Thông tin cá nhân', icon: <User size={18} /> },
                { id: 'expertise', label: 'Chuyên môn', icon: <Award size={18} /> },
                { id: 'rates', label: 'Môn dạy & Học phí', icon: <BookOpen size={18} /> },
                { id: 'schedule', label: 'Lịch dạy', icon: <Calendar size={18} /> },
                { id: 'languages', label: 'Ngôn ngữ & Sở thích', icon: <Globe size={18} /> }
              ].map((item) => {
                const isActive = tutorNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTutorNav(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#181b2a' : 'transparent',
                      color: isActive ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '32px'
          }}>
            {tutorNav === 'expertise' ? (
              /* TAB: CHUYÊN MÔN & BẰNG CẤP */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={26} color="#059669" />
                    <span>Hồ sơ Chuyên môn & Bằng cấp</span>
                  </h2>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 12px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                    Đã tải {certificates.length}/5 ảnh bằng cấp
                  </span>
                </div>

                {renderCertificateGallery()}

                <div style={{ borderTop: '1.5px solid #f1f5f9', paddingTop: '24px', marginTop: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Trình độ học vấn & Bằng tốt nghiệp
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        HỌC VỊ CAO NHẤT
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập học vị (Ví dụ: Cử nhân Sư phạm, Thạc sĩ, Kỹ sư...)"
                        value={tutorDegree}
                        onChange={(e) => setTutorDegree(e.target.value)}
                        style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        TRƯỜNG ĐÀO TẠO
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập trường đào tạo (Ví dụ: ĐH Sư Phạm, ĐH Bách Khoa...)"
                        value={tutorUniversity}
                        onChange={(e) => setTutorUniversity(e.target.value)}
                        style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      backgroundColor: '#ff5f38',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '12px',
                      padding: '11px 28px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #0f172a'
                    }}
                  >
                    Lưu hồ sơ chuyên môn
                  </button>
                </div>
              </div>
            ) : tutorNav === 'rates' ? (
              /* TAB: MÔN DẠY & HỌC PHÍ */
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={24} color="#7c3aed" />
                  <span>Môn dạy & Học phí đề xuất</span>
                </h2>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Mức học phí theo buổi (VNĐ / buổi 90 phút)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 250.000đ / buổi hoặc 200.000đ / giờ..."
                    value={tutorHourlyRate}
                    onChange={(e) => setTutorHourlyRate(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', fontWeight: 700 }}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Chọn các môn bạn tự tin nhận dạy kèm:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {allSubjects.map((sub) => {
                      const isSel = selectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '999px',
                            border: '1.5px solid',
                            borderColor: isSel ? '#7c3aed' : '#e2e8f0',
                            backgroundColor: isSel ? '#ede9fe' : '#ffffff',
                            color: isSel ? '#7c3aed' : '#64748b',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {sub} {isSel ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      backgroundColor: '#ff5f38',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '12px',
                      padding: '11px 28px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #0f172a'
                    }}
                  >
                    Lưu môn dạy & học phí
                  </button>
                </div>
              </div>
            ) : tutorNav === 'schedule' ? (
              /* TAB: LỊCH DẠY */
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={24} color="#0284c7" />
                  <span>Lịch dạy khả dụng trong tuần</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Chọn các khung giờ bạn có thể nhận lớp dạy kèm:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {daysOfWeek.map((d) => {
                    const isSel = preferredDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          border: '2px solid #0f172a',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          background: isSel ? '#0f172a' : '#ffffff',
                          color: isSel ? '#ffffff' : '#0f172a',
                          cursor: 'pointer'
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      backgroundColor: '#ff5f38',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '12px',
                      padding: '11px 28px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #0f172a'
                    }}
                  >
                    Lưu lịch dạy
                  </button>
                </div>
              </div>
            ) : tutorNav === 'languages' ? (
              /* TAB: NGÔN NGỮ & SỞ THÍCH */
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={24} color="#ea580c" />
                  <span>Kỹ năng, Ngôn ngữ & Sở thích chuyên môn</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
                  Chọn hoặc thêm các kỹ năng nổi bật để giúp học sinh hiểu rõ hơn về bạn (mặc định chưa chọn):
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (IELTS)', 'Tiếng Nhật', 'Luyện thi THPT', 'Ôn thi Chuyên', 'Kỹ năng sư phạm', 'Cờ vua', 'Tin học / Lập trình', 'Khoa học thực nghiệm'].map((tag, i) => {
                    const isSel = tutorSkills.includes(tag);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (isSel) {
                            setTutorSkills(tutorSkills.filter(t => t !== tag));
                          } else {
                            setTutorSkills([...tutorSkills, tag]);
                          }
                        }}
                        style={{
                          background: isSel ? '#0f172a' : '#ffffff',
                          color: isSel ? '#ffffff' : '#0f172a',
                          border: '1.5px solid #0f172a',
                          borderRadius: '999px',
                          padding: '6px 16px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tag} {isSel ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    style={{
                      backgroundColor: '#ff5f38',
                      color: '#ffffff',
                      border: '2px solid #0f172a',
                      borderRadius: '12px',
                      padding: '11px 28px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '3px 3px 0px #0f172a'
                    }}
                  >
                    Lưu kỹ năng & sở thích
                  </button>
                </div>
              </div>
            ) : (
              /* DEFAULT TAB: THÔNG TIN CÁ NHÂN */
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>
                  Thông tin cá nhân
                </h2>

                {/* Avatar Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '18px',
                    border: '2px solid #0f172a',
                    backgroundColor: '#ffd600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.4rem'
                  }}>
                    🐔
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: '10px',
                        padding: '8px 18px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '2px 2px 0px #0f172a',
                        marginBottom: '6px'
                      }}
                    >
                      Tải ảnh mới lên
                    </button>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      JPG, PNG hoặc GIF · tối đa 5MB · nên dùng ảnh vuông
                    </div>
                  </div>
                </div>

                {/* Quick Certificate Summary Box in Personal Info */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #0f172a',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                        Bằng cấp & Chứng chỉ ({certificates.length}/5 ảnh)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        {certificates.length > 0 ? `Đã xác thực ${certificates.length} bằng cấp giảng dạy` : 'Chưa có ảnh bằng cấp nào'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #0f172a',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      boxShadow: '1.5px 1.5px 0px #0f172a'
                    }}
                  >
                    Quản lý bằng cấp
                  </button>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Họ & Tên */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        HỌ *
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                        value={tutorLastName}
                        onChange={(e) => setTutorLastName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        TÊN *
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                        value={tutorFirstName}
                        onChange={(e) => setTutorFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Tên hiển thị */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      TÊN HIỂN THỊ
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                      value={tutorDisplayName}
                      onChange={(e) => setTutorDisplayName(e.target.value)}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      Tên học sinh nhìn thấy trên hồ sơ
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        EMAIL
                      </label>
                      <input
                        type="email"
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                        value={tutorEmail}
                        onChange={(e) => setTutorEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        SỐ ĐIỆN THOẠI
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                        value={tutorPhone}
                        onChange={(e) => setTutorPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Giới thiệu ngắn */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        CÂU GIỚI THIỆU NGẮN
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {tutorShortBio.length}/100
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={100}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                      value={tutorShortBio}
                      onChange={(e) => setTutorShortBio(e.target.value)}
                    />
                  </div>

                  {/* Giới thiệu bản thân */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        GIỚI THIỆU BẢN THÂN
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {tutorFullBio.length}/600
                      </span>
                    </div>
                    <textarea
                      maxLength={600}
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      value={tutorFullBio}
                      onChange={(e) => setTutorFullBio(e.target.value)}
                    />
                  </div>

                  {/* Link Video giới thiệu */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      LINK VIDEO GIỚI THIỆU
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/..."
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                      value={tutorVideoUrl}
                      onChange={(e) => setTutorVideoUrl(e.target.value)}
                    />
                  </div>

                  {/* Bottom bar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    paddingTop: '20px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Thay đổi được lưu ngay vào hồ sơ của bạn.
                    </span>
                    <button
                      type="button"
                      onClick={handleSave}
                      style={{
                        backgroundColor: '#ff5f38',
                        color: '#ffffff',
                        border: '2px solid #0f172a',
                        borderRadius: '12px',
                        padding: '11px 28px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '3px 3px 0px #0f172a'
                      }}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* MODAL: TUTOR CERTIFICATE MANAGER (Up to 5 photos) */}
        {showCertModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              border: '2.5px solid #0f172a',
              borderRadius: '24px',
              maxWidth: '880px',
              width: '100%',
              padding: '32px',
              boxShadow: '8px 8px 0px #0f172a',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
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
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={24} color="#059669" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Quản lý Bằng cấp & Chứng chỉ
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                    Gia sư đăng tải tối đa 5 ảnh bằng cấp chuyên môn (Bằng ĐH, IELTS, Nghiệp vụ...)
                  </div>
                </div>
              </div>

              {renderCertificateGallery()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIGHTBOX MODAL: FULL SIZE IMAGE PREVIEW */}
        {previewCert && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '24px'
          }}>
            <button
              type="button"
              onClick={() => setPreviewCert(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={24} />
            </button>

            <div style={{
              maxWidth: '900px',
              maxHeight: '75vh',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '3px solid #ffffff',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              marginBottom: '16px',
              backgroundColor: '#000000'
            }}>
              <img
                src={previewCert.imageUrl}
                alt={previewCert.title}
                style={{ width: '100%', height: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ color: '#ffffff', textAlign: 'center', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800 }}>{previewCert.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(previewCert)}
                  style={{
                    backgroundColor: '#ff5f38',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={16} /> Tải ảnh về máy tính
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận lưu Database MySQL */}
        {renderDbConfirmationModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDENT / PARENT PROFILE (Figma Frame 61:5450)
  // -------------------------------------------------------------
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px', position: 'relative' }}>
      
      {/* Floating Background Shapes */}
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

      {/* Header Bar */}
      <div style={{ marginBottom: '28px', position: 'relative', zIndex: 1 }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#64748b',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
        )}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: '0 0 6px 0',
          fontFamily: 'serif'
        }}>
          Hồ sơ phụ huynh / học sinh
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Quản lý thông tin học viên, thông tin phụ huynh và kế hoạch học tập
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: '#d1fae5',
          color: '#065f46',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 700,
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          ✓ Đã lưu thay đổi thông tin thành công!
        </div>
      )}

      {saveError && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '2px solid #ef4444',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 700,
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          ⚠️ {saveError}
        </div>
      )}

      {/* 2-Column Grid (Left: VIP Card + Account Card, Right: 4 Forms) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px minmax(0, 1fr)',
        gap: '24px',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Student Avatar & VIP badge */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '28px 24px',
            textAlign: 'center'
          }}>
            <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 16px' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#ede9fe',
                border: '2px solid #7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#7c3aed'
              }}>
                {(fullName || user?.fullName || 'HV')
                  .trim()
                  .split(' ')
                  .map(n => n[0])
                  .slice(-2)
                  .join('')
                  .toUpperCase()}
              </div>
              <button
                type="button"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Camera size={14} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              {fullName || user?.fullName || 'Học viên Tutora'}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
              {grade || 'Học sinh'} {school ? `· ${school}` : ''}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: (user?.isVip || localStorage.getItem('tutora_is_vip') === 'true') ? '#ecfdf5' : '#fffce8',
              border: '1.5px solid #0f172a',
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: (user?.isVip || localStorage.getItem('tutora_is_vip') === 'true') ? '#065f46' : '#854d0e',
              marginBottom: '18px'
            }}>
              <Crown size={14} color={(user?.isVip || localStorage.getItem('tutora_is_vip') === 'true') ? '#059669' : '#eab308'} />
              {(user?.isVip || localStorage.getItem('tutora_is_vip') === 'true') ? 'Gói VIP — Đang kích hoạt' : 'Gói Tiêu chuẩn (Chưa VIP)'}
            </div>

            <div style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7c3aed' }}>12</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Buổi đã học</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669' }}>4.9★</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Đánh giá</div>
              </div>
            </div>
          </div>

          {/* Card 2: Tài khoản & Bảo mật */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #0f172a',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
              Tài khoản & Bảo mật
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Trạng thái xác thực</span>
                <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> Đã xác thực
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Vai trò</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Học sinh / Phụ huynh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Email tài khoản</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{user?.email || email || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Form Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Form 1: Thông tin học sinh (Purple border) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #7c3aed',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
              Thông tin học sinh 🎒
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên học sinh..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Ngày sinh
                </label>
                <input
                  type="date"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Số điện thoại học sinh
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912345678 (Bỏ trống khi mới tạo)..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Email tài khoản
                </label>
                <input
                  type="email"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', backgroundColor: '#f8fafc', color: '#64748b' }}
                  value={user?.email || email}
                  disabled
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Trường đang theo học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: THPT Lê Hồng Phong, THPT Đoàn Kết..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Khối / Lớp
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp 10, Lớp 11, Lớp 12..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Địa chỉ
              </label>
              <input
                type="text"
                placeholder="Nhập địa chỉ cư trú của học sinh..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Form 2: Thông tin phụ huynh (Orange border) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #ff5733',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
              Thông tin phụ huynh / Người giám hộ 👨‍👩‍👦
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Họ và tên phụ huynh
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên phụ huynh..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Mối quan hệ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bố, Mẹ, Người giám hộ..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Số điện thoại phụ huynh / liên lạc khẩn cấp
                </label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Email phụ huynh
                </label>
                <input
                  type="email"
                  placeholder="Nhập email phụ huynh..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Form 3: Mục tiêu & Kế hoạch học tập (Emerald border) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #10b981',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
              Mục tiêu & Kế hoạch học tập 🎯
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Môn học quan tâm
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1.5px solid',
                        borderColor: isSelected ? '#10b981' : '#e2e8f0',
                        backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#065f46' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Khung giờ học tập ưu tiên
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {daysOfWeek.map((day) => {
                  const isSelected = preferredDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        border: '1.5px solid',
                        borderColor: isSelected ? '#0f172a' : '#e2e8f0',
                        backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#64748b',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form 4: Cài đặt thông báo (Cyan border) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #06b6d4',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 18px 0' }}>
              Cài đặt thông báo 🔔
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Nhắc nhở buổi học sắp tới (qua Email & SMS)', checked: notifyUpcoming, setChecked: setNotifyUpcoming },
                { label: 'Tin nhắn trực tiếp từ gia sư', checked: notifyMsg, setChecked: setNotifyMsg },
                { label: 'Tài liệu và bài tập mới được giao', checked: notifyMaterials, setChecked: setNotifyMaterials },
                { label: 'Báo cáo tiến độ học tập hàng tuần', checked: notifyWeeklyReport, setChecked: setNotifyWeeklyReport }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600 }}>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#7c3aed', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save Button */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                backgroundColor: '#ff5f38',
                color: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '12px',
                padding: '12px 36px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px #0f172a'
              }}
            >
              Lưu thay đổi hồ sơ
            </button>
          </div>

        </div>

      </div>

      {/* Modal xác nhận lưu Database MySQL */}
      {renderDbConfirmationModal()}
    </div>
  );
}
