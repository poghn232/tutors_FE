import React, { useState, useEffect } from 'react';
import { tutorService } from '../services/tutorService';
import fileService from '../services/fileService';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  Award, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Download, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw,
  User,
  GraduationCap
} from 'lucide-react';

export default function AdminTutorVerificationDashboard() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [tutorToReject, setTutorToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Lightbox modal for previewing certificate in full resolution
  const [zoomImage, setZoomImage] = useState(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await tutorService.getAdminTutors();
      if (res && res.data) {
        setTutors(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách gia sư cho Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleApprove = async (tutor) => {
    if (!window.confirm(`Bạn có chắc chắn muốn PHÊ DUYỆT hồ sơ gia sư của "${tutor.fullName}"?`)) {
      return;
    }
    try {
      setActionLoading(true);
      await tutorService.updateTutorVerification(tutor.id, 'APPROVED');
      setTutors(prev => prev.map(t => t.id === tutor.id ? { ...t, verificationStatus: 'APPROVED', rejectionReason: null, verifiedAt: new Date().toISOString() } : t));
    } catch (err) {
      alert('Phê duyệt thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (tutor) => {
    setTutorToReject(tutor);
    setRejectionReason('Ảnh bằng cấp chưa rõ ràng hoặc thiếu thông tin đối chiếu. Vui lòng cập nhật lại.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!tutorToReject) return;
    try {
      setActionLoading(true);
      await tutorService.updateTutorVerification(tutorToReject.id, 'REJECTED', rejectionReason);
      setTutors(prev => prev.map(t => t.id === tutorToReject.id ? { ...t, verificationStatus: 'REJECTED', rejectionReason } : t));
      setRejectModalOpen(false);
      setTutorToReject(null);
    } catch (err) {
      alert('Từ chối thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPending = async (tutor) => {
    try {
      setActionLoading(true);
      await tutorService.updateTutorVerification(tutor.id, 'PENDING');
      setTutors(prev => prev.map(t => t.id === tutor.id ? { ...t, verificationStatus: 'PENDING', rejectionReason: null } : t));
    } catch (err) {
      alert('Đặt lại thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics
  const totalCount = tutors.length;
  const pendingCount = tutors.filter(t => (t.verificationStatus || 'PENDING') === 'PENDING').length;
  const approvedCount = tutors.filter(t => t.verificationStatus === 'APPROVED').length;
  const rejectedCount = tutors.filter(t => t.verificationStatus === 'REJECTED').length;

  // Filtered tutors
  const filteredTutors = tutors.filter(t => {
    const status = t.verificationStatus || 'PENDING';
    if (filterStatus !== 'ALL' && status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (t.fullName || '').toLowerCase().includes(q);
      const matchEmail = (t.email || '').toLowerCase().includes(q);
      const matchPhone = (t.phone || '').toLowerCase().includes(q);
      const matchQual = (t.subject || t.qualification || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchQual;
    }
    return true;
  });

  const parseCertificates = (jsonStr) => {
    if (!jsonStr) return [];
    try {
      const parsed = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1.5px solid #fca5a5',
              fontSize: '0.8rem',
              fontWeight: 800
            }}>
              CỔNG QUẢN TRỊ VIÊN
            </span>
            <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Tutora Admin Verification</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 4px 0' }}>
            Quản Lý & Phê Duyệt Hồ Sơ Gia Sư
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Kiểm tra thông tin định danh, bằng cấp và hình ảnh chứng chỉ của gia sư trước khi hiển thị công khai trên nền tảng.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTutors}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            boxShadow: '3px 3px 0px #0f172a',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Đang tải lại...' : 'Làm mới dữ liệu'}
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '32px'
      }}>
        {/* Card 1: Total */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '4px 4px 0px #0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Tổng số gia sư
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              {totalCount}
            </div>
          </div>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#f1f5f9',
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a'
          }}>
            <User size={26} />
          </div>
        </div>

        {/* Card 2: Pending (Chờ duyệt) */}
        <div 
          onClick={() => setFilterStatus('PENDING')}
          style={{
            backgroundColor: filterStatus === 'PENDING' ? '#fffbeb' : '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '4px 4px 0px #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
              Chờ kiểm duyệt
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
              {pendingCount}
            </div>
          </div>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#fef3c7',
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706'
          }}>
            <Clock size={26} />
          </div>
        </div>

        {/* Card 3: Approved */}
        <div 
          onClick={() => setFilterStatus('APPROVED')}
          style={{
            backgroundColor: filterStatus === 'APPROVED' ? '#f0fdf4' : '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '4px 4px 0px #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
              Đã phê duyệt
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>
              {approvedCount}
            </div>
          </div>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#dcfce7',
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <CheckCircle size={26} />
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div 
          onClick={() => setFilterStatus('REJECTED')}
          style={{
            backgroundColor: filterStatus === 'REJECTED' ? '#fef2f2' : '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '4px 4px 0px #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>
              Từ chối / Bổ sung
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626', marginTop: '4px' }}>
              {rejectedCount}
            </div>
          </div>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#fee2e2',
            border: '2px solid #0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#dc2626'
          }}>
            <XCircle size={26} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #0f172a',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '3px 3px 0px #0f172a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tất cả gia sư', count: totalCount },
            { id: 'PENDING', label: '⏳ Chờ duyệt', count: pendingCount },
            { id: 'APPROVED', label: '✅ Đã duyệt', count: approvedCount },
            { id: 'REJECTED', label: '❌ Bị từ chối', count: rejectedCount }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1.5px solid #0f172a',
                backgroundColor: filterStatus === tab.id ? '#ffd600' : '#ffffff',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: filterStatus === tab.id ? '2px 2px 0px #0f172a' : 'none'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1, maxWidth: '420px' }}>
          <Search size={18} style={{ position: 'absolute', top: '12px', left: '14px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, sđt, bằng cấp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '0.88rem',
              outline: 'none',
              backgroundColor: '#f8fafc'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', top: '10px', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tutor List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 700 }}>Đang tải danh sách hồ sơ gia sư...</p>
        </div>
      ) : filteredTutors.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <AlertTriangle size={48} style={{ color: '#f59e0b', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
            Không tìm thấy hồ sơ gia sư nào
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Không có gia sư nào phù hợp với bộ lọc "{filterStatus}" hoặc từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredTutors.map(tutor => {
            const status = tutor.verificationStatus || 'PENDING';
            const certs = parseCertificates(tutor.certificatesJson);
            const isApproved = status === 'APPROVED';
            const isPending = status === 'PENDING';
            const isRejected = status === 'REJECTED';

            return (
              <div
                key={tutor.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '4px 4px 0px #0f172a',
                  position: 'relative'
                }}
              >
                {/* Status Badge Top-Right */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {isPending && (
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      border: '1.5px solid #f59e0b',
                      borderRadius: '999px',
                      padding: '4px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Clock size={14} /> Chờ Admin Duyệt
                    </span>
                  )}
                  {isApproved && (
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      border: '1.5px solid #22c55e',
                      borderRadius: '999px',
                      padding: '4px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <CheckCircle size={14} /> Đã Xác Thực
                    </span>
                  )}
                  {isRejected && (
                    <span style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1.5px solid #ef4444',
                      borderRadius: '999px',
                      padding: '4px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <XCircle size={14} /> Từ Chối
                    </span>
                  )}
                </div>

                {/* Main Content Info */}
                <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  
                  {/* Avatar Frame */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '20px',
                    border: '2px solid #0f172a',
                    backgroundColor: '#ffd600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {tutor.avatarUrl ? (
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>🐔</span>
                    )}
                  </div>

                  {/* Text Details */}
                  <div style={{ flexGrow: 1, minWidth: '280px', paddingRight: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                        {tutor.fullName}
                      </h3>
                      <span style={{
                        backgroundColor: '#ede9fe',
                        color: '#7c3aed',
                        border: '1px solid #ddd6fe',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        Mã GS: #{tutor.id}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                      fontSize: '0.85rem',
                      color: '#475569'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={16} style={{ color: '#2563eb' }} />
                        <strong>{tutor.subject || tutor.qualification || 'Chưa cập nhật học vị'}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={16} style={{ color: '#64748b' }} />
                        <span>{tutor.email}</span>
                      </div>
                      {tutor.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={16} style={{ color: '#16a34a' }} />
                          <span>{tutor.phone}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={16} style={{ color: '#f59e0b' }} />
                        <span>{tutor.experienceYears ? `${tutor.experienceYears} năm kinh nghiệm` : 'Gia sư mới'}</span>
                      </div>
                    </div>

                    {tutor.bio && (
                      <p style={{
                        margin: '12px 0 0 0',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        color: '#334155',
                        backgroundColor: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                      }}>
                        "{tutor.bio}"
                      </p>
                    )}

                    {/* Rejection Note if Rejected */}
                    {isRejected && tutor.rejectionReason && (
                      <div style={{
                        marginTop: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1.5px solid #fca5a5',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '0.86rem',
                        color: '#991b1b'
                      }}>
                        <strong>Lý do từ chối:</strong> {tutor.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section: Uploaded Certificates */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '18px',
                  borderTop: '1.5px dashed #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={18} style={{ color: '#d97706' }} />
                      Bằng cấp & Chứng chỉ tải lên ({certs.length} ảnh)
                    </span>
                    {certs.length === 0 && (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        Gia sư chưa tải lên ảnh chứng chỉ
                      </span>
                    )}
                  </div>

                  {certs.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '14px'
                    }}>
                      {certs.map((cert, idx) => (
                        <div
                          key={cert.id || idx}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          {/* Image preview with click to zoom */}
                          <div 
                            style={{ height: '110px', overflow: 'hidden', cursor: 'pointer', position: 'relative', backgroundColor: '#e2e8f0' }}
                            onClick={() => setZoomImage(cert)}
                          >
                            <img
                              src={cert.imageUrl}
                              alt={cert.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: '6px',
                              right: '6px',
                              backgroundColor: 'rgba(15, 23, 42, 0.75)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Eye size={12} /> Phóng to
                            </div>
                          </div>

                          <div style={{ padding: '8px 10px' }}>
                            <div style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {cert.title || 'Bằng cấp chuyên môn'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{cert.date || 'Đã nộp'}</span>
                              <button
                                type="button"
                                onClick={() => fileService.downloadFile(cert.imageUrl, `${cert.title || 'bang_cap'}.jpg`)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#2563eb',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="Tải ảnh về máy"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Bar for Admin */}
                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1.5px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {tutor.facebookUrl && (
                    <a
                      href={tutor.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#1d4ed8',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ExternalLink size={15} /> Facebook Gia Sư
                    </a>
                  )}

                  {isApproved ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => openRejectModal(tutor)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #ef4444',
                        color: '#dc2626',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <X size={16} /> Thu hồi phê duyệt / Từ chối
                    </button>
                  ) : isRejected ? (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleApprove(tutor)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '10px',
                        backgroundColor: '#16a34a',
                        border: '2px solid #0f172a',
                        color: '#ffffff',
                        boxShadow: '2px 2px 0px #0f172a',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={16} /> Phê duyệt lại hồ sơ này
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => openRejectModal(tutor)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '10px',
                          backgroundColor: '#ffffff',
                          border: '2px solid #0f172a',
                          color: '#dc2626',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          boxShadow: '2px 2px 0px #0f172a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <X size={16} /> Từ chối hồ sơ
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(tutor)}
                        style={{
                          padding: '9px 24px',
                          borderRadius: '10px',
                          backgroundColor: '#22c55e',
                          border: '2px solid #0f172a',
                          color: '#0f172a',
                          boxShadow: '2px 2px 0px #0f172a',
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Check size={18} /> Phê Duyệt Gia Sư
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: REJECT REASON */}
      {rejectModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: '2px solid #0f172a',
            boxShadow: '6px 6px 0px #0f172a',
            maxWidth: '520px',
            width: '100%',
            padding: '26px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={22} /> Từ chối hồ sơ gia sư
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
              Bạn đang từ chối hồ sơ của <strong>{tutorToReject?.fullName}</strong>. Vui lòng nhập lý do cụ thể để gửi hướng dẫn cho gia sư cập nhật lại bằng cấp:
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối (Ví dụ: Ảnh bằng tốt nghiệp bị nhòe, vui lòng chụp rõ nét hơn...)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={actionLoading || !rejectionReason.trim()}
                onClick={handleConfirmReject}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: '2px 2px 0px #0f172a',
                  cursor: 'pointer'
                }}
              >
                {actionLoading ? 'Đang cập nhật...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ZOOM CERTIFICATE LIGHTBOX */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '24px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '2px solid #0f172a',
              maxWidth: '860px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '8px 8px 0px #0f172a',
              position: 'relative'
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {zoomImage.title || 'Chi tiết bằng cấp'}
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Thời gian: {zoomImage.date || 'Gần đây'}</span>
              </div>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', maxHeight: '68vh', overflow: 'auto' }}>
              <img
                src={zoomImage.imageUrl}
                alt={zoomImage.title}
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>

            <div style={{
              padding: '14px 20px',
              backgroundColor: '#f8fafc',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => fileService.downloadFile(zoomImage.imageUrl, `${zoomImage.title || 'bang_cap'}.jpg`)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #0f172a',
                  backgroundColor: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} /> Tải ảnh gốc
              </button>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: '2px solid #0f172a',
                  backgroundColor: '#ffd600',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
