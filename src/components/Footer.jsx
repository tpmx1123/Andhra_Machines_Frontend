import { Facebook, Instagram, Mail as MailIcon, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function Footer() {
  const { showToast } = useToast();
  return (
    <footer className="relative bg-gray-50 border-t-2 border-[#c54513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Centered Company Name with Logo */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="flex flex-col items-center">
              <img 
                src="https://res.cloudinary.com/do8cpljrz/image/upload/v1766379206/5ce7960d-fb0f-4693-8c80-800e26fcac92-removebg-preview_cilmdc_bemxiy.png"
                alt="Andhra Machines Agencies Logo"
                className="h-16 sm:h-20 lg:h-24 w-auto mb-3 object-contain"
              />
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-[#c54513] transition-colors">
                Andhra Machines Agencies
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-1 cursor-default">Since 1982</p>
            </div>
          </Link>
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-5">
          {/* Quick Links */}
          <div className="text-center sm:text-left sm:ml-4 lg:ml-8">
            <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-gray-900 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
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
                    className="text-sm sm:text-base text-gray-600 hover:text-[#c54513] transition-colors block"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-gray-900 uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://maps.google.com/?q=Andhra+Machines+Agencies,+Kandakam+Road,+Rajahmundry,+Andhra+Pradesh+533101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-gray-600 hover:text-[#c54513] transition-colors flex items-start"
                >
                  <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">Andhra Machines Agencies, Kandakam Road, Rajahmundry - 533101</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919701332707"
                  className="text-sm sm:text-base text-gray-600 hover:text-[#c54513] transition-colors flex items-center"
                >
                  <Phone size={14} className="mr-2 flex-shrink-0" />
                  +91 97013 32707
                </a>
              </li>
              <li>
                <a
                  href="tel:917416421770"
                  className="text-sm sm:text-base text-gray-600 hover:text-[#c54513] transition-colors flex items-center"
                >
                  <Phone size={14} className="mr-2 flex-shrink-0" />
                  +91 74164 21770
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-gray-600 hover:text-[#c54513] transition-colors flex items-start break-all"
                  onClick={(e) => {
                    e.preventDefault();
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    const email = 'andhramachinesagencies@gmail.com';
                    const subject = 'Contact from Andhra Machines Website';
                    
                    if (isMobile) {
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                      setTimeout(() => {
                        navigator.clipboard.writeText(email).then(() => {
                          showToast('Email address copied to clipboard!', 'success');
                        });
                      }, 200);
                    } else {
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`, '_blank');
                    }
                    return false;
                  }}
                >
                  <MailIcon size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span className="break-all">andhramachinesagencies@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us & Business Hours */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-gray-900 uppercase tracking-wide">
              Follow Us
            </h4>
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
              <a
                href="https://www.facebook.com/andhramachinesagencies"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-300 hover:border-[#c54513] p-2.5 rounded-lg transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="text-gray-900 hover:text-[#c54513]" size={18} />
              </a>
              <a
                href="https://www.instagram.com/andhramachinesagencies"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-300 hover:border-[#c54513] p-2.5 rounded-lg transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="text-gray-900 hover:text-[#c54513]" size={18} />
              </a>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Business Hours</p>
              <p className="text-sm text-gray-700 font-medium">Mon - Sat: 10:30 AM to 8:30 PM</p>
              <p className="text-sm text-gray-700 font-medium">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-1.5 sm:space-y-0">
            <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} <span className="text-[#c54513] font-semibold">Andhra Machines Agencies</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-gray-500">
              <Link to="/legal" className="hover:text-[#c54513] transition-colors" onClick={() => window.scrollTo(0, 0)}>Legal</Link>
              <span>•</span>
              <Link to="/privacy-policy" className="hover:text-[#c54513] transition-colors" onClick={() => window.scrollTo(0, 0)}>Privacy</Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-[#c54513] transition-colors" onClick={() => window.scrollTo(0, 0)}>Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
