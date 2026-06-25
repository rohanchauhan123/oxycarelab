import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    Search,
    Grid,
    User,
    ShoppingCart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'HOME', path: '/' },
        { icon: Search, label: 'SEARCH', path: '/book-test' },
        { icon: Grid, label: 'PACKAGES', path: '/health-packages' },
        { icon: User, label: 'ACCOUNT', path: '/dashboard' },
        { icon: ShoppingCart, label: 'CART', path: null, isCart: true },
    ];

    // Hide BottomNav only on admin routes. Show on dashboard for easier mobile navigation.
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="lg:hidden fixed bottom-1 left-0 right-0 z-[100] px-4 pb-[env(safe-area-inset-bottom)] pointer-events-none">
            <div className="max-w-md mx-auto flex items-center justify-between bg-white rounded-2xl px-2 py-2 border border-slate-100 shadow-2xl pointer-events-auto relative overflow-hidden h-[72px]">
                {navItems.map((item) => {
                    const isActive = !item.isCart && (location.pathname === item.path);
                    
                    const Content = (
                        <div className={`relative flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 ${isActive ? 'text-medical-green' : 'text-slate-400'}`}>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavActive"
                                    className="absolute inset-0 bg-medical-green/5 rounded-xl -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative mb-1">
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {item.isCart && cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-medical-green text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div 
                                        layoutId="bottomNavDot"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-medical-green rounded-full"
                                    />
                                )}
                            </div>
                            <span className="text-[9px] font-black tracking-widest">{item.label}</span>
                        </div>
                    );

                    if (item.isCart) {
                        return (
                            <button
                                key={item.label}
                                onClick={() => setIsCartOpen(true)}
                                className="flex-1 flex flex-col items-center justify-center"
                            >
                                {Content}
                            </button>
                        );
                    }

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className="flex-1 flex flex-col items-center justify-center"
                        >
                            {Content}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
