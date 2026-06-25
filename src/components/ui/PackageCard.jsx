import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Shield, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { useCart } from '../../context/CartContext';

const PackageCard = ({ pkg }) => {
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const isInCart = Array.isArray(cart) ? cart.find(i => i?.id === pkg?.id) : false;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative flex flex-col overflow-hidden cursor-pointer h-full"
            onClick={() => navigate(`/item-details/${pkg?.id || pkg?.name}`)}
        >
            {/* Card Header with Image */}
            <div className="h-56 md:h-64 relative overflow-hidden">
                <img
                    src={pkg?.image || `/assets/packages/${pkg?.category === 'Full Body' ? 'full_body' : pkg?.category === 'Women Health' ? 'women_wellness' : pkg?.category === 'Senior Citizen' ? 'elderly_care' : 'cardiac'}.png`}
                    alt={pkg?.name || 'Diagnostic Package'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1579152276503-884962f275d3?q=80&w=800&auto=format&fit=crop';
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {pkg?.tag && (
                        <div className="bg-medical-green text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[2px] shadow-lg">
                            {pkg.tag}
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    {pkg?.isLocal && (
                        <span className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20 animate-pulse">
                            Near You
                        </span>
                    )}
                    {pkg?.isNational && !pkg?.isLocal && (
                        <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 shadow-sm">
                            National Partner
                        </span>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black text-dark-text shadow-sm border border-white/50">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {pkg?.rating || '4.8'}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5 md:p-6 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="text-lg md:text-xl font-black text-dark-text mb-1 tracking-tight group-hover:text-medical-green transition-colors leading-tight line-clamp-2 uppercase">
                        {pkg?.name || 'Health Package'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                        <Shield size={12} className="text-medical-green" />
                        OxyCare Premium Quality
                    </p>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-4 mb-5 border border-gray-100 group-hover:border-medical-green/10 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] text-medical-green font-black uppercase tracking-[2px]">Top Tests</p>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pkg?.testsCount || pkg?.parameters?.length || 0} Total</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {(pkg?.parameters || []).slice(0, 4).map((param, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 whitespace-nowrap overflow-hidden">
                                <CheckCircle2 size={12} className="text-medical-green shrink-0" />
                                <span className="truncate">{(param?.name || param?.testName || param || 'Test').toString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-dark-text">₹{pkg?.price || 0}</span>
                                {pkg?.originalPrice && (
                                    <span className="text-sm text-gray-300 line-through font-bold">₹{pkg.originalPrice}</span>
                                )}
                            </div>
                            {pkg?.originalPrice && pkg?.price && (
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                                   Save {Math.round(((Number(pkg.originalPrice) - Number(pkg.price)) / Number(pkg.originalPrice)) * 100) || 0}% Today
                                </span>
                            )}
                        </div>
                        
                        <Button
                            className={`rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-[2px] shadow-lg transition-all group/btn ${isInCart
                                ? 'bg-medical-green/10 text-medical-green border-2 border-medical-green !shadow-none cursor-default'
                                : 'bg-medical-green hover:bg-medical-green-hover text-white shadow-medical-green/20 scale-100 active:scale-95'
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isInCart && pkg) {
                                    addToCart({
                                        ...pkg,
                                        name: pkg.name || pkg.testName || pkg.test || 'Diagnostic Package',
                                        price: typeof pkg.price === 'string' && pkg.price.includes('₹') ? pkg.price : `₹${pkg.price}`
                                    });
                                }
                            }}
                        >
                            {isInCart ? 'In Cart' : 'Book Now'}
                        </Button>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default PackageCard;
