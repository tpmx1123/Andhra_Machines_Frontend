import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Premium Sewing Machines',
      //image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      subtitle: 'Up to 30% OFF',
      description: 'Latest models from top brands',
      bg: 'from-blue-600/80 to-blue-800/80',
    },
    {
      id: 2,
      title: 'Industrial Grade Quality',
      subtitle: 'Professional Solutions',
     // image: 'https://images.pexels.com/photos/1488467/pexels-photo-1488467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Built for demanding workloads',
      bg: 'from-orange-600/80 to-red-700/80',
    },
    {
      id: 3,
      title: 'Expert Service & Support',
      subtitle: 'Free Installation',
      //image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Comprehensive warranty coverage',
      bg: 'from-teal-600/80 to-teal-800/80',
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
           
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} mix-blend-multiply`} />
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl mx-auto z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                  {slide.title}
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white/90 drop-shadow">
                  {slide.subtitle}
                </h2>
                <p className="text-xl mb-8 text-white/90 drop-shadow">
                  {slide.description}
                </p>
                <button 
                  className="bg-white/90 text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-white transition-all hover:scale-105"
                >
                  Shop Now
                </button>
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