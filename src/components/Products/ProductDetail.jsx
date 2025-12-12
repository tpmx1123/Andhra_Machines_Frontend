import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Check, ChevronDown } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { shareProduct } from '../../utils/share';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  // Mock product data - in a real app, this would be an API call
  const product = {
    id: 'usha-excel',
    name: 'Usha Excel Automatic Sewing Machine',
    brand: 'Usha',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.5,
    reviewCount: 128,
    description: 'The Usha Excel Automatic is a versatile sewing machine perfect for all your sewing needs. With 110 built-in stitches, automatic needle threader, and LCD display, it makes sewing easy and enjoyable.',
    features: [
      '110 Built-in Stitches',
      'Automatic Needle Threader',
      '7 One-Step Buttonholes',
      'LCD Display',
      'Adjustable Stitch Length & Width',
      'Free Arm for Cuffs & Hems',
      'Included Accessories: 6 Presser Feet, Needle Set, Bobbins, Spool Caps'
    ],
    specifications: {
      'Type': 'Computerized',
      'Stitches': '110',
      'Buttonholes': '7 one-step',
      'Stitch Width': '5mm',
      'Stitch Length': '4mm',
      'Speed': '800 stitches per minute',
      'Warranty': '2 years'
    },
    images: [
      'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429697/usha1_f9149b.jpg',
      'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429696/usha2_otvgss.jpg',
      'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429695/usha3_t0vfrm.webp'
    ],
    inStock: true,
    isNew: true,
    isOnSale: true,
    sku: 'USHA-EXCEL-001',
    category: 'domestic',
    tags: ['sewing-machine', 'domestic', 'computerized', 'automatic']
  };

  const accessories = [
    {
      id: 'sewing-needles-set',
      name: 'Premium Sewing Needles Set',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.6,
      description: 'Set of 20 assorted needles'
    },
    {
      id: 'thread-spools',
      name: 'Thread Spools Pack (10 Colors)',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      description: 'High-quality thread in 10 colors'
    },
    {
      id: 'sewing-scissors',
      name: 'Professional Sewing Scissors',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      description: 'Sharp precision scissors'
    },
    {
      id: 'bobbin-set',
      name: 'Extra Bobbins Set (10 pcs)',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      description: 'Plastic bobbins for all machines'
    }
  ];

  const relatedProducts = [
    {
      id: 'singer-tradition',
      name: 'Singer Tradition 2250',
      price: 199.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.7
    },
    {
      id: 'brother-cs6000i',
      name: 'Brother CS6000i',
      price: 349.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.7
    },
    {
      id: 'juki-hzl-f600',
      name: 'JUKI HZL-F600',
      price: 1199.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.9
    },
    {
      id: 'jack-f4',
      name: 'Jack F4 Industrial',
      price: 899.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.6
    },
    {
      id: 'janome-memorycraft',
      name: 'Janome Memory Craft 9850',
      price: 899.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.6
    },
    {
      id: 'singer-heavy-duty',
      name: 'Singer Heavy Duty 4423',
      price: 279.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.4
    },
    {
      id: 'brother-overlock',
      name: 'Brother 1034D Overlock',
      price: 349.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.5
    },
    {
      id: 'juki-tl2010q',
      name: 'JUKI TL-2010Q',
      price: 1299.99,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      rating: 4.9
    }
  ];

  const [selectedAccessories, setSelectedAccessories] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const toggleAccessory = (accessoryId) => {
    setSelectedAccessories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accessoryId)) {
        newSet.delete(accessoryId);
      } else {
        newSet.add(accessoryId);
      }
      return newSet;
    });
  };

  const calculateTotalPrice = () => {
    const accessoriesTotal = accessories
      .filter(acc => selectedAccessories.has(acc.id))
      .reduce((sum, acc) => sum + acc.price, 0);
    return (product.price * quantity) + accessoriesTotal;
  };

  // Carousel functions - responsive products per view
  const [productsPerView, setProductsPerView] = useState(4);

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
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const convertToINR = (usdPrice) => {
    return Math.round(usdPrice * 83);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    const selectedAccessoriesList = accessories.filter(acc => selectedAccessories.has(acc.id));
    addToCartContext(product, quantity, selectedAccessoriesList);
    // Show success message
    alert(`${quantity} ${product.name} added to cart!`);
    // Optionally navigate to cart
    // navigate('/cart');
  };

  const handleBuyNow = () => {
    const selectedAccessoriesList = accessories.filter(acc => selectedAccessories.has(acc.id));
    addToCartContext(product, quantity, selectedAccessoriesList);
    navigate('/cart');
  };

  const handleFavorite = () => {
    toggleFavorite(product);
  };

  const handleShare = (platform = 'native') => {
    shareProduct(product, platform);
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#c54513] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-[#c54513] transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-400 truncate">{product.name}</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Image gallery */}
          <div className="mb-6 lg:mb-0">
            {/* Main Image */}
            <div className="w-full bg-gray-50 rounded-xl overflow-hidden shadow-sm mb-4 relative">
              {/* Like and Share Buttons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  onClick={handleFavorite}
                  className={`p-2 bg-white rounded-full shadow-md transition-colors ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleShare('native')}
                  className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-[#c54513] transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto max-h-[600px] object-contain object-center"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                    ? 'border-[#c54513] ring-2 ring-[#c54513] ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Specifications Section - Desktop only */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{key}</dt>
                    <dd className="text-sm font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Product info */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#c54513]/10 text-[#c54513] mb-3">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center flex-wrap gap-3 mb-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{convertToINR(product.price * quantity).toLocaleString('en-IN')}
                    {quantity > 1 && (
                      <span className="text-lg sm:text-xl text-gray-500 font-normal ml-2">
                        (₹{convertToINR(product.price).toLocaleString('en-IN')} × {quantity})
                      </span>
                    )}
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg sm:text-xl text-gray-400 line-through">₹{convertToINR(product.originalPrice * quantity).toLocaleString('en-IN')}</p>
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
                        fill={rating < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        className={`h-5 w-5 ${rating < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                          }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="text-[#c54513] mr-2 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="h-12 w-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-[#c54513] text-xl font-semibold transition-colors"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-semibold text-gray-900 text-lg">{quantity}</span>
                  <button
                    type="button"
                    className="h-12 w-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-[#c54513] text-xl font-semibold transition-colors"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  className="flex-1 min-w-[140px] bg-[#c54513] border border-transparent rounded-lg py-3 px-4 sm:px-6 flex items-center justify-center text-sm sm:text-base font-semibold text-white hover:bg-[#a43a10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-all shadow-md hover:shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Add to cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[120px] bg-white border-2 border-[#c54513] rounded-lg py-3 px-4 sm:px-6 flex items-center justify-center text-sm sm:text-base font-semibold text-[#c54513] hover:bg-[#c54513] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Specifications Section - Mobile only */}
            <div className="lg:hidden mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{key}</dt>
                    <dd className="text-sm font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Frequently Bought Together Section - Mobile only */}
            <div className="lg:hidden mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-[#c54513]" />
                Frequently Bought Together
              </h3>

              <div className="space-y-3">
                {accessories.map((accessory) => {
                  const isSelected = selectedAccessories.has(accessory.id);
                  return (
                    <div
                      key={accessory.id}
                      onClick={() => toggleAccessory(accessory.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                        ? 'border-[#c54513] bg-[#c54513]/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'border-[#c54513] bg-[#c54513]'
                        : 'border-gray-300'
                        }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>

                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {accessory.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{accessory.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <Star
                                key={rating}
                                fill={rating < Math.floor(accessory.rating) ? 'currentColor' : 'none'}
                                className={`h-3 w-3 ${rating < Math.floor(accessory.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({accessory.rating})</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">₹{convertToINR(accessory.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Price */}
              {selectedAccessories.size > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Total for bundle:</span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 line-through">
                        ₹{convertToINR((product.originalPrice || product.price) * quantity + accessories.filter(acc => selectedAccessories.has(acc.id)).reduce((sum, acc) => sum + acc.price, 0)).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xl font-bold text-[#c54513]">
                        ₹{convertToINR(calculateTotalPrice()).toLocaleString('en-IN')}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          (Product: ₹{convertToINR(product.price * quantity).toLocaleString('en-IN')} + Accessories: ₹{convertToINR(accessories.filter(acc => selectedAccessories.has(acc.id)).reduce((sum, acc) => sum + acc.price, 0)).toLocaleString('en-IN')})
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const selectedAccessoriesList = accessories.filter(acc => selectedAccessories.has(acc.id));
                      addToCartContext(product, quantity, selectedAccessoriesList);
                      alert(`Bundle with ${selectedAccessoriesList.length} accessories added to cart!`);
                    }}
                    className="w-full bg-[#c54513] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#a43a10] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add Bundle to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Frequently Bought Together Section - Desktop only */}
            <div className="hidden lg:block mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-[#c54513]" />
                Frequently Bought Together
              </h3>

              <div className="space-y-3">
                {accessories.map((accessory) => {
                  const isSelected = selectedAccessories.has(accessory.id);
                  return (
                    <div
                      key={accessory.id}
                      onClick={() => toggleAccessory(accessory.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                        ? 'border-[#c54513] bg-[#c54513]/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'border-[#c54513] bg-[#c54513]'
                        : 'border-gray-300'
                        }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>

                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {accessory.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{accessory.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <Star
                                key={rating}
                                fill={rating < Math.floor(accessory.rating) ? 'currentColor' : 'none'}
                                className={`h-3 w-3 ${rating < Math.floor(accessory.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({accessory.rating})</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">₹{convertToINR(accessory.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Price */}
              {selectedAccessories.size > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Total for bundle:</span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 line-through">
                        ₹{convertToINR((product.originalPrice || product.price) * quantity + accessories.filter(acc => selectedAccessories.has(acc.id)).reduce((sum, acc) => sum + acc.price, 0)).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xl font-bold text-[#c54513]">
                        ₹{convertToINR(calculateTotalPrice()).toLocaleString('en-IN')}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          (Product: ₹{convertToINR(product.price * quantity).toLocaleString('en-IN')} + Accessories: ₹{convertToINR(accessories.filter(acc => selectedAccessories.has(acc.id)).reduce((sum, acc) => sum + acc.price, 0)).toLocaleString('en-IN')})
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const selectedAccessoriesList = accessories.filter(acc => selectedAccessories.has(acc.id));
                      addToCartContext(product, quantity, selectedAccessoriesList);
                      alert(`Bundle with ${selectedAccessoriesList.length} accessories added to cart!`);
                    }}
                    className="w-full bg-[#c54513] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#a43a10] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add Bundle to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>

          <div className="space-y-3">
            {[
              {
                id: 1,
                name: 'Priya Sharma',
                rating: 5,
                date: '2 weeks ago',
                comment: 'Excellent sewing machine! Very smooth operation and easy to use. Highly recommend.'
              },
              {
                id: 2,
                name: 'Rajesh Kumar',
                rating: 4,
                date: '1 month ago',
                comment: 'Good quality machine at a reasonable price. Handles heavy fabrics well.'
              },
              {
                id: 3,
                name: 'Meera Patel',
                rating: 5,
                date: '3 weeks ago',
                comment: 'Perfect for my tailoring business. Speed control is great and stitches are neat.'
              }
            ].map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
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
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">FAQs</h2>

          <div className="space-y-2">
            {[
              {
                question: 'What is the warranty period?',
                answer: '2 years manufacturer warranty covering defects and parts. Extended warranty options available.'
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
                transform: `translateX(-${currentSlide * (100 / productsPerView)}%)`
              }}
            >
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                  style={{
                    width: `calc(${100 / productsPerView}% - ${(productsPerView - 1) * 24 / productsPerView}px)`,
                    marginRight: `${24 / productsPerView}px`
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
                    <p className="text-lg font-bold text-gray-900">₹{convertToINR(product.price).toLocaleString('en-IN')}</p>
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
    </div>
  );
};

export default ProductDetail;
