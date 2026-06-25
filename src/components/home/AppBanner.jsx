import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Apple, Play } from 'lucide-react';

const AppBanner = () => {
    return (
        <section className="py-12 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative bg-dark-text rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-950/20 py-16 md:py-0 px-8 md:px-16 lg:px-24">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-green/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-medical-green/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        {/* Left Content */}
                        <div className="flex-1 text-center md:text-left space-y-8 md:py-24">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 bg-medical-green/20 px-4 py-2 rounded-full border border-medical-green/20"
                            >
                                <Smartphone className="text-medical-green" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-medical-green">Download the App</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
                            >
                                Your Health is now <br />
                                <span className="text-medical-green">One-Tap Away</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 font-bold max-w-lg text-sm md:text-lg leading-relaxed"
                            >
                                Experience the full power of OxyCare Labs on your phone. Book tests, track samples, and access reports instantly.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                            >
                                <button className="group bg-white hover:bg-slate-50 text-dark-text p-1 pr-8 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 shadow-xl">
                                    <div className="w-12 h-12 bg-dark-text text-white rounded-xl flex items-center justify-center">
                                        <Play fill="currentColor" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Get it on</p>
                                        <p className="text-lg font-black leading-none mt-1">Google Play</p>
                                    </div>
                                </button>

                                <button className="group bg-white hover:bg-slate-50 text-dark-text p-1 pr-8 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-1 shadow-xl">
                                    <div className="w-12 h-12 bg-dark-text text-white rounded-xl flex items-center justify-center">
                                        <Apple fill="currentColor" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Download on</p>
                                        <p className="text-lg font-black leading-none mt-1">App Store</p>
                                    </div>
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Content - Phone Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 50 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="hidden lg:block relative"
                        >
                            <div className="relative z-10 w-[320px] xl:w-[380px] h-[600px] xl:h-[700px] bg-dark-text border-[12px] border-slate-800 rounded-[3rem] shadow-3xl overflow-hidden group">
                                {/* Mock UI */}
                                <div className="absolute top-0 left-0 w-full h-[20%] bg-medical-green flex items-end p-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full blur-xl absolute -top-4 -left-4" />
                                    <div className="space-y-1">
                                        <p className="text-white/70 text-[10px] uppercase font-black tracking-widest">OxyCare Labs</p>
                                        <p className="text-white text-xl font-black">Hi, Anuj!</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6 pt-10">
                                    <div className="h-24 bg-slate-900 rounded-3xl border border-slate-800" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-slate-900 rounded-3xl border border-slate-800" />
                                        <div className="h-32 bg-slate-900 rounded-3xl border border-slate-800" />
                                    </div>
                                    <div className="h-16 bg-medical-green rounded-3xl animate-pulse" />
                                </div>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-700 rounded-full" />
                            </div>

                            {/* Decorative Floating Circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue rounded-full border border-white/10 shadow-2xl flex items-center justify-center text-white rotate-12">
                                <span className="font-black text-xs uppercase tracking-widest">4.9 ★ <br /> Rated</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppBanner;
