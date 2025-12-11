import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
    }
  ];

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const addToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#c54513]">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-[#c54513]">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-400">{product.name}</span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513] ${
                      selectedImage === index ? 'ring-2 ring-[#c54513]' : 'ring-1 ring-black ring-opacity-5'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <span className="sr-only">View {product.name}</span>
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-96 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center">
                <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
                {product.isOnSale && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    On Sale
                  </span>
                )}
              </div>
              {product.inStock ? (
                <p className="mt-2 text-sm text-green-600">In stock and ready to ship</p>
              ) : (
                <p className="mt-2 text-sm text-red-600">Out of stock</p>
              )}

              {/* Reviews */}
              <div className="mt-3 flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 ${
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
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4">
                <ul className="pl-4 list-disc text-sm space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">
                      <span className="text-gray-900">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="mt-8 flex sm:flex-col1">
                <div className="flex items-center border border-gray-300 rounded-md mr-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-700 focus:outline-none"
                  >
                    <span className="sr-only">Decrease quantity</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center border-l border-r border-gray-300 py-2">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-700 focus:outline-none"
                  >
                    <span className="sr-only">Increase quantity</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  className="flex-1 bg-[#c54513] border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-[#a4370f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c54513]"
                  onClick={addToCart}
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="ml-4 p-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <Heart className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
              <div className="mt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Share</h3>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Pinterest</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.017 0C5.396 0 .029 5.37.029 11.997c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.042-3.439.219-.938 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.412 2.561-5.412 5.207 0 1.031.395 2.139.893 2.739.099.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.305.535 3.554.535 6.607 0 11.985-5.365 11.985-11.981C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
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
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
