import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import UsersList from './UsersList';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import ReviewsList from './ReviewsList';
import OrdersList from './OrdersList';
import BlogsList from './BlogsList';
import BlogForm from './BlogForm';
import SubscribersList from './SubscribersList';
import { Users, Package, Plus, LogOut, MessageSquare, ShoppingCart, BookOpen, Mail, Menu, X } from 'lucide-react';

export default function AdminPanel() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productsVersion, setProductsVersion] = useState(0);
  const [viewingReviewsFor, setViewingReviewsFor] = useState(null);
  
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogsVersion, setBlogsVersion] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before checking admin status
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const handleLogout = () => {
    logout();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setShowBlogForm(false);
    setEditingBlog(null);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  // Don't render if not admin (will redirect in useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs sm:text-sm text-gray-500">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setViewingReviewsFor(null);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'products'
                    ? 'bg-[#c54513] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } py-3 px-4 rounded-md font-medium text-sm flex items-center justify-start`}
              >
                <Package className="h-5 w-5 mr-2" />
                Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('users');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'users'
                    ? 'bg-[#c54513] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } py-3 px-4 rounded-md font-medium text-sm flex items-center justify-start`}
              >
                <Users className="h-5 w-5 mr-2" />
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'orders'
                    ? 'bg-[#c54513] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } py-3 px-4 rounded-md font-medium text-sm flex items-center justify-start`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('blogs');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'blogs'
                    ? 'bg-[#c54513] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } py-3 px-4 rounded-md font-medium text-sm flex items-center justify-start`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Blogs
              </button>
              <button
                onClick={() => {
                  setActiveTab('subscribers');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'subscribers'
                    ? 'bg-[#c54513] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } py-3 px-4 rounded-md font-medium text-sm flex items-center justify-start`}
              >
                <Mail className="h-5 w-5 mr-2" />
                Subscribers
              </button>
            </nav>
          </div>
        )}

        {/* Desktop Tabs */}
        <div className="mb-6 hidden lg:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                  setViewingReviewsFor(null);
                }}
                className={`${
                  activeTab === 'products'
                    ? 'border-[#c54513] text-[#c54513]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Package className="h-5 w-5 mr-2" />
                Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('users');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                }}
                className={`${
                  activeTab === 'users'
                    ? 'border-[#c54513] text-[#c54513]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Users className="h-5 w-5 mr-2" />
                Users
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                }}
                className={`${
                  activeTab === 'orders'
                    ? 'border-[#c54513] text-[#c54513]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('blogs');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                }}
                className={`${
                  activeTab === 'blogs'
                    ? 'border-[#c54513] text-[#c54513]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Blogs
              </button>
              <button
                onClick={() => {
                  setActiveTab('subscribers');
                  setShowProductForm(false);
                  setShowBlogForm(false);
                }}
                className={`${
                  activeTab === 'subscribers'
                    ? 'border-[#c54513] text-[#c54513]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Mail className="h-5 w-5 mr-2" />
                Subscribers
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Product Management</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Product
                </button>
              </div>
              {showProductForm ? (
                <ProductForm
                  product={editingProduct}
                  onClose={handleFormClose}
                  onSuccess={() => {
                    // Close the form and refresh the products list without full page reload
                    handleFormClose();
                    setProductsVersion((prev) => prev + 1);
                  }}
                />
              ) : viewingReviewsFor ? (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={() => setViewingReviewsFor(null)}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      ← Back to Products
                    </button>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reviews for: {viewingReviewsFor.title}
                    </h3>
                  </div>
                  <ReviewsList 
                    productId={viewingReviewsFor.id}
                    onClose={() => setViewingReviewsFor(null)}
                  />
                </div>
              ) : (
                <ProductsList 
                  onEdit={handleEditProduct} 
                  refreshKey={productsVersion}
                  onDelete={() => {
                    // Trigger refresh after delete
                    setProductsVersion((prev) => prev + 1);
                  }}
                  onViewReviews={(product) => {
                    setViewingReviewsFor(product);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'blogs' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Blog Management</h2>
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setShowBlogForm(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Blog Post
                </button>
              </div>
              {showBlogForm ? (
                <BlogForm
                  blog={editingBlog}
                  onClose={handleFormClose}
                  onSuccess={() => {
                    handleFormClose();
                    setBlogsVersion((prev) => prev + 1);
                  }}
                />
              ) : (
                <BlogsList 
                  onEdit={handleEditBlog} 
                  refreshKey={blogsVersion}
                  onDelete={() => setBlogsVersion((prev) => prev + 1)}
                />
              )}
            </div>
          )}

          {activeTab === 'users' && <UsersList />}

          {activeTab === 'orders' && <OrdersList />}

          {activeTab === 'subscribers' && <SubscribersList />}
        </div>
      </div>
    </div>
  );
}

