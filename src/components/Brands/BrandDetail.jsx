import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { shareProduct } from '../../utils/share';
import { api } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { logger } from '../../utils/logger';
import SEO from '../SEO';

const BrandDetail = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Brand logos from BrandsSection.jsx
  const brandLogos = {
    usha: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765961705/page1-800px-USHA_Logo.pdf_aaotn8.jpg',
    singer: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765962024/Singer-Logo_tgjv61.png',
    jack: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765962082/images_uwvfcp.jpg',
    shiela: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765965701/c0ba20498b688b78d1aa85683be2eb55_zodny4.jpg',
    brother: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765962370/Screenshot_2025-12-17_143538_v845iu.png',
    guru: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765964234/images_yfisez.png',
  };

  // Brand metadata (can be moved to database later)
  const brands = {
    usha: {
      id: 'usha',
      name: 'Usha',
      description: 'Usha International Ltd. is an Indian consumer durable company headquartered in New Delhi. The company is a part of the $4.5 billion CK Birla Group. Usha is one of the leading manufacturers of sewing machines in India with a market share of over 25%.',
      logo: brandLogos.usha,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766385110/ChatGPT_Image_Dec_22_2025_12_01_07_PM_rfkzly.png',
      founded: 1934,
      headquarters: 'New Delhi, India',
      website: 'https://www.ushasew.com/',
    },
    singer: {
      id: 'singer',
      name: 'Singer',
      description: 'The Singer Corporation is an American manufacturer of sewing machines, first established as I. M. Singer & Co. in 1851 by Isaac Merritt Singer with New York lawyer Edward C. Clark.',
      logo: brandLogos.singer,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766386088/ChatGPT_Image_Dec_22_2025_12_17_50_PM_plf7bn.png',
      founded: 1851,
      headquarters: 'La Vergne, Tennessee, U.S.',
      website: 'https://www.singer.com',
    },
    brother: {
      id: 'brother',
      name: 'Brother',
      description: 'Brother Industries, Ltd. is a Japanese multinational electronics and electrical equipment company headquartered in Nagoya, Japan. Its main products include printers, multifunction printers, desktop computers, consumer and industrial sewing machines, and machine tools.',
      logo: brandLogos.brother,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766385482/ChatGPT_Image_Dec_22_2025_12_07_45_PM_bx7a2s.png',
      founded: 1908,
      headquarters: 'Nagoya, Japan',
      website: 'https://www.brother.com',
    },
    
    jack: {
      id: 'jack',
      name: 'Jack',
      description: 'Zhejiang Jack Sewing Machine Co., Ltd. is a Chinese manufacturer of industrial sewing machines. The company is one of the largest industrial sewing machine manufacturers in the world, with products sold in over 130 countries.',
      logo: brandLogos.jack,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766385962/ChatGPT_Image_Dec_22_2025_12_14_41_PM_c2fbke.png',
      founded: 1995,
      headquarters: 'Taizhou, Zhejiang, China',
      website: 'https://www.jacksew.com',
    },
    shiela: {
      id: 'shiela',
      name: 'Shiela',
      description: 'Shiela is a trusted Indian brand offering durable and affordable sewing machines for home tailoring, small businesses, and daily sewing needs. Known for ease of use, strong build quality, and reliable performance.',
      logo: brandLogos.shiela,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766385576/ChatGPT_Image_Dec_22_2025_12_08_48_PM_ehqdup.png',
      founded: 1985,
      headquarters: 'India'
    },
    guru: {
      id: 'guru',
      name: 'Guru',
      description: 'Guru Sewing Machines is a trusted Indian brand offering durable and affordable sewing machines for home tailoring, small businesses, and daily sewing needs. Known for ease of use, strong build quality, and reliable performance.',
      logo: brandLogos.guru,
      banner: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766385577/ChatGPT_Image_Dec_22_2025_12_08_40_PM_vgew9o.png',
      founded: 1985,
      headquarters: 'India',
      website: 'https://www.gursewingmachines.com',
    },
    
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const brandData = brands[brandId];
        if (!brandData) {
          navigate('/brands');
          return;
        }
        setBrand(brandData);
        
        // Fetch all products and filter by brand name
        const allProducts = await api.getAllProducts();
        const brandProducts = allProducts
          .filter(p => p.brandName && p.brandName.toLowerCase() === brandData.name.toLowerCase() && p.isActive !== false)
          .map(product => {
            // Calculate discount percentage
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            
            return {
              id: product.id,
              name: product.title,
              brandSlug: product.brandSlug || product.id.toString(),
              price: parseFloat(product.price) || 0,
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
              rating: product.rating ? parseFloat(product.rating) : 0,
              image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
              discount: discount,
              isNew: product.isNew || false,
              isOnSale: product.isOnSale || false,
              inStock: product.inStock !== false
            };
          });
        setProducts(brandProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [brandId, navigate]);

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    logger.log('Price update received in BrandDetail:', priceUpdate);
    const productId = Number(priceUpdate.productId);
    const newPrice = parseFloat(priceUpdate.newPrice);
    const originalPrice = priceUpdate.originalPrice ? parseFloat(priceUpdate.originalPrice) : null;
    
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        // Compare IDs as numbers to handle type mismatches
        if (Number(product.id) === productId) {
          logger.log(`Updating product ${product.id} price from ${product.price} to ${newPrice}`);
          return {
            ...product,
            price: newPrice,
            originalPrice: originalPrice || product.originalPrice,
            // Recalculate discount
            discount: originalPrice && originalPrice > newPrice
              ? Math.round(((originalPrice - newPrice) / originalPrice) * 100)
              : 0
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
    if (connected && brandId) {
      logger.log('WebSocket connected - refreshing brand products to sync prices');
      const fetchProducts = async () => {
        try {
          const allProducts = await api.getAllProducts();
          const brandProducts = allProducts
            .filter(p => {
              const productBrandSlug = (p.brandSlug || '').toLowerCase();
              const targetBrandSlug = brandId.toLowerCase();
              return productBrandSlug === targetBrandSlug || 
                     (p.brandName && p.brandName.toLowerCase() === targetBrandSlug);
            })
            .map(product => {
              const discount = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              
              return {
                id: product.id,
                name: product.title,
                brandSlug: product.brandSlug || product.id.toString(),
                price: parseFloat(product.price) || 0,
                originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
                rating: product.rating ? parseFloat(product.rating) : 0,
                reviewCount: product.reviewCount || 0,
                image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
                discount: discount,
                isNew: product.isNew || false,
                isOnSale: product.isOnSale || false,
                inStock: product.inStock !== false
              };
            });
          setProducts(brandProducts);
          logger.log('Brand products refreshed after WebSocket connection');
        } catch (err) {
          logger.error('Error refreshing brand products:', err);
        }
      };
      fetchProducts();
    }
  }, [connected, brandId]);
  
  if (!brand) return null;

  return (
    <>
      <SEO
        title={`${brand.name} Sewing Machines | Buy Online | Andhra Machines Agencies`}
        description={`Shop ${brand.name} sewing machines online. Premium quality, genuine products. Free delivery across India. Expert service since 1982. Browse our collection of ${brand.name} sewing machines.`}
        keywords={`${brand.name} sewing machine, buy ${brand.name} online, ${brand.name} price, ${brand.name} dealer, sewing machine ${brand.name}, ${brand.name} India`}
        image={brand.logo || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png'}
        type="website"
      />
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center sm:justify-start">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 sm:relative sm:left-0 mr-0 sm:mr-4 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center flex-1 sm:flex-none">{brand.name}</h1>
          </div>
        </div>
      </div>

      {/* Brand Banner */}
      <div className="relative bg-white  lg:h-[500px] w-full">
        <img
          src={brand.banner}
          alt={`${brand.name} banner`}
          className="w-full h-full object-contain opacity-80"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/1920x300?text=' + brand.name;
          }}
        />
      </div>

     

      {/* Brand Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {brand.name}</h2>
              <p className="text-gray-600 mb-6">{brand.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                  <p className="mt-1 text-gray-900">{brand.founded}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Headquarters</h3>
                  <p className="mt-1 text-gray-900">{brand.headquarters}</p>
                </div>
                {brand.website && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <a 
                      href={brand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-[#c54513] hover:underline"
                    >
                      {brand.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose {brand.name}?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#c54513]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">High-quality construction</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#c54513]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Innovative features</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#c54513]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Reliable performance</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-[#c54513]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">Excellent customer support</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#c54513] hover:bg-[#a4370f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513]"
                >
                  Contact for Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{brand.name} Products</h2>
            <Link
              to="/products"
              className="text-sm font-medium text-[#c54513] hover:text-[#a4370f] flex items-center"
            >
              View all products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {products.map((product) => {
                const cartQuantities = {};
                cartItems.forEach(item => {
                  cartQuantities[item.id] = item.quantity;
                });
                
                return (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link to={`/products/${product.brandSlug || product.id}`} className="relative h-56 bg-gray-50 overflow-hidden block">
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
                          {brand.name}
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
                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col min-w-0">
                      <Link to={`/products/${product.brandSlug || product.id}`} className="group">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{brand.name}</p>
                      <div className="flex-1 flex flex-col justify-end min-w-0 mt-1">
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <Star
                                key={rating}
                                fill={rating < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  rating < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <p className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">
                            {product.reviewCount || 0} reviews
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-1 sm:gap-2 min-w-0">
                          <div className="flex-shrink min-w-0 overflow-hidden">
                            <p className="text-xs sm:text-sm md:text-base font-medium text-gray-900 truncate">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through truncate">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1 relative z-10 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(product, showToast, navigate);
                              }}
                              className={`p-1 sm:p-1.5 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0 ${
                                isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                              }`}
                              title={isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} aria-hidden="true" />
                            </button>
                            {product.inStock ? (
                              cartQuantities[product.id] ? (
                                <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const existingItem = cartItems.find(item => item.id === product.id);
                                      if (existingItem && existingItem.quantity > 1) {
                                        updateQuantity(product.id, existingItem.quantity - 1);
                                        showToast('Cart updated!', 'success');
                                      } else if (existingItem) {
                                        updateQuantity(product.id, 0);
                                        showToast('Item removed from cart', 'success');
                                      }
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
                                      if (!user) {
                                        showToast('Please login to add items to cart', 'error');
                                        navigate('/login', { state: { from: location.pathname } });
                                        return;
                                      }
                                      const existingItem = cartItems.find(item => item.id === product.id);
                                      if (existingItem) {
                                        updateQuantity(product.id, existingItem.quantity + 1);
                                        showToast(`Cart updated! Quantity: ${existingItem.quantity + 1}`, 'success');
                                      } else {
                                        const cartProduct = {
                                          id: product.id,
                                          name: product.name,
                                          brand: brand?.name || 'Unknown',
                                          price: product.price,
                                          originalPrice: product.originalPrice || product.price,
                                          image: product.image,
                                          brandSlug: product.brandSlug,
                                          inStock: product.inStock
                                        };
                                        try {
                                          addToCart(cartProduct, 1);
                                          showToast(`${product.name} added to cart!`, 'success');
                                        } catch (error) {
                                          if (error.message.includes('login')) {
                                            showToast('Please login to add items to cart', 'error');
                                            navigate('/login', { state: { from: location.pathname } });
                                          }
                                        }
                                      }
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
                                    if (!user) {
                                      showToast('Please login to add items to cart', 'error');
                                      navigate('/login', { state: { from: location.pathname } });
                                      return;
                                    }
                                    const cartProduct = {
                                      id: product.id,
                                      name: product.name,
                                      brand: brand?.name || 'Unknown',
                                      price: product.price,
                                      originalPrice: product.originalPrice || product.price,
                                      image: product.image,
                                      brandSlug: product.brandSlug,
                                      inStock: product.inStock
                                    };
                                    try {
                                      addToCart(cartProduct, 1);
                                      showToast(`${product.name} added to cart!`, 'success');
                                    } catch (error) {
                                      if (error.message.includes('login')) {
                                        showToast('Please login to add items to cart', 'error');
                                        navigate('/login', { state: { from: location.pathname } });
                                      }
                                    }
                                  }}
                                  className="px-1.5 py-1.5 sm:px-3 sm:py-2 bg-[#c54513] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#a43a10] transition-colors flex items-center justify-center flex-shrink-0"
                                  title="Add to cart"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="hidden sm:inline ml-1">Add</span>
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
                );
              })}
            </div>
          )}
        </div>

        {/* Related Brands */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Brands You Might Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Object.values(brands)
              .filter(b => b.id !== brandId)
              .slice(0, 6)
              .map((relatedBrand) => (
                <Link
                  key={relatedBrand.id}
                  to={`/brands/${relatedBrand.id}`}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-16 w-full mb-2 flex items-center justify-center">
                    <img
                      src={relatedBrand.logo}
                      alt={relatedBrand.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/120x60?text=' + relatedBrand.name;
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 text-center">{relatedBrand.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BrandDetail;
