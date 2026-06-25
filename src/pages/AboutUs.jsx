import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, HeartPulse, UserCheck, Award } from 'lucide-react';

const AboutUs = () => {
    const stats = [
        { label: 'Labs Partnered', value: '500+' },
        { label: 'Cities Covered', value: '50+' },
        { label: 'Tests Conducted', value: '1M+' },
        { label: 'Happy Customers', value: '500K+' },
    ];

    const values = [
        { title: 'Accuracy First', desc: 'Precise results for better medical decisions.', icon: ShieldCheck },
        { title: 'Patient Centric', desc: 'Your comfort and care are our priority.', icon: HeartPulse },
        { title: 'Certified Experts', desc: 'Only NABL & CAP accredited partners.', icon: UserCheck },
        { title: 'Innovation', desc: 'Latest diagnostic tech at your doorstep.', icon: Award },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="pt-24 md:pt-40 pb-12 md:pb-20 bg-soft-green/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-dark-text mb-6">Redefining <span className="text-medical-green">Diagnostic</span> Accuracy</h1>
                        <p className="text-lg text-grey-text leading-relaxed mb-8">
                            At OxyCare Labs, we are committed to making healthcare accessible and transparent.
                            We bridge the gap between patients and top-tier labs through technology and trust.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left transition-all hover:bg-white hover:shadow-xl group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-medical-green group-hover:scale-110 transition-transform">
                                <Target size={28} />
                            </div>
                            <h2 className="text-2xl font-black mb-4 tracking-tight">Our Mission</h2>
                            <p className="text-grey-text leading-relaxed font-bold opacity-80">
                                To provide world-class diagnostic services at affordable prices by leveraging advanced technology and a robust logistics network for home collection.
                            </p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left transition-all hover:bg-white hover:shadow-xl group">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-teal group-hover:scale-110 transition-transform">
                                <Eye size={28} />
                            </div>
                            <h2 className="text-2xl font-black mb-4 tracking-tight">Our Vision</h2>
                            <p className="text-grey-text leading-relaxed font-bold opacity-80">
                                To become India's most trusted diagnostic platform where every citizen can access high-quality medical testing with a single click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-medical-green text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
                        {stats.map((s, i) => (
                            <div key={i}>
                                <div className="text-3xl md:text-4xl font-bold mb-2">{s.value}</div>
                                <div className="text-sm opacity-80">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="text-center p-6 group">
                                <div className="w-16 h-16 bg-soft-green rounded-2xl flex items-center justify-center mx-auto mb-6 text-medical-green group-hover:scale-110 transition-transform">
                                    <v.icon size={32} />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                                <p className="text-sm text-grey-text">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
