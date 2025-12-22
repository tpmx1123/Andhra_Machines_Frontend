import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Premium Sewing Machines',
      image: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766379865/WhatsApp_Image_2025-12-19_at_6.06.31_PM_kcugod_ictydo.jpg',
      subtitle: 'Up to 20% OFF',
      description: 'Latest models from top brands - USHA, Singer, JACK & more',
      bg: 'from-[#c54513]/20 to-[#a43a10]/20',
    },
    {
      id: 2,
      title: 'Industrial Grade Quality',
      subtitle: 'Professional Solutions',
      image: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766379865/ChatGPT_Image_Dec_19_2025_06_26_31_PM_fsbphs_toljyb.png',
      description: 'Built for demanding workloads with precision and durability',
      bg: 'from-[#c54513]/20 to-[#a43a10]/20',
    },
    {
      id: 3,
      title: 'Expert Service & Support',
      subtitle: 'Free Installation',
      image: 'https://res.cloudinary.com/do8cpljrz/image/upload/v1766379865/ChatGPT_Image_Dec_19_2025_06_28_19_PM_grlgrs_ewbrvt.png',
      description: 'Comprehensive warranty coverage & dedicated customer support',
      bg: 'from-[#c54513]/20 to-[#a43a10]/20',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="w-full flex-shrink-0 h-full relative"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                  {slide.title}
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-white drop-shadow-lg">
                  {slide.subtitle}
                </h2>
                
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white drop-shadow-md">
                  {slide.description}
                </p>
                <Link 
                  to="/products"
                  className="inline-block bg-white text-[#c54513] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8 scale-125' 
                : 'bg-white/50 hover:bg-white/75 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}