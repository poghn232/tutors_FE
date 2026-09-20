import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('classes');

  // Set default view based on role when user logs in
  useEffect(() => {
    if (user) {
      if (user.role === 'TUTOR') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('classes');
      }
    } else {
      setCurrentView('login');
    }
  }, [user]);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#64748b',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontWeight: 600 }}>Đang tải ứng dụng Tutora...</span>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user && (
        <Navbar 
          activeTab={currentView} 
          onNavigate={handleNavigate} 
        />
      )}

      <main className={user ? 'main-content' : 'auth-main'}>
        {!user ? (
          <>
            {currentView === 'register' ? (
              <RegisterPage onNavigate={handleNavigate} />
            ) : currentView === 'forgot-password' ? (
              <ForgotPasswordPage onNavigate={handleNavigate} />
            ) : (
              <LoginPage onNavigate={handleNavigate} />
            )}
          </>
        ) : (
          <DashboardPage 
            activeTab={currentView} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
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
