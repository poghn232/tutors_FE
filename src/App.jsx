import React from 'react'

export default function App() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#38bdf8' }}>GiaSuHQ Frontend</h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>
        Nền tảng hỗ trợ dạy kèm & Tóm tắt ghi chú bằng AI Note dành cho Gia sư, Học sinh và Phụ huynh.
      </p>
      <div style={{ padding: '24px', background: '#1e293b', borderRadius: '12px', textAlign: 'left', border: '1px solid #334155' }}>
        <h3 style={{ color: '#f8fafc', marginBottom: '12px' }}>⚡ Cấu hình khởi tạo:</h3>
        <ul style={{ color: '#cbd5e1', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li><strong>Framework:</strong> React (Vite)</li>
          <li><strong>Deployment:</strong> Vercel</li>
          <li><strong>Backend API:</strong> Java Spring Boot (MySQL)</li>
        </ul>
      </div>
    </div>
  )
}
