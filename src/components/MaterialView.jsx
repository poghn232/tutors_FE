import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  CheckSquare, 
  HelpCircle, 
  Download, 
  Lock, 
  Search, 
  Star, 
  BookOpen, 
  Users,
  Plus,
  X,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import fileService from '../services/fileService';
import VNPayCheckoutModal from './VNPayCheckoutModal';

export default function MaterialView({ user, onNavigateToVip }) {
  const isTutor = user?.role === 'TUTOR';
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showVnpayModal, setShowVnpayModal] = useState(false);

  // Modal State for Tutor "+ Đăng tài liệu"
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Toán học');
  const [newType, setNewType] = useState('pdf');
  const [newDesc, setNewDesc] = useState('');
  const [newFile, setNewFile] = useState(null);

  const subjectFilters = [
    'Tất cả',
    'Toán học',
    'Vật lý',
    'Tiếng Anh',
    'Sinh học',
    'Hóa học',
    'Luyện thi THPT'
  ];

  const typeFilters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pdf', label: 'PDF' },
    { id: 'video', label: 'Video' },
    { id: 'exercise', label: 'Bài tập' },
    { id: 'quiz', label: 'Trắc nghiệm' }
  ];

  // Materials list
  const [materials, setMaterials] = useState([
    {
      id: 1,
      type: 'pdf',
      typeBadge: 'PDF',
      subject: 'Toán học',
      title: 'Công thức Toán THPT tổng hợp',
      desc: 'Tổng hợp toàn bộ công thức Toán từ lớp 10 đến 12, bao gồm Đại số, Hình học và Giải tích.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '02/09/2026',
      downloads: '2,341',
      isVip: false,
      btnText: 'Tải xuống (1.2MB)',
      btnColor: '#f97316'
    },
    {
      id: 2,
      type: 'video',
      typeBadge: 'Video',
      badgeExtra: 'MỚI',
      subject: 'Vật lý',
      title: 'Video giải bài Vật lý sóng âm',
      desc: 'Hướng dẫn chi tiết giải các dạng bài tập sóng âm, giao thoa sóng và hiệu ứng Doppler.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '05/09/2026',
      downloads: '1,892',
      isVip: false,
      btnText: 'Tải xuống (24 phút)',
      btnColor: '#7c3aed'
    },
    {
      id: 3,
      type: 'pdf',
      typeBadge: 'PDF',
      subject: 'Tiếng Anh',
      title: 'Từ vựng Tiếng Anh chủ đề môi trường',
      desc: 'Bộ từ vựng 200+ từ về môi trường, biến đổi khí hậu và phát triển bền vững kèm ví dụ.',
      author: 'Trần Minh Đức',
      date: '01/09/2026',
      downloads: '3,104',
      isVip: false,
      btnText: 'Tải xuống (0.8MB)',
      btnColor: '#f43f5e'
    },
    {
      id: 4,
      type: 'quiz',
      typeBadge: 'Trắc nghiệm',
      subject: 'Sinh học',
      title: 'Trắc nghiệm Sinh học tế bào',
      desc: 'Bộ 80 câu trắc nghiệm về cấu trúc và chức năng tế bào, có đáp án và giải thích chi tiết.',
      author: 'TS. Lê Thị Thu',
      date: '03/09/2026',
      downloads: '1,567',
      isVip: false,
      btnText: 'Tải xuống',
      btnColor: '#00c288'
    },
    {
      id: 5,
      type: 'pdf',
      typeBadge: 'PDF',
      subject: 'Toán học',
      title: 'Đề thi thử THPT quốc gia Toán 2026',
      desc: 'Đề thi chuẩn cấu trúc Bộ GD&ĐT kèm video chữa bài độc quyền từ thủ khoa và giáo viên chuyên.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '08/09/2026',
      downloads: '841',
      isVip: true,
      btnText: 'Tải xuống (3.5MB)',
      btnColor: '#2563eb'
    },
    {
      id: 6,
      type: 'exercise',
      typeBadge: 'Bài tập',
      subject: 'Hóa học',
      title: 'Bài tập Hóa hữu cơ cơ chế phản ứng',
      desc: 'Tuyển tập 150 câu bài tập cơ chế chuyên sâu dành cho học sinh giỏi và thi chuyên.',
      author: 'TS. Phạm Thị Lan',
      date: '06/09/2026',
      downloads: '712',
      isVip: true,
      btnText: 'Tải xuống (2.1MB)',
      btnColor: '#2563eb'
    },
    {
      id: 7,
      type: 'video',
      typeBadge: 'Video',
      subject: 'Tiếng Anh',
      title: 'Video luyện nghe IELTS 7.5+ chuyên đề Science',
      desc: 'Chiến thuật bắt key words và bẫy phát âm trong Section 4 bài thi IELTS Listening.',
      author: 'Trần Minh Đức',
      date: '07/09/2026',
      downloads: '954',
      isVip: true,
      btnText: 'Tải xuống (45 phút)',
      btnColor: '#2563eb'
    },
    {
      id: 8,
      type: 'quiz',
      typeBadge: 'Trắc nghiệm',
      subject: 'Vật lý',
      title: 'Trắc nghiệm Vật lý hạt nhân 12 nâng cao',
      desc: 'Dạng bài toán phóng xạ, năng lượng liên kết và phản ứng nhiệt hạch có độ phân hóa cao.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '04/09/2026',
      downloads: '623',
      isVip: true,
      btnText: 'Tải xuống (1.4MB)',
      btnColor: '#2563eb'
    },
    {
      id: 9,
      type: 'pdf',
      typeBadge: 'PDF',
      subject: 'Luyện thi THPT',
      title: 'Sổ tay công thức Hóa học 10-11-12',
      desc: 'Bản in tóm tắt bỏ túi toàn bộ lý thuyết, bảng tính tan, chuỗi thế điện cực và mẹo giải nhanh.',
      author: 'TS. Phạm Thị Lan',
      date: '09/09/2026',
      downloads: '4,102',
      isVip: false,
      btnText: 'Tải xuống (1.8MB)',
      btnColor: '#f97316'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDownloadMaterial = (mat) => {
    const ext = mat.type === 'video' ? 'mp4' : mat.type === 'quiz' ? 'pdf' : 'pdf';
    const fileName = `${mat.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${ext}`;
    fileService.downloadFile(mat.fileUrl, fileName);
    showToast(`Đang tải xuống tài liệu: ${mat.title}`);
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Vui lòng nhập tên tài liệu.');
      return;
    }

    let fileUrl = null;
    let sizeStr = '1.5MB';
    if (newFile) {
      const uploadRes = await fileService.uploadFile(newFile);
      fileUrl = uploadRes.data?.fileUrl;
      sizeStr = fileService.formatBytes(newFile.size);
    }

    const typeBadgeMap = {
      pdf: 'PDF',
      video: 'Video',
      exercise: 'Bài tập',
      quiz: 'Trắc nghiệm'
    };

    const newMat = {
      id: Date.now(),
      type: newType,
      typeBadge: typeBadgeMap[newType] || 'Tài liệu',
      badgeExtra: 'MỚI',
      subject: newSubject,
      title: newTitle,
      desc: newDesc || 'Tài liệu học tập được chia sẻ bởi gia sư.',
      author: user?.fullName || 'Gia sư Tutora',
      date: new Date().toLocaleDateString('vi-VN'),
      downloads: '0',
      isVip: false,
      btnText: `Tải xuống (${sizeStr})`,
      btnColor: '#7c3aed',
      fileUrl: fileUrl
    };

    setMaterials([newMat, ...materials]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewFile(null);
    showToast(`Đã đăng tài liệu "${newTitle}" thành công!`);
  };

  const filteredMaterials = materials.filter((m) => {
    if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 60px 20px' }}>
      
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
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
          <CheckCircle2 size={20} color="#10b981" />
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
            Tài liệu học tập
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {isTutor 
              ? 'Kho học liệu, đề thi và chuyên đề hỗ trợ giảng dạy' 
              : 'Kho tài liệu ôn tập, đề thi và chuyên đề tuyển chọn'}
          </p>
        </div>

        {/* Tutor: "+ Đăng tài liệu mới" */}
        {isTutor && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
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
            <span>Đăng tài liệu mới</span>
          </button>
        )}
      </div>

      {/* VIP Upgrade Banner (ONLY SHOWN TO STUDENTS - Hidden for Tutors) */}
      {!isTutor && (
        <div style={{
          background: '#facc15',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '4px 4px 0px #0f172a',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#0f172a',
              color: '#facc15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900
            }}>
              ★
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                Mở khóa 200+ tài liệu độc quyền VIP
              </div>
              <div style={{ fontSize: '0.85rem', color: '#713f12', marginTop: '2px' }}>
                Truy cập không giới hạn đề thi, chiến lược và bộ tài liệu cao cấp
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowVnpayModal(true)}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Nâng cấp VIP qua VNPAY →
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{materials.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Tổng tài liệu</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isTutor ? <FolderOpen size={22} /> : <Star size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {isTutor ? '4' : '4'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              {isTutor ? 'Tài liệu của tôi' : 'Tài liệu VIP'}
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>6</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Môn học</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>14.2k</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Lượt tải về</div>
          </div>
        </div>
      </div>

      {/* Filter Row 1: Môn học */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {subjectFilters.map((sub) => {
          const isSel = selectedSubject === sub || (selectedSubject === 'all' && sub === 'Tất cả');
          return (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub === 'Tất cả' ? 'all' : sub)}
              style={{
                border: '1.5px solid #0f172a',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: isSel ? '#0f172a' : '#ffffff',
                color: isSel ? '#ffffff' : '#0f172a',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Filter Row 2: Type Filter Pills + Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {typeFilters.map((tf) => {
            const isSel = selectedType === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => setSelectedType(tf.id)}
                style={{
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: isSel ? 800 : 600,
                  background: isSel ? '#0f172a' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Tìm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              border: '1.5px solid #0f172a',
              borderRadius: '10px',
              padding: '0 14px',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* 3-Column Document Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredMaterials.map((mat) => {
          // Locked overlay ONLY appears for Students when mat.isVip === true.
          // Tutors NEVER have locked VIP overlays!
          const isLocked = !isTutor && mat.isVip;

          return (
            <div
              key={mat.id}
              style={{
                background: '#ffffff',
                border: '1.5px solid #0f172a',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '260px'
              }}
            >
              <div>
                {/* Type Badge & MỚI */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#475569'
                  }}>
                    {mat.typeBadge}
                  </span>

                  {mat.badgeExtra && (
                    <span style={{
                      background: '#f43f5e',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}>
                      {mat.badgeExtra}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {mat.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {mat.desc}
                </p>

                {/* Author & Stats */}
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
                  {mat.author}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                  <span>📅 {mat.date}</span>
                  <span>⬇ {mat.downloads} lượt tải</span>
                </div>
              </div>

              {/* Bottom Action */}
              {!isLocked ? (
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: mat.isVip ? '#fef3c7' : '#e6fffa',
                    color: mat.isVip ? '#b45309' : '#059669',
                    border: `1px solid ${mat.isVip ? '#fde68a' : '#34d399'}`,
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}>
                    {isTutor && mat.isVip ? 'Tài liệu Chuyên sâu' : mat.isVip ? 'VIP' : 'Miễn phí'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDownloadMaterial(mat)}
                    style={{
                      width: '100%',
                      background: mat.btnColor || '#7c3aed',
                      color: '#ffffff',
                      border: '2px solid #000000',
                      boxShadow: '3px 3px 0px #000000',
                      borderRadius: '12px',
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} />
                    <span>{mat.btnText || 'Tải xuống'}</span>
                  </button>
                </div>
              ) : (
                /* Locked VIP Overlay Card for Students */
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '2px solid #0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    boxShadow: '2px 2px 0 #000'
                  }}>
                    <Lock size={22} color="#7c3aed" />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '12px' }}>
                    Yêu cầu gói Cao cấp
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVnpayModal(true)}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: '1.5px solid #0f172a',
                      borderRadius: '10px',
                      padding: '8px 18px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0px #0f172a'
                    }}
                  >
                    Nâng cấp VIP qua VNPAY
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: TUTOR UPLOAD MATERIAL */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '20px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
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
              + Đăng tài liệu mới
            </h2>

            <form onSubmit={handleUploadMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tên tài liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyên đề Đột biến cấu trúc Nhiễm sắc thể..."
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
                    <option value="Luyện thi THPT">Luyện thi THPT</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Định dạng
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
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
                    <option value="pdf">PDF Tài liệu</option>
                    <option value="video">Video Bài giảng</option>
                    <option value="exercise">Bài tập tự luyện</option>
                    <option value="quiz">Trắc nghiệm Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Mô tả tóm tắt nội dung
                </label>
                <textarea
                  rows={3}
                  placeholder="Tóm tắt những kiến thức chính trong tài liệu..."
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tệp tài liệu tải lên (PDF, DOCX, MP4, ZIP) *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    fontSize: '0.85rem'
                  }}
                />
                {newFile && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Đã chọn: {newFile.name} ({fileService.formatBytes(newFile.size)})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#ff5f38',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: 'pointer'
                  }}
                >
                  Đăng ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VNPay VIP Checkout Modal */}
      <VNPayCheckoutModal
        isOpen={showVnpayModal}
        onClose={() => setShowVnpayModal(false)}
        initialPlan="yearly"
      />

    </div>
  );
}

