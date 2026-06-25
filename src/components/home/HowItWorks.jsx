import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Microchip, FileText, ChevronRight } from 'lucide-react';

const steps = [
    {
        id: '01',
        title: 'Search & Book',
        description: 'Choose from 1500+ tests and packages from top-rated labs.',
        icon: Search,
        subtext: 'Easy online booking'
    },
    {
        id: '02',
        title: 'Sample Collection',
        description: 'Phlebotomist visits your home for sterile sample collection.',
        icon: MapPin,
        subtext: 'Trained professionals'
    },
    {
        id: '03',
        title: 'Lab Processing',
        description: 'Samples are analyzed in NABL/ISO certified laboratories.',
        icon: Microchip,
        subtext: 'High precision equipment'
    },
    {
        id: '04',
        title: 'Smart Reports',
        description: 'Receive digital reports within 24 hours via Email & WhatsApp.',
        icon: FileText,
        subtext: 'Easy to understand'
    }
];

const HowItWorks = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setActiveIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
            }
        }, 4000);
        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <section className="py-24 bg-dark-text relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-green rounded-full blur-[160px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-teal rounded-full blur-[160px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <span className="text-medical-green font-black text-xs uppercase tracking-[0.3em] mb-4">The Process</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 md:mb-6">How OxyCare Works?</h2>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                        Experience hassle-free diagnostics from the comfort of your home in 4 simple steps.
                    </p>
                </div>

                <div 
                    className="relative max-w-4xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-16"
                        >
                            <div className="relative group">
                                <span className="absolute -top-8 -left-8 md:-top-12 md:-left-12 text-[80px] md:text-[120px] font-black text-white/5 italic select-none">
                                    {steps[activeIndex].id}
                                </span>
                                <div className="relative w-24 h-24 md:w-40 md:h-40 bg-medical-green rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_rgba(0,186,136,0.3)] group-hover:scale-105 transition-transform duration-500">
                                    {React.createElement(steps[activeIndex].icon, { size: 48, strokeWidth: 1.5 })}
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-6">
                                <h3 className="text-2xl md:text-4xl font-black text-white">
                                    {steps[activeIndex].title}
                                </h3>
                                <p className="text-gray-300 text-base md:text-xl font-medium leading-relaxed">
                                    {steps[activeIndex].description}
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-black text-medical-green uppercase tracking-widest bg-medical-green/10 w-fit mx-auto md:mx-0 px-5 py-2 rounded-full border border-medical-green/20">
                                    <ChevronRight size={16} /> {steps[activeIndex].subtext}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-4 mt-12">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`group relative h-2 transition-all duration-500 rounded-full overflow-hidden ${
                                    index === activeIndex ? "w-16 bg-medical-green" : "w-4 bg-white/20 hover:bg-white/40"
                                }`}
                                aria-label={`Go to step ${index + 1}`}
                            >
                                {index === activeIndex && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "0%" }}
                                        transition={{ duration: 4, ease: "linear" }}
                                        className="absolute inset-0 bg-white/30"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
