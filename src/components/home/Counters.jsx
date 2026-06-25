import { motion } from 'framer-motion';
import { Microscope, Award, Building2, FlaskConical } from 'lucide-react';

const stats = [
    { label: 'Licensed Labs', value: '500+', icon: Award },
    { label: 'Cities Covered', value: '120+', icon: Building2 },
    { label: 'Tests Available', value: '2500+', icon: Microscope },
    { label: 'Happy Customers', value: '1.5M+', icon: FlaskConical },
];

const Counters = () => {
    return (
        <section className="py-20 bg-medical-green relative overflow-hidden">
            {/* Geometric Background Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 border-[60px] border-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                            className="text-center text-white flex flex-col items-center group"
                        >
                            <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                <stat.icon size={36} />
                            </div>
                            <motion.p 
                                initial={{ y: 20 }}
                                whileInView={{ y: 0 }}
                                className="text-4xl md:text-5xl font-black mb-2 tracking-tight"
                            >
                                {stat.value}
                            </motion.p>
                            <p className="text-xs md:text-sm font-black uppercase tracking-[3px] text-white/80">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Counters;
