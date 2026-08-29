import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminAuthApi = {
  login: (data) => adminApi.post('/admin/auth/login', data),
  logout: () => adminApi.post('/auth/logout'),
  getMe: () => adminApi.get('/auth/me'),
  // Dashboard & Analytics
  getDashboard: () => adminApi.get('/admin/dashboard'),
  getStats: () => adminApi.get('/admin/stats'),
  // Medicines
  getMedicines: () => adminApi.get('/admin/medicines'),
  addMedicine: (data) => adminApi.post('/admin/medicines', data),
  updateMedicine: (id, data) => adminApi.put(`/admin/medicines/${id}`, data),
  deleteMedicine: (id) => adminApi.delete(`/admin/medicines/${id}`),
  // Categories
  getCategories: () => adminApi.get('/admin/categories'),
  addCategory: (data) => adminApi.post('/admin/categories', data),
  updateCategory: (id, data) => adminApi.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => adminApi.delete(`/admin/categories/${id}`),
  // Users
  getUsers: () => adminApi.get('/admin/users'),
  updateUserRole: (id, role) => adminApi.put(`/admin/users/${id}/role?role=${role}`),
  // Inventory
  getLowStock: () => adminApi.get('/admin/inventory/low-stock'),
  getOutOfStock: () => adminApi.get('/admin/inventory/out-of-stock'),
  updateInventory: (id, qty, inc) => adminApi.put(`/admin/inventory/update?medicineId=${id}&quantity=${qty}&increase=${inc}`),
  // Orders
  getOrders: () => adminApi.get('/admin/orders'),
  updateOrderStatus: (id, status) => adminApi.put(`/admin/orders/${id}/status?status=${status}`),
  // Analytics
  getDailyRevenue: () => adminApi.get('/admin/analytics/daily'),
  getMonthlyRevenue: () => adminApi.get('/admin/analytics/monthly'),
  getYearlyRevenue: () => adminApi.get('/admin/analytics/yearly'),
};

export default adminApi;
