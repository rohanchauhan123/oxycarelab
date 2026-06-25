import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';

const faqs = [
    {
        question: 'How do I book a test with OxyCare Labs?',
        answer: 'You can book a test by searching for it on our homepage, adding it to your cart, and providing your address for sample collection. Alternatively, you can upload a prescription, and our health experts will handle the booking for you.'
    },
    {
        question: 'Are the lab partners certified?',
        answer: 'Yes, all our lab partners are NABL and ISO certified. We only partner with laboratories that meet strict quality standards to ensure high precision and accuracy of results.'
    },
    {
        question: 'How long does it take to get the reports?',
        answer: 'Most test reports are delivered within 24 hours. Some specialized tests may take up to 48-72 hours. You will receive a digital copy via WhatsApp and Email as soon as it is ready.'
    },
    {
        question: 'Is home sample collection free?',
        answer: 'We offer free home sample collection for orders above ₹500. For orders below this amount, a nominal collection fee may apply depending on your location.'
    },
    {
        question: 'Can I cancel or reschedule my booking?',
        answer: 'Yes, you can cancel or reschedule your booking through the My Bookings section in your dashboard or by calling our support team at least 4 hours before the scheduled time.'
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                    <span className="text-medical-green font-black text-xs uppercase tracking-[0.3em]">Support Center</span>
                    <h2 className="text-4xl md:text-5xl font-black text-dark-text tracking-tight leading-tight">
                        Got Questions? <br />
                        We've Got <span className="text-medical-green">Answers.</span>
                    </h2>
                    <p className="text-grey-text font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                        Check out our most frequently asked questions. If you can't find what you're looking for, our health experts are just a message away.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Accordion */}
                    <div className="space-y-4 mb-20">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${openIndex === index
                                        ? 'border-medical-green bg-soft-green/20 shadow-xl shadow-medical-green/5'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openIndex === index ? 'bg-medical-green text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            <HelpCircle size={18} />
                                        </div>
                                        <span className={`text-lg font-bold tracking-tight transition-colors ${openIndex === index ? 'text-medical-green' : 'text-dark-text'
                                            }`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        {openIndex === index ? <Minus size={20} className="text-medical-green" /> : <Plus size={20} className="text-gray-400" />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-8 pb-8 pl-20 text-grey-text font-medium leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA Card - Centralized */}
                    <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-medical-green text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-medical-green/20 shrink-0">
                                <MessageCircle size={40} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-2xl font-black text-dark-text mb-1">Still Confused?</h4>
                                <p className="text-gray-500 font-medium">Get a free consultation from our doctors.</p>
                            </div>
                        </div>
                        <Button className="px-10 h-14 rounded-2xl whitespace-nowrap">Chat with an Expert</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
