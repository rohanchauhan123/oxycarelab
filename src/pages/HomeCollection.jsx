import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldCheck, Thermometer, UserCheck, Calendar, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const HomeCollection = () => {
    const steps = [
        { icon: Calendar, title: "Book Appointment", desc: "Select tests and pick a convenient time slot." },
        { icon: UserCheck, title: "Professional Visit", desc: "Our certified phlebotomist visits your home." },
        { icon: Thermometer, title: "Safe Sample", desc: "Painless collection with cold-chain transport." },
        { icon: Clock, title: "Digital Report", desc: "Accurate results delivered within 24 hours." }
    ];

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-green/10 text-medical-green rounded-full text-xs font-bold mb-6 uppercase tracking-widest">
                                <MapPin size={14} />
                                <span>Serving 500+ Localities</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-text leading-[1.1] mb-8 tracking-tight">
                                Lab Quality Results, <br />
                                <span className="text-medical-green">From Your Living Room</span>
                            </h1>
                            <p className="text-xl text-grey-text mb-10 leading-relaxed max-w-xl">
                                Why wait in clinics? Our premium home collection service brings world-class diagnostics to your doorstep with zero contamination risk.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="h-14 px-10 rounded-2xl shadow-xl shadow-medical-green/20">Book Home Visit</Button>
                                <Button variant="outline" className="h-14 px-10 rounded-2xl">View Coverage Area</Button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-[60px] overflow-hidden shadow-2xl border-4 border-white"
                        >
                            <img
                                src="/assets/blogs/home_collection.png"
                                alt="Sample Collection"
                                className="w-full aspect-[4/3] object-cover"
                            />
                        </motion.div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-soft-green rounded-2xl flex items-center justify-center text-medical-green">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Safety First</p>
                                    <p className="text-lg font-black text-dark-text tracking-tight uppercase">100% Sterile</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <div className="py-24 border-t border-gray-50">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-dark-text tracking-tight mb-4">How Home Collection Works</h2>
                        <p className="text-grey-text max-w-2xl mx-auto">Our streamlined process ensures your health screening is as comfortable and efficient as possible.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group flex flex-col items-center md:items-start text-center md:text-left transition-all hover:bg-white p-6 rounded-3xl hover:shadow-xl border border-transparent hover:border-gray-50">
                                <div className="mb-8 relative z-10 w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-medical-green group-hover:bg-medical-green group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 group-hover:border-transparent">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-black text-dark-text mb-3 tracking-tight group-hover:text-medical-green transition-colors">{step.title}</h3>
                                <p className="text-grey-text text-sm leading-relaxed font-bold opacity-80">{step.desc}</p>
                                {idx < 3 && (
                                    <div className="hidden lg:block absolute top-10 left-full w-full border-t-2 border-dashed border-gray-100 -ml-10 -z-10"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ / Info Banner */}
                <div className="bg-dark-text rounded-[40px] p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-black mb-4 tracking-tight">Need a last-minute booking?</h2>
                            <p className="opacity-70 text-lg mb-8">We provide same-day collection for bookings made before 8:00 AM across major metropolitan areas.</p>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-tight underline decoration-medical-green decoration-4 underline-offset-4">5 Lac+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Successful Visits</span>
                                </div>
                                <div className="w-px h-10 bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black tracking-tight underline decoration-medical-green decoration-4 underline-offset-4">4.9/5</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Patient Rating</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="h-16 px-12 rounded-3xl border-white text-white hover:bg-white hover:text-dark-text text-lg">
                            Check Availability
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCollection;
