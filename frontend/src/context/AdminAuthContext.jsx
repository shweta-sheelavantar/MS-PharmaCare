import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminAuthApi } from '../api/adminAuthApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(() => {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [loading, setLoading] = useState(!!localStorage.getItem('adminToken'));

  useEffect(() => {
    const fetchAdmin = async () => {
      if (adminToken) {
        try {
          const response = await adminAuthApi.getMe();
          if (response.data && response.data.data) {
            setAdminUser(response.data.data);
            localStorage.setItem('adminUser', JSON.stringify(response.data.data));
          }
        } catch (error) {
          console.error("Failed to fetch admin details", error);
          if (error.response?.status === 401) {
            setAdminToken(null);
            setAdminUser(null);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        }
      }
      setLoading(false);
    };

    fetchAdmin();
  }, [adminToken]);

  const login = (authData) => {
    localStorage.setItem('adminToken', authData.token);
    localStorage.setItem('adminUser', JSON.stringify(authData.user));
    
    setAdminToken(authData.token);
    setAdminUser(authData.user);
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdminToken(null);
      setAdminUser(null);
    }
  };

  const value = useMemo(
    () => ({
      adminUser,
      adminToken,
      loading,
      isAuthenticated: Boolean(adminToken && adminUser && adminUser.role === 'ADMIN'),
      login,
      logout,
    }),
    [adminUser, adminToken, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
