import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, ArrowRight, Package, Calculator, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import PackageDetailsModal from './PackageDetailsModal';

const FloatingCart = () => {
    const { cart, removeFromCart, cartCount, totalAmount, clearCart, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    if (cartCount === 0 && !isCartOpen) return null;

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: [0, -10, 0] 
                }}
                transition={{
                    y: {
                        duration: 0.5,
                        repeat: 0,
                        ease: "easeOut"
                    }
                }}
                key={cartCount} // Re-animate on count change
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="fixed hidden lg:flex bottom-24 lg:bottom-8 right-6 lg:right-8 z-[100] w-16 h-16 lg:w-20 lg:h-20 bg-medical-green text-white rounded-full shadow-[0_20px_50px_rgba(25,185,145,0.4)] items-center justify-center group"
            >
                <div className="relative">
                    <ShoppingCart className="w-7 h-7 lg:w-8 lg:h-8" />
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={cartCount}
                        className="absolute -top-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-white text-medical-green text-[10px] lg:text-xs font-black rounded-full flex items-center justify-center shadow-lg border-2 border-medical-green"
                    >
                        {cartCount}
                    </motion.span>
                </div>

                {/* Ping Animation */}
                <div className="absolute inset-0 rounded-full bg-medical-green animate-ping opacity-20 pointer-events-none" />
            </motion.button>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[102] shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-dark-text tracking-tight">Your Cart</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cartCount} Tests Selected</p>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:rotate-90"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <motion.div
                                            layout
                                            key={item?.id || Math.random()}
                                            className="p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group flex items-center justify-between"
                                        >
                                            <div 
                                                className="flex items-center gap-4 cursor-pointer group/item flex-1"
                                                onClick={() => setSelectedPackage(item)}
                                            >
                                                <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-xl flex flex-shrink-0 items-center justify-center group-hover/item:scale-110 transition-transform">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-dark-text line-clamp-1 group-hover/item:text-medical-green transition-colors">{item?.testName || item?.test || item?.name || 'Diagnostic Test'}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-xs text-gray-400 font-medium">{item?.lab || item?.labName || 'Expert Lab'}</p>
                                                        <span className="flex items-center gap-1 text-[10px] text-medical-green uppercase font-black opacity-0 group-hover/item:opacity-100 transition-opacity translate-x-[-10px] group-hover/item:translate-x-0 duration-300">
                                                            <Info size={12} /> Details
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-black text-dark-text whitespace-nowrap">₹{item?.price || 0}</span>
                                                <button
                                                    onClick={() => removeFromCart(item?.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                            <ShoppingCart size={48} />
                                        </div>
                                        <p className="text-lg font-bold text-gray-400 italic">Your cart is feeling lonely...</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Summary */}
                            {cart.length > 0 && (
                                <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                            <Calculator size={14} /> Total Amount
                                        </div>
                                        <span className="text-3xl font-black text-dark-text tracking-tighter">
                                            ₹{totalAmount.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" className="flex-1 py-4 border-gray-200" onClick={clearCart}>
                                            Empty Cart
                                        </Button>
                                        <Button
                                            className="flex-[2] py-4 shadow-xl shadow-medical-green/20 group"
                                            onClick={handleCheckout}
                                        >
                                            Checkout Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>

                                    <p className="text-center text-[10px] font-black text-medical-green uppercase tracking-[0.2em] animate-pulse">
                                        FREE Home Collection Included!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <PackageDetailsModal
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                pkg={selectedPackage}
            />
        </>
    );
};

export default FloatingCart;
