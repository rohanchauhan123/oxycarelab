import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="pt-28 pb-12 lg:pt-36 lg:pb-16 bg-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-dark-text leading-[1.1] mb-6 tracking-tight">
                        Find the Right Health Test for You
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium mb-10 leading-relaxed">
                        Answer a few questions and get the right tests instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button 
                            onClick={() => navigate('/health-check')}
                            className="w-full sm:w-auto px-10 h-16 rounded-full text-lg font-black shadow-xl shadow-medical-green/20"
                        >
                            Start Health Check
                        </Button>
                        <Link to="/health-packages" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto px-10 h-16 rounded-full text-lg font-black text-medical-green border-medical-green/20 hover:bg-medical-green/5">
                                Browse All Packages
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-medical-green w-5 h-5" />
                            <span className="text-sm font-bold text-gray-600">Certified labs only</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <Star className="text-amber-400 fill-amber-400 w-5 h-5" />
                            <span className="text-sm font-bold text-gray-600">Trusted by thousands</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;

