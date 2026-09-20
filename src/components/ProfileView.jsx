import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import fileService from '../services/fileService';
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

  // State for Tutor Profile (Figma Frame 16:1610)
  const [tutorNav, setTutorNav] = useState('personal'); // 'personal', 'expertise', 'rates', 'schedule', 'languages'
  const [tutorLastName, setTutorLastName] = useState('Hoàng');
  const [tutorFirstName, setTutorFirstName] = useState('Thiên Ứng');
  const [tutorDisplayName, setTutorDisplayName] = useState('Chú chim nho nhỏ');
  const [tutorEmail, setTutorEmail] = useState(user?.email || 'chuchimnho@email.com');
  const [tutorPhone, setTutorPhone] = useState(user?.phone || '+84 (123)456789');
  const [tutorGender, setTutorGender] = useState('Nam');
  const [tutorShortBio, setTutorShortBio] = useState('Đẳng cấp ở mọi môn học.');
  const [tutorFullBio, setTutorFullBio] = useState(
    'Với hơn 5 năm kinh nghiệm thực chiến, mình tự tin đảm nhận giảng dạy xuất sắc TẤT CẢ các môn học từ Tiểu học đến THPT. Phương pháp dạy tư duy logic đa môn của mình đã giúp hàng trăm học sinh xóa mất gốc, bứt phá toàn diện và đỗ các trường top đầu. Dù là Toán, Văn, Anh hay các môn Khoa học, mình cam kết sẽ giúp các em làm chủ kiến thức nhanh nhất và chinh phục điểm 9, 10 một cách dễ dàng!'
  );
  const [tutorVideoUrl, setTutorVideoUrl] = useState('');

  // Tutor Certificates State (Up to 5 photos)
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('giasuhq_tutor_certificates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        title: 'Bằng Cử nhân Sư phạm Toán học - ĐH Sư phạm Hà Nội',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        date: '2023',
        verified: true
      },
      {
        id: 2,
        title: 'Chứng chỉ Giảng dạy Tiếng Anh Quốc tế IELTS 8.0',
        imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80',
        date: '2024',
        verified: true
      }
    ];
  });
  const [showCertModal, setShowCertModal] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertFile, setNewCertFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);
  const certFileInputRef = useRef(null);

  // State for Student Profile (Figma Frame 61:5450)
  const [fullName, setFullName] = useState(user?.fullName || 'Nguyễn Minh Anh');
  const [dob, setDob] = useState('2008-05-15');
  const [gender, setGender] = useState('Nữ');
  const [phone, setPhone] = useState(user?.phone || '0901 234 567');
  const [email, setEmail] = useState(user?.email || 'minhanh@gmail.com');
  const [school, setSchool] = useState('THPT Đoàn Kết - Hai Bà Trưng');
  const [address, setAddress] = useState('Số 12, phố Trần Khát Chân, Hai Bà Trưng, Hà Nội');
  const [grade, setGrade] = useState('Lớp 11');

  // Parent info
  const [parentName, setParentName] = useState('Nguyễn Văn Bình');
  const [parentRelation, setParentRelation] = useState('Bố');
  const [parentPhone, setParentPhone] = useState('0912345678');
  const [parentEmail, setParentEmail] = useState('phuhuynh@gmail.com');
  const [reportEmail, setReportEmail] = useState(true);
  const [reportSms, setReportSms] = useState(true);

  // Study goals
  const [goal, setGoal] = useState('Cải thiện điểm số');
  const [level, setLevel] = useState('Khá');
  const [selectedSubjects, setSelectedSubjects] = useState(['Toán học', 'Tiếng Anh']);
  const [preferredDays, setPreferredDays] = useState(['T2', 'T4', 'T6']);
  const [preferredTimes, setPreferredTimes] = useState(['evening']);
  const [note, setNote] = useState('');

  // Notification toggles
  const [notifyUpcoming, setNotifyUpcoming] = useState(true);
  const [notifyMsg, setNotifyMsg] = useState(true);
  const [notifyMaterials, setNotifyMaterials] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [notifySystem, setNotifySystem] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

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
                        defaultValue="Cử nhân Sư phạm loại Giỏi"
                        style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        TRƯỜNG ĐÀO TẠO
                      </label>
                      <input
                        type="text"
                        defaultValue="Đại học Sư phạm Hà Nội"
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
                  <span>Môn dạy & Học phí tham khảo</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {[
                    { sub: 'Toán học (Lớp 10 - 12)', price: '250.000đ / buổi (90 phút)', format: 'Online & Trực tiếp' },
                    { sub: 'Vật lý (Lớp 11 - 12)', price: '280.000đ / buổi (90 phút)', format: 'Online qua Zoom' },
                    { sub: 'Tiếng Anh THPT & IELTS', price: '320.000đ / buổi (90 phút)', format: 'Trực tiếp tại nhà' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ border: '1.5px solid #0f172a', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{item.sub}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Hình thức: {item.format}</div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '1rem', color: '#ea580c' }}>{item.price}</div>
                    </div>
                  ))}
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
                    Lưu học phí
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
                  <span>Ngôn ngữ & Sở thích cá nhân</span>
                </h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (IELTS 8.0)', 'Tiếng Nhật (N3)', 'Cờ vua', 'Lập trình', 'Đọc sách'].map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#fff4cc',
                        border: '1.5px solid #0f172a',
                        borderRadius: '999px',
                        padding: '6px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
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
                    Lưu thông tin
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
                fontSize: '2rem',
                fontWeight: 900,
                color: '#7c3aed'
              }}>
                MA
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
              {fullName}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
              {grade} · {school}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fffce8',
              border: '1.5px solid #0f172a',
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#854d0e',
              marginBottom: '18px'
            }}>
              <Crown size={14} color="#eab308" />
              Gói VIP — Còn 45 ngày
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
                <span style={{ color: '#64748b' }}>Đăng nhập</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Google Account</span>
              </div>
            </div>

            <button
              type="button"
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Đổi mật khẩu
            </button>
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
                  Trường đang theo học
                </label>
                <input
                  type="text"
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
                  Họ và tên phụ huynh *
                </label>
                <input
                  type="text"
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
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Số điện thoại nhận báo cáo
                </label>
                <input
                  type="text"
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

    </div>
  );
}
