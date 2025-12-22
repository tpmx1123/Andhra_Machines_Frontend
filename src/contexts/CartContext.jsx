import React, { createContext, useContext, useState, useEffect } from 'react';

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

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, accessories = []) => {
        const MAX_QUANTITY = 50;
        setCartItems(prevItems => {
            // Check if product already exists in cart
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                // Update quantity if product exists, but enforce max limit
                const updatedItems = [...prevItems];
                const newQuantity = Math.min(updatedItems[existingItemIndex].quantity + quantity, MAX_QUANTITY);
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: newQuantity
                };
                return updatedItems;
            } else {
                // Add new product to cart, but enforce max limit
                const newItem = {
                    id: product.id,
                    name: product.name || product.title,
                    brand: product.brand || product.brandName || 'Unknown',
                    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                    originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(product.originalPrice)) : (typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0),
                    image: product.image || product.mainImageUrl || product.imageUrl || 'https://res.cloudinary.com/durbtkhbz/image/upload/v1765429607/usha_k7slud.jpg',
                    quantity: Math.min(quantity, MAX_QUANTITY),
                    inStock: product.inStock !== false,
                    brandSlug: product.brandSlug,
                    accessories: accessories
                };
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        const MAX_QUANTITY = 50;
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        // Enforce maximum quantity limit
        const limitedQuantity = Math.min(newQuantity, MAX_QUANTITY);
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: limitedQuantity } : item
            )
        );
    };

    const setQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const updateProductPrice = (productId, newPrice, newOriginalPrice) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? {
                        ...item,
                        price: typeof newPrice === 'number' ? newPrice : parseFloat(newPrice) || item.price,
                        originalPrice: newOriginalPrice ? (typeof newOriginalPrice === 'number' ? newOriginalPrice : parseFloat(newOriginalPrice)) : item.originalPrice
                    }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
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
        updateProductPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

