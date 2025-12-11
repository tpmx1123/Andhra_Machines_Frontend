import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductsSection() {
  const products = [
    {
      id: 1,
      name: 'Usha Janome Dream Stitch Automatic',
      price: 15999,
      originalPrice: 19999,
      rating: 4.5,
      image: 'bg-gradient-to-br from-pink-400 to-pink-600',
      discount: 20,
    },
    {
      id: 2,
      name: 'Singer Heavy Duty 4452',
      price: 28999,
      originalPrice: 35999,
      rating: 5,
      image: 'bg-gradient-to-br from-blue-400 to-blue-600',
      discount: 20,
    },
    {
      id: 3,
      name: 'Brother GS 3700',
      price: 17990,
      originalPrice: 21990,
      rating: 4.2,
      image: 'bg-gradient-to-br from-green-400 to-green-600',
      discount: 18,
    },
    {
      id: 4,
      name: 'Jack JK-T9292A',
      price: 34999,
      originalPrice: 41999,
      rating: 4.8,
      image: 'bg-gradient-to-br from-purple-400 to-purple-600',
      discount: 17,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            Discover our handpicked selection of premium sewing machines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-48 ${product.image} flex items-center justify-center relative`}>
                {product.discount && (
                  <span className="absolute top-4 right-4 bg-[#c54513] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
                <button className="absolute top-4 left-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors">
                  <Heart size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="bg-[#c54513] text-white p-2 rounded-full hover:bg-[#a5380e] transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#c54513] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a5380e] transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
