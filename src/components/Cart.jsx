import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const convertToINR = (usdPrice) => {
    return Math.round(usdPrice * 83);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (convertToINR(item.price) * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => 
    sum + ((convertToINR(item.originalPrice) - convertToINR(item.price)) * item.quantity), 0);
  const total = subtotal;
  const deliveryCharge = total > 0 ? 0 : 0; // Free delivery for all orders

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500">Review and manage your items</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-1 text-gray-500">Browse our products and add items to your cart</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            {/* Cart items */}
            <div className="lg:col-span-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row">
                        <Link 
                          to={`/products/${item.id}`}
                          className="flex-shrink-0 w-full sm:w-32 mb-4 sm:mb-0 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-contain"
                          />
                        </Link>

                        <div className="flex-1 sm:ml-6">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                <Link to={`/products/${item.id}`} className="hover:text-[#c54513] transition-colors">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                              {!item.inStock && (
                                <p className="mt-1 text-sm text-red-600">Out of Stock</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex-1 flex items-end justify-between sm:mt-0 sm:block">
                            <div className="sm:hidden text-sm text-gray-500">
                              <span className="font-medium text-gray-900">₹{Math.round(item.price * 83).toLocaleString('en-IN')}</span>
                              {item.originalPrice > item.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ₹{Math.round(item.originalPrice * 83).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-6">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <span className="sr-only">Decrease quantity</span>
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <span className="sr-only">Increase quantity</span>
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  ₹{(convertToINR(item.price) * item.quantity).toLocaleString('en-IN')}
                                </p>
                                {item.originalPrice > item.price && (
                                  <p className="text-xs text-gray-500 line-through">
                                    ₹{(convertToINR(item.originalPrice) * item.quantity).toLocaleString('en-IN')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0 lg:col-span-4">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Discount</span>
                      <span className="text-sm text-green-600">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delivery</span>
                    <span className="text-sm">
                      {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-base font-bold">₹{(total + deliveryCharge).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Including all taxes</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#c54513] hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    or{' '}
                    <Link to="/products" className="font-medium text-[#c54513] hover:text-[#a43a10]">
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Our customer service team is available 24/7 to assist you with any questions.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href="tel:+919876543210" className="hover:text-[#c54513]">+91 98765 43210</a>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:support@msewingmachines.com" className="hover:text-[#c54513]">support@msewingmachines.com</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
