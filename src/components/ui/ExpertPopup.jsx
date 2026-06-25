import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, ChevronRight, CheckCircle2, MessageCircle } from 'lucide-react';
import Button from './Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const ExpertPopup = () => {
    const { addCallbackRequest } = useData();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    useEffect(() => {
        if (isAuthenticated) return;

        const timer = setTimeout(() => {
            try {
                const hasSeenPopup = localStorage.getItem('hasSeenExpertPopup');
                if (!hasSeenPopup) {
                    setIsVisible(true);
                }
            } catch (e) {
                console.warn('localStorage blocked in this browser');
                setIsVisible(true); // Show anyway if we can't track
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    const handleClose = () => {
        setIsVisible(false);
        try {
            localStorage.setItem('hasSeenExpertPopup', 'true');
        } catch (e) {}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCallbackRequest(formData);
            setIsSubmitted(true);
            setTimeout(() => handleClose(), 3000);
        } catch (error) {
            console.error("Callback submission failed:", error);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[95] md:hidden"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-[100] w-[calc(100%-32px)] md:w-96 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            id="expert-popup-close-button"
                            onClick={handleClose}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-dark-text transition-all z-[110]"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 md:p-10">
                            {!isSubmitted ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-medical-green/10 rounded-xl flex items-center justify-center text-medical-green">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div className="bg-medical-green/10 text-medical-green text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Specialist Online
                                        </div>
                                    </div>

                                    <div className="mb-8 pr-8">
                                        <h3 className="text-2xl font-black text-dark-text leading-tight mb-3">
                                            Not sure which test to book?
                                        </h3>
                                        <p className="text-gray-500 font-bold text-sm leading-relaxed">
                                            Get a <span className="text-medical-green font-black">free consultation</span> from our experts within 10-15 minutes.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-medical-green transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-medical-green/5 focus:border-medical-green transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-medical-green transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="Your phone number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-medical-green/5 focus:border-medical-green transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full py-4 bg-medical-green hover:bg-medical-green-hover text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-xl shadow-medical-green/20 flex items-center justify-center gap-2 mt-4 transition-all active:scale-95 group">
                                            Request Callback <ChevronRight size={18} className="group-hover:translate-x-1 transition-all" />
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <div className="py-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-medical-green/10 rounded-full flex items-center justify-center text-medical-green shadow-inner">
                                        <CheckCircle2 size={56} className="animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-dark-text tracking-tight">Request Sent!</h4>
                                        <p className="text-sm font-bold text-gray-500 leading-relaxed">Our expert will call you back <br /><span className="text-medical-green font-black">within 15 minutes.</span></p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">OxyCare Health Support</p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExpertPopup;
