import { Facebook, Instagram, Mail as MailIcon, Phone, MapPin, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-[#2b2b2b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Company Info with Logo */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <img 
                src="https://res.cloudinary.com/durbtkhbz/image/upload/v1765255577/logo_sewing_td6tcf.png" 
                alt="Murthy Sewing Machines Logo" 
                className="h-12 sm:h-16 w-auto transition-transform group-hover:scale-105"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#c54513] group-hover:text-[#e55a2b] transition-colors">
                  Murthy Sewing Machines
                </h3>
                <p className="text-xs text-gray-400">Since 1998</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              Your trusted partner for premium sewing machines and expert repair services in Andhra Pradesh.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="bg-gray-700 hover:bg-[#c54513] p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 hover:bg-[#c54513] p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 hover:bg-[#c54513] p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="bg-gray-700 hover:bg-[#c54513] p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#c54513] pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/brands" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Brands
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#c54513] pb-2 inline-block">
              Our Products
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Domestic Machines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Industrial Machines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Embroidery Machines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Overlock Machines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#c54513] transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#c54513] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Spare Parts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#c54513] pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-[#c54513] p-2 rounded-lg mr-3 flex-shrink-0 group-hover:bg-[#e55a2b] transition-colors">
                  <MapPin className="text-white" size={18} />
                </div>
                <a 
                  href="https://maps.google.com/?q=Andhra+Machines+Agencies,+Kandakam+Road,+Rajahmundry,+Andhra+Pradesh+533101" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base leading-relaxed"
                >
                  Andhra Machines Agencies,<br/>Kandakam Road, Rajahmundry - 533101,<br/>Andhra Pradesh
                </a>
              </li>
              <li className="flex items-start group">
                <div className="bg-[#c54513] p-2 rounded-lg mr-3 flex-shrink-0 group-hover:bg-[#e55a2b] transition-colors">
                  <Phone className="text-white" size={18} />
                </div>
                <div className="flex flex-col space-y-1">
                  <a href="tel:+919701332707" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                    +91 97013 32707
                  </a>
                  <a href="tel:917416421770" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                    +91 74164 21770
                  </a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="bg-[#c54513] p-2 rounded-lg mr-3 flex-shrink-0 group-hover:bg-[#e55a2b] transition-colors">
                  <MailIcon className="text-white" size={18} />
                </div>
                <a 
                  href="mailto:andhramachinesagencies@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base break-words"
                >
                  andhramachinesagencies@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm sm:text-base text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="text-[#c54513] font-semibold">Murthy Sewing Machines</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#c54513] transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-[#c54513] transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-[#c54513] transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
