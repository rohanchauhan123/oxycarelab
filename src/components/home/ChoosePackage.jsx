import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    ClipboardCheck,
    Search,
    Upload,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const steps = [
    {
        title: "Select test/package",
        subtitle: "Pick from 100+ labs",
        icon: Search,
        color: "bg-blue-600"
    },
    {
        title: "Upload Prescription",
        subtitle: "You will get a call back",
        icon: Upload,
        color: "bg-medical-green"
    },
    {
        title: "Book Your Slot",
        subtitle: "At your convenience",
        icon: Calendar,
        color: "bg-oxy-green"
    },
    {
        title: "Get Reports",
        subtitle: "Digital & Verified",
        icon: ClipboardCheck,
        color: "bg-medical-green-hover"
    }
];

const ChoosePackage = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-10 md:py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                        <h2 className="text-[32px] md:text-[40px] font-black text-medical-green-hover tracking-tight">
                            Choose your <span className="text-medical-green">Package</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">How it works</p>
                            <div className="w-12 h-1 bg-medical-green rounded-full" />
                        </div>
                    </div>

                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-medical-green hover:text-white hover:border-medical-green transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-medical-green hover:text-white hover:border-medical-green transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Unified Carousel Layout */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-24 right-24 h-0.5 border-t-2 border-dashed border-slate-100 -z-10" />

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {steps.map((step, idx) => (
                            <StepCard key={idx} step={step} idx={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ step, idx }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="min-w-[280px] md:min-w-0 md:flex-1 snap-center flex flex-col items-center text-center group bg-white rounded-3xl p-6 border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300"
    >
        <div className={`w-24 h-24 ${step.color} text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <step.icon size={36} />
        </div>
        <h3 className="text-xl font-black text-medical-green-hover mb-2 leading-tight">{step.title}</h3>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{step.subtitle}</p>

        {/* Step Number Badge */}
        <div className="mt-6 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm transition-colors group-hover:bg-medical-green group-hover:text-white group-hover:border-medical-green">
            0{idx + 1}
        </div>
    </motion.div>
);

export default ChoosePackage;
