import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PaymentResultView from './components/PaymentResultView';
import AuthRequiredModal from './components/AuthRequiredModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.search.includes('vnp_ResponseCode') || window.location.hash.includes('payment-result')) {
      return 'payment-result';
    }
    const hash = window.location.hash.replace('#', '').split('?')[0];
    return hash || 'tutors';
  });

  const [authModal, setAuthModal] = useState({ isOpen: false, actionName: '' });

  const handleRequireAuth = (actionName) => {
    setAuthModal({
      isOpen: true,
      actionName: actionName || 'sử dụng dịch vụ này'
    });
  };

  const publicViews = ['tutors', 'classes', 'materials', 'vip', 'assignments', 'checkout'];
  const authViews = ['login', 'register', 'forgot-password'];

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        const hash = window.location.hash.replace('#', '').split('?')[0];
        if (window.location.search.includes('vnp_ResponseCode') || hash === 'payment-result') {
          setCurrentView('payment-result');
        } else if (hash) {
          setCurrentView(hash);
        } else if (user) {
          setCurrentView(user.role === 'TUTOR' ? 'dashboard' : 'classes');
        } else {
          setCurrentView('tutors');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  // Set default view or sync hash when user auth state changes
  useEffect(() => {
    if (loading) return;

    const rawHash = window.location.hash.replace('#', '');
    const hash = rawHash.split('?')[0];

    // Priority 1: VNPay Payment Callback
    if (window.location.search.includes('vnp_ResponseCode') || hash === 'payment-result') {
      setCurrentView('payment-result');
      window.history.replaceState({ view: 'payment-result' }, '', '#payment-result' + (window.location.search || ''));
      return;
    }

    if (user) {
      const validViews = ['dashboard', 'classes', 'assignments', 'materials', 'schedule', 'profile', 'payment', 'vip', 'tutors', 'checkout'];
      if (hash && validViews.includes(hash)) {
        setCurrentView(hash);
        window.history.replaceState({ view: hash }, '', '#' + hash);
      } else {
        const defaultView = user.role === 'TUTOR' ? 'dashboard' : 'classes';
        setCurrentView(defaultView);
        window.history.replaceState({ view: defaultView }, '', '#' + defaultView);
      }
    } else {
      if (hash && authViews.includes(hash)) {
        setCurrentView(hash);
        window.history.replaceState({ view: hash }, '', '#' + hash);
      } else if (hash && publicViews.includes(hash)) {
        setCurrentView(hash);
        window.history.replaceState({ view: hash }, '', '#' + hash);
      } else {
        setCurrentView('tutors');
        window.history.replaceState({ view: 'tutors' }, '', '#tutors');
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

  const isAuthPage = authViews.includes(currentView);

  return (
    <div className="app-container">
      <Navbar 
        activeTab={currentView} 
        onNavigate={handleNavigate} 
      />

      <main className={user || !isAuthPage ? 'main-content' : 'auth-main'}>
        {currentView === 'payment-result' ? (
          <PaymentResultView onNavigate={handleNavigate} />
        ) : isAuthPage && !user ? (
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
            onRequireAuth={handleRequireAuth}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, actionName: '' })}
        onNavigate={handleNavigate}
        actionName={authModal.actionName}
      />
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
