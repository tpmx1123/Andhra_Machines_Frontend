import { Link } from 'react-router-dom';

export default function BrandsSection() {
  const brands = [
    {
      name: 'Usha',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380473/page1-800px-USHA_Logo.pdf_aaotn8_v4iosh.jpg',
      description: 'Pioneering sewing technology since 1934',
      slug: 'usha'
    },
    {
      name: 'Singer',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380889/Singer-Logo_tgjv61_nk8vfi.png',
      description: 'The original sewing machine company',
      slug: 'singer'
    },
    {
      name: 'Jack',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766380965/images_uwvfcp_l3g1xg.jpg',
      description: 'Industrial strength performance',
      slug: 'jack'
    },
    {
      name: 'Brother',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381417/Screenshot_2025-12-17_143538_v845iu_keavdh.png',
      description: 'Innovative sewing solutions',
      slug: 'brother'
    },
    {
      name: 'Guru',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381542/images_yfisez_1_xoqcmb.png',
      description: 'Reliable, affordable sewing machines for everyday use',
      slug: 'guru'
    },
    {
      name: 'Shiela',
      logo: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766381608/c0ba20498b688b78d1aa85683be2eb55_zodny4_x8uikd.jpg',
      description: 'Reliable, affordable sewing machines for everyday use',
      slug: 'shiela'
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#f8f6f6] bg-[#eb5a2a] rounded-full mb-4">
            OUR BRANDS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Brands
          </h2>
          <div className="w-20 h-1 bg-[#c54513] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are proud to be authorized dealers for the world's most reputable sewing machine manufacturers
          </p>
        </div>

        <div className="overflow-hidden px-4">
          <div className="flex animate-scroll-slow gap-6">
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <Link 
                to={`/brands/${brand.slug}`}
                key={`${brand.name}-${index}`}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#c54513]/20 flex-shrink-0 w-[280px]"
              >
                <div className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="w-full h-16 flex items-center justify-center mb-4">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150x60?text=' + brand.name;
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{brand.name}</h3>
                  <p className="text-sm text-gray-500 text-center group-hover:text-[#c54513] transition-colors">
                    {brand.description}
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#c54513]/30 rounded-xl pointer-events-none transition-all duration-300"></div>
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
            animation: scroll-slow 20s linear infinite;
          }
          .animate-scroll-slow:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="mt-12 text-center">
          <Link 
            to="/brands" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#c54513] hover:bg-[#a43a10] transition-colors shadow-sm"
          >
            View All Brands
            <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
