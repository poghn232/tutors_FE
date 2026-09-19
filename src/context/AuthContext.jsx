import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getSavedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success) {
            setUser(res.data);
          }
        } catch (error) {
          console.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn", error);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const loginWithGoogle = async ({ idToken, role }) => {
    const res = await authService.loginWithGoogle({ idToken, role });
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem('giasuhq_user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
