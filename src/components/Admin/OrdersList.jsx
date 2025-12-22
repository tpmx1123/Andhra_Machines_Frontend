import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Clock, CheckCircle, Truck, XCircle, Package, Trash2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null, orderNumber: null });
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await api.updateOrderStatus(orderId, newStatus);
      showToast('Order status updated successfully', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast(error.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteClick = (orderId, orderNumber) => {
    setDeleteModal({ isOpen: true, orderId, orderNumber });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteOrder(deleteModal.orderId);
      showToast('Order deleted successfully', 'success');
      setDeleteModal({ isOpen: false, orderId: null, orderNumber: null });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast(error.message || 'Failed to delete order', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, orderId: null, orderNumber: null });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513] mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Orders ({orders.length})</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No orders found</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">{order.shippingAddress.name}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items:</span>
                    <span className="text-gray-900 font-medium">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total:</span>
                    <span className="text-gray-900 font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-2">
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {expandedOrders.has(order.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        View Details
                      </>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c54513] disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleDeleteClick(order.id, order.orderNumber)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {expandedOrders.has(order.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">All Order Items ({order.items.length})</h4>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.productName}</div>
                              <div className="text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="font-medium text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-gray-900 mb-2">Shipping Address</h5>
                        <p className="text-xs text-gray-700">{order.shippingAddress.name}</p>
                        <p className="text-xs text-gray-700">{order.shippingAddress.address}</p>
                        <p className="text-xs text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        {order.shippingAddress.landmark && (
                          <p className="text-xs text-gray-500 mt-1">Landmark: {order.shippingAddress.landmark}</p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-gray-900 mb-2">Contact & Payment</h5>
                        <p className="text-xs text-gray-700">Phone: {order.shippingAddress.phone}</p>
                        <p className="text-xs text-gray-700">Email: {order.shippingAddress.email}</p>
                        <p className="text-xs text-gray-700 mt-1">Payment: <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus.toUpperCase()}</span></p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Discount:</span>
                          <span className="font-medium text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium text-gray-900">Free</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-[#c54513]">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <>
                <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                    <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-gray-900">{order.shippingAddress.name}</div>
                    <div className="text-sm text-gray-500">{order.shippingAddress.email}</div>
                    <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                  </td>
                    <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                    <div className="text-xs text-gray-500">
                      {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{order.total.toLocaleString('en-IN')}</div>
                    {order.discount > 0 && (
                      <div className="text-xs text-green-600">Saved ₹{order.discount.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="p-1.5 text-gray-600 hover:text-[#c54513] hover:bg-gray-50 rounded-md transition-colors"
                          title={expandedOrders.has(order.id) ? "Hide details" : "View all items"}
                        >
                          {expandedOrders.has(order.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#c54513] disabled:opacity-50"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteClick(order.id, order.orderNumber)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                  {expandedOrders.has(order.id) && (
                    <tr>
                      <td colSpan={7} className="px-4 lg:px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">All Order Items ({order.items.length})</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Subtotal:</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</td>
                                  </tr>
                                  {order.discount > 0 && (
                                    <tr>
                                      <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-green-600 text-right">Discount:</td>
                                      <td className="px-4 py-3 text-sm font-semibold text-green-600">-₹{order.discount.toLocaleString('en-IN')}</td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">Delivery:</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">Free</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Total:</td>
                                    <td className="px-4 py-3 text-sm font-bold text-[#c54513]">₹{order.total.toLocaleString('en-IN')}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h5>
                              <p className="text-sm text-gray-700">{order.shippingAddress.name}</p>
                              <p className="text-sm text-gray-700">{order.shippingAddress.address}</p>
                              <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                              {order.shippingAddress.landmark && (
                                <p className="text-sm text-gray-500 mt-1">Landmark: {order.shippingAddress.landmark}</p>
                              )}
                              {order.shippingAddress.deliveryInstructions && (
                                <p className="text-sm text-gray-500 mt-1">Instructions: {order.shippingAddress.deliveryInstructions}</p>
                              )}
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h5 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h5>
                              <p className="text-sm text-gray-700">Phone: {order.shippingAddress.phone}</p>
                              <p className="text-sm text-gray-700">Email: {order.shippingAddress.email}</p>
                              <p className="text-sm text-gray-700 mt-2">Payment Status: <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus.toUpperCase()}</span></p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete order ${deleteModal.orderNumber}? This action cannot be undone.`}
      />
    </div>
  );
}

