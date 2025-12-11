import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Filter, X } from 'lucide-react';

const Products = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sort: 'featured',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock product data
  const products = [
    {
      id: 'usha-excel',
      name: 'Usha Excel Automatic',
      brand: 'Usha',
      price: 249.99,
      originalPrice: 299.99,
      rating: 4.5,
      reviewCount: 128,
image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',      category: 'domestic',
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
image: 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',      category: 'domestic',
      inStock: true,
      isNew: false,
      isOnSale: false,
    },
    // Add more products as needed
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
    { id: 'under-100', name: 'Under $100' },
    { id: '100-300', name: '$100 - $300' },
    { id: '300-500', name: '$300 - $500' },
    { id: 'over-500', name: 'Over $500' },
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <div className="flex items-center">
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#c54513] focus:border-[#c54513] sm:text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="ml-4 p-2 -m-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-5 w-5" aria-hidden="true" />
            </button>
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
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover sm:w-full sm:h-full"
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
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <Star
                              key={rating}
                              className={`h-4 w-4 ${
                                rating < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="ml-2 text-sm text-gray-500">
                          {product.reviewCount} reviews
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </p>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-500">
                            <Heart className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-500">
                            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
