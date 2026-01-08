import { useState, useEffect } from 'react';
import { X, Sparkles, Calendar } from 'lucide-react';

export default function AnniversaryPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Set anniversary date (tomorrow) - you can change this to a specific date
    // Format: YYYY-MM-DD
    const anniversaryDate = new Date(today);
    anniversaryDate.setDate(today.getDate() + 1); // Tomorrow
    const anniversaryDateStr = anniversaryDate.toISOString().split('T')[0];
    
    // Show popup for 7 days starting from anniversary date
    const endDate = new Date(anniversaryDate);
    endDate.setDate(anniversaryDate.getDate() + 7);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Show popup if today is between anniversary date and end date
    // Will show on every page refresh/load
    if (todayStr >= anniversaryDateStr && todayStr <= endDateStr) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // No storage - will show again on next page refresh
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-gradient-to-br from-[#c54513] via-[#d65a2a] to-[#e67e3f] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10 bg-black bg-opacity-20 rounded-full p-1.5 hover:bg-opacity-30"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-white rounded-full p-4">
                <Sparkles className="h-12 w-12 text-[#c54513]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-white mb-2">
            🎉 Celebrating 44 Years! 🎉
          </h2>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 text-white/90 mb-4">
            <Calendar className="h-5 w-5" />
            <p className="text-lg font-semibold">44th Anniversary</p>
          </div>

          {/* Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <p className="text-white text-lg leading-relaxed">
              Thank you for being part of our incredible journey! 
              <br />
              <span className="font-semibold">44 years of excellence</span> in serving you with 
              premium sewing machines and exceptional service.
            </p>
          </div>

          {/* Call to action */}
          <div className="space-y-3">
            <p className="text-white/90 text-sm">
              Join us in celebrating this milestone!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleClose}
                className="bg-white text-[#c54513] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/80 text-sm">
              Andhra Machines Agencies - Since 1982
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

