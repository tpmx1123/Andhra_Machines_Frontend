import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { logger } from '../utils/logger';

export default function SearchResults() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  
  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await api.getAllProducts();
        setAllProducts(products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search query
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }
    
    // Filter products from database
    const results = allProducts
      .filter(product => product.isActive !== false)
      .filter(product => {
        const title = (product.title || '').toLowerCase();
        const brandName = (product.brandName || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        return title.includes(query) ||
               brandName.includes(query) ||
               description.includes(query);
      })
      .map(product => {
        // Calculate discount percentage
        const discount = product.originalPrice && product.originalPrice > product.price
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;
        
        return {
          id: product.id,
          name: product.title,
          brand: product.brandName || 'Unknown',
          brandSlug: product.brandSlug || product.id.toString(),
          description: product.description || '',
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
          image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
          rating: product.rating ? parseFloat(product.rating) : 0,
          reviewCount: product.reviewCount || 0,
          isNew: product.isNew || false,
          isOnSale: product.isOnSale || false,
          inStock: product.inStock !== false,
          discount: discount
        };
      });
    
    setFilteredProducts(results);
  }, [location.search, allProducts]);

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    logger.log('Price update received in SearchResults:', priceUpdate);
    const productId = Number(priceUpdate.productId);
    const newPrice = parseFloat(priceUpdate.newPrice);
    const originalPrice = priceUpdate.originalPrice ? parseFloat(priceUpdate.originalPrice) : null;
    
    setAllProducts(prevProducts => {
      return prevProducts.map(product => {
        // Compare IDs as numbers to handle type mismatches
        if (Number(product.id) === productId) {
          logger.log(`Updating product ${product.id} price from ${product.price} to ${newPrice}`);
          return {
            ...product,
            price: newPrice,
            originalPrice: originalPrice || product.originalPrice
          };
        }
        return product;
      });
    });
  };

  // Subscribe to WebSocket updates for real-time price changes
  const { connected } = useWebSocket(handlePriceUpdate, null, null);

  // Refresh products when WebSocket connects to get latest prices
  useEffect(() => {
    if (connected) {
      logger.log('WebSocket connected - refreshing search products to sync prices');
      const fetchProducts = async () => {
        try {
          const products = await api.getAllProducts();
          setAllProducts(products || []);
          logger.log('Search products refreshed after WebSocket connection');
        } catch (err) {
          logger.error('Error refreshing search products:', err);
        }
      };
      fetchProducts();
    }
  }, [connected]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513] mx-auto mb-4"></div>
            <h2 className="text-3xl font-extrabold text-gray-900">Searching for products...</h2>
          </div>
        </div>
      </div>
    );
  }

  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {filteredProducts.length} results for "{searchQuery}"
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#c54513] hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513]"
              >
                View All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <Link to={`/products/${product.brandSlug}`} className="relative h-56 bg-gray-50 overflow-hidden block">
                  <img
                    src={product.image}
                    alt={product.name}
                    width="300"
                    height="300"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  
                  {/* Discount and Brand Tags */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.discount > 0 && (
                      <span className="inline-block bg-[#c54513] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                    <span className="inline-block bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {product.brand}
                    </span>
                  </div>

                  {/* New and Sale Badges */}
                  {product.isNew && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      New
                    </div>
                  )}
                  {product.isOnSale && !product.isNew && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Sale
                    </div>
                  )}
                  
                  {/* Out of Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                </Link>
                <div className="flex-1 p-3 sm:p-4 flex flex-col">
                  <Link to={`/products/${product.brandSlug}`} className="group">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{product.brand}</p>
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <Star
                            key={rating}
                            fill={rating < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              rating < Math.floor(product.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">
                        {product.reviewCount} reviews
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-sm sm:text-base font-medium text-gray-900 flex-shrink-0">
                        ₹{product.price.toLocaleString('en-IN')}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                      <div className="flex space-x-1 sm:space-x-2 relative z-10 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product, showToast, navigate);
                          }}
                          className={`p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0 ${
                            isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                          title={isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} aria-hidden="true" />
                        </button>
                        {product.inStock ? (
                          cartQuantities[product.id] ? (
                            <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleQuantityChange(product.id, cartQuantities[product.id] - 1);
                                }}
                                className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 py-1 text-xs font-medium">
                                {cartQuantities[product.id]}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleQuantityChange(product.id, cartQuantities[product.id] + 1);
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
                                handleAddToCart(product);
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
