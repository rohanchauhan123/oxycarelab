import { motion } from 'framer-motion';
import { ShieldCheck, Truck, FlaskConical, Headphones, Award, Smartphone } from 'lucide-react';

const features = [
    {
        title: 'Certified Lab Partners',
        desc: 'All our partner labs are NABL & ISO certified with stringent quality checks.',
        icon: ShieldCheck,
    },
    {
        title: 'Free Home Collection',
        desc: 'Trained phlebotomists will collect your samples from your doorstep at your convenience.',
        icon: Truck,
    },
    {
        title: 'Advanced Testing',
        desc: 'Use of high-end technology and precise equipment for accurate diagnostic results.',
        icon: FlaskConical,
    },
    {
        title: 'Quick Digital Reports',
        desc: 'Get your reports directly on your mobile within 24 hours of sample collection.',
        icon: Smartphone,
    },
    {
        title: 'Expert Consultations',
        desc: 'Post-report consultations with qualified doctors to understand your results.',
        icon: Headphones,
    },
    {
        title: 'Best Price Guarantee',
        desc: 'We offer premium diagnostic services at the most affordable prices in the market.',
        icon: Award,
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-dark-text mb-6">
                        Why Millions Trust <br />
                        <span className="text-medical-green">OxyCareLabs</span> for Diagnostics
                    </h2>
                    <p className="text-grey-text leading-relaxed text-lg max-w-2xl mx-auto">
                        We understand that behind every sample is a life. That's why we maintain the highest standards of accuracy, reliability, and speed in our diagnostic services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                    {features.map((feature, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center p-8 rounded-[32px] bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-soft-green group"
                        >
                            <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center text-medical-green shadow-sm group-hover:scale-110 transition-transform mb-6">
                                <feature.icon size={32} />
                            </div>
                            <h4 className="text-xl font-black text-dark-text mb-3 group-hover:text-medical-green transition-colors">{feature.title}</h4>
                            <p className="text-base text-grey-text font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-5xl mx-auto relative rounded-[60px] overflow-hidden shadow-2xl">
                    <img
                        src="/assets/content/healthcare_pro.png"
                        alt="Healthcare Professional"
                        className="w-full h-[300px] md:h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-medical-green/60 to-transparent" />

                    {/* Floating Stat Card - Centered at bottom */}
                    <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl border border-white/50 flex flex-col items-center text-center w-[90%] sm:w-auto min-w-[280px]">
                        <p className="text-4xl md:text-5xl font-display font-bold text-medical-green mb-2">99.9%</p>
                        <p className="text-lg md:text-xl font-bold text-dark-text mb-3">Accuracy Rate</p>
                        <p className="text-[10px] md:text-sm text-grey-text">Maintained across 1.2M+ tests conducted last year alone.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
