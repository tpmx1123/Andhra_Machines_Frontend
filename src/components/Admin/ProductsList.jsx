import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Edit, Trash2, Image as ImageIcon, Package, MessageSquare, Clock } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';
import AlertModal from '../AlertModal';
import { useWebSocket } from '../../hooks/useWebSocket';

// Helper function to format date for display (using local timezone)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Format using local timezone
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error('Error formatting date:', e, dateString);
    return 'Invalid Date';
  }
};

// Helper function to get schedule status
const getScheduleStatus = (product) => {
  if (!product.scheduledPrice || !product.priceStartDate || !product.priceEndDate) {
    return null;
  }
  
  try {
    // Get current time in IST
    const now = new Date();
    // Convert to IST: Get UTC timestamp, add IST offset (UTC+5:30)
    const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istNow = new Date(utcTimestamp + istOffset);
    
    // Parse dates - backend sends LocalDateTime (timezone-naive, treated as IST)
    const startDateStr = product.priceStartDate;
    const endDateStr = product.priceEndDate;
    
    // Helper to check if string has timezone
    const hasTimezone = (str) => {
      if (!str) return false;
      return str.includes('Z') || str.includes('+') || (str.match(/[+-]\d{2}:\d{2}$/) !== null);
    };
    
    // Parse dates - if no timezone, treat as IST
    let startDate, endDate;
    
    if (hasTimezone(startDateStr)) {
      startDate = new Date(startDateStr);
    } else {
      // No timezone - treat as IST
      // Format: "2025-12-22T18:25:00" or "2025-12-22 18:25:00" -> add +05:30
      const cleanStart = startDateStr.replace(' ', 'T').split('.')[0]; // Remove milliseconds if present
      const formattedStart = cleanStart.includes('T') 
        ? `${cleanStart}+05:30`
        : `${cleanStart.replace(' ', 'T')}+05:30`;
      startDate = new Date(formattedStart);
    }
    
    if (hasTimezone(endDateStr)) {
      endDate = new Date(endDateStr);
    } else {
      const cleanEnd = endDateStr.replace(' ', 'T').split('.')[0];
      const formattedEnd = cleanEnd.includes('T')
        ? `${cleanEnd}+05:30`
        : `${cleanEnd.replace(' ', 'T')}+05:30`;
      endDate = new Date(formattedEnd);
    }
    
    // Compare times (all in milliseconds since epoch)
    const nowTime = istNow.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    
    if (nowTime < startTime) {
      return { status: 'upcoming', message: 'Scheduled (Not Started)' };
    } else if (nowTime >= startTime && nowTime <= endTime) {
      return { status: 'active', message: 'Scheduled (Active)' };
    } else {
      return { status: 'expired', message: 'Scheduled (Expired)' };
    }
  } catch (e) {
    console.error('Error calculating schedule status:', e);
    return { status: 'unknown', message: 'Schedule Status Unknown' };
  }
};

export default function ProductsList({ onEdit, refreshKey, onDelete, onViewReviews }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, productId: null, productTitle: '' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  // Refresh products every minute to update schedule status
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update schedule status
      setProducts(prevProducts => [...prevProducts]);
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    // Update the product in the list
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === priceUpdate.productId
          ? {
              ...product,
              price: priceUpdate.newPrice,
              originalPrice: priceUpdate.originalPrice || product.originalPrice
            }
          : product
      )
    );
  };

  // Subscribe to WebSocket updates for real-time price changes
  useWebSocket(handlePriceUpdate, null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getAllProductsForAdmin();
      // Ensure response is an array
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response from server');
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching products');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message, type = 'info') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const handleDeleteClick = (id, title) => {
    setDeleteConfirmModal({ isOpen: true, productId: id, productTitle: title });
  };

  const handleDeleteConfirm = async () => {
    const { productId } = deleteConfirmModal;
    if (!productId) return;

    try {
      setLoading(true);
      await api.deleteProduct(productId);
      
      // Refresh the products list to reflect the deletion
      await fetchProducts();
      
      // Also trigger parent refresh if callback provided
      if (onDelete) {
        onDelete();
      }
      
      // Show success message
      showAlert('Success', 'Product deleted successfully from database', 'success');
      setDeleteConfirmModal({ isOpen: false, productId: null, productTitle: '' });
    } catch (err) {
      console.error('Error deleting product:', err);
      showAlert('Error', err.message || 'Failed to delete product. Please try again.', 'error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {products.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 hover:bg-gray-50">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {product.mainImageUrl || product.imageUrl ? (
                    <img
                      src={product.mainImageUrl || product.imageUrl}
                      alt={product.title}
                      className="h-20 w-20 object-contain rounded border border-gray-200 bg-gray-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`h-20 w-20 bg-gray-100 rounded flex items-center justify-center ${product.mainImageUrl || product.imageUrl ? 'hidden' : ''}`}>
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">{product.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{parseFloat(product.price).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{parseFloat(product.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.scheduledPrice && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className={`text-xs font-medium ${
                          getScheduleStatus(product)?.status === 'active' 
                            ? 'text-green-600' 
                            : getScheduleStatus(product)?.status === 'upcoming'
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }`}>
                          {getScheduleStatus(product)?.message || 'Scheduled'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-[#c54513] hover:text-[#a43a10] hover:bg-[#fde8e1] rounded-md transition-colors"
                      title="Edit product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {onViewReviews && (
                      <button
                        onClick={() => onViewReviews(product)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                        title="View reviews"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(product.id, product.title)}
                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.mainImageUrl || product.imageUrl ? (
                      <img
                        src={product.mainImageUrl || product.imageUrl}
                        alt={product.title}
                        className="h-16 w-16 object-contain rounded border border-gray-200 bg-gray-50"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-16 w-16 bg-gray-100 rounded flex items-center justify-center ${product.mainImageUrl || product.imageUrl ? 'hidden' : ''}`}>
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{parseFloat(product.price).toLocaleString('en-IN')}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ₹{parseFloat(product.originalPrice).toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.scheduledPrice ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className={`text-xs font-medium ${
                            getScheduleStatus(product)?.status === 'active' 
                              ? 'text-green-600' 
                              : getScheduleStatus(product)?.status === 'upcoming'
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`}>
                            {getScheduleStatus(product)?.message || 'Scheduled'}
                          </span>
                        </div>
                          <div className="text-xs text-gray-600">
                          <div>Price: ₹{parseFloat(product.scheduledPrice).toLocaleString('en-IN')}</div>
                          <div className="text-gray-500">
                            {formatDate(product.priceStartDate)} - {formatDate(product.priceEndDate)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400">No schedule</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-[#c54513] hover:text-[#a43a10]"
                        title="Edit product"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {onViewReviews && (
                        <button
                          onClick={() => onViewReviews(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View reviews"
                        >
                          <MessageSquare className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(product.id, product.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete product"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, productId: null, productTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirmModal.productTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}

