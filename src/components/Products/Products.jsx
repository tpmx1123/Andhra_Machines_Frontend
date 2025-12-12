import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Filter, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';

const Products = () => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sort: 'featured',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock product data with different categories and brands
  const allProducts = [
    {
      id: 'usha-excel',
      name: 'Usha Excel Automatic',
      brand: 'Usha',
      price: 249.99,
      originalPrice: 299.99,
      rating: 4.5,
      reviewCount: 128,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'domestic',
      inStock: true,
      isNew: true,
      isOnSale: true,
    },
    {
      id: 'singer-tradition',
      name: 'Singer Tradition 2250',
      brand: 'Singer',
      price: 199.99,
      rating: 4.7,
      reviewCount: 215,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'domestic',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'brother-cs6000i',
      name: 'Brother CS6000i',
      brand: 'Brother',
      price: 349.99,
      originalPrice: 399.99,
      rating: 4.6,
      reviewCount: 342,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'domestic',
      inStock: true,
      isNew: true,
      isOnSale: true,
    },
    {
      id: 'juki-tl2010q',
      name: 'JUKI TL-2010Q',
      brand: 'JUKI',
      price: 1299.99,
      rating: 4.9,
      reviewCount: 156,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'industrial',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'jack-a4',
      name: 'Jack A4 Industrial',
      brand: 'Jack',
      price: 1599.99,
      rating: 4.7,
      reviewCount: 67,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'industrial',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'janome-memorycraft',
      name: 'Janome Memory Craft 9850',
      brand: 'Janome',
      price: 899.99,
      originalPrice: 1099.99,
      rating: 4.6,
      reviewCount: 89,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'embroidery',
      inStock: true,
      isNew: true,
      isOnSale: true,
    },
    {
      id: 'singer-heavy-duty',
      name: 'Singer Heavy Duty 4423',
      brand: 'Singer',
      price: 279.99,
      rating: 4.4,
      reviewCount: 523,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'domestic',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'brother-overlock',
      name: 'Brother 1034D Overlock',
      brand: 'Brother',
      price: 349.99,
      originalPrice: 399.99,
      rating: 4.5,
      reviewCount: 234,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'overlock',
      inStock: true,
      isNew: true,
      isOnSale: true,
    },
    {
      id: 'juki-mo644d',
      name: 'JUKI MO-644D Overlock',
      brand: 'JUKI',
      price: 449.99,
      rating: 4.8,
      reviewCount: 198,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'overlock',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'usha-janome',
      name: 'Usha Janome Dream Maker',
      brand: 'Usha',
      price: 179.99,
      rating: 4.3,
      reviewCount: 187,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'domestic',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'brother-embroidery',
      name: 'Brother SE600 Embroidery',
      brand: 'Brother',
      price: 599.99,
      originalPrice: 699.99,
      rating: 4.8,
      reviewCount: 312,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'embroidery',
      inStock: true,
      isNew: true,
      isOnSale: true,
    },
    {
      id: 'jack-f4',
      name: 'Jack F4 Industrial',
      brand: 'Jack',
      price: 899.99,
      rating: 4.6,
      reviewCount: 94,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'industrial',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'singer-accessories',
      name: 'Singer Presser Feet Set',
      brand: 'Singer',
      price: 24.99,
      rating: 4.5,
      reviewCount: 145,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'accessories',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'brother-accessories',
      name: 'Brother Needle Set',
      brand: 'Brother',
      price: 12.99,
      rating: 4.4,
      reviewCount: 203,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'accessories',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'juki-accessories',
      name: 'JUKI Bobbin Set',
      brand: 'JUKI',
      price: 8.99,
      rating: 4.6,
      reviewCount: 178,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'accessories',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    {
      id: 'usha-accessories',
      name: 'Usha Thread Set',
      brand: 'Usha',
      price: 15.99,
      rating: 4.3,
      reviewCount: 256,
      image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
      category: 'accessories',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'domestic', name: 'Domestic Machines' },
    { id: 'industrial', name: 'Industrial Machines' },
    { id: 'embroidery', name: 'Embroidery Machines' },
    { id: 'overlock', name: 'Overlock Machines' },
    { id: 'accessories', name: 'Accessories' },
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'under-100', name: 'Under ₹8,000' },
    { id: '100-300', name: '₹8,000 - ₹25,000' },
    { id: '300-500', name: '₹25,000 - ₹40,000' },
    { id: 'over-500', name: 'Over ₹40,000' },
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
          product.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filter by price range (converting INR ranges back to USD for comparison)
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (filters.priceRange) {
          case 'under-100':
            return price < 100; // Under ₹8,000
          case '100-300':
            return price >= 100 && price <= 300; // ₹8,000 - ₹25,000
          case '300-500':
            return price > 300 && price <= 500; // ₹25,000 - ₹40,000
          case 'over-500':
            return price > 500; // Over ₹40,000
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          
          {/* Search Bar - Mobile and Desktop */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-[#c54513] text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
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
                        {categories.find(c => c.id === filters.category)?.name}
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
                  <Link to={`/products/${product.id}`} className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64 block relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1584917860127-7ee3bf0d81d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    {product.isOnSale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                  </Link>
                  <div className="flex-1 p-3 sm:p-4 flex flex-col">
                    <Link to={`/products/${product.id}`} className="group">
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
                          ₹{Math.round(product.price * 83).toLocaleString('en-IN')}
                          {product.originalPrice && (
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                              ₹{Math.round(product.originalPrice * 83).toLocaleString('en-IN')}
                            </span>
                          )}
                        </p>
                        <div className="flex space-x-1 sm:space-x-2 relative z-10 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(product);
                            }}
                            className={`p-1.5 sm:p-2 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0 ${
                              isFavorite(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            }`}
                            title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} aria-hidden="true" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, 1);
                              alert(`${product.name} added to cart!`);
                            }}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-[#c54513] transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          </button>
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
  );
};

export default Products;
