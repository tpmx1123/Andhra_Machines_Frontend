import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Package, RefreshCw, CreditCard, User as UserIcon, LogOut, ChevronRight, ShoppingCart, X, Clock, CheckCircle, Truck, XCircle, Edit, Save, X as XIcon, Star, Plus, Minus } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { api } from '../services/api';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, cartItems, getCartTotal, getCartCount, updateQuantity } = useCart();
  const { user, logout, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cartQuantities, setCartQuantities] = useState({});

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication status
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Only fetch orders after auth has finished loading and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  // Update cart quantities when cartItems change
  useEffect(() => {
    const quantities = {};
    cartItems.forEach(item => {
      quantities[item.id] = item.quantity;
    });
    setCartQuantities(quantities);
  }, [cartItems]);

  const handleAddToCart = (product) => {
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      // Update quantity instead of adding again
      updateQuantity(product.id, existingItem.quantity + 1);
      showToast(`Cart updated! Quantity: ${existingItem.quantity + 1}`, 'success');
    } else {
      addToCart(product, 1);
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(productId, newQuantity);
    showToast('Cart updated!', 'success');
  };

  // Handle real-time order status updates via WebSocket
  const handleOrderStatusUpdate = (orderUpdate) => {
    // Update the order in the orders list
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderUpdate.orderId
          ? { ...order, status: orderUpdate.newStatus }
          : order
      )
    );
    // Show notification
    showToast(`Order ${orderUpdate.orderNumber} status updated to ${orderUpdate.newStatus}`, 'info');
  };

  // Handle user profile updates via WebSocket
  const handleUserUpdate = (userUpdate) => {
    // Refresh user data when admin updates profile
    if (refreshUser) {
      refreshUser();
    }
    showToast('Your profile has been updated', 'info');
  };

  // Subscribe to WebSocket updates
  useWebSocket(null, handleOrderStatusUpdate, handleUserUpdate);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await api.getUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      // Handle ISO format date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = () => {
    setEditFormData({
      name: user?.name || '',
      phone: user?.phone || ''
    });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({ name: '', phone: '' });
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.updateProfile({
        name: editFormData.name.trim(),
        phone: editFormData.phone.trim() || null
      });

      if (response.success) {
        // Refresh user data
        if (refreshUser) {
          await refreshUser();
        }
        showToast('Profile updated successfully', 'success');
        setIsEditingProfile(false);
      } else {
        showToast(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect in useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  const userData = {
    name: user.name || 'User',
    email: user.email || '',
    phone: user.phone || 'Not provided',
    joinedDate: formatDate(user.createdAt),
    orders: orders.length,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'wishlist':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">My Wishlist ({favorites.length})</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">Your wishlist is empty</p>
                <Link 
                  to="/products" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                {favorites.map((item) => {
                  // Calculate discount percentage
                  const discount = item.originalPrice && item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <Link to={`/products/${item.brandSlug || item.id}`} className="relative h-56 bg-gray-50 overflow-hidden block">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        
                        {/* Discount and Brand Tags */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                          {discount > 0 && (
                            <span className="inline-block bg-[#c54513] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                          <span className="inline-block bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {item.brand}
                          </span>
                        </div>
                        
                        {/* Out of Stock Badge */}
                        {!item.inStock && (
                          <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Out of Stock
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                      </Link>
                      <div className="flex-1 p-3 sm:p-4 flex flex-col">
                        <Link to={`/products/${item.brandSlug || item.id}`} className="group">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.brand}</p>
                        <div className="flex-1 flex flex-col justify-end">
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <Star
                                  key={rating}
                                  fill={rating < Math.floor(item.rating || 0) ? 'currentColor' : 'none'}
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    rating < Math.floor(item.rating || 0)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">
                              {item.reviewCount || 0} reviews
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-sm sm:text-base font-medium text-gray-900 flex-shrink-0">
                              ₹{parseFloat(item.price || 0).toLocaleString('en-IN')}
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                                  ₹{parseFloat(item.originalPrice || 0).toLocaleString('en-IN')}
                                </span>
                              )}
                            </p>
                            <div className="flex space-x-1 sm:space-x-2 relative z-10 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(item, showToast, navigate);
                                }}
                                className={`p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0 ${
                                  isFavorite(item.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                }`}
                                title="Remove from wishlist"
                              >
                                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite(item.id) ? 'fill-current' : ''}`} aria-hidden="true" />
                              </button>
                              {item.inStock ? (
                                cartQuantities[item.id] ? (
                                <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleQuantityChange(item.id, cartQuantities[item.id] - 1);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="px-2 py-1 text-xs font-medium">
                                    {cartQuantities[item.id]}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleQuantityChange(item.id, cartQuantities[item.id] + 1);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart(item);
                                  }}
                                  className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#c54513] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#a43a10] transition-colors flex items-center gap-1 flex-shrink-0"
                                  title="Add to cart"
                                >
                                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">Add</span>
                                </button>
                              )
                            ) : (
                              <button
                                disabled
                                className="p-1.5 sm:p-2 text-gray-300 cursor-not-allowed rounded-full flex-shrink-0"
                                title="Out of stock"
                              >
                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                              </button>
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">My Orders</h2>
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513] mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">You haven't placed any orders yet</p>
                <Link 
                  to="/products" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10]"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#c54513]">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Shipping to:</p>
                          <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                          <p className="text-gray-600">{order.shippingAddress.address}</p>
                          <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Payment Status:</p>
                          <p className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING FOR PAYMENT'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <Link
                              key={item.id}
                              to={`/products/${item.brandSlug || item.productId}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              {item.productImage && (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-16 h-16 object-contain rounded border border-gray-200 bg-gray-50 flex-shrink-0"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</p>
                                {item.unitPrice && (
                                  <p className="text-xs text-gray-500">₹{item.unitPrice.toLocaleString('en-IN')} each</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* GST Invoice Message */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-semibold text-green-800">GST Invoice Available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'refunds':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Replacements & Exchanges</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Replacements & Exchanges</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-gray-600">
                          For details about replacements and exchanges, please contact us.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Expert Service</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Our team includes experienced professionals with over 10 years of expertise in sewing machines. 
                          We ensure quality service and support for all your needs.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">10+ Years Experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Need Help?</strong> Contact our support team via WhatsApp for assistance with replacements or exchanges.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'payments':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-.923-4.235-1.787-7.05-2.5-7.35-2.61-.3-.11-.52-.082-.707.05-.186.13-.767.966-.767 1.965s.99 2.28 1.13 2.44c.14.16.99 1.52 2.39 2.45 1.78 1.19 3.26 1.52 3.66 1.68.4.16.63.13.87-.1.24-.23.99-.96 1.26-1.29.27-.33.54-.25.87-.15.33.1 2.11.99 2.47 1.17.36.18.6.15.82-.05.22-.2.99-1.15 1.26-1.58.27-.43.27-.72-.02-.92-.3-.2-1.1-.55-1.26-.61-.16-.06-.28-.1-.4.15-.12.25-.48.61-.66.82-.18.21-.36.25-.66.15-.3-.1-1.26-.46-2.4-.92-4.24-1.79-7.05-2.5-7.35-2.61-.3-.11-.52-.08-.71.05-.19.13-.77.97-.77 1.97s.99 2.28 1.13 2.44c.14.16.99 1.52 2.39 2.45 1.78 1.19 3.26 1.52 3.66 1.68.4.16.63.13.87-.1.24-.23.99-.96 1.26-1.29.27-.33.54-.25.87-.15.33.1 2.11.99 2.47 1.17.36.18.6.15.82-.05.22-.2.99-1.15 1.26-1.58.27-.43.27-.72-.02-.92-.3-.2-1.1-.55-1.26-.61-.16-.06-.28-.1-.4.15-.12.25-.48.61-.66.82-.18.21-.36.25-.66.15z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Through WhatsApp</h3>
                    <p className="text-gray-600 mb-4">
                      All payments are processed securely through WhatsApp. After placing your order, you will receive payment instructions via WhatsApp. Our team will guide you through the payment process.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Payment Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                        <li>Place your order on our website</li>
                        <li>You will receive a WhatsApp message with order details</li>
                        <li>Follow the payment instructions provided</li>
                        <li>Confirm payment via WhatsApp</li>
                        <li>Your order will be processed immediately</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] text-lg font-semibold"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{userData.name}</h2>
                    <p className="text-gray-500">{userData.email}</p>
                    <p className="text-sm text-gray-500">Member since {userData.joinedDate}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">{orders.length}</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">{favorites.length}</p>
                <p className="text-sm text-gray-500">Wishlist</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">{getCartCount()}</p>
                <p className="text-sm text-gray-500">Cart Items</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">₹{getCartTotal().toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">Cart Total</p>
              </div>
            </div>
            
            {/* Cart Details Section */}
            {cartItems.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Cart Details</h3>
                  <Link
                    to="/cart"
                    className="text-sm text-[#c54513] hover:text-[#a43a10] font-medium"
                  >
                    View Cart →
                  </Link>
                </div>
                <div className="space-y-3">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{(parseFloat(item.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Account Details</h3>
                {!isEditingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#c54513] hover:text-[#a43a10] hover:bg-[#fef0e8] rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Full Name</span>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] text-sm"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <span className="font-medium">{userData.name}</span>
                  )}
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Phone</span>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] text-sm"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <span className="font-medium">{userData.phone}</span>
                  )}
                </div>
                {isEditingProfile && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XIcon className="h-4 w-4 inline mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#c54513] rounded-md hover:bg-[#a43a10] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 inline mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 inline mr-1" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500">Manage your account details and track orders</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Hello, {userData.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-[#fef0e8] text-[#c54513]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center">
                    <UserIcon className="mr-3 h-5 w-5" />
                    My Profile
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'orders' ? 'bg-[#fef0e8] text-[#c54513]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center">
                    <Package className="mr-3 h-5 w-5" />
                    My Orders
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {userData.orders}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'wishlist' ? 'bg-[#fef0e8] text-[#c54513]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center">
                    <Heart className="mr-3 h-5 w-5" />
                    My Wishlist
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'payments' ? 'bg-[#fef0e8] text-[#c54513]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center">
                    <CreditCard className="mr-3 h-5 w-5" />
                    Payment Methods
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setActiveTab('refunds')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'refunds' ? 'bg-[#fef0e8] text-[#c54513]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center">
                    <RefreshCw className="mr-3 h-5 w-5" />
                    Replacements & Exchanges
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span className="flex items-center text-red-600">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
