import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Award, BookOpen, MapPin, Save, ShieldCheck } from 'lucide-react';

export default function ProfileView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        setProfile(p);
        setFullName(p.fullName || '');
        setPhone(p.phone || '');
        setBio(p.bio || '');
        setQualification(p.qualification || '');
        setExperienceYears(p.experienceYears || '');
        setHourlyRate(p.hourlyRate || '');
        setAddress(p.address || '');
        setEmergencyContact(p.emergencyContact || '');
        setGradeLevel(p.gradeLevel || '');
        setSchoolName(p.schoolName || '');
      }
    } catch (err) {
      setErrorMsg('Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      const payload = {
        fullName,
        phone,
        bio,
        qualification,
        experienceYears: experienceYears ? Number(experienceYears) : null,
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        address,
        emergencyContact,
        gradeLevel,
        schoolName
      };

      const res = await userService.updateProfile(payload);
      if (res.success) {
        setSuccessMsg('Cập nhật hồ sơ thông tin thành công!');
        fetchProfile();
      } else {
        setErrorMsg(res.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      setErrorMsg('Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải thông tin hồ sơ...</div>;
  }

  return (
    <div style={{ marginTop: '24px', maxWidth: '720px', margin: '24px auto 0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#2563eb', color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 'bold'
          }}>
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#0f172a' }}>Hồ sơ cá nhân</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Email: <strong>{profile?.email}</strong> • Vai trò: <strong style={{ color: '#2563eb' }}>{profile?.role}</strong>
            </p>
          </div>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Họ và tên (*)</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại liên hệ</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Dành riêng cho Gia sư */}
          {profile?.role === 'TUTOR' && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', color: '#2563eb', marginBottom: '12px' }}>Thông tin Chuyên môn Gia sư</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Trình độ / Bằng cấp</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Cử nhân Sư phạm Toán"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Số năm"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Học phí đề xuất (VND / giờ)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="150000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Giới thiệu bản thân & Phương pháp giảng dạy</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Mô tả kinh nghiệm, thành tích học sinh..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Dành riêng cho Phụ huynh */}
          {profile?.role === 'PARENT' && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', color: '#8b5cf6', marginBottom: '12px' }}>Thông tin Phụ huynh</h4>

              <div className="form-group">
                <label>Địa chỉ liên hệ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Địa chỉ nhà / Quận / TP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại khẩn cấp</label>
                <input
                  type="tel"
                  className="form-control"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Dành riêng cho Học sinh */}
          {profile?.role === 'STUDENT' && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
              <h4 style={{ fontSize: '1rem', color: '#10b981', marginBottom: '12px' }}>Thông tin Học sinh</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Khối / Lớp đang học</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Lớp 12"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Tên Trường đang học</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="THPT Chuyên..."
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ gap: '6px' }}>
              <Save size={18} /> {submitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
