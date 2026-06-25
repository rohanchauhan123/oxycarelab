import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Shield, ArrowRight, Tag, Activity, Heart, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useLocation } from '../../context/LocationContext';
import PackageCard from '../ui/PackageCard';
import PackageDetailsModal from '../ui/PackageDetailsModal';

const Packages = () => {
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const { packages: dataPackages, labs } = useData();
    const { location } = useLocation();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const homePackages = useMemo(() => {
        return (dataPackages || [])
            .filter(p => p && p.status === 'Active')
            .map(p => {
                const lab = Array.isArray(labs) ? labs.find(l => l?.name === p?.labName || l?.name === p?.lab) : null;
                const labLoc = (lab?.location || '').toLowerCase();
                const userLoc = (location || '').toLowerCase();

                const isNational = labLoc.includes('multiple') || 
                                   labLoc.includes('ncr') || 
                                   labLoc.includes('india') ||
                                   labLoc.includes('national') ||
                                   labLoc.includes('pan india') ||
                                   labLoc.includes('nationwide') ||
                                   labLoc.includes('across india');

                const ncrCites = ['delhi', 'noida', 'gurugram', 'gurgaon', 'ghaziabad', 'faridabad', 'ncr'];
                const isUserInNCR = ncrCites.some(c => userLoc.includes(c));
                const isLabInNCR = ncrCites.some(c => labLoc.includes(c));

                const isDirectMatch = userLoc && userLoc !== 'india' && (
                    labLoc.includes(userLoc) || 
                    userLoc.includes(labLoc) ||
                    (isUserInNCR && isLabInNCR)
                );

                return {
                    ...p,
                    isLocal: isDirectMatch,
                    isNational: isNational
                };
            })
            .sort((a, b) => {
                if (a.isLocal && !b.isLocal) return -1;
                if (!a.isLocal && b.isLocal) return 1;
                if (a.isNational && !b.isNational) return -1;
                if (!a.isNational && b.isNational) return 1;
                
                // Tie-breaker: Keep the original chronological order provided by the API (newest first)
                return 0;
            })
            .slice(0, 8);
    }, [dataPackages, labs, location]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setActiveIndex(index);
        }
    };

    const scrollTo = (index) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            scrollRef.current.scrollTo({
                left: index * clientWidth,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (homePackages.length <= 1) return;
        
        const interval = setInterval(() => {
            setActiveIndex((current) => {
                const nextIndex = current >= homePackages.length - 1 ? 0 : current + 1;
                scrollTo(nextIndex);
                return nextIndex;
            });
        }, 3000); // Autoplay every 3 seconds
        
        return () => clearInterval(interval);
    }, [homePackages.length]);

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-medical-green/10 px-4 py-2 rounded-full text-medical-green text-[10px] font-black uppercase tracking-[2px] mb-6"
                    >
                        <Shield size={14} /> Certified Health Partners
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-dark-text mb-6 tracking-tight leading-tight uppercase">
                        Popular <span className="text-medical-green">Health Packages</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Comprehensive diagnostic solutions tailored for your lifestyle.
                        Transparent pricing with hospital-grade accuracy.
                    </p>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex justify-end gap-3 mb-8">
                    <button
                        onClick={() => scrollTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        className={`p-3 rounded-full border border-gray-100 transition-all ${
                            activeIndex === 0 ? 'text-gray-300' : 'text-dark-text hover:bg-medical-green hover:text-white hover:border-medical-green shadow-sm'
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scrollTo(activeIndex + 1)}
                        disabled={activeIndex === homePackages.length - 1}
                        className={`p-3 rounded-full border border-gray-100 transition-all ${
                            activeIndex === homePackages.length - 1 ? 'text-gray-300' : 'text-dark-text hover:bg-medical-green hover:text-white hover:border-medical-green shadow-sm'
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto gap-4 md:gap-8 pb-10 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {homePackages.map((pkg) => (
                        <div key={pkg.id} className="min-w-[calc(100vw-32px)] md:min-w-[380px] snap-center h-full">
                            <PackageCard pkg={pkg} />
                        </div>
                    ))}
                </div>

                {/* Mobile Navigation Dots */}
                <div className="flex md:hidden justify-center gap-2 mt-4">
                    {homePackages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeIndex === idx ? 'w-8 bg-medical-green' : 'w-2 bg-gray-200'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/health-packages'}
                        className="w-full md:w-auto md:px-12 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[2px] border-2 border-gray-100 hover:border-medical-green hover:text-medical-green transition-all"
                    >
                        View All Packages <ArrowRight size={18} />
                    </Button>
                </div>
            </div>

            <PackageDetailsModal
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                pkg={selectedPackage}
            />
        </section>
    );
};

export default Packages;
