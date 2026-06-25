import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import { useCart } from '../../context/CartContext';

const TestCard = ({ test }) => {
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const isInCart = Array.isArray(cart) ? cart.find(i => i?.id === test?.id) : false;

    // Derived simple values
    const title = test?.testName || test?.test || test?.name || 'Health Package';
    // Fallback benefit if none exists
    const benefit = test?.benefit || test?.description?.substring(0, 50) || 'Covers all important health markers';
    const price = test?.price || 0;
    const originalPrice = test?.originalPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate(`/item-details/${test?.id || test?.name}`)}
            className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-medical-green hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full"
        >
            {/* Title & Benefit */}
            <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-black text-dark-text leading-tight mb-2">
                    {title}
                </h3>
                <p className="text-sm font-medium text-gray-500 line-clamp-2">
                    {benefit}
                </p>
            </div>

            {/* Bottom Section: Price & Action */}
            <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-end gap-2 border-t border-gray-100 pt-4">
                    <span className="text-3xl font-black text-medical-green leading-none">₹{price}</span>
                    {originalPrice > price && (
                        <span className="text-lg font-bold text-gray-400 line-through mb-1">₹{originalPrice}</span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-black text-medical-green uppercase tracking-widest bg-medical-green/10 px-3 py-1.5 rounded-full">
                        Reports in 24 hrs
                    </span>
                    
                    <Button
                        className={`rounded-xl h-12 px-8 font-black uppercase tracking-wider transition-all ${isInCart
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : 'bg-medical-green hover:bg-medical-green-hover text-white shadow-lg shadow-medical-green/20'
                            }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isInCart) {
                                addToCart({
                                    ...test,
                                    name: title
                                });
                            }
                            navigate('/checkout'); // Quick checkout flow
                        }}
                    >
                        {isInCart ? 'ADDED' : 'BOOK NOW'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default TestCard;
