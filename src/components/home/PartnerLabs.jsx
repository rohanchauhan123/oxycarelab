import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const PartnerLabs = () => {
    const navigate = useNavigate();
    const { labs } = useData();

    // Filter only active labs
    const activeLabs = (labs || []).filter(lab => lab && lab.status === 'Active');

    // Duplicate partners for infinite loop - ensure we have at least a few for the marquee
    const marqueeLabs = activeLabs.length > 3 
        ? [...activeLabs, ...activeLabs] 
        : [...activeLabs, ...activeLabs, ...activeLabs, ...activeLabs];

    // Helper for lab logo or placeholder
    const getLabLogo = (lab) => {
        if (lab.logo) return lab.logo;
        
        // Map some default names to existing assets if available
        const nameLogoMap = {
            'Marvel Path Lab': '/assets/partners/marvel.png',
            'CRL Diagnostics': '/assets/partners/crl.png',
            'CRL': '/assets/partners/crl.png',
            'Biohelp': '/assets/partners/biohelp.png',
            'Accuprobe': '/assets/partners/accuprobe.png',
            'Bioline': '/assets/partners/bioline.png',
            'Benekind': '/assets/partners/benekind.png',
            'Healthians': '/assets/partners/healthians.png',
        };

        return (lab && lab.name) ? nameLogoMap[lab.name] : null;
    };

    return (
        <section className="py-20 bg-gray-50/30 overflow-hidden">
            <div className="container mx-auto px-4 mb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-medical-green/10 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-medical-green animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-medical-green">Network</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-dark-text tracking-tight mb-6">
                        Our Trusted <span className="text-medical-green">Partner Labs</span>
                    </h2>
                    <p className="text-grey-text text-lg font-medium max-w-2xl mx-auto">
                        Working with the biggest names in diagnostics to ensure hospital-grade accuracy across all test parameters.
                    </p>
                </div>
            </div>

            <div className="relative">
                {/* Gradient Masks for fade effect */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-10 flex-nowrap"
                        animate={{
                            x: [0, "-50%"]
                        }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {marqueeLabs.map((lab, index) => {
                            const logo = getLabLogo(lab);
                            return (
                                <div
                                    onClick={() => navigate(`/lab/${lab.id}`)}
                                    key={`${lab.id}-${index}`}
                                    className="flex-shrink-0 w-56 h-32 md:w-64 md:h-36 bg-white rounded-3xl border border-gray-100 flex items-center justify-center p-8 shadow-sm hover:shadow-xl hover:border-medical-green/20 transition-all duration-500 group cursor-pointer"
                                >
                                    {logo ? (
                                        <img
                                            src={logo}
                                            alt={lab.name}
                                            className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-lg md:text-xl font-black text-medical-green uppercase tracking-tight group-hover:scale-110 transition-transform duration-500 inline-block">
                                                {lab.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
                <div className="mt-16 text-center">
                    <button 
                        onClick={() => navigate('/partner-labs')}
                        className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-dark-text hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-2 group"
                    >
                        View All Partner Labs
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PartnerLabs;
