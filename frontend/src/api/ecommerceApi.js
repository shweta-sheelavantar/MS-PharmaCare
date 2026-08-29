import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create a new axios instance for ecommerce endpoints
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ecommerceApi = {
  // Categories
  getAllCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Products
  getAllProducts: async (searchQuery = '') => {
    const url = searchQuery ? `/products?search=${encodeURIComponent(searchQuery)}` : '/products';
    const response = await apiClient.get(url);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId) => {
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // Orders
  createOrder: async (orderData, token) => {
    const response = await apiClient.post('/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  verifyPayment: async (paymentData, token) => {
    const response = await apiClient.post('/orders/verify-payment', paymentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getUserOrders: async (token) => {
    const response = await apiClient.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Now returns { role, username, orders: [] }
  },

  getOrderById: async (orderId, token) => {
    const response = await apiClient.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  cancelOrder: async (orderId, token, reason) => {
    const body = reason ? { reason } : {};
    const response = await apiClient.put(`/orders/${orderId}/cancel`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  requestRefund: async (orderId, itemId, reason, token) => {
    const body = reason ? { reason } : {};
    const response = await apiClient.post(`/orders/${orderId}/items/${itemId}/refund`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  downloadInvoice: async (orderId, token) => {
    const response = await apiClient.get(`/orders/invoice/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob' // Important for file download
    });
    return response.data;
  },

  // Cart
  getCartItems: async (token) => {
    const response = await apiClient.get('/cart/items', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addToCart: async (productId, quantity = 1, token) => {
    const response = await apiClient.post('/cart/add', { productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateCartQuantity: async (productId, operation, token) => {
    const response = await apiClient.put('/cart/update', { productId, operation }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  removeFromCart: async (productId, token) => {
    const response = await apiClient.delete(`/cart/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  clearCart: async (token) => {
    const response = await apiClient.delete('/cart/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Wishlist
  getWishlistItems: async (token) => {
    const response = await apiClient.get('/wishlist/items', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  addToWishlist: async (productId, token) => {
    const response = await apiClient.post('/wishlist/add', { product_id: productId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  removeFromWishlist: async (productId, token) => {
    const response = await apiClient.delete(`/wishlist/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  // Reviews
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/products/${productId}/reviews`);
    return response.data;
  },
  
  addReview: async (productId, reviewData, token) => {
    const response = await apiClient.post(`/products/${productId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
