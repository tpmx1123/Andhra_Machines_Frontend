import { Award, Wrench, Truck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content with Logo and Text */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-12">
            {/* Logo Section - Left */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-200">
                <Link to="/" className="inline-block group">
                  <div className="text-center lg:text-left">
                    <img
                      src="https://res.cloudinary.com/durbtkhbz/image/upload/v1766221250/WhatsApp_Image_2025-12-20_at_2.29.17_PM-removebg-preview_lhqolz.png"
                      alt="Andhra Machines Agencies Logo"
                      className="h-32 sm:h-40 lg:h-44 w-auto mx-auto lg:mx-12 transition-transform group-hover:scale-105 cursor-default"
                    />
                    <div className="mt-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#c54513] group-hover:text-[#c54513] transition-colors cursor-default">
                        Andhra Machines Agencies
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 cursor-default">Since 1982</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Content Section - Right */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Who We Are?
                </h2>
                <div className="w-20 h-1.5 bg-[#c54513] rounded-full"></div>
              </div>

              <div className="space-y-5 text-gray-700">
                <p className="text-base sm:text-lg leading-relaxed">
                  We are one of <span className="font-semibold text-[#c54513]">Andhra Pradesh's most trusted sewing machine specialists</span>, serving customers since 1982. With over 43 years of experience, we provide a complete range of domestic, professional, and industrial sewing machines, along with genuine accessories and expert servicing.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  From our roots in <span className="font-semibold">Rajahmundry</span> to our expanding presence across the state, we have built a reputation for quality, reliability, and customer-first service. Today, we are proud to extend our reach—delivering sewing machines and accessories across India and supporting customers nationwide.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-[#c54513] mb-1">43+</div>
                  <div className="text-sm sm:text-base text-gray-600">Years Experience</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-bold text-[#c54513] mb-1">1000+</div>
                  <div className="text-sm sm:text-base text-gray-600">Happy Customers</div>
                </div>
               
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#c54513]/20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#c54513] to-[#e55a2b] text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Award size={36} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Authorized Dealer</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Official authorized dealer for all major brands including Usha, Singer, Jack, Brother, Juki, and more.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#c54513]/20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#c54513] to-[#e55a2b] text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Wrench size={36} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Expert Repairs</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Our certified technicians provide reliable repair and maintenance services for all types of machines with genuine parts.
            </p>
          </div>

          <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#c54513]/20 sm:col-span-2 lg:col-span-1">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#c54513] to-[#e55a2b] text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Truck size={36} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Free Installation</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We offer free installation and demonstration for all machines purchased from our store, ensuring you're comfortable with your new equipment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
