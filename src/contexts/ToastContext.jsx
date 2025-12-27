import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Track recent toasts to prevent duplicates (within 3 seconds)
  const recentToastsRef = useRef(new Map());

  const showToast = useCallback((message, type = 'success') => {
    // Create a unique key for this toast message
    // For price updates, also include a simplified key to catch similar messages
    const toastKey = `${message}-${type}`;
    const now = Date.now();
    
    // Check if we've shown this exact toast recently (within 5 seconds)
    const lastShown = recentToastsRef.current.get(toastKey);
    if (lastShown && (now - lastShown) < 5000) {
      // Duplicate toast within 5 seconds, skip it
      return null;
    }
    
    // For price update messages, also check for similar messages (same product name pattern)
    // This catches cases where the message might vary slightly
    if (message.includes('has discount') || message.includes('Price updated for')) {
      // Extract product name pattern (everything after "for " or before " has")
      const productNameMatch = message.match(/(?:for |^)(.+?)(?: has|$)/);
      if (productNameMatch) {
        const productName = productNameMatch[1].trim();
        const similarKey = `price-update-${productName}-${type}`;
        const lastSimilarShown = recentToastsRef.current.get(similarKey);
        if (lastSimilarShown && (now - lastSimilarShown) < 5000) {
          // Similar price update toast within 5 seconds, skip it
          return null;
        }
        // Record similar key
        recentToastsRef.current.set(similarKey, now);
        setTimeout(() => {
          recentToastsRef.current.delete(similarKey);
        }, 10000);
      }
    }
    
    // Record this toast
    recentToastsRef.current.set(toastKey, now);
    
    // Clean up old entries (older than 10 seconds)
    setTimeout(() => {
      recentToastsRef.current.delete(toastKey);
    }, 10000);
    
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

