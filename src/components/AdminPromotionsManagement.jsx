import React, { useState, useEffect } from 'react';
import { 
  TicketPercent, 
  Plus, 
  Search, 
  RefreshCw, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Gift, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle,
  Users,
  Percent,
  Sparkles,
  Share2
} from 'lucide-react';
import voucherService from '../services/voucherService';
import userService from '../services/userService';

const formatVND = (value) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminPromotionsManagement() {
  const [vouchers, setVouchers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, ACTIVE, INACTIVE, EXPIRED
  const [copiedCode, setCopiedCode] = useState(null);

  // Create Voucher Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE', // PERCENTAGE or FIXED_AMOUNT
    discountValue: 15,
    maxDiscount: 50000,
    minOrderAmount: 0,
    usageLimit: '',
    maxClaimsPerUser: 1,
    startsAt: new Date().toISOString().slice(0, 10),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    active: true,
    shareable: true,
    autoIssueOnPayment: false
  });

  // Direct Issue Modal state
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedVoucherForIssue, setSelectedVoucherForIssue] = useState(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueError, setIssueError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [vouchersRes, usersRes] = await Promise.allSettled([
        voucherService.getAllVouchersForAdmin(),
        userService.getAllUsersForAdmin()
      ]);

      if (vouchersRes.status === 'fulfilled' && vouchersRes.value?.success) {
        setVouchers(vouchersRes.value.data || []);
      } else if (vouchersRes.status === 'rejected') {
        setError(vouchersRes.reason?.response?.data?.message || 'Không thể tải danh sách voucher.');
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
        setUsersList(usersRes.value.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu khuyến mãi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (voucher) => {
    try {
      setError('');
      const res = await voucherService.toggleVoucherStatus(voucher.id);
      if (res?.success) {
        setSuccessMessage(`Đã ${voucher.active ? 'tạm dừng' : 'kích hoạt'} voucher ${voucher.code}.`);
        setTimeout(() => setSuccessMessage(''), 4000);
        await loadData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật trạng thái voucher.');
    }
  };

  const handleDelete = async (voucher) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa/vô hiệu hóa voucher "${voucher.code}"?`)) {
      return;
    }
    try {
      setError('');
      await voucherService.deleteVoucher(voucher.id);
      setSuccessMessage(`Đã xóa/vô hiệu hóa voucher ${voucher.code}.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa voucher.');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanCode = formData.code.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Vui lòng nhập mã voucher.');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên chương trình khuyến mãi.');
      return;
    }
    if (Number(formData.discountValue) <= 0) {
      setFormError('Giá trị giảm giá phải lớn hơn 0.');
      return;
    }
    if (formData.discountType === 'PERCENTAGE' && Number(formData.discountValue) > 100) {
      setFormError('Giảm giá phần trăm không thể vượt quá 100%.');
      return;
    }
    if (formData.startsAt && formData.expiresAt && formData.expiresAt < formData.startsAt) {
      setFormError('Ngày hết hạn phải diễn ra sau ngày bắt đầu.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        code: cleanCode,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: formData.discountType === 'PERCENTAGE' && formData.maxDiscount ? Number(formData.maxDiscount) : null,
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        maxClaimsPerUser: formData.maxClaimsPerUser ? parseInt(formData.maxClaimsPerUser, 10) : 1,
        startsAt: formData.startsAt ? `${formData.startsAt}T00:00:00` : null,
        expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59` : null,
        active: Boolean(formData.active),
        shareable: Boolean(formData.shareable),
        autoIssueOnPayment: Boolean(formData.autoIssueOnPayment)
      };

      const res = await voucherService.createVoucher(payload);
      if (res?.success) {
        setSuccessMessage(`Đã tạo thành công voucher khuyến mãi "${cleanCode}".`);
        setTimeout(() => setSuccessMessage(''), 4000);
        setCreateModalOpen(false);
        // Reset form
        setFormData({
          code: '',
          name: '',
          description: '',
          discountType: 'PERCENTAGE',
          discountValue: 15,
          maxDiscount: 50000,
          minOrderAmount: 0,
          usageLimit: '',
          maxClaimsPerUser: 1,
          startsAt: new Date().toISOString().slice(0, 10),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          active: true,
          shareable: true,
          autoIssueOnPayment: false
        });
        await loadData();
      } else {
        setFormError(res?.message || 'Không thể tạo voucher.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Không thể tạo voucher.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!targetUserId) {
      setIssueError('Vui lòng chọn người dùng nhận voucher.');
      return;
    }
    try {
      setIssueLoading(true);
      setIssueError('');
      const res = await voucherService.issueVoucherToUser(targetUserId, selectedVoucherForIssue.code);
      if (res?.success) {
        setSuccessMessage(`Đã phát voucher ${selectedVoucherForIssue.code} cho người dùng thành công.`);
        setTimeout(() => setSuccessMessage(''), 4000);
        setIssueModalOpen(false);
        setSelectedVoucherForIssue(null);
        setTargetUserId('');
        await loadData();
      } else {
        setIssueError(res?.message || 'Không thể phát voucher.');
      }
    } catch (err) {
      setIssueError(err.response?.data?.message || 'Không thể phát voucher cho người dùng này.');
    } finally {
      setIssueLoading(false);
    }
  };

  // Quick preset helper
  const applyPreset = (preset) => {
    if (preset === 'PERCENT_20') {
      setFormData(prev => ({
        ...prev,
        code: `GIAM20_${Math.floor(Math.random() * 900 + 100)}`,
        name: 'Ưu đãi kết nối giảm 20%',
        description: 'Giảm 20% phí kết nối gia sư ban đầu.',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscount: 50000,
        minOrderAmount: 5000,
        shareable: true,
        autoIssueOnPayment: false
      }));
    } else if (preset === 'FIXED_50K') {
      setFormData(prev => ({
        ...prev,
        code: `TRIAN50K_${Math.floor(Math.random() * 900 + 100)}`,
        name: 'Voucher tri ân 50.000đ',
        description: 'Giảm ngay 50.000đ học phí buổi đầu tiên.',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50000,
        maxDiscount: '',
        minOrderAmount: 100000,
        shareable: true,
        autoIssueOnPayment: false
      }));
    } else if (preset === 'PAYMENT_THANKYOU') {
      setFormData(prev => ({
        ...prev,
        code: `THANKYOU_${Math.floor(Math.random() * 900 + 100)}`,
        name: 'Voucher cảm ơn sau thanh toán',
        description: 'Tự động gửi tặng học viên sau khi thanh toán phí kết nối thành công.',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        maxDiscount: 20000,
        minOrderAmount: 5000,
        shareable: true,
        autoIssueOnPayment: true
      }));
    }
  };

  // Helper check status
  const getVoucherStatus = (v) => {
    if (!v.active) return { label: 'Tạm dừng', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' };
    if (v.expiresAt && new Date(v.expiresAt) < new Date()) {
      return { label: 'Hết hạn', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
    }
    if (v.usageLimit && v.claimedCount >= v.usageLimit) {
      return { label: 'Hết lượt', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' };
    }
    return { label: 'Đang chạy', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
  };

  // Filtered list
  const filteredVouchers = vouchers.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || (v.code || '').toLowerCase().includes(q) || (v.name || '').toLowerCase().includes(q);
    if (!matchQuery) return false;

    const st = getVoucherStatus(v).label;
    if (filterStatus === 'ACTIVE') return st === 'Đang chạy';
    if (filterStatus === 'INACTIVE') return st === 'Tạm dừng';
    if (filterStatus === 'EXPIRED') return st === 'Hết hạn' || st === 'Hết lượt';
    return true;
  });

  // Metrics
  const totalCount = vouchers.length;
  const activeCount = vouchers.filter(v => getVoucherStatus(v).label === 'Đang chạy').length;
  const autoIssueCount = vouchers.filter(v => v.autoIssueOnPayment).length;
  const totalClaimed = vouchers.reduce((acc, v) => acc + (v.claimedCount || 0), 0);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Sparkles size={16} /> Cổng Quản Trị Khuyến Mãi
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', fontFamily: 'serif' }}>
            Quản Lý & Tạo Chương Trình Khuyến Mãi
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
            Tạo voucher giảm giá, cấu hình tự động tặng sau thanh toán, quản lý lượt dùng và phát trực tiếp cho người dùng.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '2px solid #0f172a',
              background: '#ffffff',
              boxShadow: '2px 2px 0px #0f172a',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              border: '2px solid #0f172a',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              boxShadow: '3px 3px 0px #0f172a',
              fontWeight: 900,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Tạo Khuyến Mãi Mới
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div style={{
          background: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          color: '#065f46',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} /> {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          color: '#991b1b',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Tổng số Voucher
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            Toàn bộ chiến dịch khuyến mãi
          </div>
        </div>

        <div style={{
          backgroundColor: '#ecfdf5',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
            Đang hoạt động
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#065f46', marginTop: '4px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '4px' }}>
            Sẵn sàng áp dụng khi thanh toán
          </div>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
            Lượt nhận / Sử dụng
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#92400e', marginTop: '4px' }}>
            {totalClaimed}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '4px' }}>
            Học viên đã claim vào tài khoản
          </div>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #0f172a',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: '3px 3px 0px #0f172a'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
            Tự tặng sau thanh toán
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e40af', marginTop: '4px' }}>
            {autoIssueCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1d4ed8', marginTop: '4px' }}>
            Chiến dịch tặng voucher tự động
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #0f172a',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '2px 2px 0px #0f172a',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 14px 0 42px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'ACTIVE', label: 'Đang chạy' },
            { id: 'INACTIVE', label: 'Đã tạm dừng' },
            { id: 'EXPIRED', label: 'Hết hạn / Hết lượt' }
          ].map((item) => {
            const isSel = filterStatus === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterStatus(item.id)}
                style={{
                  border: '1.5px solid #0f172a',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? 800 : 600,
                  backgroundColor: isSel ? '#0f172a' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vouchers List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Đang tải danh sách khuyến mãi...
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '16px',
          color: '#64748b'
        }}>
          <TicketPercent size={40} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Không tìm thấy khuyến mãi nào
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>
            Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút "Tạo Khuyến Mãi Mới" để thiết lập mã ưu đãi đầu tiên.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredVouchers.map((voucher) => {
            const statusInfo = getVoucherStatus(voucher);
            const isPercentage = voucher.discountType === 'PERCENTAGE';
            const progress = voucher.usageLimit ? Math.min(100, (voucher.claimedCount / voucher.usageLimit) * 100) : null;

            return (
              <div
                key={voucher.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '18px',
                  padding: '22px',
                  boxShadow: '3px 3px 0px #0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top line: Status Badge & Auto Issue badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      border: `1.5px solid ${statusInfo.border}`,
                      borderRadius: '999px',
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusInfo.color }} />
                      {statusInfo.label}
                    </span>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {voucher.autoIssueOnPayment && (
                        <span style={{
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '999px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          Tự tặng sau TT
                        </span>
                      )}
                      {voucher.shareable && (
                        <span style={{
                          backgroundColor: '#f3e8ff',
                          color: '#7c3aed',
                          border: '1px solid #ddd6fe',
                          borderRadius: '999px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          Có thể chia sẻ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Voucher Code Box */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    border: '1.5px dashed #0f172a',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    marginBottom: '14px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Mã khuyến mãi
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '0.04em' }}>
                        {voucher.code}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(voucher.code)}
                      title="Sao chép mã voucher"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #0f172a',
                        background: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedCode === voucher.code ? <><Check size={14} color="#10b981" /> Đã sao chép</> : <><Copy size={14} /> Sao chép</>}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {voucher.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                    {voucher.description || 'Ưu đãi dành cho phụ huynh và học viên.'}
                  </p>

                  {/* Discount Details */}
                  <div style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #f3e8ff',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Mức giảm:</span>
                      <strong style={{ color: '#7c3aed', fontWeight: 900 }}>
                        {isPercentage ? `${voucher.discountValue}%` : formatVND(voucher.discountValue)}
                        {isPercentage && voucher.maxDiscount && ` (Tối đa ${formatVND(voucher.maxDiscount)})`}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Đơn tối thiểu:</span>
                      <strong>{voucher.minOrderAmount > 0 ? formatVND(voucher.minOrderAmount) : 'Không yêu cầu'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b' }}>Lượt/người:</span>
                      <strong>{voucher.maxClaimsPerUser || 1} lần</strong>
                    </div>
                  </div>

                  {/* Progress & Usage */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>Đã nhận: <b>{voucher.claimedCount || 0}</b></span>
                      <span>Giới hạn: <b>{voucher.usageLimit ? `${voucher.usageLimit} lượt` : 'Vô hạn'}</b></span>
                    </div>
                    {progress !== null && (
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: progress >= 90 ? '#ef4444' : '#7c3aed',
                          borderRadius: '999px'
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <Clock size={14} />
                    <span>
                      {voucher.startsAt ? new Date(voucher.startsAt).toLocaleDateString('vi-VN') : 'Bắt đầu ngay'}
                      {' - '}
                      {voucher.expiresAt ? new Date(voucher.expiresAt).toLocaleDateString('vi-VN') : 'Không hết hạn'}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '14px',
                  borderTop: '1.5px solid #f1f5f9',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {/* Toggle Active button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(voucher)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #0f172a',
                      background: voucher.active ? '#ffffff' : '#f8fafc',
                      color: voucher.active ? '#0f172a' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {voucher.active ? <ToggleRight size={18} color="#10b981" /> : <ToggleLeft size={18} color="#64748b" />}
                    {voucher.active ? 'Tắt' : 'Bật'}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {/* Direct Issue button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoucherForIssue(voucher);
                        setTargetUserId('');
                        setIssueError('');
                        setIssueModalOpen(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #0f172a',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                      title="Phát trực tiếp cho học viên"
                    >
                      <Send size={14} /> Phát voucher
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(voucher)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #ef4444',
                        background: '#ffffff',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                      title="Xóa voucher"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: TẠO KHUYẾN MÃI MỚI */}
      {createModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '24px',
            boxShadow: '8px 8px 0px #0f172a',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>
                  Thiết Lập Chiến Dịch
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0', fontFamily: 'serif' }}>
                  Tạo Khuyến Mãi Mới
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                ✕
              </button>
            </div>

            {/* Presets Quick Select */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
                GỢI Ý MẪU KHUYẾN MÃI NHANH:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('PERCENT_20')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #7c3aed',
                    background: '#f3e8ff',
                    color: '#7c3aed',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Giảm 20% phí kết nối
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('FIXED_50K')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ea580c',
                    background: '#fff7ed',
                    color: '#c2410c',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Giảm 50.000đ trực tiếp
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('PAYMENT_THANKYOU')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #0284c7',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Tặng sau thanh toán
                </button>
              </div>
            </div>

            {formError && (
              <div style={{
                background: '#fef2f2',
                border: '1.5px solid #fecaca',
                color: '#991b1b',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '0.88rem',
                fontWeight: 700
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gap: '16px' }}>
              {/* Row 1: Code & Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    MÃ VOUCHER * (Viết hoa, không dấu)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: GIASU2026, SUMMER50"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#7c3aed',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    TÊN CHƯƠNG TRÌNH *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Ưu đãi tân học viên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  MÔ TẢ CHI TIẾT
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả quyền lợi và điều kiện áp dụng cho học viên..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Row 2: Discount Type & Discount Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    HÌNH THỨC GIẢM GIÁ *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="PERCENTAGE">Theo phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    {formData.discountType === 'PERCENTAGE' ? 'MỨC GIẢM (%) *' : 'SỐ TIỀN GIẢM (VNĐ) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discountType === 'PERCENTAGE' ? '100' : '10000000'}
                    placeholder={formData.discountType === 'PERCENTAGE' ? 'VD: 20' : 'VD: 50000'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #0f172a',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Max Discount & Min Order Amount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    GIẢM TỐI ĐA (VNĐ) {formData.discountType !== 'PERCENTAGE' && '(Không áp dụng)'}
                  </label>
                  <input
                    type="number"
                    disabled={formData.discountType !== 'PERCENTAGE'}
                    placeholder="VD: 50000 (để trống = không giới hạn)"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: formData.discountType !== 'PERCENTAGE' ? '#f1f5f9' : '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    ĐƠN TỐI THIỂU (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="VD: 5000 (mặc định 0đ)"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Usage Limit & Claims Per User */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    GIỚI HẠN LƯỢT DÙNG TOÀN HỆ THỐNG
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Để trống = Không giới hạn"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    LƯỢT NHẬN TỐI ĐA / MỖI NGƯỜI
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Mặc định: 1"
                    value={formData.maxClaimsPerUser}
                    onChange={(e) => setFormData({ ...formData, maxClaimsPerUser: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 5: Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    NGÀY BẮT ĐẦU
                  </label>
                  <input
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    NGÀY HẾT HẠN
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'grid', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.shareable}
                    onChange={(e) => setFormData({ ...formData, shareable: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
                  />
                  <span>Cho phép người dùng tạo link chia sẻ voucher này cho bạn bè</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.autoIssueOnPayment}
                    onChange={(e) => setFormData({ ...formData, autoIssueOnPayment: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
                  />
                  <span>Tự động gửi tặng voucher này cho học viên sau khi thanh toán phí kết nối</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }}
                  />
                  <span>Kích hoạt áp dụng ngay lập tức</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    background: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    boxShadow: '2px 2px 0px #0f172a',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {submitting ? 'Đang tạo...' : 'Lưu & Phát Hành Khuyến Mãi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PHÁT VOUCHER CHO NGƯỜI DÙNG */}
      {issueModalOpen && selectedVoucherForIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '2.5px solid #0f172a',
            borderRadius: '24px',
            boxShadow: '6px 6px 0px #0f172a',
            maxWidth: '500px',
            width: '100%',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                  Phát Trực Tiếp
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>
                  Tặng Voucher Cho Học Viên
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1.5px solid #0f172a',
                  borderRadius: '10px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Voucher sẽ được tặng:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7c3aed' }}>
                {selectedVoucherForIssue.code} - {selectedVoucherForIssue.name}
              </div>
            </div>

            {issueError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '16px'
              }}>
                {issueError}
              </div>
            )}

            <form onSubmit={handleIssueSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  CHỌN NGƯỜI DÙNG NHẬN VOUCHER *
                </label>
                <select
                  required
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="">-- Chọn tài khoản người dùng --</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      ID {u.id}: {u.fullName || u.email} ({u.email}) - {u.role === 'PARENT' ? 'Phụ huynh' : u.role === 'TUTOR' ? 'Gia sư' : 'Admin'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #0f172a',
                    background: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={issueLoading}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: '2px solid #0f172a',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    boxShadow: '2px 2px 0px #0f172a',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} /> {issueLoading ? 'Đang gửi...' : 'Phát Voucher Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
