import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { logger } from '../utils/logger';

export default function Checkout() {
  const { cartItems, clearCart, updateProductPrice } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    logger.log('Checkout: Price update received:', priceUpdate);
    const productId = Number(priceUpdate.productId);
    const newPrice = parseFloat(priceUpdate.newPrice);
    const originalPrice = priceUpdate.originalPrice ? parseFloat(priceUpdate.originalPrice) : null;
    
    // Check if the updated product is in the cart
    const cartItem = cartItems.find(item => Number(item.id) === productId);
    if (cartItem) {
      logger.log(`Checkout: Updating price for ${cartItem.name} from ₹${cartItem.price} to ₹${newPrice}`);
      // Update the price in cart
      updateProductPrice(
        productId,
        newPrice,
        originalPrice || newPrice
      );
      // Price updates happen silently - no toast notifications for scheduled prices
    }
  };

  // Subscribe to WebSocket updates
  useWebSocket(handlePriceUpdate, null, null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    deliveryInstructions: ''
  });

  const [errors, setErrors] = useState({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('Please login to proceed with checkout', 'error');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, authLoading, navigate, location.pathname, showToast]);

  // Calculate subtotal using original prices (before discount)
  const subtotal = cartItems.reduce((sum, item) => {
    const originalPrice = item.originalPrice ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice)) : (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0);
    return sum + (originalPrice * item.quantity);
  }, 0);
  
  // Calculate discount (difference between original and current price)
  const discount = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const originalPrice = item.originalPrice ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice)) : price;
    const itemDiscount = (originalPrice - price) * item.quantity;
    return sum + (itemDiscount > 0 ? itemDiscount : 0);
  }, 0);
  
  // Total is subtotal minus discount
  const total = subtotal - discount;
  const deliveryCharge = 0; // Free delivery

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user || !isAuthenticated) {
      showToast('Please login to place an order', 'error');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          originalPrice: item.originalPrice ? (typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice)) : (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0),
          accessories: item.accessories || []
        })),
        shippingAddress: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark || '',
          deliveryInstructions: formData.deliveryInstructions || ''
        },
        paymentMethod: 'whatsapp',
        paymentId: null
      };

      const orderResponse = await api.createOrder(orderData);
      
      if (orderResponse.success) {
        // Prepare order summary for WhatsApp
        const orderItems = cartItems.map(item => 
          `• ${item.name} (Qty: ${item.quantity}) - ₹${((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toLocaleString('en-IN')}`
        ).join('\n');

        const orderSummary = `
*Order Number: ${orderResponse.data.orderNumber}*

*Order Details:*

${orderItems}

*Price Summary:*
Subtotal: ₹${subtotal.toLocaleString('en-IN')}
${discount > 0 ? `Discount: -₹${discount.toLocaleString('en-IN')}\n` : ''}Delivery: Free
*Total: ₹${(total + deliveryCharge).toLocaleString('en-IN')}*

*Delivery Address:*
${formData.fullName}
${formData.address}
${formData.city}, ${formData.state} - ${formData.pincode}
${formData.landmark ? `Landmark: ${formData.landmark}\n` : ''}${formData.deliveryInstructions ? `Instructions: ${formData.deliveryInstructions}\n` : ''}
*Contact:*
Phone: ${formData.phone}
Email: ${formData.email}

✅ *GST Invoice will be provided with this order*
📄 Valid GST invoice as per Government of India regulations.
        `.trim();

        // WhatsApp number with country code
        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER; 
        const whatsappMessage = encodeURIComponent(orderSummary);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

        // Clear cart
        clearCart();
        
        // Show success message
        showToast('Order placed successfully! Redirecting to WhatsApp...', 'success');
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          navigate('/profile?tab=orders');
        }, 1000);
      } else {
        throw new Error(orderResponse.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showToast(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
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
  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-gray-500">Add items to your cart to proceed with checkout</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#c54513] mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513]"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    rows={2}
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513]"
                  />
                </div>

                {/* GST Invoice Message before Place Order */}
                <div className="mt-6 mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-800">📄 GST Invoice will be provided with this order</p>
                      <p className="text-xs text-green-700 mt-1">Valid GST invoice as per Government of India regulations.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#c54513] text-white text-base font-semibold rounded-md hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : 'Submit & Continue to WhatsApp'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-6 lg:mt-0">
            <div className="bg-white shadow-sm rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100">
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
                        ₹{((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toLocaleString('en-IN')}
                      </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-xl font-bold text-[#c54513]">
                    ₹{(total + deliveryCharge).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* GST Invoice Message */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800">GST Invoice Available</p>
                    <p className="text-xs text-green-700 mt-1">Invoice will be issued as per Government of India GST regulations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

