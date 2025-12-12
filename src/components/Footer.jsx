import { Facebook, Instagram, Mail as MailIcon, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 border-t-2 border-[#c54513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Centered Logo Section - Compact */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://res.cloudinary.com/durbtkhbz/image/upload/v1765255577/logo_sewing_td6tcf.png"
                alt="Murthy Sewing Machines Logo"
                className="h-16 sm:h-20 lg:h-24 w-auto transition-transform group-hover:scale-105"
              />
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-[#c54513] transition-colors">
                  Murthy Sewing Machines
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 cursor-default">Since 1998</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-5">
          {/* Quick Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Brands', path: '/brands' },
                { name: 'Blog', path: '/blog' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors block"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900 uppercase tracking-wide">
              Our Products
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                'Domestic Machines',
                'Industrial Machines',
                'Embroidery Machines',
                'Overlock Machines',
                'Accessories',
                'Spare Parts',
              ].map((product) => (
                <li key={product}>
                  <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors block">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900 uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <a
                  href="https://maps.google.com/?q=Andhra+Machines+Agencies,+Kandakam+Road,+Rajahmundry,+Andhra+Pradesh+533101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors flex items-start"
                >
                  <MapPin size={12} className="mr-1.5 mt-0.5 flex-shrink-0 sm:mr-2 sm:size-[14px]" />
                  <span className="leading-tight">Andhra Machines Agencies,<br className="hidden sm:block" /> Kandakam Road,<br className="hidden sm:block" /> Rajahmundry - 533101</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919701332707"
                  className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors flex items-center"
                >
                  <Phone size={12} className="mr-1.5 flex-shrink-0 sm:mr-2 sm:size-[14px]" />
                  +91 97013 32707
                </a>
              </li>
              <li>
                <a
                  href="tel:917416421770"
                  className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors flex items-center"
                >
                  <Phone size={12} className="mr-1.5 flex-shrink-0 sm:mr-2 sm:size-[14px]" />
                  +91 74164 21770
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=andhramachinesagencies@gmail.com&su=Inquiry%20from%20Website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-gray-600 hover:text-[#c54513] transition-colors flex items-start break-all"
                >
                  <MailIcon size={12} className="mr-1.5 mt-0.5 flex-shrink-0 sm:mr-2 sm:size-[14px]" />
                  <span className="break-all">andhramachinesagencies@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Follow */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-gray-900 uppercase tracking-wide">
              Follow Us
            </h4>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <a
                href="#"
                className="bg-white border border-gray-300 hover:border-[#1877F2] hover:bg-[#1877F2] p-2 sm:p-2.5 rounded-lg transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="text-gray-600 hover:text-white" size={16} />
              </a>
              <a
                href="#"
                className="bg-white border border-gray-300 hover:border-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 p-2 sm:p-2.5 rounded-lg transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="text-gray-600 hover:text-white" size={16} />
              </a>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-1 sm:mb-2">Business Hours</p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Mon - Sat: 9AM - 7PM</p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-1.5 sm:space-y-0">
            <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} <span className="text-[#c54513] font-semibold">Murthy Sewing Machines</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-gray-500">
              <a href="#" className="hover:text-[#c54513] transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-[#c54513] transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-[#c54513] transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
