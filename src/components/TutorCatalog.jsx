import React, { useState, useEffect } from 'react';
import { tutorService } from '../services/tutorService';
import { Search, Star, Award, BookOpen, DollarSign, Mail, Phone, UserCheck } from 'lucide-react';

export default function TutorCatalog() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    async function loadTutors() {
      try {
        setLoading(true);
        const res = await tutorService.getTutors();
        if (res.success) {
          setTutors(res.data || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách gia sư:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTutors();
  }, []);

  const filteredTutors = tutors.filter((t) => {
    const term = searchQuery.toLowerCase();
    return (
      (t.fullName && t.fullName.toLowerCase().includes(term)) ||
      (t.bio && t.bio.toLowerCase().includes(term)) ||
      (t.qualification && t.qualification.toLowerCase().includes(term))
    );
  });

  const formatCurrency = (val) => {
    if (!val) return 'Thỏa thuận';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) + '/giờ';
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải danh sách gia sư...</div>;
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header & Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
          Danh mục Gia sư Chất lượng cao ({filteredTutors.length} gia sư)
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 16px 0' }}>
          Đội ngũ Gia sư uy tín, giàu kinh nghiệm giảng dạy các môn học từ Lớp 1 - Lớp 12 & Ôn thi Đại học.
        </p>

        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '40px' }}
            placeholder="Tìm theo tên gia sư, bằng cấp, môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTutors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          Không tìm thấy gia sư nào phù hợp với tìm kiếm.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    border: '2px solid #bfdbfe'
                  }}>
                    {tutor.fullName ? tutor.fullName.charAt(0).toUpperCase() : 'G'}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: '0 0 2px 0', color: '#0f172a' }}>{tutor.fullName}</h4>
                    <span className="badge badge-tutor" style={{ fontSize: '0.75rem' }}>
                      {tutor.qualification || 'Gia sư Chuyên nghiệp'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={16} color="#f59e0b" />
                    <span>Kinh nghiệm: <strong>{tutor.experienceYears ? `${tutor.experienceYears} năm` : 'Trên 2 năm'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={16} color="#10b981" />
                    <span>Học phí: <strong style={{ color: '#059669' }}>{formatCurrency(tutor.hourlyRate || 150000)}</strong></span>
                  </div>
                  {tutor.bio && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{tutor.bio}"
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setSelectedTutor(tutor)}
                  className="btn btn-secondary btn-block"
                  style={{ fontSize: '0.85rem' }}
                >
                  Xem chi tiết hồ sơ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Chi tiết Gia sư */}
      {selectedTutor && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                backgroundColor: '#2563eb', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 'bold'
              }}>
                {selectedTutor.fullName ? selectedTutor.fullName.charAt(0) : 'G'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedTutor.fullName}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{selectedTutor.email}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div><strong>Trình độ / Bằng cấp:</strong> {selectedTutor.qualification || 'Đại học Sư phạm / Cử nhân chuyên ngành'}</div>
              <div><strong>Số năm kinh nghiệm:</strong> {selectedTutor.experienceYears || 3} năm</div>
              <div><strong>Mức học phí đề xuất:</strong> {formatCurrency(selectedTutor.hourlyRate || 150000)}</div>
              <div><strong>Tiểu sử & Phương pháp giảng dạy:</strong></div>
              <p style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', margin: 0, fontSize: '0.875rem', color: '#475569' }}>
                {selectedTutor.bio || 'Gia sư tận tâm, bám sát cấu trúc đề thi, phương pháp truyền đạt dễ hiểu giúp học sinh nắm vững kiến thức từ căn bản đến nâng cao.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedTutor(null)} className="btn btn-primary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
