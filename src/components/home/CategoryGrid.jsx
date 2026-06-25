import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        name: 'CT Scans',
        image: '/assets/categories/ct_scan.png',
        filter: 'CT Scan'
    },
    {
        name: 'PET CT',
        image: '/assets/categories/gamma_scan.png',
        filter: 'PET CT'
    },
    {
        name: 'Cardiology',
        image: '/assets/categories/cardiology.png',
        filter: 'Cardiology'
    },
    {
        name: 'Endoscopy',
        image: '/assets/categories/endoscopy.png',
        filter: 'Endoscopy'
    },
    {
        name: 'Gastro',
        image: '/assets/categories/gastro.png',
        filter: 'Gastro'
    },
    {
        name: 'Kidney',
        image: '/assets/categories/kidney.png',
        filter: 'Kidney'
    },
    {
        name: 'Liver',
        image: '/assets/categories/liver.png',
        filter: 'Liver'
    },
];

const CategoryGrid = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-[#F0FDF4]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-black text-dark-text tracking-tight">Tests by Category</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 md:gap-12">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                            onClick={() => navigate(`/book-test?category=${cat.filter}`)}
                            className="group flex flex-col items-center gap-6 cursor-pointer"
                        >
                            {/* Concentric Ring Container */}
                            <div className="relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center">
                                {/* Outer Glow */}
                                <div className="absolute inset-0 bg-medical-green/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 blur-xl" />

                                {/* Static Outer Ring (Green) */}
                                <div className="absolute inset-0 rounded-full border-[6px] border-medical-green shadow-[0_0_20px_rgba(16,185,129,0.2)]" />

                                {/* Inner Thin Ring (Dashed/Concentric) */}
                                <div className="absolute inset-4 rounded-full border border-medical-green/20 group-hover:inset-3 transition-all duration-500" />
                                <div className="absolute inset-6 rounded-full border border-medical-green/10" />

                                {/* Image Container */}
                                <div className="relative w-[75%] h-[75%] rounded-full overflow-hidden border-2 border-white shadow-inner">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Glass Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent group-hover:opacity-0 transition-opacity" />
                                </div>
                            </div>

                            <span className="text-lg font-black text-dark-text group-hover:text-medical-green transition-colors text-center tracking-tight">
                                {cat.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
