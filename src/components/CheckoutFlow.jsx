import React, { useState } from 'react';
import { 
  Check, 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  Hourglass, 
  Video, 
  Lock, 
  Star, 
  Copy, 
  CheckCheck, 
  ExternalLink,
  Tag,
  CreditCard
} from 'lucide-react';
import paymentService from '../services/paymentService';

export default function CheckoutFlow({ 
  tutor, 
  bookingDetails, 
  onBack, 
  onNavigate 
}) {
  // Step: 1 = 'Xem lại', 2 = 'Thanh toán', 3 = 'Xác nhận'
  const [step, setStep] = useState(1);

  // Tutor defaults matching Figma screenshots
  const currentTutor = tutor || {
    id: 1,
    fullName: 'Hoàng Thiên Ứng',
    school: 'Đại học bách khoa',
    title: 'TS. Nguyễn Thị Hoa', // for step 3 confirmation
    rating: 4.9,
    reviewsCount: 127,
    hourlyRate: 250000,
    subjects: ['Toán học', 'Vật lý', 'Tin học'],
    avatarUrl: null
  };

  // Booking details defaults
  const details = bookingDetails || {
    subject: 'Toán học',
    allSubjects: 'Toán học, Vật lý, Tin học',
    date: '2026-09-14',
    time: '9:00 SA',
    duration: '60 phút',
    format: 'Gọi video (Google Meet)',
    lessonPrice: 250000,
    bookingFeeRate: 0.05, // 5%
    meetLink: 'meet.google.com/abc-def-ghi'
  };

  // Payment method selection in Step 2: 'vnpay' | 'card' | 'paypal' | 'apple'
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [vnpayLoading, setVnpayLoading] = useState(false);
  const [vnpayError, setVnpayError] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Discount code
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Link Meet copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate pricing
  const lessonPrice = details.lessonPrice || 250000;
  const bookingFee = Math.round(lessonPrice * (details.bookingFeeRate || 0.05));
  const subtotal = lessonPrice + bookingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    if (discountCode.trim().toUpperCase() === 'TUTORA' || discountCode.trim().toUpperCase() === 'GIASU10') {
      const discount = Math.round(lessonPrice * 0.1); // 10% off
      setDiscountAmount(discount);
      setDiscountApplied(true);
    } else {
      alert('Mã giảm giá không hợp lệ. Bạn có thể thử mã "TUTORA" để được giảm 10%!');
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://${details.meetLink}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'vnpay') return true;
    if (paymentMethod === 'apple') return true;
    if (paymentMethod === 'paypal') return paypalEmail.includes('@');
    if (paymentMethod === 'card') return cardNumber.trim().length >= 12 && cardExpiry.trim() && cardCvv.trim();
    return true;
  };

  const handleVNPayPayment = async () => {
    try {
      setVnpayLoading(true);
      setVnpayError('');
      const res = await paymentService.createVNPayPayment({
        amount: finalTotal,
        orderInfo: `Thanh toan buoi hoc ${details.subject} voi gia su ${currentTutor.fullName || 'Tutora'}`,
        orderType: 'billpayment'
      });
      if (res && res.success && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setVnpayError(res?.message || 'Không thể tạo phiên thanh toán VNPay');
      }
    } catch (e) {
      setVnpayError(e.message || 'Lỗi kết nối máy chủ thanh toán');
    } finally {
      setVnpayLoading(false);
    }
  };

  const handleProcessPayment = () => {
    if (paymentMethod === 'vnpay') {
      handleVNPayPayment();
      return;
    }
    if (!isPaymentValid()) return;
    setStep(3);
  };

  return (
    <div className="figma-checkout-wrapper">
      {/* Playful Floating Geometric Shapes (Figma Design) */}
      <div className="figma-shape shape-yellow-circle" />
      <div className="figma-shape shape-peach-box" />
      <div className="figma-shape shape-pink-pill" />
      <div className="figma-shape shape-peach-wireframe" />
      <div className="figma-shape shape-lavender-diamond" />
      <div className="figma-shape shape-yellow-black-square" />
      <div className="figma-shape shape-mint-circle" />

      <div className="figma-checkout-container">
        {/* Breadcrumb back link */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button" 
            className="figma-back-link"
            onClick={() => {
              if (step === 2) setStep(1);
              else if (onBack) onBack();
              else if (onNavigate) onNavigate('tutors');
            }}
          >
            ← Quay lại hồ sơ
          </button>
        </div>

        {/* Page Title */}
        <h1 className="figma-checkout-title">
          Thanh Toán
        </h1>

        {/* Stepper Progress (Step 1, 2, 3) */}
        <div className="figma-stepper">
          {/* Step 1: Xem lại */}
          <div 
            className={`figma-step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
            onClick={() => { if (step > 1 && step < 3) setStep(1); }}
            style={{ cursor: step > 1 && step < 3 ? 'pointer' : 'default' }}
          >
            <div className="figma-step-circle">
              {step > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
            </div>
            <span className="figma-step-label">Xem lại</span>
          </div>

          <div className={`figma-step-connector ${step > 1 ? 'completed' : ''}`} />

          {/* Step 2: Thanh toán */}
          <div 
            className={`figma-step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
            onClick={() => { if (step === 1) setStep(2); }}
            style={{ cursor: step === 1 ? 'pointer' : 'default' }}
          >
            <div className="figma-step-circle">
              {step > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
            </div>
            <span className="figma-step-label">Thanh toán</span>
          </div>

          <div className={`figma-step-connector ${step > 2 ? 'completed' : ''}`} />

          {/* Step 3: Xác nhận */}
          <div className={`figma-step-item ${step === 3 ? 'active' : ''}`}>
            <div className="figma-step-circle">
              3
            </div>
            <span className="figma-step-label">Xác nhận</span>
          </div>
        </div>

        {/* ========================================================
            STEP 1 & STEP 2: 2-COLUMN LAYOUT
           ======================================================== */}
        {step < 3 && (
          <div className="figma-checkout-grid">
            {/* LEFT COLUMN: STEP CONTENT */}
            <div className="figma-main-card">
              {/* STEP 1: XEM LẠI BUỔI HỌC */}
              {step === 1 && (
                <div>
                  <h3 className="figma-card-heading">Xem lại buổi học</h3>

                  {/* Tutor Info Box */}
                  <div className="figma-tutor-box">
                    <div className="figma-tutor-avatar">
                      {/* Friendly illustrated avatar icon */}
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <rect width="42" height="42" rx="10" fill="#fef08a" />
                        <circle cx="21" cy="17" r="8" fill="#f59e0b" />
                        <path d="M10 35C10 29.5 15 26 21 26C27 26 32 29.5 32 35" fill="#f59e0b" />
                        <circle cx="18" cy="16" r="1.5" fill="#ffffff" />
                        <circle cx="24" cy="16" r="1.5" fill="#ffffff" />
                        <path d="M19 20C20 21 22 21 23 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="figma-tutor-name">{currentTutor.fullName}</div>
                      <div className="figma-tutor-sub">{currentTutor.school}</div>
                      <div className="figma-tutor-rating">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span><strong>{currentTutor.rating}</strong> ({currentTutor.reviewsCount} đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="figma-detail-list">
                    {/* Row 1: Môn học */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <BookOpen size={16} color="#64748b" />
                        <span>Môn học</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.allSubjects || currentTutor.subjects?.join(', ') || 'Toán học, Vật lý, Tin học'}
                      </div>
                    </div>

                    {/* Row 2: Ngày */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Calendar size={16} color="#64748b" />
                        <span>Ngày</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.date}
                      </div>
                    </div>

                    {/* Row 3: Giờ */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Clock size={16} color="#64748b" />
                        <span>Giờ</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.time}
                      </div>
                    </div>

                    {/* Row 4: Thời lượng */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Hourglass size={16} color="#64748b" />
                        <span>Thời lượng</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.duration}
                      </div>
                    </div>

                    {/* Row 5: Hình thức */}
                    <div className="figma-detail-row">
                      <div className="figma-detail-label">
                        <Video size={16} color="#64748b" />
                        <span>Hình thức</span>
                      </div>
                      <div className="figma-detail-value">
                        {details.format}
                      </div>
                    </div>
                  </div>

                  {/* Subject Tag */}
                  <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                    <span className="figma-subject-pill">
                      {details.subject || 'Toán học'}
                    </span>
                  </div>

                  {/* Continue Button */}
                  <button 
                    type="button" 
                    className="figma-btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục Thanh toán →
                  </button>
                </div>
              )}

              {/* STEP 2: PHƯƠNG THỨC THANH TOÁN */}
              {step === 2 && (
                <div>
                  <h3 className="figma-card-heading">Phương thức Thanh toán</h3>

                  {/* Segmented Payment Tabs */}
                  <div className="figma-payment-tabs">
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'vnpay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('vnpay')}
                    >
                      VNPay (ATM / QR)
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      Thẻ tín dụng
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      PayPal
                    </button>
                    <button
                      type="button"
                      className={`figma-payment-tab ${paymentMethod === 'apple' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('apple')}
                    >
                      Apple Pay
                    </button>
                  </div>

                  {/* Sub-view: VNPay */}
                  {paymentMethod === 'vnpay' && (
                    <div style={{ textAlign: 'center', padding: '24px 0 10px 0' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#eff6ff',
                        border: '2px solid #005baa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 14px'
                      }}>
                        <CreditCard size={32} color="#005baa" />
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                        Cổng thanh toán VNPay
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 16px', lineHeight: '1.5' }}>
                        Hỗ trợ VNPAY-QR, Thẻ ATM nội địa (NCB, Vietcombank, BIDV...), Thẻ Quốc tế Visa / Mastercard.
                      </div>

                      {vnpayError && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600 }}>
                          {vnpayError}
                        </div>
                      )}

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Mã hóa HMAC-SHA512 · Kết nối cổng VNPay Sandbox · Chuyển hướng bảo mật 100%
                      </div>

                      {/* VNPay Action Button */}
                      <button 
                        type="button" 
                        className="figma-btn-primary"
                        style={{
                          backgroundColor: '#005baa',
                          borderColor: '#005baa',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        disabled={vnpayLoading}
                        onClick={handleProcessPayment}
                      >
                        {vnpayLoading ? 'Đang kết nối cổng VNPay...' : `Thanh toán ${formatVND(finalTotal)} qua VNPay`}
                      </button>
                    </div>
                  )}

                  {/* Sub-view: Apple Pay (Figma Image 1) */}
                  {paymentMethod === 'apple' && (
                    <div style={{ textAlign: 'center', padding: '24px 0 10px 0' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                        Apple Pay
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                        Sử dụng Touch ID hoặc Face ID để xác thực
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* Apple Pay Green Action Button (Figma Image 1) */}
                      <button 
                        type="button" 
                        className="figma-btn-apple-green"
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}

                  {/* Sub-view: PayPal (Figma Image 2) */}
                  {paymentMethod === 'paypal' && (
                    <div style={{ padding: '12px 0 10px 0' }}>
                      <div className="figma-input-group">
                        <label className="figma-input-label">EMAIL PAYPAL</label>
                        <input 
                          type="email"
                          className="figma-text-input"
                          placeholder="email@cua.ban.com"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                        />
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                          Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán
                        </div>
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* PayPal Action Button */}
                      <button 
                        type="button" 
                        className={paypalEmail.trim() ? "figma-btn-primary" : "figma-btn-disabled"}
                        disabled={!paypalEmail.trim()}
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}

                  {/* Sub-view: Credit Card */}
                  {paymentMethod === 'card' && (
                    <div style={{ padding: '12px 0 10px 0' }}>
                      <div className="figma-input-group">
                        <label className="figma-input-label">SỐ THẺ TÍN DỤNG / GHI NỢ</label>
                        <input 
                          type="text"
                          className="figma-text-input"
                          placeholder="4532 •••• •••• 8921"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>

                      <div className="figma-input-group">
                        <label className="figma-input-label">HỌ VÀ TÊN CHỦ THẺ</label>
                        <input 
                          type="text"
                          className="figma-text-input"
                          placeholder="NGUYEN VAN A"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="figma-input-group">
                          <label className="figma-input-label">HẾT HẠN (MM/YY)</label>
                          <input 
                            type="text"
                            className="figma-text-input"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                        </div>

                        <div className="figma-input-group">
                          <label className="figma-input-label">MÃ CVV/CVC</label>
                          <input 
                            type="password"
                            className="figma-text-input"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Security Lock Note */}
                      <div className="figma-security-note">
                        <Lock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
                        Bảo mật bằng mã hóa SSL 256-bit · Tuân thủ PCI DSS · Không lưu trên máy chủ của chúng tôi
                      </div>

                      {/* Card Action Button */}
                      <button 
                        type="button" 
                        className={isPaymentValid() ? "figma-btn-primary" : "figma-btn-disabled"}
                        disabled={!isPaymentValid()}
                        onClick={handleProcessPayment}
                      >
                        Thanh toán {formatVND(finalTotal)}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: TÓM TẮT ĐƠN HÀNG (FIGMA EXACT DESIGN) */}
            <div className="figma-summary-card">
              <h3 className="figma-summary-heading">Tóm tắt đơn hàng</h3>

              <div className="figma-summary-line">
                <span className="figma-summary-label">Buổi học 60 phút</span>
                <span className="figma-summary-val">{formatVND(lessonPrice)}</span>
              </div>

              <div className="figma-summary-line">
                <span className="figma-summary-label">Phí đặt lịch (5%)</span>
                <span className="figma-summary-val">{formatVND(bookingFee)}</span>
              </div>

              {discountApplied && (
                <div className="figma-summary-line" style={{ color: '#059669' }}>
                  <span className="figma-summary-label">Khuyến mãi ({discountCode.toUpperCase()})</span>
                  <span className="figma-summary-val">-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="figma-summary-divider" />

              <div className="figma-summary-total">
                <span>Tổng cộng</span>
                <span>{formatVND(finalTotal)}</span>
              </div>

              {/* Cancellation policy green box (Figma design) */}
              <div className="figma-cancel-box">
                <strong>Hủy miễn phí</strong> trước 24 giờ so với giờ học. Sau thời điểm đó, phí hủy là 50%.
              </div>

              {/* Discount code link / expander */}
              <div style={{ marginTop: '16px' }}>
                {!showDiscountInput ? (
                  <button 
                    type="button"
                    className="figma-discount-link"
                    onClick={() => setShowDiscountInput(true)}
                  >
                    + Nhập mã giảm giá
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input 
                      type="text" 
                      className="figma-text-input" 
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      placeholder="Mã giảm giá (ví dụ: TUTORA)" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="figma-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto' }}
                      onClick={handleApplyDiscount}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: ĐẶT LỊCH THÀNH CÔNG! (FIGMA IMAGE 4 EXACT DESIGN)
           ======================================================== */}
        {step === 3 && (
          <div className="figma-success-card">
            {/* Party popper */}
            <div className="figma-success-icon">
              🎉
            </div>

            {/* Title */}
            <h2 className="figma-success-title">
              Đặt lịch thành công!
            </h2>

            {/* Subtitle */}
            <p className="figma-success-subtitle">
              Buổi học với <strong>{currentTutor.title || currentTutor.fullName}</strong> vào ngày <strong>{details.date}</strong> lúc <strong>{details.time}</strong> đã được xác nhận.
            </p>

            {/* Confirmation Box (Cyan background with border) */}
            <div className="figma-success-box">
              <div className="figma-success-row">
                <span className="figma-success-box-label">Buổi học</span>
                <span className="figma-success-box-val"><strong>{details.subject || 'Toán học'} · 60 phút</strong></span>
              </div>

              <div className="figma-success-row">
                <span className="figma-success-box-label">Link Meet</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a 
                    href={`https://${details.meetLink}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="figma-meet-link"
                  >
                    {details.meetLink}
                  </a>
                  <button 
                    type="button" 
                    onClick={handleCopyLink}
                    title="Sao chép link Meet"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: 0 }}
                  >
                    {copiedLink ? <CheckCheck size={16} color="#059669" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="figma-success-row">
                <span className="figma-success-box-label">Đã thanh toán</span>
                <span className="figma-success-box-val figma-paid-amount">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Email note */}
            <p className="figma-success-note">
              Email xác nhận đã được gửi đến tài khoản của bạn. Bạn có thể hủy miễn phí trước 24 giờ.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button"
                className="figma-btn-primary"
                onClick={() => onNavigate ? onNavigate('classes') : (window.location.href = '/')}
              >
                Xem bảng điều khiển
              </button>

              <button 
                type="button"
                className="figma-btn-outline"
                onClick={() => onNavigate ? onNavigate('tutors') : setStep(1)}
              >
                Tìm gia sư khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
