import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionCards = () => {
    const cards = [
        {
            title: 'Upload Prescription',
            description: 'Order fast by uploading your doctor prescription here.',
            icon: FileUp,
            color: 'bg-medical-green',
            btnText: 'Upload Now',
            shadow: 'shadow-medical-green/20',
            link: '/upload-prescription',
            borderColor: 'border-medical-green/20 hover:border-medical-green/60'
        },
        {
            title: 'Download Reports',
            description: 'Access your diagnostic reports anytime, anywhere.',
            icon: FileText,
            color: 'bg-brand-teal',
            btnText: 'View Reports',
            shadow: 'shadow-brand-teal/20',
            link: '/dashboard/reports',
            borderColor: 'border-brand-teal/20 hover:border-brand-teal/60'
        }
    ];

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={`group relative overflow-hidden glass-card p-6 md:p-8 rounded-[32px] flex flex-col sm:flex-row items-center gap-6 hover:shadow-2xl transition-all duration-500 border-2 ${card.borderColor} backdrop-blur-sm`}
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 ${card.color} rounded-[24px] flex items-center justify-center text-white shadow-xl ${card.shadow} group-hover:rotate-6 transition-transform duration-500 shrink-0`}>
                                <card.icon size={32} strokeWidth={2.5} />
                            </div>

                            <div className="flex-1 text-center sm:text-left space-y-3 z-10">
                                <h3 className="text-2xl font-black text-dark-text tracking-tight leading-tight">{card.title}</h3>
                                <p className="text-grey-text text-sm font-medium leading-relaxed max-w-sm mx-auto sm:mx-0">
                                    {card.description}
                                </p>
                                <Link 
                                    to={card.link}
                                    className="inline-flex items-center gap-2 text-dark-text font-black text-xs uppercase tracking-widest group/btn hover:text-medical-green transition-colors pt-1"
                                >
                                    {card.btnText} <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Decorative Background Icon */}
                            <card.icon
                                size={100}
                                className="absolute -bottom-6 -right-6 opacity-5 text-dark-text -rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ActionCards;
