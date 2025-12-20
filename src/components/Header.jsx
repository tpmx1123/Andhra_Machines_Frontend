import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { getCartCount } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const brandsRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileMenu(false); // Close mobile menu if open
    }
    return false; // Prevent default form submission
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    setSearchQuery('');
    if (location.pathname === '/search') {
      navigate('/');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
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
    { name: 'Guru', path: '/brands/guru' },
  ];


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="bg-[#047DAA] text-white py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center text-xs sm:text-sm">
          Delivery Available Across India
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 z-10">
            <img
              src="https://res.cloudinary.com/durbtkhbz/image/upload/v1766121553/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc.png"
              alt="Andhra Machines Agencies"
              className="h-14 sm:h-16 lg:h-18 w-auto object-contain"
              style={{ display: 'block' }}
            />
            <div className="hidden sm:block">
              <span className="block text-base sm:text-lg lg:text-xl font-bold text-[#c54513]">
                Andhra Machines Agencies
              </span>
              <span className="block text-xs sm:text-sm text-gray-600">
                Stitching Trust Since 1982
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-4">

            {navItems.map((item) => {
              if (item.name === 'Brands') {
                return (
                  <div key={item.path} className="relative" ref={brandsRef}>
                    <button
                      onClick={() => {
                        setShowBrandsDropdown(!showBrandsDropdown);
                      }}
                      className={`flex items-center px-3 py-2 text-sm font-medium ${isActive(item.path) || location.pathname.startsWith('/brands')
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
                  className={`px-3 py-2 text-sm font-medium ${isActive(item.path)
                    ? 'text-[#c54513] border-b-2 border-[#c54513]'
                    : 'text-gray-700 hover:text-[#c54513]'
                    } transition-colors`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center relative" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-40 sm:w-48 pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#c54513] focus:border-[#c54513]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#c54513] text-white p-1.5 rounded-r-md hover:bg-[#a43a10] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Search Bar - Always Visible */}
          <div className="lg:hidden flex-1 min-w-0 mx-2">
            <form onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-3 pr-20 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#c54513] focus:border-[#c54513]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 bg-[#c54513] text-white p-1.5 rounded hover:bg-[#a43a10] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin" : "/profile"}
                  className={`relative p-1 text-gray-700 hover:text-[#c54513] transition-colors ${(isAdmin && location.pathname.startsWith('/admin')) || (!isAdmin && location.pathname === '/profile') ? 'text-[#c54513]' : ''}`}
                  title={isAdmin ? "Admin Panel" : "My Account"}
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sr-only">{isAdmin ? "Admin Panel" : "My Account"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative p-1 text-gray-700 hover:text-[#c54513] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sr-only">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`relative p-1 text-gray-700 hover:text-[#c54513] transition-colors ${location.pathname === '/login' ? 'text-[#c54513]' : ''}`}
                title="Login"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="sr-only">Login</span>
              </Link>
            )}
            <Link
              to="/cart"
              className={`relative p-1 text-gray-700 hover:text-[#c54513] transition-colors ${location.pathname === '/cart' ? 'text-[#c54513]' : ''}`}
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="sr-only">Shopping Cart</span>
              {/* Cart item count badge */}
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c54513] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>
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
                className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/')
                  ? 'bg-gray-100 text-[#c54513]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#c54513]'
                  }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>

              <div className="border-t border-gray-100 my-1"></div>

              <Link
                to="/products"
                className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/products') || location.pathname.startsWith('/products')
                  ? 'bg-gray-100 text-[#c54513]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#c54513]'
                  }`}
                onClick={closeMobileMenu}
              >
                Products
              </Link>

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
                        className={`block py-2 px-2 rounded-md text-sm ${isActive(brand.path)
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
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive(`/${item.toLowerCase()}`)
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
