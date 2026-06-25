import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
    { id: 1, name: 'Full Body Checkup', image: '/assets/categories/full_body.png', count: '12+ Packages', color: 'from-blue-50 to-blue-100/30' },
    { id: 2, name: 'Thyroid Care', image: '/assets/categories/thyroid.png', count: '8+ Tests', color: 'from-emerald-50 to-emerald-100/30' },
    { id: 3, name: 'Bone Health', image: '/assets/categories/bone_pain.png', count: '15+ Tests', color: 'from-orange-50 to-orange-100/30' },
    { id: 4, name: 'Gastro Health', image: '/assets/categories/gastro.png', count: '10+ Tests', color: 'from-purple-50 to-purple-100/30' },
    { id: 5, name: 'Cardiology', image: '/assets/categories/cardiology.png', count: '20+ Screenings', color: 'from-red-50 to-red-100/30' },
    { id: 6, name: 'Kidney Function', image: '/assets/categories/kidney.png', count: '12+ Tests', color: 'from-cyan-50 to-cyan-100/30' },
    { id: 7, name: 'Liver Care', image: '/assets/categories/liver.png', count: '14+ Tests', color: 'from-amber-50 to-amber-100/30' },
    { id: 8, name: 'Diabetes Care', image: '/assets/categories/diabetes.png', count: '18+ Tests', color: 'from-pink-50 to-pink-100/30' },
];

const Categories = () => {
    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-medical-green/5 blur-[120px] rounded-full -translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-green rounded-full mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-medical-green">Top Services</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-dark-text leading-tight">
                            Explore Tests by <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-green to-brand-teal italic">Health Category</span>
                        </h2>
                    </div>
                    <button className="group flex items-center gap-2 text-dark-text font-black hover:text-medical-green transition-colors text-lg">
                        View All Categories
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-medical-green group-hover:text-white transition-all">
                            <ArrowRight size={20} />
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-8">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-[32px] border border-gray-100 group-hover:border-medical-green/30 group-hover:shadow-2xl transition-all duration-500 -z-10"></div>

                            <div className="p-4 md:p-8 flex flex-col items-center text-center">
                                <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br ${cat.color} rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 overflow-hidden p-4`}>
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                                <h3 className="text-sm md:text-xl font-black text-dark-text mb-2 group-hover:text-medical-green transition-colors leading-tight">
                                    {cat.name}
                                </h3>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-medical-green"></span>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-tight">{cat.count}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
