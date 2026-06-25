import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    FileText,
    FlaskConical,
    Home,
    Shield,
    Smartphone
} from 'lucide-react';

const reasons = [
    {
        title: "Book tests & health home collection",
        description: "Experience hassle-free testing with our convenient home collection services.",
        icon: Home,
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "NABL/CAP Accredited partner labs",
        description: "We partner with the most trusted, world-class accredited diagnostic centers.",
        icon: Shield,
        color: "bg-green-50 text-oxy-green"
    },
    {
        title: "Smart Digital Reports",
        description: "Easy-to-understand visual reports to help you track your health better.",
        icon: FileText,
        color: "bg-medical-green/5 text-medical-green"
    },
    {
        title: "Widest Test Menu",
        description: "Over 5000+ Pathology and Radiology tests available at your choice.",
        icon: FlaskConical,
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Fast Turnaround Time",
        description: "Get your accurate test results delivered digitally within 12-24 hours.",
        icon: Clock,
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "Health Trend Mapping",
        description: "Track your historical health data with our advanced AI-driven trend graphs.",
        icon: Smartphone,
        color: "bg-slate-50 text-medical-green-hover"
    }
];

const WhyOxyCare = () => {
    return (
        <section className="py-10 md:py-16 bg-[#F9FBFE]">
            <div className="w-full px-4 md:px-8 lg:px-12">
                <div className="flex flex-col items-center gap-4 mb-16">
                    <h2 className="text-[32px] md:text-[40px] font-extrabold text-medical-green-hover tracking-tight text-center">
                        Why Choose <span className="text-medical-green">OxyCare?</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-medical-green rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-medical-green-hover/5 transition-all group"
                        >
                            <div className={`w-14 h-14 ${reason.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <reason.icon size={28} />
                            </div>
                            <h3 className="text-lg font-black text-medical-green-hover mb-4 leading-tight">{reason.title}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{reason.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyOxyCare;
