import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Load cart from database when user is authenticated
    useEffect(() => {
        const loadCart = async () => {
            if (isAuthenticated && user) {
                try {
                    setLoading(true);
                    // Get localStorage cart first (if exists) - only merge once
                    const localCart = localStorage.getItem('cart');
                    let localCartItems = [];
                    const mergeKey = `cart_merged_${user.id}`;
                    const hasMerged = localStorage.getItem(mergeKey) === 'true';
                    
                    if (localCart && !hasMerged) {
                        try {
                            localCartItems = JSON.parse(localCart);
                        } catch (e) {
                            console.error('Error parsing local cart:', e);
                        }
                    }

                    // Load cart from database
                    const response = await api.getCart();
                    if (response.success && response.data) {
                        const dbItems = response.data.items.map(item => ({
                            id: item.productId,
                            name: item.name,
                            brand: item.brand,
                            brandSlug: item.brandSlug,
                            price: parseFloat(item.price),
                            originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                            image: item.image,
                            quantity: item.quantity,
                            inStock: item.inStock !== false
                        }));

                        // Merge local cart with database cart (only if not already merged)
                        if (localCartItems.length > 0 && !hasMerged) {
                            // Clear local cart first
                            localStorage.removeItem('cart');
                            
                            // Merge items - update quantities for existing items, add new ones
                            for (const localItem of localCartItems) {
                                const existingDbItem = dbItems.find(item => item.id === localItem.id);
                                if (existingDbItem) {
                                    // Update quantity if needed
                                    const newQuantity = Math.min(
                                        existingDbItem.quantity + localItem.quantity,
                                        50
                                    );
                                    if (newQuantity !== existingDbItem.quantity) {
                                        try {
                                            await api.updateCartItem(localItem.id, newQuantity);
                                        } catch (e) {
                                            console.error('Error updating cart item during merge:', e);
                                        }
                                    }
                                } else {
                                    // Add new item from local cart
                                    try {
                                        await api.addToCart(localItem.id, localItem.quantity);
                                    } catch (e) {
                                        console.error('Error adding cart item during merge:', e);
                                    }
                                }
                            }
                            
                            // Mark as merged
                            localStorage.setItem(mergeKey, 'true');
                            
                            // Reload from database
                            const updatedResponse = await api.getCart();
                            if (updatedResponse.success && updatedResponse.data) {
                                const updatedItems = updatedResponse.data.items.map(item => ({
                                    id: item.productId,
                                    name: item.name,
                                    brand: item.brand,
                                    brandSlug: item.brandSlug,
                                    price: parseFloat(item.price),
                                    originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                                    image: item.image,
                                    quantity: item.quantity,
                                    inStock: item.inStock !== false
                                }));
                                setCartItems(updatedItems);
                            } else {
                                setCartItems(dbItems);
                            }
                        } else {
                            setCartItems(dbItems);
                        }
                    }
                } catch (error) {
                    console.error('Error loading cart from database:', error);
                    // Fallback to localStorage if database fails
                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        try {
                            setCartItems(JSON.parse(savedCart));
                        } catch (e) {
                            console.error('Error loading cart from localStorage:', e);
                        }
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                // If not authenticated, clear cart (don't load from localStorage)
                setCartItems([]);
                setLoading(false);
            }
        };

        loadCart();
    }, [isAuthenticated, user]);

    // Sync cart to database whenever it changes (if authenticated)
    useEffect(() => {
        if (isAuthenticated && user && !loading) {
            // Save to localStorage as backup
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } else if (!isAuthenticated) {
            // Don't save to localStorage when logged out - cart should be empty
            localStorage.removeItem('cart');
        }
    }, [cartItems, isAuthenticated, user, loading]);

    // Clear cart when user logs out
    useEffect(() => {
        if (!isAuthenticated && !user) {
            setCartItems([]);
            localStorage.removeItem('cart');
            // Clear merge flags for all users
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('cart_merged_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }, [isAuthenticated, user]);

    const addToCart = async (product, quantity = 1, accessories = []) => {
        const MAX_QUANTITY = 50;
        const finalQuantity = Math.min(quantity, MAX_QUANTITY);

        if (isAuthenticated && user) {
            try {
                // Add to database
                await api.addToCart(product.id, finalQuantity);
                // Reload cart from database
                const response = await api.getCart();
                if (response.success && response.data) {
                    const items = response.data.items.map(item => ({
                        id: item.productId,
                        name: item.name,
                        brand: item.brand,
                        brandSlug: item.brandSlug,
                        price: parseFloat(item.price),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                        image: item.image,
                        quantity: item.quantity,
                        inStock: item.inStock !== false
                    }));
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                // Fallback to local state
                setCartItems(prevItems => {
                    const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
                    if (existingItemIndex >= 0) {
                        const updatedItems = [...prevItems];
                        const newQuantity = Math.min(updatedItems[existingItemIndex].quantity + finalQuantity, MAX_QUANTITY);
                        updatedItems[existingItemIndex] = {
                            ...updatedItems[existingItemIndex],
                            quantity: newQuantity
                        };
                        return updatedItems;
                    } else {
                        const newItem = {
                            id: product.id,
                            name: product.name || product.title,
                            brand: product.brand || product.brandName || 'Unknown',
                            price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                            originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice)) : (typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0),
                            image: product.image || product.mainImageUrl || product.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
                            quantity: finalQuantity,
                            inStock: product.inStock !== false,
                            brandSlug: product.brandSlug,
                            accessories: accessories
                        };
                        return [...prevItems, newItem];
                    }
                });
            }
        } else {
            // Not authenticated - use local state only
            setCartItems(prevItems => {
                const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
                if (existingItemIndex >= 0) {
                    const updatedItems = [...prevItems];
                    const newQuantity = Math.min(updatedItems[existingItemIndex].quantity + finalQuantity, MAX_QUANTITY);
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: newQuantity
                    };
                    return updatedItems;
                } else {
                    const newItem = {
                        id: product.id,
                        name: product.name || product.title,
                        brand: product.brand || product.brandName || 'Unknown',
                        price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                        originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice)) : (typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0),
                        image: product.image || product.mainImageUrl || product.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
                        quantity: finalQuantity,
                        inStock: product.inStock !== false,
                        brandSlug: product.brandSlug,
                        accessories: accessories
                    };
                    return [...prevItems, newItem];
                }
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated && user) {
            try {
                await api.removeFromCart(productId);
                // Reload cart from database
                const response = await api.getCart();
                if (response.success && response.data) {
                    const items = response.data.items.map(item => ({
                        id: item.productId,
                        name: item.name,
                        brand: item.brand,
                        brandSlug: item.brandSlug,
                        price: parseFloat(item.price),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                        image: item.image,
                        quantity: item.quantity,
                        inStock: item.inStock !== false
                    }));
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
                // Fallback to local state
                setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        const MAX_QUANTITY = 50;
        if (newQuantity < 1) {
            await removeFromCart(productId);
            return;
        }
        const limitedQuantity = Math.min(newQuantity, MAX_QUANTITY);

        if (isAuthenticated && user) {
            try {
                await api.updateCartItem(productId, limitedQuantity);
                // Reload cart from database
                const response = await api.getCart();
                if (response.success && response.data) {
                    const items = response.data.items.map(item => ({
                        id: item.productId,
                        name: item.name,
                        brand: item.brand,
                        brandSlug: item.brandSlug,
                        price: parseFloat(item.price),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                        image: item.image,
                        quantity: item.quantity,
                        inStock: item.inStock !== false
                    }));
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error updating cart quantity:', error);
                // Fallback to local state
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === productId ? { ...item, quantity: limitedQuantity } : item
                    )
                );
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: limitedQuantity } : item
                )
            );
        }
    };

    const setQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(productId);
            return;
        }
        const MAX_QUANTITY = 50;
        const limitedQuantity = Math.min(newQuantity, MAX_QUANTITY);

        if (isAuthenticated && user) {
            try {
                await api.updateCartItem(productId, limitedQuantity);
                // Reload cart from database
                const response = await api.getCart();
                if (response.success && response.data) {
                    const items = response.data.items.map(item => ({
                        id: item.productId,
                        name: item.name,
                        brand: item.brand,
                        brandSlug: item.brandSlug,
                        price: parseFloat(item.price),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : parseFloat(item.price),
                        image: item.image,
                        quantity: item.quantity,
                        inStock: item.inStock !== false
                    }));
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error setting cart quantity:', error);
                // Fallback to local state
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === productId ? { ...item, quantity: limitedQuantity } : item
                    )
                );
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: limitedQuantity } : item
                )
            );
        }
    };

    const updateProductPrice = (productId, newPrice, newOriginalPrice) => {
        const productIdNum = typeof productId === 'number' ? productId : Number(productId);
        const priceNum = typeof newPrice === 'number' ? newPrice : parseFloat(newPrice);
        const originalPriceNum = newOriginalPrice ? (typeof newOriginalPrice === 'number' ? newOriginalPrice : parseFloat(newOriginalPrice)) : priceNum;
        
        // Update local state only - backend has already synced prices via syncCartPricesForProduct
        // No need to refresh from database as it can cause race conditions and duplicate items
        setCartItems(prevItems => {
            const updated = prevItems.map(item => {
                if (Number(item.id) === productIdNum) {
                    return {
                        ...item,
                        price: priceNum,
                        originalPrice: originalPriceNum
                    };
                }
                return item;
            });
            return updated;
        });
    };

    const clearCart = async () => {
        if (isAuthenticated && user) {
            try {
                await api.clearCart();
                setCartItems([]);
            } catch (error) {
                console.error('Error clearing cart:', error);
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        updateProductPrice,
        loading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

