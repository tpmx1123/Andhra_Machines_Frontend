import { useState, useEffect } from 'react';
import { X, Sparkles, PartyPopper } from 'lucide-react';

export default function AnniversaryBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Check if banner should be shown (within 7 days)
    const checkBannerVisibility = () => {
      const startDateKey = 'anniversaryBannerStartDate';
      const startDateStr = localStorage.getItem(startDateKey);
      
      if (!startDateStr) {
        // First time - set start date and show banner
        const startDate = new Date();
        localStorage.setItem(startDateKey, startDate.toISOString());
        setIsVisible(true);
        return;
      }
      
      // Check if 7 days have passed
      const startDate = new Date(startDateStr);
      const now = new Date();
      const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        // Still within 7 days - show banner
        setIsVisible(true);
      } else {
        // 7 days passed - hide banner
        setIsVisible(false);
      }
    };
    
    checkBannerVisibility();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles that fall from top
      const particles = [];
      const colors = ['#c54513', '#ffd700', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8c42', '#ffa500', '#ff1493'];
      
      for (let i = 0; i < 80; i++) {
        particles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 4 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 6,
          rotation: Math.random() * 360
        });
      }
      setConfetti(particles);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .confetti-particle {
          animation: confetti-fall linear infinite;
        }
        
        .sparkle-icon {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#c54513] via-[#d65a1f] to-[#c54513] py-5 px-4 md:py-4 md:px-6 shadow-2xl border-b-2 border-yellow-300">
        {/* Confetti Animation - Falling from top */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: '200%', top: '-100%' }}>
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="confetti-particle absolute rounded-full"
              style={{
                left: `${particle.left}%`,
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                transform: `rotate(${particle.rotation}deg)`
              }}
            />
          ))}
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Sparkles
              key={i}
              className="sparkle-icon absolute text-yellow-300"
              size={18}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))'
              }}
            />
          ))}
        </div>

        {/* Banner Content - Landscape Layout */}
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
            <div className="flex-shrink-0 float-animation">
              <PartyPopper className="text-yellow-300" size={40} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white whitespace-nowrap drop-shadow-lg">
                  🎉 Celebrating 44 Years! 🎉
                </h2>
                
              </div>
              <p className="text-sm md:text-base text-yellow-50 mt-1 md:mt-2 font-medium drop-shadow">
                Your Trusted Partner Since 1982 • Thank you for being part of our journey!
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-200 text-white hover:text-yellow-200 hover:scale-110 active:scale-95"
            aria-label="Close banner"
          >
            <X size={28} />
          </button>
        </div>

        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse" style={{ boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }} />
      </div>
    </>
  );
}

