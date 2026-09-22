import React, { useState, useEffect } from 'react';
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
  FolderOpen,
  Edit3,
  Trash2,
  AlertTriangle,
  UploadCloud,
  Check,
  Crown
} from 'lucide-react';
import fileService from '../services/fileService';
import materialService from '../services/materialService';
import VietQRCheckoutModal from './VietQRCheckoutModal';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function MaterialView({ user, onNavigateToVip, onRequireAuth }) {
  const isAdmin = user?.role === 'ADMIN';
  const isTutor = user?.role === 'TUTOR';
  const canManage = isAdmin || isTutor;

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [isVip, setIsVip] = useState(() => {
    return user?.isVip || localStorage.getItem('tutora_is_vip') === 'true';
  });

  // Tự động đồng bộ trạng thái VIP khi thanh toán thành công
  useEffect(() => {
    const handleVipUpdate = () => {
      setIsVip(user?.isVip || localStorage.getItem('tutora_is_vip') === 'true');
    };
    window.addEventListener('tutora_vip_updated', handleVipUpdate);
    window.addEventListener('storage', handleVipUpdate);
    return () => {
      window.removeEventListener('tutora_vip_updated', handleVipUpdate);
      window.removeEventListener('storage', handleVipUpdate);
    };
  }, [user]);

  // Modal State for Add / Edit Material
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null); // null = Add new, object = Edit
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Toán học');
  const [newType, setNewType] = useState('pdf');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsVip, setNewIsVip] = useState(false);
  const [newBadgeExtra, setNewBadgeExtra] = useState('');
  const [newFile, setNewFile] = useState(null);

  // Delete Confirmation Modal State
  const [deletingMaterial, setDeletingMaterial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const [materials, setMaterials] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load materials from backend
  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await materialService.getMaterials();
      if (res && res.data && Array.isArray(res.data)) {
        setMaterials(res.data);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.warn('Cannot load materials from backend:', err);
      showToast('Không thể kết nối máy chủ để tải tài liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingMaterial(null);
    setNewTitle('');
    setNewSubject('Toán học');
    setNewType('pdf');
    setNewDesc('');
    setNewAuthor(user?.fullName || (isAdmin ? 'Ban Quản Trị Tutora' : 'Gia Sư Tutora'));
    setNewIsVip(false);
    setNewBadgeExtra('');
    setNewFile(null);
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (mat) => {
    setEditingMaterial(mat);
    setNewTitle(mat.title || '');
    setNewSubject(mat.subjectName || mat.subject || 'Toán học');
    setNewType(mat.materialType || mat.type || 'pdf');
    setNewDesc(mat.description || mat.desc || '');
    setNewAuthor(mat.authorName || mat.author || '');
    setNewIsVip(Boolean(mat.isVip));
    setNewBadgeExtra(mat.badgeExtra || '');
    setNewFile(null);
    setShowModal(true);
  };

  // Save (Create or Update)
  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Vui lòng nhập tên tài liệu.', 'error');
      return;
    }

    if (newFile && newFile.size > MAX_FILE_SIZE) {
      showToast('Tệp tài liệu vượt quá giới hạn 20MB. Vui lòng chọn tệp nhỏ hơn.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      let fileUrl = editingMaterial?.fileUrl || null;
      let fileName = editingMaterial?.fileName || null;
      let fileSize = editingMaterial?.fileSize || null;

      // Upload new file if selected
      if (newFile) {
        const uploadRes = await fileService.uploadFile(newFile);
        if (uploadRes && uploadRes.data) {
          fileUrl = uploadRes.data.fileUrl || null;
          fileName = newFile.name;
          fileSize = fileService.formatBytes(newFile.size);
        }
      }

      const typeBadgeMap = {
        pdf: 'PDF',
        video: 'Video',
        exercise: 'Bài tập',
        quiz: 'Trắc nghiệm'
      };

      const payload = {
        title: newTitle.trim(),
        description: newDesc.trim(),
        subjectName: newSubject,
        materialType: newType,
        typeBadge: typeBadgeMap[newType] || 'Tài liệu',
        badgeExtra: newBadgeExtra.trim() || null,
        authorName: newAuthor.trim() || (user?.fullName || 'Ban Quản Trị Tutora'),
        fileUrl: fileUrl,
        fileName: fileName,
        fileSize: fileSize,
        isVip: newIsVip
      };

      if (editingMaterial) {
        const res = await materialService.updateMaterial(editingMaterial.id, payload);
        if (res && res.data) {
          setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? res.data : m));
          showToast(`Đã cập nhật tài liệu "${payload.title}" thành công!`);
        } else {
          loadMaterials();
          showToast('Đã lưu thay đổi tài liệu!');
        }
      } else {
        const res = await materialService.createMaterial(payload);
        if (res && res.data) {
          setMaterials(prev => [res.data, ...prev]);
          showToast(`Đã thêm tài liệu mới "${payload.title}" thành công!`);
        } else {
          loadMaterials();
          showToast('Đã thêm tài liệu mới thành công!');
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error saving material:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi lưu tài liệu';
      showToast(errMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Material
  const handleConfirmDelete = async () => {
    if (!deletingMaterial) return;
    try {
      setIsDeleting(true);
      await materialService.deleteMaterial(deletingMaterial.id);
      setMaterials(prev => prev.filter(m => m.id !== deletingMaterial.id));
      showToast(`Đã xóa tài liệu "${deletingMaterial.title}" thành công!`);
      setDeletingMaterial(null);
    } catch (err) {
      console.error('Error deleting material:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi xóa tài liệu';
      showToast(errMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Download Material
  const handleDownloadMaterial = (mat) => {
    if (!user && onRequireAuth) {
      onRequireAuth(`tải tài liệu học tập "${mat.title}"`);
      return;
    }
    const ext = mat.materialType === 'video' || mat.type === 'video' 
      ? 'mp4' 
      : (mat.materialType === 'quiz' || mat.type === 'quiz') ? 'pdf' : 'pdf';
    const fileName = mat.fileName || `${mat.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.${ext}`;
    
    fileService.downloadFile(mat.fileUrl, fileName);
    materialService.incrementDownload(mat.id);
    
    // Update local download count
    setMaterials(prev => prev.map(m => {
      if (m.id === mat.id) {
        const count = (m.downloadsCount || 0) + 1;
        return { ...m, downloadsCount: count, downloads: String(count.toLocaleString()) };
      }
      return m;
    }));
    
    showToast(`Đang tải xuống: ${mat.title}`);
  };

  const filteredMaterials = materials.filter((m) => {
    const sub = m.subjectName || m.subject;
    const typ = m.materialType || m.type;
    if (selectedSubject !== 'all' && sub !== selectedSubject) return false;
    if (selectedType !== 'all' && typ !== selectedType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.desc && m.desc.toLowerCase().includes(q)) ||
        (m.authorName && m.authorName.toLowerCase().includes(q)) ||
        (m.author && m.author.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const vipCount = materials.filter(m => m.isVip).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 60px 20px' }}>
      
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toastType === 'error' ? '#ef4444' : '#0f172a',
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
          {toastType === 'error' ? <AlertTriangle size={20} color="#ffffff" /> : <CheckCircle2 size={20} color="#10b981" />}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px 0'
            }}>
              Tài liệu học tập
            </h1>
            {isAdmin && (
              <span style={{
                background: '#7c3aed',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1.5px solid #0f172a'
              }}>
                ADMIN QUẢN TRỊ
              </span>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {isAdmin 
              ? 'Quản trị hệ thống: Thêm, chỉnh sửa, xóa và phân quyền tài liệu VIP'
              : isTutor 
                ? 'Kho học liệu, đề thi và chuyên đề hỗ trợ giảng dạy' 
                : 'Kho tài liệu ôn tập, đề thi và chuyên đề tuyển chọn'}
          </p>
        </div>

        {/* Admin & Tutor: "+ Thêm tài liệu mới" */}
        {canManage && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
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
            <span>Thêm tài liệu mới</span>
          </button>
        )}
      </div>

      {/* VIP Upgrade / Active Banner (ONLY SHOWN TO PARENT ACCOUNTS WITHOUT VIP - Hidden for Tutors & Admin) */}
      {!canManage && (
        isVip ? (
          /* BANNER CHO HỌC VIÊN ĐÃ THANH TOÁN THÀNH CÔNG (VIP ACTIVE) */
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '2.5px solid #0f172a',
            borderRadius: '18px',
            padding: '20px 24px',
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
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#059669',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                border: '2px solid #0f172a',
                boxShadow: '2px 2px 0px #0f172a'
              }}>
                👑
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#065f46' }}>
                    Đặc Quyền VIP Đang Hoạt Động
                  </div>
                  <span style={{
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    border: '1.5px solid #0f172a',
                    letterSpacing: '0.5px'
                  }}>
                    ĐÃ KÍCH HOẠT ✓
                  </span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>
                  Bạn có toàn quyền tải về và xem không giới hạn 200+ đề thi thử THPT và tài liệu chuyên sâu.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('all');
                  setSelectedSubject('all');
                  const target = document.querySelector('input[placeholder*="Tìm"]');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '10px',
                  padding: '11px 20px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Kho tài liệu VIP đã mở ↓</span>
              </button>
            </div>
          </div>
        ) : (
          /* BANNER DÀNH CHO HỌC VIÊN CHƯA NÂNG CẤP */
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
              onClick={() => {
                if (!user && onRequireAuth) {
                  onRequireAuth('nâng cấp gói VIP để mở khóa tài liệu độc quyền');
                  return;
                }
                setShowPaymentModal(true);
              }}
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
              Nâng cấp VIP ngay →
            </button>
          </div>
        )
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
            {canManage ? <FolderOpen size={22} /> : <Star size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {vipCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              Tài liệu VIP
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
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {materials.reduce((acc, m) => acc + (m.downloadsCount || 0), 0).toLocaleString()}
            </div>
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

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
          Đang tải danh sách tài liệu...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMaterials.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px dashed #cbd5e1'
        }}>
          <FolderOpen size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Thử thay đổi bộ lọc môn học, định dạng hoặc từ khóa tìm kiếm.
          </p>
        </div>
      )}

      {/* 3-Column Document Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredMaterials.map((mat) => {
          // Locked overlay ONLY appears for parent/student accounts when mat.isVip === true and the account is NOT VIP.
          // Tutors and Admin accounts NEVER have locked overlays!
          const isLocked = !canManage && mat.isVip && !isVip;

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
                minHeight: '270px'
              }}
            >
              <div>
                {/* Type Badge & MỚI & Admin Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#475569'
                    }}>
                      {mat.typeBadge || 'Tài liệu'}
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

                    {mat.isVip && (
                      <span style={{
                        background: '#fef3c7',
                        color: '#b45309',
                        border: '1px solid #fde68a',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Crown size={11} /> VIP
                      </span>
                    )}
                  </div>

                  {/* Admin CRUD Actions: Edit & Delete */}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(mat)}
                        title="Chỉnh sửa tài liệu"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid #0f172a',
                          background: '#f8fafc',
                          color: '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingMaterial(mat)}
                        title="Xóa tài liệu"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid #ef4444',
                          background: '#fef2f2',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {mat.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {mat.description || mat.desc}
                </p>

                {/* Author & Stats */}
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '6px', fontWeight: 600 }}>
                  {mat.authorName || mat.author}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
                  <span>📅 {mat.date || '01/09/2026'}</span>
                  <span>⬇ {mat.downloads || mat.downloadsCount || 0} lượt tải</span>
                </div>
              </div>

              {/* Bottom Action */}
              {!isLocked ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: mat.isVip ? '#fef3c7' : '#e6fffa',
                      color: mat.isVip ? '#b45309' : '#059669',
                      border: `1px solid ${mat.isVip ? '#fde68a' : '#34d399'}`,
                      borderRadius: '999px',
                      padding: '2px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {canManage && mat.isVip 
                        ? 'Tài liệu VIP' 
                        : mat.isVip 
                          ? (isVip ? 'VIP · ĐÃ MỞ ✓' : 'VIP') 
                          : 'Miễn phí'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      {mat.subjectName || mat.subject}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadMaterial(mat)}
                    style={{
                      width: '100%',
                      background: mat.btnColor || (mat.isVip ? '#2563eb' : '#7c3aed'),
                      color: '#ffffff',
                      border: '2px solid #000000',
                      boxShadow: '3px 3px 0px #000000',
                      borderRadius: '10px',
                      padding: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} />
                    <span>{mat.btnText || 'Tải về'}</span>
                  </button>
                </div>
              ) : (
                /* Locked VIP Overlay Card for Students / Regular Parents */
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
                    onClick={() => {
                      if (!user && onRequireAuth) {
                        onRequireAuth('nâng cấp gói VIP để mở khóa toàn bộ tài liệu');
                        return;
                      }
                      setShowPaymentModal(true);
                    }}
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
                    Nâng cấp VIP ngay
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT MATERIAL (ADMIN & TUTOR) */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '6px 6px 0px #0f172a',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
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

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 18px 0' }}>
              {editingMaterial ? '✎ Chỉnh sửa tài liệu học tập' : '+ Thêm tài liệu học tập mới'}
            </h2>

            <form onSubmit={handleSaveMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tên tài liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công thức Toán THPT tổng hợp..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Tác giả / Người đăng
                  </label>
                  <input
                    type="text"
                    placeholder="Tên tác giả hoặc gia sư..."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Huy hiệu phụ (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: MỚI, HOT..."
                    value={newBadgeExtra}
                    onChange={(e) => setNewBadgeExtra(e.target.value)}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Mô tả tóm tắt nội dung
                </label>
                <textarea
                  rows={3}
                  placeholder="Tóm tắt những kiến thức chính, cấu trúc tài liệu..."
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

              {/* VIP Checkbox */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input
                  type="checkbox"
                  id="materialIsVip"
                  checked={newIsVip}
                  onChange={(e) => setNewIsVip(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: '#7c3aed',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="materialIsVip" style={{ cursor: 'pointer', flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Crown size={16} color="#d97706" />
                    Chỉ cho phép tài khoản Phụ huynh VIP truy cập (Tài liệu VIP)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Khi bật tùy chọn này, phụ huynh thông thường sẽ thấy tài liệu ở trạng thái Khóa và cần nâng cấp gói VIP để tải.
                  </div>
                </label>
              </div>

              {/* File Upload (Max 20MB) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Tệp đính kèm (PDF, DOCX, MP4, ZIP - Tối đa 20MB) {!editingMaterial && '*'}
                </label>
                <input
                  type="file"
                  required={!editingMaterial && !editingMaterial?.fileUrl}
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
                {editingMaterial && !newFile && editingMaterial.fileName && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                    Tệp hiện tại: <strong>{editingMaterial.fileName}</strong> ({editingMaterial.fileSize || 'Đã có'})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
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
                  disabled={isSaving}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    background: '#ff5f38',
                    color: '#fff',
                    fontWeight: 800,
                    boxShadow: '2px 2px 0px #0f172a',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? 'Đang lưu...' : (editingMaterial ? 'Lưu thay đổi' : 'Đăng tài liệu')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMaterial && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '6px 6px 0px #0f172a',
            textAlign: 'center'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>
              Xác nhận xóa tài liệu?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Bạn có chắc chắn muốn xóa tài liệu <strong>"{deletingMaterial.title}"</strong> không? Thao tác này không thể hoàn tác.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeletingMaterial(null)}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
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
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: '2px solid #0f172a',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 800,
                  boxShadow: '2px 2px 0px #0f172a',
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VietQR VIP Checkout Modal */}
      <VietQRCheckoutModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        initialPlan="yearly"
      />

    </div>
  );
}
