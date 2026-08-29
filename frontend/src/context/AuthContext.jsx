import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const userName = localStorage.getItem('userName');
    return userName ? { userName } : null;
  });
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.data && response.data.data) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch user details", error);
          if (error.response?.status === 401) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (authData) => {
    const userInfo = {
      id: authData.user.id,
      userName: authData.user.userName,
      email: authData.user.email,
      mobileNumber: authData.user.mobileNumber,
      role: authData.user.role,
    };
    
    // Store token and only userName for initial display as requested
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userName', authData.user.userName || '');
    
    // Clean up any legacy sensitive data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionId');
    
    setToken(authData.token);
    setUser(userInfo);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local session even if server call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userMobile');
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      localStorage.removeItem('mspharmcare_cart');
      localStorage.removeItem('mspharmcare_wishlist');
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
