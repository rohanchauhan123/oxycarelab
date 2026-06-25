import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Ticket, Clock, ArrowRight, Percent, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Offers = () => {
    const { offers } = useData();

    return (
        <div className="pt-32 pb-20 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-medical-green/10 text-medical-green rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Percent size={14} /> Exclusive Deals
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black text-dark-text mb-6 tracking-tight"
                    >
                        Health & Wellness <span className="text-medical-green">Savings</span>
                    </motion.h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        Get the best value for your diagnostics with our curated offers and seasonal discounts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group flex flex-col"
                        >
                            <div className={`${offer.color} h-3 text-white`} />

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`p-4 rounded-3xl ${offer.bgLight}`}>
                                        <Ticket size={32} className={offer.color.replace('bg-', 'text-')} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Clock size={12} />
                                            {offer.expires}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-dark-text mb-4 leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                                    {offer.desc}
                                </p>

                                <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-6">
                                    <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[24px] border border-dashed border-gray-200">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coupon Code</span>
                                            <span className="text-xl font-black text-dark-text tracking-widest uppercase">{offer.code}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2"
                                            onClick={() => {
                                                navigator.clipboard.writeText(offer.code);
                                                alert('Coupon code copied!');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>

                                    <Button className={`${offer.color} hover:opacity-90 text-white rounded-[24px] h-14 font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-200 group/btn`}>
                                        Apply Now <ArrowRight size={18} className="ml-2 inline group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Terms Banner */}
                <div className="mt-20 max-w-5xl mx-auto rounded-[48px] bg-dark-text p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                            <ShieldCheck className="text-medical-green" size={32} />
                            Safe & Secure Diagnostics
                        </h2>
                        <p className="text-white/60 font-bold max-w-lg">All offers are valid on home collection and visit bookings. Discounts cannot be combined with other promotional coupons.</p>
                    </div>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-dark-text h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-sm relative z-10 transition-all">View All Terms</Button>
                </div>
            </div>
        </div>
    );
};

export default Offers;
