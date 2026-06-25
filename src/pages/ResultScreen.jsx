import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';

// Mock recommendations based on typical flows
const mockRecommendations = [
    {
        id: 'pkg-full-body',
        name: 'Full Body Checkup',
        benefit: 'Covers all important health markers',
        price: 999,
        originalPrice: 1999,
        isBestMatch: true
    },
    {
        id: 'pkg-vitamin',
        name: 'Vitamin Panel',
        benefit: 'Checks Vitamin D & B12 levels',
        price: 599,
        originalPrice: 999,
        isBestMatch: false
    },
    {
        id: 'pkg-thyroid',
        name: 'Thyroid Profile',
        benefit: 'Screens for thyroid gland function',
        price: 399,
        originalPrice: 699,
        isBestMatch: false
    }
];

const ResultScreen = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();

    // In a real app, we'd use the answers to fetch from an API
    // const age = searchParams.get('age');
    // const problems = searchParams.get('problems');

    const handleBookNow = (pkg) => {
        const isInCart = Array.isArray(cart) ? cart.find(i => i?.id === pkg.id) : false;
        if (!isInCart) {
            addToCart({
                ...pkg,
                name: pkg.name
            });
        }
        navigate('/checkout'); // directly to checkout for simplicity
    };

    return (
        <main className="min-h-screen bg-gray-50/50 flex flex-col pt-24 pb-24">
            <div className="container mx-auto px-4 max-w-3xl">
                
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-black text-dark-text">Based on your answers</h1>
                </div>

                <div className="space-y-6">
                    {mockRecommendations.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className={`relative bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-xl ${
                                pkg.isBestMatch ? 'border-medical-green shadow-lg shadow-medical-green/10 scale-[1.02]' : 'border-gray-100'
                            }`}
                        >
                            {pkg.isBestMatch && (
                                <div className="absolute -top-3 left-6 bg-medical-green text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                    <Star size={10} className="fill-white" /> Best Match
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-xl md:text-2xl font-black text-dark-text mb-1">{pkg.name}</h3>
                                    <p className="text-gray-500 font-medium mb-4">{pkg.benefit}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 size={16} className="text-medical-green" /> Home Collection
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck size={16} className="text-medical-green" /> NABL Certified
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <div className="flex flex-col items-start md:items-end mb-0 md:mb-3">
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-black text-medical-green leading-none">₹{pkg.price}</span>
                                            <span className="text-lg font-bold text-gray-400 line-through mb-1">₹{pkg.originalPrice}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-medical-green uppercase tracking-wider mt-1">Reports in 24 hrs</span>
                                    </div>
                                    
                                    <Button 
                                        onClick={() => handleBookNow(pkg)}
                                        className={`px-8 h-12 rounded-xl text-sm font-black tracking-wider w-full md:w-auto ${
                                            pkg.isBestMatch ? 'bg-medical-green hover:bg-medical-green-hover shadow-md shadow-medical-green/20' : ''
                                        }`}
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </main>
    );
};

export default ResultScreen;
