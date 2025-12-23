import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function ProductsSection() {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await api.getAllProducts();
        // Get first 4 active products (or featured products)
        const featuredProducts = allProducts
          .filter(p => p.isActive !== false)
          .slice(0, 4)
          .map(product => {
            // Calculate discount percentage
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            // Get highlights/features (first 3)
            const features = product.highlights && product.highlights.length > 0
              ? product.highlights.slice(0, 3)
              : ['High Quality', 'Reliable', 'Easy to Use'];

            return {
              id: product.id,
              name: product.title,
              brandSlug: product.brandSlug || product.id.toString(),
              price: parseFloat(product.price) || 0,
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
              rating: product.rating ? parseFloat(product.rating) : 0,
              image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
              discount: discount,
              category: product.brandName || 'Featured',
              features: features,
              inStock: product.inStock !== false
            };
          });
        setProducts(featuredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update cart quantities when cartItems change
  useEffect(() => {
    const quantities = {};
    cartItems.forEach(item => {
      quantities[item.id] = item.quantity;
    });
    setCartQuantities(quantities);
  }, [cartItems]);

  const handleAddToCart = (product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }
    
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#f8f6f6] bg-[#eb5a2a]  rounded-full mb-4">
            OUR COLLECTION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Sewing Machines
          </h2>
          <div className="w-20 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of high-quality sewing machines for every skill level
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          ) : (
            products.map((product) => (
            <Link 
              to={`/products/${product.brandSlug || product.id}`}
              key={product.id} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 block"
            >
              <div className="relative h-56 bg-gray-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Sewing+Machine';
                  }}
                />
                
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.discount > 0 && (
                    <span className="inline-block bg-[#c54513] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                  <span className="inline-block bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(product, showToast, navigate);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      toggleFavorite(product, showToast, navigate);
                    }
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    isFavorite(product.id) 
                      ? 'text-red-500 bg-white/90' 
                      : 'text-gray-400 bg-white/80 hover:bg-white'
                  }`}
                  title={isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart 
                    size={20} 
                    className={isFavorite(product.id) ? 'fill-current' : ''} 
                  />
                </button>
                
                {/* Out of Stock Badge */}
                {!product.inStock && (
                  <div className="absolute top-3 left-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.rating})
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
                  {product.name}
                </h3>

                <ul className="mb-4 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-[#c54513] rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.inStock ? (
                      cartQuantities[product.id] ? (
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(product.id, cartQuantities[product.id] - 1);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {cartQuantities[product.id]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(product.id, cartQuantities[product.id] + 1);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }
                          }}
                          className="px-4 py-2 bg-[#c54513] text-white text-sm font-medium rounded-lg hover:bg-[#a5380e] transition-colors flex items-center gap-2"
                          title="Add to cart"
                        >
                          <ShoppingCart size={16} />
                          
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                        title="Out of stock"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10] transition-colors shadow-sm"
          >
            View All Products
            <ChevronRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
