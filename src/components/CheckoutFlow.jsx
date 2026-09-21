import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  ExternalLink, 
  Tag, 
  CreditCard,
  QrCode,
  AlertTriangle,
  RefreshCw,
  Phone,
  MessageSquare
} from 'lucide-react';
import paymentService from '../services/paymentService';
import { classService } from '../services/classService';

export default function CheckoutFlow({ 
  tutor, 
  bookingDetails, 
  user,
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
    avatarUrl: null,
    phone: '0901 234 567',
    facebookUrl: 'https://facebook.com/giasu.nguyenthihoa',
    email: 'tutor.nguyen@giasuhq.com'
  };

  const tutorPhone = currentTutor.phone || '0901 234 567';
  const tutorPhoneClean = tutorPhone.replace(/[^0-9]/g, '');
  const tutorFacebook = currentTutor.facebookUrl || `https://facebook.com/giasu.${(currentTutor.fullName || 'tutor').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const tutorEmail = currentTutor.email || 'tutor.nguyen@giasuhq.com';

  const [copiedTutorPhone, setCopiedTutorPhone] = useState(false);
  const [copiedTutorFacebook, setCopiedTutorFacebook] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(tutorPhone);
    setCopiedTutorPhone(true);
    setTimeout(() => setCopiedTutorPhone(false), 2000);
  };

  const handleCopyFacebook = () => {
    navigator.clipboard?.writeText(tutorFacebook);
    setCopiedTutorFacebook(true);
    setTimeout(() => setCopiedTutorFacebook(false), 2000);
  };

  // Booking details from parent or fallbacks
  const details = bookingDetails || {
    subject: 'Toán học',
    allSubjects: 'Toán học, Vật lý, Tin học',
    date: '2026-09-14',
    time: '10:00 SA',
    duration: '60 phút',
    format: 'Gọi video (Google Meet)',
    lessonPrice: 250000,
    bookingFeeRate: 0.05, // 5%
    meetLink: 'meet.google.com/abc-def-ghi'
  };

  // Payment method selection in Step 2: 'vietqr' | 'card' | 'paypal' | 'apple'
  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [bookingOrderCode, setBookingOrderCode] = useState(() => 'TUTORA' + Math.floor(100000 + Math.random() * 900000));
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleRegenerateQR = () => {
    setBookingOrderCode('TUTORA' + Math.floor(100000 + Math.random() * 900000));
    setTimeLeft(600);
  };

  // MB Bank Config
  const BANK_CONFIG = {
    bankId: 'MB',
    bankName: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '0913511637',
    accountName: 'PHAM GIA PHONG'
  };

  // Discount code
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Link Meet copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate pricing
  // Phí kết nối nền tảng: Cố định 5.000đ trong giai đoạn thử nghiệm
  const CONNECTION_FEE = 5000;
  const tutorReferencePrice = details.lessonPrice || currentTutor.hourlyRate || 250000;
  const bookingFee = CONNECTION_FEE;
  const finalTotal = Math.max(0, CONNECTION_FEE - discountAmount);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  const [createdClassInfo, setCreatedClassInfo] = useState(null);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const buildBookingPayload = () => ({
    className: `Lớp ${details.subject || 'Toán học'} - ${currentTutor.fullName}`,
    subjectId: details.subjectId || 1,
    subjectName: details.subject || 'Toán học',
    tutorId: currentTutor.id || 1,
    tutorName: currentTutor.fullName,
    studentId: user?.id,
    studentName: user?.fullName,
    studentEmail: user?.email,
    scheduleDescription: `${details.date} lúc ${details.time}`,
    date: details.date,
    time: details.time,
    amount: finalTotal,
    orderCode: bookingOrderCode,
    paymentMethod: paymentMethod
  });

  const registerPendingBooking = async () => {
    try {
      const payload = buildBookingPayload();
      await paymentService.registerPendingBooking(payload);
    } catch (err) {
      console.warn('Không thể lưu booking chờ thanh toán:', err);
    }
  };

  const confirmBookingInDatabase = async (createdBookingData = null) => {
    if (isCreatingClass || createdClassInfo) return;
    setIsCreatingClass(true);
    try {
      const payload = buildBookingPayload();
      
      // If the class was already created via SePay webhook (createdBookingData has an id),
      // skip creating again.
      if (createdBookingData && createdBookingData.id) {
        setCreatedClassInfo(createdBookingData);
      } else {
        // Actually call the backend API to create the class
        try {
          const createPayload = {
            className: payload.className,
            subjectId: payload.subjectId,
            subjectName: payload.subjectName,
            tutorId: payload.tutorId,
            tutorName: payload.tutorName,
            studentName: payload.studentName,
            studentId: payload.studentId,
            studentEmail: payload.studentEmail,
            scheduleDescription: payload.scheduleDescription,
            date: payload.date,
            time: payload.time,
            amount: payload.amount,
            orderCode: payload.orderCode,
            paymentMethod: payload.paymentMethod
          };
          const res = await classService.createClass(createPayload);
          if (res && res.data) {
            setCreatedClassInfo(res.data);
          } else {
            // Fallback to local data if API returns unexpected format
            setCreatedClassInfo({
              id: res?.id || null,
              className: payload.className,
              subjectName: payload.subjectName,
              tutorName: payload.tutorName,
              scheduleDescription: payload.scheduleDescription,
              status: 'PENDING_TUTOR_APPROVAL'
            });
          }
        } catch (apiErr) {
          console.warn('classService.createClass failed, trying registerPendingBooking fallback:', apiErr);
          // Fallback: register through payment service (permitAll endpoint)
          try {
            await paymentService.registerPendingBooking(payload);
            setCreatedClassInfo({
              id: null,
              className: payload.className,
              subjectName: payload.subjectName,
              tutorName: payload.tutorName,
              scheduleDescription: payload.scheduleDescription,
              status: 'PENDING_TUTOR_APPROVAL'
            });
          } catch (fallbackErr) {
            console.warn('Fallback registerPendingBooking also failed:', fallbackErr);
            setCreatedClassInfo({
              id: null,
              className: payload.className,
              subjectName: payload.subjectName,
              tutorName: payload.tutorName,
              scheduleDescription: payload.scheduleDescription,
              status: 'PENDING_TUTOR_APPROVAL'
            });
          }
        }
      }
    } catch (err) {
      console.warn('Lưu lớp học vào database gặp cảnh báo:', err);
    } finally {
      setIsCreatingClass(false);
      setStep(3);
    }
  };

  // Polling check SePay webhook status for booking
  useEffect(() => {
    if (step !== 2 || paymentMethod !== 'vietqr') return;

    registerPendingBooking();

    const interval = setInterval(async () => {
      try {
        const res = await paymentService.checkSepayStatus(bookingOrderCode);
        if (res && res.data && res.data.paid) {
          clearInterval(interval);
          confirmBookingInDatabase({
            id: res.data.classId || null,
            className: `Lớp ${details.subject || 'Toán học'} - ${currentTutor.fullName}`,
            subjectName: details.subject || 'Toán học',
            tutorName: currentTutor.fullName,
            scheduleDescription: `${details.date} lúc ${details.time}`,
            status: 'PENDING_TUTOR_APPROVAL'
          });
        }
      } catch (e) {
        // silent
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [step, paymentMethod, bookingOrderCode]);

  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
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
    if (paymentMethod === 'vietqr') return true;
    if (paymentMethod === 'apple') return true;
    if (paymentMethod === 'paypal') return paypalEmail.includes('@');
    if (paymentMethod === 'card') return cardNumber.trim().length >= 12 && cardExpiry.trim() && cardCvv.trim();
    return true;
  };

  const handleCheckBookingPayment = async () => {
    try {
      const res = await paymentService.checkSepayStatus(bookingOrderCode);
      if (res && res.data && res.data.paid) {
        confirmBookingInDatabase({
          id: res.data.classId || null,
          className: `Lớp ${details.subject || 'Toán học'} - ${currentTutor.fullName}`,
          subjectName: details.subject || 'Toán học',
          tutorName: currentTutor.fullName,
          scheduleDescription: `${details.date} lúc ${details.time}`,
          status: 'PENDING_TUTOR_APPROVAL'
        });
      } else {
        alert('Hệ thống đang chờ ngân hàng xác nhận giao dịch. Vui lòng chuyển khoản đúng nội dung và chờ giây lát.');
      }
    } catch (e) {
      alert('Chưa nhận được giao dịch. Vui lòng quét mã QR chuyển tiền đúng cú pháp.');
    }
  };

  const handleProcessPayment = () => {
    if (paymentMethod === 'vietqr') {
      handleCheckBookingPayment();
      return;
    }
    if (!isPaymentValid()) return;
    confirmBookingInDatabase();
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
                      className={`figma-payment-tab ${paymentMethod === 'vietqr' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('vietqr')}
                    >
                      VietQR MB Bank
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

                  {/* Sub-view: VietQR MB Bank */}
                  {paymentMethod === 'vietqr' && (
                    <div style={{ padding: '16px 0 10px 0' }}>
                      {timeLeft <= 0 ? (
                        /* TIMEOUT EXPIRED NOTIFICATION */
                        <div style={{
                          background: '#fff1f2',
                          border: '2px solid #e11d48',
                          borderRadius: '18px',
                          padding: '24px 20px',
                          textAlign: 'center',
                          marginBottom: '16px',
                          boxShadow: '3px 3px 0px #0f172a'
                        }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#ffe4e6',
                            color: '#e11d48',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px auto'
                          }}>
                            <AlertTriangle size={28} />
                          </div>

                          <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 900, color: '#9f1239' }}>
                            Mã QR thanh toán đã hết hạn!
                          </h4>

                          <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', color: '#881337', lineHeight: 1.5 }}>
                            Phiên thanh toán học phí (Mã: <b>{bookingOrderCode}</b>) đã kết thúc sau 10 phút để đảm bảo an toàn.
                            <br />
                            • <b>Nếu bạn đã chuyển khoản:</b> Vui lòng bấm <i>"Kiểm tra lại giao dịch"</i> hoặc lưu lại biên lai ngân hàng để hệ thống đối soát.
                            <br />
                            • <b>Nếu bạn chưa chuyển:</b> Bấm <i>"Tạo mã QR mới"</i> để gia hạn thêm 10 phút.
                          </p>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={handleRegenerateQR}
                              style={{
                                background: '#7c3aed',
                                color: '#ffffff',
                                border: '2px solid #0f172a',
                                boxShadow: '2px 2px 0px #0f172a',
                                borderRadius: '10px',
                                padding: '10px 18px',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <RefreshCw size={16} /> Tạo mã QR mới (Gia hạn 10 phút)
                            </button>

                            <button
                              type="button"
                              onClick={handleCheckBookingPayment}
                              style={{
                                background: '#ffffff',
                                color: '#0f172a',
                                border: '2px solid #0f172a',
                                boxShadow: '2px 2px 0px #0f172a',
                                borderRadius: '10px',
                                padding: '10px 18px',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                cursor: 'pointer'
                              }}
                            >
                              Kiểm tra lại giao dịch
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '170px 1fr',
                            gap: '18px',
                            background: '#f8fafc',
                            border: '1.5px solid #0f172a',
                            borderRadius: '18px',
                            padding: '16px',
                            marginBottom: '16px',
                            alignItems: 'center'
                          }}>
                            {/* QR Image */}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{
                                background: '#ffffff',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '6px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                              }}>
                                <img 
                                  src={`https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${finalTotal}&addInfo=${bookingOrderCode}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`} 
                                  alt="VietQR MB Bank" 
                                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
                                />
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                color: '#64748b',
                                marginTop: '6px',
                                fontWeight: 700
                              }}>
                                <Clock size={12} /> Hết hạn: <span style={{ color: '#ef4444' }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                              </div>
                            </div>

                            {/* Transfer Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Ngân hàng thụ hưởng
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#005baa' }}>
                                  MB Bank · Quân Đội
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Số tài khoản
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>
                                    {BANK_CONFIG.accountNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(BANK_CONFIG.accountNumber, 'acc')}
                                    style={{
                                      background: '#eff6ff',
                                      border: '1px solid #bfdbfe',
                                      borderRadius: '6px',
                                      padding: '2px 6px',
                                      cursor: 'pointer',
                                      color: '#1d4ed8',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'acc' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'acc' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Chủ tài khoản
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                                  {BANK_CONFIG.accountName}
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                                  Số tiền thanh toán
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#059669' }}>
                                    {formatVND(finalTotal)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(finalTotal.toString(), 'amount')}
                                    style={{
                                      background: '#ecfdf5',
                                      border: '1px solid #a7f3d0',
                                      borderRadius: '6px',
                                      padding: '2px 6px',
                                      cursor: 'pointer',
                                      color: '#047857',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'amount' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'amount' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>

                              <div style={{
                                background: '#fffbeb',
                                border: '1px solid #fde68a',
                                borderRadius: '8px',
                                padding: '6px 8px'
                              }}>
                                <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 800, textTransform: 'uppercase' }}>
                                  Nội dung chuyển khoản (bắt buộc)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                  <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#b45309', fontFamily: 'monospace' }}>
                                    {bookingOrderCode}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(bookingOrderCode, 'content')}
                                    style={{
                                      background: '#fef3c7',
                                      border: '1px solid #fcd34d',
                                      borderRadius: '6px',
                                      padding: '2px 8px',
                                      cursor: 'pointer',
                                      color: '#b45309',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    {copiedField === 'content' ? <CheckCheck size={11} /> : <Copy size={11} />}
                                    {copiedField === 'content' ? 'Đã chép' : 'Chép'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Radar status indicator */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            marginBottom: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                backgroundColor: '#22c55e',
                                boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)',
                                animation: 'pulse 1.5s infinite'
                              }} />
                              <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                                Hệ thống tự động duyệt ngay khi MB Bank nhận tiền
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleCheckBookingPayment}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #86efac',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: '#15803d',
                                cursor: 'pointer'
                              }}
                            >
                              Kiểm tra ngay
                            </button>
                          </div>

                          <button 
                            type="button" 
                            className="figma-btn-primary"
                            onClick={handleProcessPayment}
                          >
                            Xác nhận đã chuyển {formatVND(finalTotal)}
                          </button>
                        </>
                      )}
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
              <h3 className="figma-summary-heading">Tóm tắt thanh toán</h3>

              <div className="figma-summary-line">
                <span className="figma-summary-label">
                  <strong style={{ color: '#0f172a' }}>Phí kết nối nền tảng</strong>
                  <span style={{ display: 'block', fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                    Thử nghiệm kết nối gia sư
                  </span>
                </span>
                <span className="figma-summary-val" style={{ color: '#059669', fontWeight: 800 }}>
                  {formatVND(CONNECTION_FEE)}
                </span>
              </div>

              <div className="figma-summary-line" style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', margin: '8px 0' }}>
                <span className="figma-summary-label">
                  <span style={{ color: '#475569', fontWeight: 700, fontSize: '0.82rem' }}>Học phí gia sư (Tham khảo)</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                    Phụ huynh & gia sư tự thỏa thuận trực tiếp sau buổi học (không chuyển khoản qua web)
                  </span>
                </span>
                <span className="figma-summary-val" style={{ color: '#64748b', fontWeight: 700 }}>
                  {formatVND(tutorReferencePrice)}/buổi
                </span>
              </div>

              {discountApplied && (
                <div className="figma-summary-line" style={{ color: '#059669' }}>
                  <span className="figma-summary-label">Khuyến mãi ({discountCode.toUpperCase()})</span>
                  <span className="figma-summary-val">-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="figma-summary-divider" />

              <div className="figma-summary-total">
                <span>Phí kết nối</span>
                <span style={{ color: '#059669' }}>{formatVND(finalTotal)}</span>
              </div>

              {/* Cancellation policy / Note green box */}
              <div className="figma-cancel-box" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                <strong>Lưu ý:</strong> Tiền chuyển khoản chỉ là <strong>Phí kết nối (5.000đ)</strong>. Học phí thực tế do phụ huynh và gia sư tự thanh toán trực tiếp, nền tảng không thu giữ học phí.
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
            STEP 3: KẾT NỐI GIA SƯ THÀNH CÔNG & HIỆN THÔNG TIN LIÊN HỆ
           ======================================================== */}
        {step === 3 && (
          <div className="figma-success-card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'left' }}>
            {/* Top Celebration Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="figma-success-icon" style={{ fontSize: '3rem', marginBottom: '12px' }}>
                🎉
              </div>

              <h2 className="figma-success-title" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                Kết Nối Gia Sư Thành Công!
              </h2>

              <p className="figma-success-subtitle" style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5, margin: '0 auto', maxWidth: '540px' }}>
                Bạn đã thanh toán phí kết nối nền tảng <strong>{formatVND(finalTotal)}</strong>. Dưới đây là <strong>thông tin liên lạc trực tiếp của gia sư</strong> để hai bên kết nối trao đổi.
              </p>
            </div>

            {/* TUTOR DIRECT CONTACT CARD */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #0f172a',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              marginBottom: '24px'
            }}>
              {/* Tutor Header Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '18px', borderBottom: '1.5px solid #f1f5f9' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: currentTutor.avatarColor || '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {currentTutor.fullName ? currentTutor.fullName.charAt(0) : 'G'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {currentTutor.fullName}
                    </h3>
                    <span style={{
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #a7f3d0'
                    }}>
                      ✓ Đã xác minh
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>
                    {currentTutor.school || currentTutor.qualification || 'Gia sư chuyên môn'} · {details.subject || 'Toán học'}
                  </div>
                </div>
              </div>

              {/* Contact Channels List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
                
                {/* 1. Phone & Zalo */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Phone size={20} color="#2563eb" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Số điện thoại & Zalo
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.5px' }}>
                        {tutorPhone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${tutorPhoneClean}`}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Phone size={14} /> Gọi ngay
                    </a>
                    <a
                      href={`https://zalo.me/${tutorPhoneClean}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={14} /> Nhắn Zalo
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#334155',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedTutorPhone ? <><Check size={14} color="#059669" /> Đã chép</> : <><Copy size={14} /> Sao chép</>}
                    </button>
                  </div>
                </div>

                {/* 2. Facebook Profile */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1877f2',
                      fontWeight: 900,
                      fontSize: '1.25rem'
                    }}>
                      f
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Trang cá nhân Facebook
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1d4ed8', wordBreak: 'break-all' }}>
                        {tutorFacebook}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a
                      href={tutorFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#1877f2',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ExternalLink size={14} /> Mở Facebook
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyFacebook}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#334155',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedTutorFacebook ? <><Check size={14} color="#059669" /> Đã chép</> : <><Copy size={14} /> Sao chép</>}
                    </button>
                  </div>
                </div>

                {/* 3. Email */}
                {tutorEmail && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Email liên hệ: <strong style={{ color: '#0f172a' }}>{tutorEmail}</strong></span>
                    <a
                      href={`mailto:${tutorEmail}`}
                      style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                    >
                      Gửi email →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* NEXT STEPS GUIDANCE */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#166534', fontWeight: 800, fontSize: '0.98rem' }}>
                <CheckCircle2 size={20} color="#16a34a" />
                Hướng dẫn các bước tiếp theo:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#14532d', lineHeight: 1.5 }}>
                <div>
                  <strong>1. Liên hệ gia sư:</strong> Phụ huynh gọi điện hoặc nhắn tin qua Zalo / Facebook cho gia sư để trao đổi về tình hình học tập của con, mục tiêu và thống nhất lịch học cụ thể.
                </div>
                <div>
                  <strong>2. Tự thêm lớp học vào hệ thống:</strong> Sau khi thống nhất ngày giờ, <strong>Gia sư hoặc Phụ huynh có thể tự thêm lớp học</strong> tại mục <strong>"Lớp Học Của Tôi"</strong> để hiển thị lịch học và theo dõi tiến trình.
                </div>
                <div>
                  <strong>3. Học phí thực tế:</strong> Học phí gia sư ({formatVND(tutorReferencePrice)}/buổi) sẽ do phụ huynh và gia sư tự thanh toán trực tiếp sau các buổi học. Nền tảng chỉ thu 5.000đ phí kết nối ban đầu và không can thiệp học phí.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button" 
                className="figma-btn-primary"
                style={{ padding: '14px 24px', fontSize: '1rem', fontWeight: 800 }}
                onClick={() => onNavigate ? onNavigate('classes') : (window.location.href = '/')}
              >
                Vào Lớp Học Của Tôi để thêm lớp & xem lịch →
              </button>

              <button 
                type="button" 
                className="figma-btn-outline"
                style={{ padding: '12px 20px' }}
                onClick={() => onNavigate ? onNavigate('tutors') : setStep(1)}
              >
                Tìm kiếm thêm gia sư khác
              </button>
            </div>
          </div>
        )}
              </div>
    </div>
  );
}
