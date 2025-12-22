import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';

const Brands = () => {
  // Brand logos from BrandsSection.jsx
  const brandLogos = {
    usha: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380473/page1-800px-USHA_Logo.pdf_aaotn8_v4iosh.jpg',
    singer: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380889/Singer-Logo_tgjv61_nk8vfi.png',
    jack: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380965/images_uwvfcp_l3g1xg.jpg',
    brother: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381417/Screenshot_2025-12-17_143538_v845iu_keavdh.png',
    guru: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381542/images_yfisez_1_xoqcmb.png',
    shiela: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381608/c0ba20498b688b78d1aa85683be2eb55_zodny4_x8uikd.jpg',
  };

  const brands = [
    {
      id: 'usha',
      name: 'Usha',
      description: 'A trusted name in sewing machines since 1934, Usha offers a wide range of reliable and affordable sewing solutions for home and professional use.',
      logo: brandLogos.usha,
      featured: true
    },
    {
      id: 'singer',
      name: 'Singer',
      description: 'The original American sewing machine company since 1851, Singer is known for its innovative and high-quality sewing machines for all skill levels.',
      logo: brandLogos.singer,
      featured: true
    },
    {
      id: 'shiela',
      name: 'Shiela',
      description: 'Shiela is a trusted Indian brand offering durable and affordable sewing machines for home tailoring, small businesses, and daily sewing needs. Known for ease of use, strong build quality, and reliable performance.',
      logo: brandLogos.shiela,
      featured: true
    },
    {
      id: 'guru',
      name: 'Guru',
      description: 'Guru Sewing Machines is a trusted Indian brand offering durable and affordable sewing machines for home tailoring, small businesses, and daily sewing needs. Known for ease of use, strong build quality, and reliable performance.',
      logo: brandLogos.guru,
      featured: true
    },
    {
      id: 'brother',
      name: 'Brother',
      description: 'Innovative sewing and embroidery machines with user-friendly features, perfect for both beginners and experienced sewists.',
      logo: brandLogos.brother,
      featured: true
    },
    
    {
      id: 'jack',
      name: 'Jack',
      description: 'Specializing in industrial sewing machines, Jack is known for its heavy-duty and high-performance machines.',
      logo: brandLogos.jack,
      featured: true
    }
    
  ];

  return (
    <>
      <SEO
        title="Sewing Machine Brands - Usha, Singer, Brother, Jack | Andhra Machines Agencies"
        description="Explore premium sewing machine brands at Andhra Machines Agencies. Shop Usha, Singer, Brother, Jack, Guru, and Shiela sewing machines. Trusted brands since 1982."
        keywords="Usha sewing machine, Singer sewing machine, Brother sewing machine, Jack sewing machine, sewing machine brands, best sewing machine brands"
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Brands
          </h1>
          <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-500">
            Discover top-quality sewing machine brands trusted by professionals and hobbyists worldwide.
          </p>
        </div>

        {/* Featured Brands */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {brands.filter(brand => brand.featured).map((brand) => (
              <div key={brand.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-white flex items-center justify-center p-6">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`} 
                    className="max-h-20 max-w-full object-contain "
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x80?text=' + brand.name;
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{brand.description}</p>
                  <div className="mt-4">
                    <Link
                      to={`/brands/${brand.id}`}
                      className="inline-flex items-center text-[#c54513] hover:text-[#a4370f] font-medium"
                    >
                      View Products
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Brands */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Brands</h2>
          <div className="overflow-hidden">
            <div className="flex animate-scroll-slow gap-6">
              {/* Duplicate brands for seamless loop */}
              {[...brands, ...brands].map((brand, index) => (
                <Link
                  key={`${brand.id}-${index}`}
                  to={`/brands/${brand.id}`}
                  className="group bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-[#c54513] transition-all duration-200 text-center flex-shrink-0 w-[200px]"
                >
                  <div className="h-20 flex items-center justify-center mb-3">
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/120x60?text=' + brand.name;
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#c54513] transition-colors">
                    {brand.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
          
          <style>{`
            @keyframes scroll-slow {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll-slow {
              animation: scroll-slow 60s linear infinite;
            }
            .animate-scroll-slow:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>

        {/* Brand Showcase */}
        <div className="mt-16 bg-gradient-to-r from-[#c54513] to-[#e05a24] rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Premium Quality Sewing Machines</h2>
            <p className="text-lg mb-6 opacity-90">
              We partner with the world's leading sewing machine manufacturers to bring you reliable, innovative, and high-performance machines for all your sewing needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-[#c54513] font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse All Products
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Brands;
