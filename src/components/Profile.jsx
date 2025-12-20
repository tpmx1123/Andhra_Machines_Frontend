import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Package, RefreshCw, CreditCard, User as UserIcon, LogOut, ChevronRight, ShoppingCart, X, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart, cartItems, getCartTotal, getCartCount } = useCart();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/products/${item.id}`} className="block">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg';
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-[#c54513]">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-gray-900">
                          ₹{parseFloat(item.price || 0).toLocaleString('en-IN')}
                          {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price || 0) && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{parseFloat(item.originalPrice || 0).toLocaleString('en-IN')}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            showToast(`${item.name} added to cart!`, 'success');
                          }}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-[#c54513] text-white text-sm font-medium rounded-md hover:bg-[#a43a10] transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove from wishlist"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
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
                            {order.paymentStatus.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{item.productName} x {item.quantity}</span>
                              <span className="font-medium text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
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
            <h2 className="text-xl font-semibold mb-6">Refunds & Returns</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Refund & Return Policy</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          <li>7-day return policy for damaged or defective products</li>
                          <li>Products must be in original packaging with all accessories</li>
                          <li>Return requests must be initiated within 7 days of delivery</li>
                          <li>Contact our support team via WhatsApp to initiate returns</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Refund Process</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          <li>Refunds are processed within 5-7 business days</li>
                          <li>Refund amount will be credited to the original payment method</li>
                          <li>For WhatsApp payments, refunds will be processed via the same channel</li>
                          <li>You will receive confirmation once the refund is processed</li>
                        </ul>
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
                  <strong>Need Help?</strong> Contact our support team via WhatsApp for assistance with returns or refunds.
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
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
                <p className="text-sm text-gray-500">Member since {userData.joinedDate}</p>
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
              <h3 className="text-lg font-medium">Account Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Full Name</span>
                  <span className="font-medium">{userData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{userData.phone}</span>
                </div>
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
                    Refunds & Returns
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
