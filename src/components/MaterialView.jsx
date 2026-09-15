import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Search, 
  FolderOpen, 
  CheckCircle, 
  BookOpen, 
  User, 
  Calendar 
} from 'lucide-react';

export default function MaterialView({ user }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadNotification, setDownloadNotification] = useState('');

  // Sample materials from Figma EXE-2 frames (43:1024 & 16:830)
  const materials = [
    {
      id: 1,
      title: 'Tuyển tập 50 Đề thi thử THPT Quốc gia môn Toán (Kèm lời giải chi tiết)',
      subject: 'Toán học',
      tutor: 'TS. Nguyễn Thị Hoa',
      format: 'PDF',
      size: '14.2 MB',
      downloads: 480,
      uploadDate: '02/09/2026',
      description: 'Tổng hợp các dạng câu hỏi vận dụng cao về hàm số, mũ - logarit, hình học không gian Oxyz và xác suất.'
    },
    {
      id: 2,
      title: 'Sơ đồ tư duy toàn bộ chuỗi phản ứng Hóa hữu cơ 11 & 12',
      subject: 'Hóa học',
      tutor: 'TS. Phạm Thị Lan',
      format: 'PDF',
      size: '8.5 MB',
      downloads: 320,
      uploadDate: '06/09/2026',
      description: 'Hệ thống hóa kiến thức este - lipit, cacbohiđrat, amin - amino axit - peptit và polime dưới dạng mindmap dễ nhớ.'
    },
    {
      id: 3,
      title: 'Cẩm nang 1.000 Collocations & Idioms Tiếng Anh nâng cao',
      subject: 'Tiếng Anh',
      tutor: 'Trần Minh Đức',
      format: 'PDF',
      size: '6.1 MB',
      downloads: 615,
      uploadDate: '08/09/2026',
      description: 'Tài liệu độc quyền phục vụ luyện thi IELTS 7.5+ và kỳ thi THPT Chuyên toàn quốc.'
    },
    {
      id: 4,
      title: 'Công thức giải nhanh Vật lý 12 - Dao động và Sóng cơ',
      subject: 'Vật lý',
      tutor: 'ThS. Hoàng Thiên Ưng',
      format: 'PDF',
      size: '5.4 MB',
      downloads: 275,
      uploadDate: '10/09/2026',
      description: 'Bí kíp bấm máy tính Casio và công thức tính nhanh chu kỳ con lắc, khoảng vân giao thoa sóng.'
    }
  ];

  const subjects = ['all', 'Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh'];

  const filteredMaterials = materials.filter((item) => {
    const matchSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.tutor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchQuery;
  });

  const handleDownload = (title) => {
    setDownloadNotification(`Đang tải tài liệu: "${title}"`);
    setTimeout(() => {
      setDownloadNotification('');
    }, 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Thư Viện Tài Liệu</h2>
          <p className="section-desc">Kho tài liệu học tập, giáo trình chuyên sâu và đề thi thử chọn lọc</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn btn-primary"
            style={{ gap: '8px' }}
            onClick={() => alert('Tính năng tải lên tài liệu dành riêng cho Gia sư được cấp phép.')}
          >
            <Upload size={16} /> Tải tài liệu lên
          </button>
        </div>
      </div>

      {downloadNotification && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> {downloadNotification}
        </div>
      )}

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <BookOpen size={26} />
          </div>
          <div>
            <strong>1.250+</strong>
            <span>Tài liệu đã chia sẻ</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Download size={26} />
          </div>
          <div>
            <strong>15.400+</strong>
            <span>Lượt tải về học tập</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
            <FolderOpen size={26} />
          </div>
          <div>
            <strong>100%</strong>
            <span>Đã kiểm duyệt chuyên môn</span>
          </div>
        </div>
      </div>

      {/* Search & Subject Filters */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Chips */}
        <div className="filter-chip-grid">
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`filter-chip ${selectedSubject === sub ? 'active' : ''}`}
              onClick={() => setSelectedSubject(sub)}
            >
              {sub === 'all' ? 'Tất cả môn học' : sub}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.88rem' }}
            placeholder="Tìm tên tài liệu hoặc gia sư..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Materials List */}
      <div style={{ display: 'grid', gap: '14px' }}>
        {filteredMaterials.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
            <FileText size={42} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Không tìm thấy tài liệu phù hợp.</p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div key={item.id} className="material-card">
              <div className="material-icon">
                <FileText size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="tutor-tag">{item.subject}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                    {item.format} • {item.size}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {item.title}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '8px', lineHeight: 1.45 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} /> Gia sư: <strong style={{ color: '#1e293b' }}>{item.tutor}</strong>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {item.uploadDate}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={13} /> {item.downloads} lượt tải
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', gap: '6px' }}
                  onClick={() => alert(`Xem trước tài liệu: "${item.title}"`)}
                >
                  <Eye size={15} /> Xem trước
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', gap: '6px' }}
                  onClick={() => handleDownload(item.title)}
                >
                  <Download size={15} /> Tải về
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
