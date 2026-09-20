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
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'login';
  });

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setCurrentView(hash);
        } else if (user) {
          setCurrentView(user.role === 'TUTOR' ? 'dashboard' : 'classes');
        } else {
          setCurrentView('login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  // Set default view or sync hash when user auth state changes
  useEffect(() => {
    if (loading) return;

    if (user) {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['dashboard', 'classes', 'assignments', 'materials', 'schedule', 'profile'];
      if (hash && validViews.includes(hash)) {
        setCurrentView(hash);
        window.history.replaceState({ view: hash }, '', '#' + hash);
      } else {
        const defaultView = user.role === 'TUTOR' ? 'dashboard' : 'classes';
        setCurrentView(defaultView);
        window.history.replaceState({ view: defaultView }, '', '#' + defaultView);
      }
    } else {
      const authViews = ['register', 'forgot-password'];
      const hash = window.location.hash.replace('#', '');
      if (hash && authViews.includes(hash)) {
        setCurrentView(hash);
        window.history.replaceState({ view: hash }, '', '#' + hash);
      } else {
        setCurrentView('login');
        window.history.replaceState({ view: 'login' }, '', '#login');
      }
    }
  }, [user, loading]);

  const handleNavigate = (view) => {
    if (view !== currentView) {
      window.history.pushState({ view }, '', '#' + view);
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
