import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, ChevronDown, X, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import { shareProduct } from '../../utils/share';
import SEO from '../SEO';
import StructuredData, { generateProductSchema, generateBreadcrumbSchema } from '../StructuredData';
import { useWebSocket } from '../../hooks/useWebSocket';
import { logger } from '../../utils/logger';


const ProductDetail = () => {
  const { productId } = useParams(); // This will now be brand slug
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart: addToCartContext, cartItems, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Product state
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Swipe functionality state
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const imageContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const [productsPerView, setProductsPerView] = useState(4);

  // Track last price update to prevent duplicate toasts
  const lastPriceUpdateRef = useRef({ productId: null, price: null, timestamp: 0 });

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    logger.log('ProductDetail: Price update received:', priceUpdate);
    const productId = Number(priceUpdate.productId);
    const newPrice = parseFloat(priceUpdate.newPrice);
    const originalPrice = priceUpdate.originalPrice ? parseFloat(priceUpdate.originalPrice) : null;
    
    // Only update if this is the current product
    if (product && Number(product.id) === productId) {
      const now = Date.now();
      const lastUpdate = lastPriceUpdateRef.current;
      
      // Check if this is a duplicate update (same product, same price, within 2 seconds)
      const isDuplicate = lastUpdate.productId === productId && 
                          lastUpdate.price === newPrice && 
                          (now - lastUpdate.timestamp) < 2000;
      
      if (isDuplicate && priceUpdate.type !== 'PRICE_SYNC') {
        logger.log('ProductDetail: Skipping duplicate price update toast');
        return;
      }
      
      logger.log(`ProductDetail: Updating price for ${product.title} from ₹${product.price} to ₹${newPrice}`);
      
      setProduct(prevProduct => ({
        ...prevProduct,
        price: newPrice,
        originalPrice: originalPrice || prevProduct.originalPrice,
        // Recalculate discount
        isOnSale: originalPrice && originalPrice > newPrice,
      }));
      
      // Update last price update reference
      lastPriceUpdateRef.current = { productId, price: newPrice, timestamp: now };
      
      // Price updates happen silently - no toast notifications for scheduled prices
    }
  };

  // Subscribe to WebSocket updates
  const { connected } = useWebSocket(handlePriceUpdate, null, null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        // productId is now brand slug, backend handles both ID and slug
        const productData = await api.getProductById(productId);
        setProduct(productData);
        
        // Fetch reviews using product ID from the fetched product
        try {
          const reviewsData = await api.getProductReviews(productData.id);
          setReviews(reviewsData);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setReviews([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Refresh product when WebSocket connects
  useEffect(() => {
    if (connected && productId) {
      const fetchProduct = async () => {
        try {
          const productData = await api.getProductById(productId);
          setProduct(productData);
        } catch (err) {
          logger.error('Error refreshing product:', err);
        }
      };
      fetchProduct();
    }
  }, [connected, productId]);

  // Parse specifications JSON
  const getSpecifications = () => {
    if (!product?.specificationsJson) return {};
    try {
      let specs = product.specificationsJson;
      
      // If it's already an object, return it
      if (typeof specs === 'object' && specs !== null && !Array.isArray(specs)) {
        return specs;
      }
      
      // If it's a string, try to parse it
      if (typeof specs === 'string') {
        // Remove any extra whitespace
        specs = specs.trim();
        
        // If empty, return empty object
        if (!specs) return {};
        
        // Try to parse as JSON
        const parsed = JSON.parse(specs);
        
        // Ensure it's an object, not an array or primitive
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return parsed;
        }
      }
      
      return {};
    } catch (error) {
      console.error('Error parsing specifications:', error, product.specificationsJson);
      return {};
    }
  };

  // Get product images array
  const getProductImages = () => {
    if (!product) return [];
    const images = [];
    if (product.mainImageUrl) images.push(product.mainImageUrl);
    if (product.galleryImages && product.galleryImages.length > 0) {
      images.push(...product.galleryImages);
    }
    if (product.imageUrl && !images.includes(product.imageUrl)) {
      images.push(product.imageUrl);
    }
    return images.length > 0 ? images : ['https://via.placeholder.com/600'];
  };

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        const allProducts = await api.getAllProducts();
        // Filter out current product and get up to 8 related products
        const related = allProducts
          .filter(p => p.id !== product.id && p.isActive !== false)
          .slice(0, 8)
          .map(p => ({
            id: p.id,
            name: p.title,
            brandSlug: p.brandSlug || p.id.toString(),
            price: parseFloat(p.price) || 0,
            image: p.mainImageUrl || p.imageUrl || 'https://via.placeholder.com/300',
            rating: p.rating ? parseFloat(p.rating) : 0
          }));
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Carousel functions - responsive products per view
  useEffect(() => {
    const updateProductsPerView = () => {
      if (window.innerWidth < 640) {
        setProductsPerView(1);
      } else if (window.innerWidth < 1024) {
        setProductsPerView(2);
      } else if (window.innerWidth < 1280) {
        setProductsPerView(3);
      } else {
        setProductsPerView(4);
      }
    };

    updateProductsPerView();
    window.addEventListener('resize', updateProductsPerView);
    return () => window.removeEventListener('resize', updateProductsPerView);
  }, []);

  const maxSlide = Math.max(0, relatedProducts.length - productsPerView);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  // Touch handlers for image swiping
  const handleTouchStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchEndX.current = clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
    setSwipeOffset(clientX - touchStartX.current);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const threshold = 50; // Minimum distance to trigger a swipe
    const difference = touchEndX.current - touchStartX.current;
    const images = getProductImages();
    
    if (Math.abs(difference) > threshold) {
      if (difference > 0 && selectedImage > 0) {
        // Swipe right - go to previous image
        setSelectedImage(prev => prev - 1);
      } else if (difference < 0 && selectedImage < images.length - 1) {
        // Swipe left - go to next image
        setSelectedImage(prev => prev + 1);
      }
    }
    
    // Reset states
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const addToCart = () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      // Update quantity instead of adding again
      updateQuantity(product.id, existingItem.quantity + quantity);
      showToast(`Cart updated! Quantity: ${existingItem.quantity + quantity}`, 'success');
    } else {
      addToCartContext(product, quantity);
      showToast(`${quantity} ${product.title} added to cart!`, 'success');
    }
  };

  const isInCart = cartItems.some(item => item.id === product?.id);
  const cartItem = cartItems.find(item => item.id === product?.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleQuantityChange = (newQuantity) => {
    if (!product) return;
    if (newQuantity < 1) {
      return;
    }
    if (isInCart) {
      updateQuantity(product.id, newQuantity);
      showToast('Cart updated!', 'success');
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!user) {
      showToast('Please login to proceed with purchase', 'error');
      // Redirect to login with current product page as return path
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      // Just navigate to checkout
      navigate('/checkout');
    } else {
      // Add to cart and navigate to checkout
      addToCartContext(product, quantity);
      navigate('/checkout');
    }
  };

  const handleFavorite = () => {
    if (product) {
      toggleFavorite(product, showToast, navigate);
    }
  };

  const handleShare = (platform = 'native') => {
    if (product) {
      shareProduct(product, platform, showToast);
      setShowShareMenu(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to submit a review', 'error');
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const reviewData = {
        userName: user.name || 'Anonymous',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      };
      
      await api.addReview(product.id, reviewData);
      
      // Refresh reviews and product
      const reviewsData = await api.getProductReviews(product.id);
      setReviews(reviewsData);
      
      const productData = await api.getProductById(product.brandSlug || product.id);
      setProduct(productData);
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      showToast('Review submitted successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return 'Recently';
    }
  };

  // Derived values for product and images
  const productImages = getProductImages();
  const rawSpecs = getSpecifications();
  // Ensure specifications is always an object, never a string
  const specifications = (rawSpecs && typeof rawSpecs === 'object' && !Array.isArray(rawSpecs) && rawSpecs !== null) 
    ? rawSpecs 
    : {};
  const highlights = product?.highlights || [];
  const ratingValue = product?.rating;
  
  const productRating = ratingValue ? parseFloat(ratingValue) : 0;
  const reviewCount = product?.reviewCount ?? reviews.length;

  // Handle keyboard navigation for main gallery
  useEffect(() => {
    if (isImageModalOpen || !productImages.length) return; // Don't handle keys if modal is open
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && selectedImage > 0) {
        setSelectedImage(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && selectedImage < productImages.length - 1) {
        setSelectedImage(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, productImages.length, isImageModalOpen]);

  // Handle keyboard navigation for modal
  useEffect(() => {
    if (!isImageModalOpen || !productImages.length) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
        document.body.style.overflow = 'unset';
      } else if (e.key === 'ArrowLeft' && modalImageIndex > 0) {
        setModalImageIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && modalImageIndex < productImages.length - 1) {
        setModalImageIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, modalImageIndex, productImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link to="/products" className="text-[#c54513] hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Generate SEO and structured data
  const productSchema = generateProductSchema({
    id: product.id,
    name: product.title,
    description: product.description || `${product.title} - Premium sewing machine from ${product.brandName || 'Andhra Machines Agencies'}`,
    images: productImages,
    brand: product.brandName,
    price: product.price,
    rating: productRating,
    reviewsCount: reviewCount
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.title, url: `/products/${product.brandSlug || product.id}` }
  ]);

  return (
    <>
      <SEO
        title={`${product.title} - Buy Online | ${product.brandName || ''} Sewing Machine | Andhra Machines Agencies`}
        description={product.description || `Buy ${product.title} online. Premium ${product.brandName || ''} sewing machine at best price. Free delivery across India. Expert service & genuine products.`}
        keywords={`${product.title}, ${product.brandName} sewing machine, buy ${product.title} online, sewing machine price, ${product.category} sewing machine`}
        image={productImages[0] || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png'}
        type="product"
      />
      <StructuredData data={productSchema} />
      <StructuredData data={breadcrumbSchema} />
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#c54513] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-[#c54513] transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-400 truncate">{product.title}</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Image gallery */}
          <div className="mb-6 lg:mb-0">
            {/* Main Image */}
            <div 
              className="w-full bg-gray-50 rounded-xl overflow-hidden shadow-sm mb-4 relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              ref={imageContainerRef}
              role="region"
              aria-label="Product image gallery"
              tabIndex={0}
            >
              {/* Like and Share Buttons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite();
                  }}
                  className={`p-2 bg-white rounded-full shadow-md transition-colors ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare('native');
                  }}
                  className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-[#c54513] transition-colors"
                  title="Share"
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              
              {/* Navigation Arrows */}
              {selectedImage > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(prev => Math.max(0, prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
              )}
              
              {selectedImage < productImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(prev => Math.min(productImages.length - 1, prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              )}
              
              {/* Image with swipe effect - Clickable to open modal */}
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out cursor-zoom-in"
                style={{
                  transform: `translateX(${swipeOffset}px)`,
                  touchAction: 'pan-y',
                }}
                onClick={() => {
                  setModalImageIndex(selectedImage);
                  setIsImageModalOpen(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={`${product.title} - Image ${selectedImage + 1}`}
                  className="w-full h-auto max-h-[600px] object-contain object-center select-none"
                  draggable="false"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600';
                  }}
                />
              </div>
              
              {/* Image indicator dots */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${index === selectedImage ? 'bg-[#c54513] w-6' : 'bg-gray-300'}`}
                      aria-label={`View image ${index + 1} of ${productImages.length}`}
                      aria-current={index === selectedImage ? 'true' : 'false'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  onDoubleClick={() => {
                    setModalImageIndex(index);
                    setIsImageModalOpen(true);
                    document.body.style.overflow = 'hidden';
                  }}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index
                    ? 'border-[#c54513] ring-2 ring-[#c54513] ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Specifications Section - Always below images */}
            {specifications && 
             typeof specifications === 'object' && 
             !Array.isArray(specifications) &&
             specifications !== null &&
             Object.keys(specifications).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(specifications)
                    .filter(([key, value]) => {
                      // Only show valid key-value pairs
                      return key && 
                             key !== null && 
                             typeof key === 'string' && 
                             value !== null && 
                             value !== undefined &&
                             (typeof value === 'string' || typeof value === 'number');
                    })
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <dt className="text-sm font-semibold text-gray-700 mb-1 sm:mb-0 sm:w-1/3 sm:pr-4">{key}:</dt>
                        <dd className="text-sm text-gray-900 sm:w-2/3">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="mb-4">
              {product.brandName && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#c54513]/10 text-[#c54513] mb-3">
                  {product.brandName}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center flex-wrap gap-3 mb-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{parseFloat(product.price || 0).toLocaleString('en-IN')}
                    {quantity > 1 && (
                      <span className="text-lg sm:text-xl text-gray-500 font-normal ml-2">
                        (₹{parseFloat(product.price || 0).toLocaleString('en-IN')} × {quantity})
                      </span>
                    )}
                  </p>
                  {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                    <p className="text-lg sm:text-xl text-gray-400 line-through">₹{parseFloat(product.originalPrice).toLocaleString('en-IN')}</p>
                  )}
                </div>
                {product.isOnSale && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    On Sale
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    New
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {product.inStock ? (
                  <p className="text-sm font-medium text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    In stock and ready to ship
                  </p>
                ) : (
                  <p className="text-sm font-medium text-red-600">Out of stock</p>
                )}

                {/* Reviews */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        fill={rating < Math.floor(productRating) ? 'currentColor' : 'none'}
                        className={`h-5 w-5 ${rating < Math.floor(productRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                          }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    {productRating.toFixed(1)} ({reviewCount} reviews)
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-base text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
            </div>


            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:inline">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                  <button
                    type="button"
                    className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-[#c54513] text-lg sm:text-xl font-semibold transition-colors"
                    onClick={() => handleQuantityChange(isInCart ? cartQuantity - 1 : quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 sm:w-16 text-center font-semibold text-gray-900 text-base sm:text-lg">
                    {isInCart ? cartQuantity : quantity}
                  </span>
                  <button
                    type="button"
                    className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-[#c54513] text-lg sm:text-xl font-semibold transition-colors"
                    onClick={() => handleQuantityChange(isInCart ? cartQuantity + 1 : quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {product.inStock ? (
                  <>
                    {isInCart ? (
                      <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="flex-1 min-w-0 bg-green-600 border border-transparent rounded-lg py-2.5 sm:py-3 px-2 sm:px-4 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all shadow-md hover:shadow-lg"
                      >
                        <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">View Cart ({cartQuantity})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={addToCart}
                        className="flex-1 min-w-0 bg-[#c54513] border border-transparent rounded-lg py-2.5 sm:py-3 px-2 sm:px-4 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-white hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-all shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">Add to cart</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 min-w-0 bg-white border-2 border-[#c54513] rounded-lg py-2.5 sm:py-3 px-2 sm:px-4 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-[#c54513] hover:bg-[#c54513] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      <span className="text-xs sm:text-sm md:text-base">Buy Now</span>
                    </button>
                  </>
                ) : (
                  <div className="flex-1 min-w-0 bg-gray-300 border border-transparent rounded-lg py-2.5 sm:py-3 px-2 sm:px-4 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold text-gray-600 cursor-not-allowed">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Warranty & Service Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty & Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Warranty</h4>
                  <p className="text-sm text-gray-700">1-5 years manufacturer warranty covering defects and parts. Extended warranty options available.</p>
                    </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Installation</h4>
                  <p className="text-sm text-gray-700">Free installation service at your location within 24-48 hours of purchase.</p>
              </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Support</h4>
                  <p className="text-sm text-gray-700">Dedicated customer support team available for assistance and technical queries.</p>
                      </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Delivery</h4>
                  <p className="text-sm text-gray-700">Fast and secure delivery with tracking. Free delivery on orders above ₹10,000.</p>
                      </div>
                        </div>
                      </div>

            {/* Key Features Section */}
            {highlights.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlights.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      <span className="text-[#c54513] mr-2 font-bold text-lg">✓</span>
                      <span>{feature}</span>
                    </li>
                            ))}
                </ul>
                          </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Customer Reviews ({reviewCount})</h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] text-sm font-medium"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        className={`p-1 ${reviewForm.rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star fill={reviewForm.rating >= rating ? 'currentColor' : 'none'} className="h-6 w-6" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{reviewForm.rating} out of 5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-transparent"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({ rating: 5, comment: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-[#c54513] text-white rounded-md hover:bg-[#a43a10] disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <Link to="/login" className="font-medium underline">Login</Link> to write a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{review.userName || 'Anonymous'}</h4>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <Star
                          key={rating}
                          fill={rating < review.rating ? 'currentColor' : 'none'}
                          className={`h-3 w-3 ${rating < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">FAQs</h2>

          <div className="space-y-2">
            {[
              {
                question: 'What is the warranty period?',
                answer: '1 - 5 years manufacturer warranty covering defects and parts. Extended warranty options available.'
              },
              {
                question: 'Does it come with accessories?',
                answer: 'Yes, includes bobbins, needles, presser feet, and user manual. Additional accessories available separately.'
              },
              {
                question: 'Is installation included?',
                answer: 'Yes, free installation service at your location within 24-48 hours of purchase.'
              },
              {
                question: 'Can it handle heavy fabrics?',
                answer: 'Yes, designed for various fabrics including denim, canvas, and leather with adjustable settings.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100"
              >
                <button
                  className="w-full py-3 text-left flex justify-between items-center hover:text-[#c54513] transition-colors"
                  onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 h-4 w-4 ${openFAQIndex === index ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>
                {openFAQIndex === index && (
                  <div className="pb-3">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related products - Swipeable Carousel */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You may also like</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-2 rounded-full border-2 transition-all ${currentSlide === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#c54513] text-[#c54513] hover:bg-[#c54513] hover:text-white'
                  }`}
                aria-label="Previous products"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
                className={`p-2 rounded-full border-2 transition-all ${currentSlide >= maxSlide
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#c54513] text-[#c54513] hover:bg-[#c54513] hover:text-white'
                  }`}
                aria-label="Next products"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentSlide * (100 / productsPerView)}% - ${currentSlide * 1}rem))`,
                gap: '1rem'
              }}
            >
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.brandSlug || product.id}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                  style={{
                    width: `calc((100% - ${Math.max(0, productsPerView - 1) * 1}rem) / ${productsPerView})`
                  }}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#c54513] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <Star
                            key={rating}
                            fill={rating < Math.floor(product.rating) ? 'currentColor' : 'none'}
                            className={`h-4 w-4 ${rating < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                              }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">₹{parseFloat(product.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Carousel indicators */}
          {maxSlide > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${currentSlide === index
                    ? 'w-8 bg-[#c54513]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - E-commerce Style */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={() => {
            setIsImageModalOpen(false);
            document.body.style.overflow = 'unset';
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            if (!isSwiping) return;
            const threshold = 50;
            const difference = touchEndX.current - touchStartX.current;
            
            if (Math.abs(difference) > threshold) {
              if (difference > 0 && modalImageIndex > 0) {
                setModalImageIndex(prev => prev - 1);
              } else if (difference < 0 && modalImageIndex < productImages.length - 1) {
                setModalImageIndex(prev => prev + 1);
              }
            }
            setIsSwiping(false);
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsImageModalOpen(false);
              document.body.style.overflow = 'unset';
            }}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
              {productImages.length > 1 && modalImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(prev => prev - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}

              {/* Next Button */}
              {productImages.length > 1 && modalImageIndex < productImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(prev => prev + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}

          {/* Main Image Container - Fixed dimensions */}
          <div
            className="relative w-full h-full flex items-center justify-center px-4 py-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
              <img
                src={productImages[modalImageIndex]}
                alt={`${product.title} - Image ${modalImageIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '80vh',
                  width: 'auto',
                  height: 'auto'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600';
                }}
              />
            </div>
          </div>

          {/* Image Counter */}
          {productImages.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {modalImageIndex + 1} / {productImages.length}
            </div>
          )}

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-3 max-w-[90vw] overflow-x-auto px-4 py-3 bg-black/30 rounded-lg backdrop-blur-sm">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    modalImageIndex === index
                      ? 'border-white ring-2 ring-white scale-110'
                      : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ProductDetail;
