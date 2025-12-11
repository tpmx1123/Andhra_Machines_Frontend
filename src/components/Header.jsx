import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const location = useLocation();
  const productsRef = useRef(null);
  const brandsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setShowProductsDropdown(false);
      }
      if (brandsRef.current && !brandsRef.current.contains(event.target)) {
        setShowBrandsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setMobileProductsOpen(false);
    setMobileBrandsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Brands', path: '/brands' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const brandItems = [
    { name: 'Usha', path: '/brands/usha' },
    { name: 'Singer', path: '/brands/singer' },
    { name: 'Juki', path: '/brands/juki' },
    { name: 'Jack', path: '/brands/jack' },
    { name: 'Brother', path: '/brands/brother' },
    { name: 'Shiela', path: '/brands/shiela' },
  ];
  
  const productCategories = [
    { name: 'Industrial Machines', path: '/products/industrial' },
    { name: 'Domestic Machines', path: '/products/domestic' },
    { name: 'Heavy Duty Machines', path: '/products/heavy-duty' },
    { name: 'Embroidery Machines', path: '/products/embroidery' },
    { name: 'Overlock Machines', path: '/products/overlock' },
    { name: 'Accessories', path: '/products/accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-[#047DAA] text-white py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm">
          Delivery Available Across Andhra Pradesh
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="https://res.cloudinary.com/durbtkhbz/image/upload/v1765255577/logo_sewing_td6tcf.png" 
                alt="Murthy Sewing Machines" 
                className="h-10 sm:h-14 w-auto"
              />
              <span className="hidden sm:block text-lg sm:text-xl font-bold text-[#c54513]">
                Murthy Sewing Machines
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => {
                if (item.name === 'Products') {
                  return (
                    <div key={item.path} className="relative" ref={productsRef}>
                      <button
                        onClick={() => {
                          setShowProductsDropdown(!showProductsDropdown);
                          setShowBrandsDropdown(false);
                        }}
                        className={`flex items-center px-3 py-2 text-sm font-medium ${
                          isActive(item.path) || location.pathname.startsWith('/products')
                            ? 'text-[#c54513] border-b-2 border-[#c54513]'
                            : 'text-gray-700 hover:text-[#c54513]'
                        } transition-colors`}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {showProductsDropdown && (
                        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {productCategories.map((category) => (
                              <Link
                                key={category.path}
                                to={category.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#c54513]"
                                onClick={() => setShowProductsDropdown(false)}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else if (item.name === 'Brands') {
                  return (
                    <div key={item.path} className="relative" ref={brandsRef}>
                      <button
                        onClick={() => {
                          setShowBrandsDropdown(!showBrandsDropdown);
                          setShowProductsDropdown(false);
                        }}
                        className={`flex items-center px-3 py-2 text-sm font-medium ${
                          isActive(item.path) || location.pathname.startsWith('/brands')
                            ? 'text-[#c54513] border-b-2 border-[#c54513]'
                            : 'text-gray-700 hover:text-[#c54513]'
                        } transition-colors`}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {showBrandsDropdown && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {brandItems.map((brand) => (
                              <Link
                                key={brand.path}
                                to={brand.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#c54513]"
                                onClick={() => setShowBrandsDropdown(false)}
                              >
                                {brand.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'text-[#c54513] border-b-2 border-[#c54513]'
                        : 'text-gray-700 hover:text-[#c54513]'
                    } transition-colors`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="text-gray-700 hover:text-[#c54513] transition-colors p-1 sm:p-0">
              <User className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            <button className="text-gray-700 hover:text-[#c54513] transition-colors p-1 sm:p-0">
              <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            <button
              className="lg:hidden text-gray-700 hover:text-[#c54513] transition-colors p-1 sm:p-0"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-3 pb-3 bg-white shadow-inner rounded-lg">
            <div className="space-y-0.5 py-2">
              <Link
                to="/"
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive('/')
                    ? 'bg-gray-100 text-[#c54513]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#c54513]'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <div className="px-3 py-2">
                <button
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between py-2 px-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#c54513]"
                >
                  <span>Products</span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileProductsOpen ? 'transform rotate-180' : ''}`} />
                </button>
                <div className={`${mobileProductsOpen ? 'block' : 'hidden'} pl-4 mt-1 space-y-1`}>
                  {productCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className={`block py-2 px-2 rounded-md text-sm ${
                        isActive(category.path)
                          ? 'bg-gray-100 text-[#c54513]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#c54513]'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <div className="px-3 py-2">
                <button
                  onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
                  className="w-full flex items-center justify-between py-2 px-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#c54513]"
                >
                  <span>Brands</span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileBrandsOpen ? 'transform rotate-180' : ''}`} />
                </button>
                <div className={`${mobileBrandsOpen ? 'block' : 'hidden'} pl-4 mt-1`}>
                  <div className="grid grid-cols-2 gap-2">
                    {brandItems.map((brand) => (
                      <Link
                        key={brand.path}
                        to={brand.path}
                        className={`block py-2 px-2 rounded-md text-sm ${
                          isActive(brand.path)
                            ? 'bg-gray-100 text-[#c54513]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#c54513]'
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {['Blog', 'About', 'Contact'].map((item) => (
                <Link
                  key={`mobile-${item.toLowerCase()}`}
                  to={`/${item.toLowerCase()}`}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(`/${item.toLowerCase()}`)
                      ? 'bg-gray-100 text-[#c54513]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#c54513]'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
