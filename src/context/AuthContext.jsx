import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getSavedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const savedUser = authService.getSavedUser();

      if (token && savedUser) {
        // Khôi phục user state ngay lập tức từ bộ nhớ lưu trữ
        setUser(savedUser);

        try {
          const res = await authService.getCurrentUser();
          if (res?.success && res.data) {
            setUser(res.data);
          }
        } catch (error) {
          // CHỈ đăng xuất khi máy chủ chủ động từ chối token (401 Unauthorized / 403 Forbidden)
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Phiên đăng nhập đã hết hạn trên server, tiến hành đăng xuất.");
            authService.logout();
            setUser(null);
          } else {
            // Máy chủ offline hoặc lỗi mạng tạm thời: GIỮ NGUYÊN user đã lưu để không bị văng ra ngoài!
            console.info("Không thể kết nối đến máy chủ để làm mới hồ sơ, duy trì phiên đăng nhập cục bộ.");
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials, rememberMe = true) => {
    const res = await authService.login(credentials, rememberMe);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const loginWithGoogle = async ({ idToken, role }, rememberMe = true) => {
    const res = await authService.loginWithGoogle({ idToken, role }, rememberMe);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (data, rememberMe = true) => {
    const res = await authService.register(data, rememberMe);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      const isRemember = localStorage.getItem('giasuhq_remember_me') === 'true';
      if (isRemember) {
        localStorage.setItem('giasuhq_user', JSON.stringify(merged));
      } else {
        sessionStorage.setItem('giasuhq_user', JSON.stringify(merged));
      }
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
