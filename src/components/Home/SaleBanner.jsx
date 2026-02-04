import { useState } from 'react';
import { Sparkles, Tag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SaleBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleShopNow = () => {
    setIsOpen(false);
    navigate('/products');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup card */}
      <div className="relative w-full max-w-[960px] bg-[radial-gradient(circle_at_top,_#ffb563,_#c54513_55%,_#7d250c_100%)] rounded-[28px] md:rounded-[32px] shadow-[0_22px_45px_rgba(0,0,0,0.35)] overflow-hidden border border-white/10">
        {/* Decorative sparkles in background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(18)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-yellow-300"
              size={16}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 text-white/80 hover:text-white bg-black/25 hover:bg-black/40 rounded-full p-1.5 transition-colors"
          aria-label="Close sale banner"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 px-5 py-6 md:px-10 md:py-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 md:gap-8">
            {/* Icon + text */}
            <div className="flex items-start gap-4 md:gap-5 text-white flex-1">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/20 rounded-full blur-md" />
                  <div className="relative bg-[radial-gradient(circle_at_30%_30%,_#ffdf8b,_#f28a2a)] rounded-full p-4 md:p-5 shadow-lg">
                    <Tag className="text-white" size={32} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-semibold text-yellow-200 uppercase tracking-[0.18em]">
                  Limited Time Offer
                </span>
                <p className="mt-1 text-2xl md:text-[32px] font-extrabold leading-snug drop-shadow max-w-[20rem] md:max-w-none">
                  10–20% OFF on Sewing Machines Sale
                </p>
                <p className="mt-3 text-xs md:text-sm text-yellow-100">
                  Grab the best deals on domestic &amp; industrial sewing machines today.
                </p>
              </div>
            </div>

            {/* CTAs: Live Sale + Shop Now */}
            <div className="mt-4 md:mt-0 flex flex-col items-stretch md:items-end justify-center gap-2 w-full md:w-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-white text-[#c54513] px-4 py-1.5 text-xs md:text-sm font-semibold shadow-md self-center md:self-end">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live Sale</span>
              </div>
              <button
                type="button"
                onClick={handleShopNow}
                className="inline-flex justify-center items-center rounded-full bg-[#ffffff] text-[#c54513] hover:bg-gray-100 px-7 py-2.5 text-sm md:text-base font-semibold shadow-lg transition-colors self-center md:self-end w-full md:w-auto"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
