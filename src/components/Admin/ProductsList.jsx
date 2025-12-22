import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Edit, Trash2, Image as ImageIcon, Package, MessageSquare, Clock } from 'lucide-react';

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
    // Get current time in IST (Asia/Kolkata) timezone
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + (istOffset - now.getTimezoneOffset() * 60 * 1000));
    
    // Parse dates - backend sends LocalDateTime which should be interpreted as IST
    // Convert to IST for comparison
    const startDateStr = product.priceStartDate;
    const endDateStr = product.priceEndDate;
    
    // If dates are in ISO format, parse them and treat as IST
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    
    // If the date string doesn't have timezone info, assume it's IST
    if (!startDateStr.includes('Z') && !startDateStr.includes('+') && !startDateStr.includes('-', 10)) {
      // Date is timezone-naive, add IST offset
      const startDateUTC = new Date(startDateStr + '+05:30');
      startDate = startDateUTC;
    }
    
    if (!endDateStr.includes('Z') && !endDateStr.includes('+') && !endDateStr.includes('-', 10)) {
      const endDateUTC = new Date(endDateStr + '+05:30');
      endDate = endDateUTC;
    }
    
    // Compare current IST time with schedule dates
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

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getAllProducts();
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.deleteProduct(id);
      
      // Refresh the products list to reflect the deletion
      await fetchProducts();
      
      // Also trigger parent refresh if callback provided
      if (onDelete) {
        onDelete();
      }
      
      // Show success message
      alert('Product deleted successfully from database');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.message || 'Failed to delete product. Please try again.');
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
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
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
                      onClick={() => handleDelete(product.id)}
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
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
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
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
}

