import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import products from '../data/products';

export default function SearchResults() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setFilteredProducts([]);
      } else {
        const results = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
        setFilteredProducts(results);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
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
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
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
                </div>
                <h3 className="mt-4 text-sm text-gray-700">
                  <Link to={`/products/${product.id}`} className="hover:text-[#c54513]">
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ₹{product.price.toLocaleString()}
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </p>
                <div className="mt-1 flex items-center">
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
                  <span className="ml-2 text-sm text-gray-500">
                    {product.reviewCount} reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
