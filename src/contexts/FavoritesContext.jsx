import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(item => item.id === product.id);
      
      if (isFavorite) {
        // Remove from favorites
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        // Add to favorites
        const favoriteItem = {
          id: product.id,
          name: product.name,
          brand: product.brand || 'Unknown',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image || product.images?.[0] || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
          rating: product.rating || 0
        };
        return [...prevFavorites, favoriteItem];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

