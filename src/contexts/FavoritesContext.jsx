import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load favorites from database when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated && user) {
        try {
          setLoading(true);
          // Load favorites from database only
          const response = await api.getFavorites();
          if (response.success && response.data) {
            const dbFavorites = response.data.map(item => ({
              id: item.productId,
              name: item.name,
              brand: item.brand || 'Unknown',
              brandSlug: item.brandSlug,
              price: parseFloat(item.price),
              originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
              image: item.image,
              rating: 0,
              inStock: item.inStock !== undefined ? item.inStock : true
            }));
            setFavorites(dbFavorites);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          console.error('Error loading favorites from database:', error);
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      } else {
        // If not authenticated, clear favorites
        setFavorites([]);
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  // Clear favorites when user logs out
  useEffect(() => {
    if (!isAuthenticated && !user) {
      setFavorites([]);
    }
  }, [isAuthenticated, user]);

  const toggleFavorite = async (product, showToast = null, navigate = null) => {
    // Require authentication
    if (!isAuthenticated || !user) {
      if (showToast) {
        showToast('Please login to add items to wishlist', 'error');
      }
      if (navigate) {
        navigate('/login');
      }
      return;
    }

    const isCurrentlyFavorite = favorites.some(item => item.id === product.id);
    
    if (isCurrentlyFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter(item => item.id !== product.id);
      setFavorites(newFavorites);
      
      // Remove from database
      try {
        await api.removeFavorite(product.id);
        if (showToast) {
          showToast('Removed from wishlist', 'success');
        }
      } catch (error) {
        console.error('Error removing favorite from database:', error);
        // Revert on error
        setFavorites(favorites);
        if (showToast) {
          showToast('Failed to remove from wishlist', 'error');
        }
      }
    } else {
      // Add to favorites
      const favoriteItem = {
        id: product.id,
        name: product.name,
        brand: product.brand || 'Unknown',
        brandSlug: product.brandSlug,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image || product.images?.[0] || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
        rating: product.rating || 0,
        inStock: product.inStock !== undefined ? product.inStock : true
      };
      
      setFavorites(prev => [...prev, favoriteItem]);
      
      // Add to database
      try {
        await api.addFavorite(product.id);
        if (showToast) {
          showToast('Added to wishlist', 'success');
        }
      } catch (error) {
        console.error('Error adding favorite to database:', error);
        // Revert on error
        setFavorites(favorites);
        if (showToast) {
          showToast('Failed to add to wishlist', 'error');
        }
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = async () => {
    setFavorites([]);
    
    // Clear from database if authenticated
    if (isAuthenticated && user) {
      try {
        await api.syncFavorites([]);
      } catch (error) {
        console.error('Error clearing favorites from database:', error);
      }
    }
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loading
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

