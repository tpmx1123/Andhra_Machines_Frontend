import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Filter, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import { logger } from '../../utils/logger';
import SEO from '../SEO';
import StructuredData, { generateBreadcrumbSchema } from '../StructuredData';

const Products = () => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sort: 'featured',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartQuantities, setCartQuantities] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Function to determine category based on title and description
  const determineCategory = (title, description) => {
    const titleLower = (title || '').toLowerCase();
    const descLower = (description || '').toLowerCase();
    const combined = `${titleLower} ${descLower}`;

    // Check for embroidery keywords
    if (combined.match(/\b(embroidery|embroid|digitiz|hoop|monogram)\b/)) {
      return 'embroidery';
    }

    // Check for overlock keywords
    if (combined.match(/\b(overlock|serger|overlocker|merrow)\b/)) {
      return 'overlock';
    }

    // Check for industrial keywords
    if (combined.match(/\b(industrial|heavy.?duty|commercial|factory|production|garment|manufacturing)\b/)) {
      return 'industrial';
    }

    // Check for accessories keywords
    if (combined.match(/\b(accessory|accessories|needle|thread|bobbin|presser.?foot|foot|case|stand|table|carrying|bag|cover|oil|lubricant|scissors|seam.?ripper|thimble|pin|pincushion)\b/)) {
      return 'accessories';
    }

    // Default to domestic
    return 'domestic';
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const products = await api.getAllProducts();
        // Map backend products to frontend format
        const mappedProducts = products.map(product => {
          // Determine category based on title and description
          const detectedCategory = determineCategory(product.title, product.description);
          
          // Calculate discount percentage
          const discount = product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
          
          return {
          id: product.id,
          name: product.title,
          brand: product.brandName || 'Unknown',
          brandSlug: product.brandSlug || product.id.toString(), // Use brand slug or fallback to ID
          price: parseFloat(product.price) || 0,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
          rating: product.rating ? parseFloat(product.rating) : 0,
          reviewCount: product.reviewCount || 0,
          image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
            category: detectedCategory, // Use detected category
            description: product.description || '', // Store description for search
            discount: discount, // Discount percentage
          inStock: product.inStock !== undefined ? product.inStock : true,
          isNew: product.isNew || false,
          isOnSale: product.isOnSale || false,
          };
        });
        setAllProducts(mappedProducts);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Error fetching products:', err);
        setAllProducts([]);
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

  // Handle real-time price updates via WebSocket
  const handlePriceUpdate = (priceUpdate) => {
    logger.log('Price update received in Products:', priceUpdate);
    const productId = Number(priceUpdate.productId);
    const newPrice = parseFloat(priceUpdate.newPrice);
    const originalPrice = priceUpdate.originalPrice ? parseFloat(priceUpdate.originalPrice) : null;
    
    if (!productId || isNaN(newPrice)) {
      logger.error('Invalid price update data:', priceUpdate);
      return;
    }
    
    setAllProducts(prevProducts => {
      let found = false;
      const updated = prevProducts.map(product => {
        // Compare IDs as numbers to handle type mismatches
        if (Number(product.id) === productId) {
          found = true;
          logger.log(`Updating product ${product.id} (${product.name}) price from ₹${product.price} to ₹${newPrice}`);
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
      
      if (found) {
        // Only show toast for actual price changes, not sync messages
        if (priceUpdate.type !== 'PRICE_SYNC') {
          const updatedProduct = prevProducts.find(p => Number(p.id) === productId);
          if (updatedProduct) {
            const hasDiscount = originalPrice && originalPrice > newPrice;
            if (hasDiscount) {
              showToast(`${updatedProduct.name} has discount, check it once`, 'info');
            } else {
              showToast(`Price updated for ${updatedProduct.name}`, 'info');
            }
          }
        }
      } else {
        logger.warn(`Product with ID ${productId} not found in current product list`);
      }
      
      return updated;
    });
  };

  // Subscribe to WebSocket updates for real-time price changes
  const { connected } = useWebSocket(handlePriceUpdate, null, null);

  // Refresh products when WebSocket connects to get latest prices
  useEffect(() => {
    if (connected) {
      logger.log('WebSocket connected - refreshing products to sync prices');
      const fetchProducts = async () => {
        try {
          const products = await api.getAllProducts();
          const mappedProducts = products.map(product => {
            const detectedCategory = determineCategory(product.title, product.description);
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            
            return {
              id: product.id,
              name: product.title,
              brand: product.brandName || 'Unknown',
              brandSlug: product.brandSlug || product.id.toString(),
              price: parseFloat(product.price) || 0,
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
              rating: product.rating ? parseFloat(product.rating) : 0,
              reviewCount: product.reviewCount || 0,
              image: product.mainImageUrl || product.imageUrl || 'https://via.placeholder.com/300',
              category: detectedCategory,
              description: product.description || '',
              discount: discount,
              inStock: product.inStock !== undefined ? product.inStock : true,
              isNew: product.isNew || false,
              isOnSale: product.isOnSale || false,
            };
          });
          setAllProducts(mappedProducts);
          logger.log('Products refreshed after WebSocket connection');
        } catch (err) {
          logger.error('Error refreshing products:', err);
        }
      };
      fetchProducts();
    }
  }, [connected]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const matched = allProducts
        .filter(product => {
          const name = (product.name || '').toLowerCase();
          const brand = (product.brand || '').toLowerCase();
          return name.includes(query) || brand.includes(query);
        })
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          brandSlug: product.brandSlug
        }));
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  const handleAddToCart = (product) => {
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
      updateQuantity(product.id, existingItem.quantity + 1);
      showToast(`Cart updated! Quantity: ${existingItem.quantity + 1}`, 'success');
    } else {
      try {
        addToCart(product, 1);
        showToast(`${product.name} added to cart!`, 'success');
      } catch (error) {
        // Error already handled in addToCart (login required)
        if (error.message.includes('login')) {
          showToast('Please login to add items to cart', 'error');
          navigate('/login', { state: { from: location.pathname } });
        }
      }
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(productId, newQuantity);
    showToast('Cart updated!', 'success');
  };

  // Get unique brands from products
  const uniqueBrands = React.useMemo(() => {
    const brands = new Set();
    allProducts.forEach(product => {
      if (product.brand && product.brand.trim()) {
        brands.add(product.brand.trim());
      }
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'domestic', name: 'Domestic Machines' },
    { id: 'industrial', name: 'Industrial Machines' },
    { id: 'embroidery', name: 'Embroidery Machines' },
    { id: 'overlock', name: 'Overlock Machines' },
    // Add brand filters
    ...uniqueBrands.map(brand => ({ id: `brand-${brand}`, name: brand, type: 'brand' }))
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'under-10000', name: 'Under ₹10,000' },
    { id: '10000-25000', name: '₹10,000 - ₹25,000' },
    { id: '25000-50000', name: '₹25,000 - ₹50,000' },
    { id: 'over-50000', name: 'Over ₹50,000' },
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low-high', name: 'Price: Low to High' },
    { id: 'price-high-low', name: 'Price: High to Low' },
    { id: 'top-rated', name: 'Top Rated' },
    { id: 'newest', name: 'Newest' },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Filter by category or brand
    if (filters.category !== 'all') {
      if (filters.category.startsWith('brand-')) {
        // Filter by brand name
        const brandName = filters.category.replace('brand-', '');
        filtered = filtered.filter(product => product.brand === brandName);
      } else {
        // Filter by category
        filtered = filtered.filter(product => product.category === filters.category);
      }
    }

    // Filter by price range (price is already in INR from backend)
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (filters.priceRange) {
          case 'under-10000':
            return price < 10000; // Under ₹10,000
          case '10000-25000':
            return price >= 10000 && price <= 25000; // ₹10,000 - ₹25,000
          case '25000-50000':
            return price > 25000 && price <= 50000; // ₹25,000 - ₹50,000
          case 'over-50000':
            return price > 50000; // Over ₹50,000
          default:
            return true;
        }
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'top-rated':
          return b.rating - a.rating;
        case 'newest':
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        case 'featured':
        default:
          // Featured: on sale first, then new, then by rating
          if (a.isOnSale && !b.isOnSale) return -1;
          if (!a.isOnSale && b.isOnSale) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  };

  const products = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c54513]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#c54513] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' }
  ]);

  return (
    <>
      <SEO
        title="Sewing Machines Online - Buy Premium Usha, Singer, Brother | Andhra Machines Agencies"
        description="Shop premium sewing machines online. Browse domestic, industrial, embroidery, and overlock machines from top brands like Usha, Singer, Brother, Jack, Guru, and Shiela. Free delivery across India."
        keywords="buy sewing machines online, Usha sewing machine price, Singer sewing machine online, Brother sewing machine, domestic sewing machines, industrial sewing machines, embroidery machines, overlock machines"
        image="https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png"
      />
      <StructuredData data={breadcrumbSchema} />
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          
          {/* Search Bar - Mobile and Desktop */}
          <div className="mb-4">
            <div className="relative flex items-center">
              <div className="relative flex-1 sm:w-80">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-2.5 pr-10 border-2 border-[#d1cbc8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-[#c54513] text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        to={`/products/${suggestion.brandSlug}`}
                        onClick={() => {
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }}
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm text-gray-500">{suggestion.brand}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sort and Filter - Desktop */}
          <div className="hidden lg:flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-[#c54513]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Active Filters Display */}
              <div className="flex items-center gap-2 flex-wrap">
                {(filters.category !== 'all' || filters.priceRange !== 'all') && (
                  <>
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {filters.category !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c54513]/10 text-[#c54513] rounded-full text-xs font-medium">
                        {filters.category.startsWith('brand-') 
                          ? categories.find(c => c.id === filters.category)?.name || filters.category.replace('brand-', '')
                          : categories.find(c => c.id === filters.category)?.name}
                        <button
                          onClick={() => handleFilterChange('category', 'all')}
                          className="hover:text-[#a43a10]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.priceRange !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c54513]/10 text-[#c54513] rounded-full text-xs font-medium">
                        {priceRanges.find(p => p.id === filters.priceRange)?.name}
                        <button
                          onClick={() => handleFilterChange('priceRange', 'all')}
                          className="hover:text-[#a43a10]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{products.length}</span> products found
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-[#c54513]"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          {/* Filters */}
          <form className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900">Categories</h3>
                <div className="mt-2 space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`category-${category.id}`}
                        name="category"
                        type="radio"
                        className="h-4 w-4 border-gray-300 rounded text-[#c54513] focus:ring-[#c54513]"
                        checked={filters.category === category.id}
                        onChange={() => handleFilterChange('category', category.id)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-900">Price</h3>
                <div className="mt-2 space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        id={`price-${range.id}`}
                        name="price"
                        type="radio"
                        className="h-4 w-4 border-gray-300 rounded text-[#c54513] focus:ring-[#c54513]"
                        checked={filters.priceRange === range.id}
                        onChange={() => handleFilterChange('priceRange', range.id)}
                      />
                      <label
                        htmlFor={`price-${range.id}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {range.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {/* Product grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => setFilters({ category: 'all', priceRange: 'all', sort: 'featured' })}
                  className="mt-4 text-[#c54513] hover:text-[#a43a10] font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                  {products.map((product) => (
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
                  <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col min-w-0">
                    <Link to={`/products/${product.brandSlug}`} className="group">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{product.brand}</p>
                    <div className="flex-1 flex flex-col justify-end min-w-0 mt-1">
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
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <form className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            id={`mobile-category-${category.id}`}
                            name="category"
                            type="radio"
                            className="h-4 w-4 border-gray-300 rounded text-[#c54513] focus:ring-[#c54513]"
                            checked={filters.category === category.id}
                            onChange={() => handleFilterChange('category', category.id)}
                          />
                          <label
                            htmlFor={`mobile-category-${category.id}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Price</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <div key={range.id} className="flex items-center">
                          <input
                            id={`mobile-price-${range.id}`}
                            name="price"
                            type="radio"
                            className="h-4 w-4 border-gray-300 rounded text-[#c54513] focus:ring-[#c54513]"
                            checked={filters.priceRange === range.id}
                            onChange={() => handleFilterChange('priceRange', range.id)}
                          />
                          <label
                            htmlFor={`mobile-price-${range.id}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {range.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-4 py-4 space-y-3">
                <button
                  onClick={() => {
                    setFilters({ category: 'all', priceRange: 'all', sort: filters.sort });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full px-4 py-2 bg-[#c54513] text-white rounded-lg text-sm font-medium hover:bg-[#a43a10]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Products;
