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
  Users 
} from 'lucide-react';

export default function MaterialView({ user, onNavigateToVip }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Materials matching Figma 15:4442
  const materialsList = [
    {
      id: 1,
      type: 'pdf',
      typeBadge: 'PDF',
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
      title: 'Đề thi thử THPT quốc gia Toán 2026',
      desc: 'Đề thi chuẩn cấu trúc Bộ GD&ĐT kèm video chữa bài độc quyền từ thủ khoa và giáo viên chuyên.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '08/09/2026',
      downloads: '841',
      isVip: true
    },
    {
      id: 6,
      type: 'exercise',
      typeBadge: 'Bài tập',
      title: 'Bài tập Hóa hữu cơ cơ chế phản ứng',
      desc: 'Tuyển tập 150 câu bài tập cơ chế chuyên sâu dành cho học sinh giỏi và thi chuyên.',
      author: 'TS. Phạm Thị Lan',
      date: '06/09/2026',
      downloads: '712',
      isVip: true
    },
    {
      id: 7,
      type: 'video',
      typeBadge: 'Video',
      title: 'Video luyện nghe IELTS 7.5+ chuyên đề Science',
      desc: 'Chiến thuật bắt key words và bẫy phát âm trong Section 4 bài thi IELTS Listening.',
      author: 'Trần Minh Đức',
      date: '07/09/2026',
      downloads: '954',
      isVip: true
    },
    {
      id: 8,
      type: 'quiz',
      typeBadge: 'Trắc nghiệm',
      title: 'Trắc nghiệm Vật lý hạt nhân 12 nâng cao',
      desc: 'Dạng bài toán phóng xạ, năng lượng liên kết và phản ứng nhiệt hạch có độ phân hóa cao.',
      author: 'TS. Nguyễn Thị Hoa',
      date: '04/09/2026',
      downloads: '623',
      isVip: true
    },
    {
      id: 9,
      type: 'pdf',
      typeBadge: 'PDF',
      title: 'Chiến lược làm bài thi trắc nghiệm Sinh học',
      desc: 'Kỹ năng làm bài nhanh, nhận biết quy luật di truyền chỉ trong 45 giây mỗi câu.',
      author: 'TS. Lê Thị Thu',
      date: '02/09/2026',
      downloads: '540',
      isVip: true
    }
  ];

  const filteredMaterials = materialsList.filter((m) => {
    const term = searchQuery.toLowerCase().trim();
    const matchSearch = !term || m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term);
    const matchType = selectedType === 'all' || m.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 0 60px 0' }}>
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 6px 0'
        }}>
          Tài liệu Học tập
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
          Thư viện tài liệu từ các gia sư chuyên nghiệp
        </p>
      </div>

      {/* Banner VIP (Yellow Card Figma 15:4442) */}
      <div style={{
        background: '#facc15',
        border: '1.5px solid #0f172a',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#0f172a',
            color: '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={20} />
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
          onClick={() => onNavigateToVip ? onNavigateToVip() : alert('Tính năng gói VIP')}
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
          Nâng cấp ngay →
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>12</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Tổng tài liệu</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1.5px solid #0f172a', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>4</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Tài liệu Vip</div>
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
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>4</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Gia sư</div>
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
                cursor: 'pointer'
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
                  cursor: 'pointer'
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
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* 3-Column Document Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredMaterials.map((mat) => (
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
                <span>⬇ {mat.downloads}</span>
              </div>
            </div>

            {/* Bottom Action: Free button or VIP lock */}
            {!mat.isVip ? (
              <div>
                <span style={{
                  display: 'inline-block',
                  background: '#e6fffa',
                  color: '#059669',
                  border: '1px solid #34d399',
                  borderRadius: '999px',
                  padding: '2px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '10px'
                }}>
                  Miễn phí
                </span>

                <button
                  type="button"
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
                    cursor: 'pointer'
                  }}
                >
                  {mat.btnText || 'Tải xuống'}
                </button>
              </div>
            ) : (
              /* Locked VIP Overlay Card */
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.85)',
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
                  onClick={() => onNavigateToVip ? onNavigateToVip() : alert('Tính năng gói VIP')}
                  style={{
                    background: '#7c3aed',
                    color: '#ffffff',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0 #000',
                    borderRadius: '10px',
                    padding: '8px 24px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Nâng cấp
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
