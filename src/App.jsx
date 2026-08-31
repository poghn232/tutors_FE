import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
        Đang tải ứng dụng GiaSuHQ...
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar onNavigate={handleNavigate} />

      <main className="main-content">
        {(!user && currentView === 'login') && <LoginPage onNavigate={handleNavigate} />}
        {(!user && currentView === 'register') && <RegisterPage onNavigate={handleNavigate} />}
        {(user || currentView === 'dashboard' || currentView === 'home') && (
          user ? <DashboardPage onNavigate={handleNavigate} /> : <LoginPage onNavigate={handleNavigate} />
        )}
      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} GiaSuHQ - Nền tảng Hỗ trợ Dạy kèm & AI Note.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
