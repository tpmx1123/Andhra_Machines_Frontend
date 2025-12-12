import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, RefreshCw, CreditCard, User as UserIcon, LogOut, ChevronRight, ShoppingCart, X } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  // Mock user data - replace with actual user data from your auth context/state
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    joinedDate: 'January 2023',
    orders: 5,
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
                          ₹{Math.round(item.price * 83).toLocaleString('en-IN')}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{Math.round(item.originalPrice * 83).toLocaleString('en-IN')}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            alert(`${item.name} added to cart!`);
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
          </div>
        );
      
      case 'refunds':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Refunds & Returns</h2>
            <div className="text-center py-12">
              <RefreshCw className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No recent refund requests</p>
            </div>
          </div>
        );
      
      case 'payments':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No saved payment methods</p>
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
                <p className="text-2xl font-bold text-[#c54513]">{userData.orders}</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">{favorites.length}</p>
                <p className="text-sm text-gray-500">Wishlist</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">0</p>
                <p className="text-sm text-gray-500">Coupons</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#c54513]">0</p>
                <p className="text-sm text-gray-500">Reward Points</p>
              </div>
            </div>
            
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
                
                <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
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
