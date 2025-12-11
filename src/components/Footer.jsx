import { Facebook, Instagram, Mail as MailIcon, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-white">
      <div className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#c54513]">Murthy Sewing Machines</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted partner for premium sewing machines and expert repair services in Chennai since 1998.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#c54513] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#c54513] transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 pl-0">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors block" onClick={() => window.scrollTo(0, 0)}>Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors block">Products</Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-400 hover:text-white transition-colors block">Brands</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors block">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors block">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors block">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Domestic Machines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Industrial Machines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Embroidery Machines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Overlock Machines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Spare Parts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-[#c54513] mt-1 mr-3 flex-shrink-0" size={18} />
                <a 
                  href="https://maps.google.com/?q=Andhra+Machines+Agencies,+Kandakam+Road,+Rajahmundry,+Andhra+Pradesh+533101" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Andhra Machines Agencies,<br/>Kandakam Road, Rajahmundry - 533101, Andhra Pradesh
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="text-[#c54513] mr-3 flex-shrink-0" size={18} />
                <div className="flex flex-col">
                  <a href="tel:+919701332707" className="text-gray-400 hover:text-white transition-colors">+91 97013 32707</a>
                  <a href="tel:917416421770" className="text-gray-400 hover:text-white transition-colors">+91 74164 21770</a>
                </div>
              </li>
              <li className="flex items-center">
                <MailIcon className="text-[#c54513] mr-3 flex-shrink-0" size={18} />
                <a href="mailto:info@murthysewing.com" className="text-gray-400 hover:text-white transition-colors">andhramachinesagencies@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Murthy Sewing Machines. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-white transition-colors mx-2">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors mx-2">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors mx-2">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
