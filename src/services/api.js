const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth APIs
  registerUser: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      return errorData;
    }
    
    return response.json();
  },

  registerAdmin: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      return errorData;
    }
    
    return response.json();
  },

  loginUser: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      return errorData;
    }
    
    return response.json();
  },

  loginAdmin: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Admin APIs
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    
    const data = await response.json();
    return data;
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to update user');
    }
    
    return response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to delete user');
    }
    
    return response.json();
  },

  // Product APIs
  getAllProductsForAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/products/admin`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    return response.json();
  },

  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch products');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch product');
    }
    
    return response.json();
  },

  createProduct: async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateProduct: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : {};
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to delete product');
    }

    // Handle both JSON and empty responses (200 OK with JSON or 204 No Content)
    try {
      const text = await response.text();
      if (text && text.trim()) {
        return JSON.parse(text);
      }
      return { message: 'Product deleted successfully' };
    } catch {
      return { message: 'Product deleted successfully' };
    }
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  },

  // Blog APIs
  getAllBlogs: async () => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch blogs');
    }
    
    return response.json();
  },

  getBlogBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch blog');
    }
    
    return response.json();
  },

  createBlog: async (data) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to create blog');
    }
    
    return response.json();
  },

  updateBlog: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to update blog');
    }
    
    return response.json();
  },

  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to delete blog');
    }
    
    return response.json();
  },

  // Newsletter APIs
  subscribeToNewsletter: async (email) => {
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to subscribe');
    }
    
    return response.json();
  },

  getAllSubscribers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    return response.json();
  },

  deleteSubscriber: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete subscriber');
    return response.json();
  },

  // Review APIs
  getProductReviews: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to fetch reviews');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  addReview: async (productId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to add review');
    }
    
    return response.json();
  },

  deleteReview: async (productId, reviewId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to delete review');
    }
  },

  // Order APIs
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return response.json();
  },

  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    
    const data = await response.json();
    return data.data || [];
  },

  getOrderById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch order');
    }
    
    const data = await response.json();
    return data.data;
  },

  // Admin Order APIs
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    
    const data = await response.json();
    return data.data || [];
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to update order status');
    }
    
    return response.json();
  },

  deleteOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to delete order');
    }
    
    return response.json();
  },

  // Contact Form API
  submitContactForm: async (data) => {
    const response = await fetch(`${API_BASE_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to submit contact form');
    }
    
    return response.json();
  },

  // Cart APIs
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to fetch cart');
    }
    
    const data = await response.json();
    return data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to add item to cart');
    }
    
    return response.json();
  },

  updateCartItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to update cart item');
    }
    
    return response.json();
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to remove item from cart');
    }
    
    return response.json();
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to clear cart');
    }
    
    return response.json();
  },

  syncCartPrices: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/sync-prices`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to sync cart prices');
    }
    
    return response.json();
  },

  // Favorites API
  getFavorites: async () => {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to get favorites');
    }
    
    return response.json();
  },

  addFavorite: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to add favorite');
    }
    
    return response.json();
  },

  removeFavorite: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/remove/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to remove favorite');
    }
    
    return response.json();
  },

  checkFavorite: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${productId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      return { success: false, isFavorite: false };
    }
    
    return response.json();
  },

  syncFavorites: async (productIds) => {
    const response = await fetch(`${API_BASE_URL}/favorites/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productIds }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { success: false, message: `Server error: ${response.status} ${response.statusText}` };
      }
      throw new Error(errorData.message || 'Failed to sync favorites');
    }
    
    return response.json();
  },
};

