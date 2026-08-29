import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'token';

// Create a dedicated axios instance for admin
const adminAxios = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: { 'Content-Type': 'application/json' },
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('userName');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  getStats: () => adminAxios.get('/stats').then(res => res.data),
  getDashboard: () => adminAxios.get('/dashboard').then(res => res.data),

  // Medicines (Products)
  getAllMedicines: () => adminAxios.get('/medicines').then(res => res.data),
  addMedicine: (data) => adminAxios.post('/medicines', data).then(res => res.data),
  updateMedicine: (id, data) => adminAxios.put(`/medicines/${id}`, data).then(res => res.data),
  deleteMedicine: (id) => adminAxios.delete(`/medicines/${id}`).then(res => res.data),

  // Categories
  getAllCategories: () => adminAxios.get('/categories').then(res => res.data),
  addCategory: (data) => adminAxios.post('/categories', data).then(res => res.data),
  updateCategory: (id, data) => adminAxios.put(`/categories/${id}`, data).then(res => res.data),
  deleteCategory: (id) => adminAxios.delete(`/categories/${id}`).then(res => res.data),

  // Users
  getAllUsers: () => adminAxios.get('/users').then(res => res.data),
  updateUserRole: (id, role) => adminAxios.put(`/users/${id}/role?role=${role}`).then(res => res.data),
  updateUserStatus: (id, active) => adminAxios.put(`/users/${id}/status?active=${active}`).then(res => res.data),

  // Orders
  getAllOrders: () => adminAxios.get('/orders').then(res => res.data),
  updateOrderStatus: (id, status) => adminAxios.put(`/orders/${id}/status?status=${status}`).then(res => res.data),
  cancelOrder: (id) => adminAxios.delete(`/orders/${id}`).then(res => res.data),
};

export default adminService;
