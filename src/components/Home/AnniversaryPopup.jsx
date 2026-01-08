import { useState, useEffect } from 'react';
import { X, Sparkles, PartyPopper } from 'lucide-react';

export default function AnniversaryPopup({ onOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has seen the celebration today
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('anniversaryPopupShown');
    
    // Show if not shown today
    if (lastShown !== today) {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 100);
      localStorage.setItem('anniversaryPopupShown', today);
      
      // Notify parent that popup is open
      if (onOpen) {
        onOpen();
      }
      
      // Auto-close after 6 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [onOpen]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const particles = [];
      const colors = ['#c54513', '#ffd700', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8c42', '#ffa500', '#ff1493', '#00ff00', '#ff00ff'];
      
      for (let i = 0; i < 100; i++) {
        particles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 8,
          rotation: Math.random() * 720,
          initialY: -20 - Math.random() * 30
        });
      }
      setConfetti(particles);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClose = () => {
    setShowContent(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      setIsVisible(false);
      // Notify parent that popup is closed
      if (onClose) {
        onClose();
      }
    }, 300);
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
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.6);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .confetti-particle {
          animation: confetti-fall linear forwards;
        }
        
        .sparkle-icon {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 2s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            showContent ? 'opacity-60' : 'opacity-0'
          } backdrop-blur-sm`}
          onClick={handleClose}
        />
        
        {/* Modal Content */}
        <div 
          className={`relative bg-gradient-to-br from-[#c54513] via-[#d65a2a] to-[#e67e3f] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transition-all duration-300 ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } slide-in`}
        >
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                  boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`,
                  top: `${particle.initialY}%`
                }}
              />
            ))}
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className="sparkle-icon absolute text-yellow-300"
                size={16 + Math.random() * 8}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 1))'
                }}
              />
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors z-10 bg-black bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative p-8 md:p-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6 float-animation">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-30"></div>
                <div className="relative bg-white rounded-full p-5 pulse-glow">
                  <PartyPopper className="h-12 w-12 text-[#c54513]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-2xl">
              🎉 44 Years! 🎉
            </h2>
            
            {/* Subtitle */}
            <h3 className="text-xl md:text-2xl font-bold text-yellow-200 mb-4 drop-shadow-lg">
              Celebrating Our Journey
            </h3>
            
          
            
            <p className="text-base md:text-lg text-white/90 mb-6 drop-shadow">
              Your Trusted Partner Since 1982
            </p>
            
            <p className="text-sm md:text-base text-yellow-100 drop-shadow">
              Thank you for being part of our incredible journey!
            </p>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse" style={{ boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }} />
          </div>
        </div>
      </div>
    </>
  );
}

