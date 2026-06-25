import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Arjun Mehta',
        role: 'Business Owner',
        location: 'Mumbai, Maharashtra',
        image: '/assets/testimonials/patient_1.png',
        text: 'The home collection service was incredibly smooth. Phlebotomist professional tha aur reports same day WhatsApp par mil gayi. Senior citizens ke liye ye best service hai.',
        rating: 5,
        type: 'Verified Patient'
    },
    {
        id: 2,
        name: 'Sunita Iyer',
        role: 'Software Engineer',
        location: 'Bangalore, Karnataka',
        image: '/assets/testimonials/patient_2.png',
        text: 'OxyCare Labs ke health packages bohot affordable hain. Maine full body checkup karaya aur experience bohot hi premium tha. Reports accuracy bhi spot on hai.',
        rating: 5,
        type: 'Verified Patient'
    },
    {
        id: 3,
        name: 'Harkishan Singh',
        role: 'Retired Teacher',
        location: 'Chandigarh, Punjab',
        image: '/assets/testimonials/patient_3.png',
        text: 'Age ke sath regular tests zaroori hain. Yahan ke technicians bohot polite hain aur blood sample lene mein bilkul dard nahi hua. Inka digital system bohot easy hai.',
        rating: 5,
        type: 'Verified Patient'
    },
    {
        id: 4,
        name: 'Priya Sharma',
        role: 'Home Maker',
        location: 'Delhi, NCR',
        image: '/assets/testimonials/patient_4.png',
        text: 'Very hygienic and punctual service. The app makes booking a test so simple, and the reports are very easy to interpret with the color codes. Highly recommended.',
        rating: 5,
        type: 'Verified Patient'
    },
];

const Testimonials = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-medical-green/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-teal/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-4 gap-6">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-soft-green rounded-full mb-6 border border-medical-green/10"
                        >
                            <ShieldCheck className="text-medical-green" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-medical-green">Trust & Care</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-dark-text leading-tight mb-4">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-green to-brand-teal">Patients Say</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-medium">
                            Humari prioritity aapka healthcare experience hai. Padhiye un logo ki kahani jinhone OxyCare Labs par bharosa kiya.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-dark-text hover:bg-medical-green hover:text-white transition-all border border-gray-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-dark-text hover:bg-medical-green hover:text-white transition-all border border-gray-100"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-12 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="min-w-[320px] md:min-w-[450px] lg:min-w-[500px] snap-center bg-white rounded-[40px] shadow-2xl shadow-medical-green/5 border border-gray-100 p-8 md:p-12 relative flex flex-col group hover:border-medical-green/30 transition-colors"
                        >
                            <div className="absolute top-10 right-10 opacity-5 text-medical-green group-hover:scale-110 transition-transform">
                                <Quote size={80} fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            <p className="text-lg md:text-xl font-medium text-gray-600 italic leading-relaxed mb-10 flex-1 relative z-10">
                                "{testimonial.text}"
                            </p>

                            <div className="flex items-center gap-5 mt-auto border-t border-gray-50 pt-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-medical-green/20 relative">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1579152276503-884962f275d3?q=80&w=200&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-dark-text mb-1">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-medical-green font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck size={12} /> {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
