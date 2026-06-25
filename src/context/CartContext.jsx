import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('oxycare_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('Failed to parse cart:', e);
                return [];
            }
        }
        return [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        console.log('Cart state updated:', cart);
        try {
            localStorage.setItem('oxycare_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to save cart to localStorage:', e);
        }
    }, [cart]);

    useEffect(() => {
        // Self-healing for existing cart items (fixes lab name issue)
        setCart(prev => {
            let changed = false;
            const sanitized = prev.map(item => {
                const labName = (item.lab || item.labName || '').toLowerCase();
                const currentName = (item.name || '').toLowerCase();
                
                // If the name is basically the lab name or generic, we need to fix it
                const isGeneric = currentName === labName || 
                                currentName.includes('lab') || 
                                currentName === 'diagnostic test' ||
                                currentName === 'new test';

                if (isGeneric && (item.testName || item.test)) {
                    const betterName = item.testName || item.test;
                    changed = true;
                    return { ...item, name: betterName };
                }
                return item;
            });
            return changed ? sanitized : prev;
        });
    }, []);

    const addToCart = (item) => {
        // Force standardized name on addition
        // Prioritize testName or test, use name only if it's not a known lab name
        const labName = (item.lab || item.labName || '').toLowerCase();
        let finalName = item.testName || item.test || item.name || 'Diagnostic Test';
        
        if (finalName.toLowerCase() === labName && (item.testName || item.test)) {
            finalName = item.testName || item.test;
        }

        const standardizedItem = {
            ...item,
            name: finalName
        };

        console.log('Adding to cart:', standardizedItem);
        setCart(prev => {
            const exists = prev.find(i => i.id === standardizedItem.id);
            if (exists) {
                console.log('Item already exists in cart:', standardizedItem.id);
                setIsCartOpen(true);
                return prev;
            }
            return [...prev, standardizedItem];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => {
        if (!item || !item.price) return sum;
        if (typeof item.price === 'number') return sum + item.price;
        if (typeof item.price === 'string') {
            const price = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
            return sum + price;
        }
        return sum;
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            cartCount: (cart || []).length,
            totalAmount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
