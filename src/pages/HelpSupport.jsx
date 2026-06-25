import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, Phone, Mail, MapPin, MessageCircle, ChevronDown, HelpCircle, Activity } from 'lucide-react';
import Button from '../components/ui/Button';

const faqs = [
    {
        question: "How do I book a health checkup?",
        answer: "Booking a checkup is easy. You can either select from our popular packages, search for specific tests, or upload your doctor's prescription. Once selected, choose a convenient time slot and provide your address for home sample collection."
    },
    {
        question: "Is home sample collection free?",
        answer: "Yes, we provide free home sample collection for bookings above ₹500. For smaller amounts, a nominal convenience fee might apply depending on your location."
    },
    {
        question: "How long does it take to get reports?",
        answer: "Most routine test reports (like CBC, Lipid Profile) are delivered within 12-24 hours. Specialized tests may take 48-72 hours. You'll receive a notification as soon as your report is ready."
    },
    {
        question: "Are your labs accredited?",
        answer: "Absolutely. All samples are processed in NABL accredited and ISO certified partner laboratories to ensure the highest standards of accuracy and precision."
    },
    {
        question: "Can I manage bookings for my family members?",
        answer: "Yes, you can add family members to your profile in the dashboard and book tests for them seamlessly using the 'Manage Members' feature."
    }
];

const HelpSupport = () => {
    const [openFaq, setOpenFaq] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-medical-green py-20 mb-16 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-black/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <HelpCircle size={16} />
                        Help Center
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-display font-black text-white mb-8"
                    >
                        How can we help you?
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative"
                    >
                        <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for questions, booking issues, reports..."
                                className="flex-1 bg-transparent border-none outline-none font-medium text-dark-text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button className="hidden md:block rounded-xl px-8">Search</Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: FAQ Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-dark-text mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                        className="w-full px-8 py-6 flex items-center justify-between text-left"
                                    >
                                        <span className="text-lg font-bold text-dark-text">{faq.question}</span>
                                        <div className={`p-2 rounded-full transition-colors ${openFaq === index ? 'bg-medical-green text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-8 pb-8 pt-2 text-gray-600 font-medium leading-relaxed border-t border-gray-50">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Contact Support */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-medical-green/5">
                            <h3 className="text-2xl font-bold text-dark-text mb-6">Contact Us</h3>
                            <div className="space-y-6">
                                <a href="tel:+918376852126" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Call Support</p>
                                        <p className="text-lg font-bold text-dark-text">+91 8376852126</p>
                                    </div>
                                </a>
                                <a href="mailto:info@oxycarelabs.com" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-medical-green/5 rounded-2xl flex items-center justify-center text-medical-green group-hover:bg-medical-green group-hover:text-white transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Email Us</p>
                                        <p className="text-lg font-bold text-dark-text">info@oxycarelabs.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Visit Us</p>
                                        <p className="text-sm font-bold text-dark-text leading-tight">Lal Kuan, Sanjay Nagar, Ghaziabad, UP</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-8 border-gray-100" />

                            <div className="bg-medical-green/5 p-6 rounded-2xl border border-medical-green/10">
                                <div className="flex items-center gap-2 text-medical-green font-bold mb-2">
                                    <MessageCircle size={20} />
                                    WhatsApp Support
                                </div>
                                <p className="text-xs text-gray-500 font-medium mb-4">Chat with our health experts for quick booking and guidance.</p>
                                <a 
                                    href="https://wa.me/918376852126" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <Button className="w-full text-sm">Start Chat</Button>
                                </a>
                            </div>
                        </div>

                        {/* Emergency Info */}
                        <div className="bg-red-50 p-6 rounded-[32px] border border-red-100">
                            <h4 className="flex items-center gap-2 text-red-600 font-bold mb-2 uppercase text-xs tracking-wider">
                                <Activity size={16} />
                                Emergency?
                            </h4>
                            <p className="text-sm text-red-900 font-medium">Please call our 24/7 priority line at +91 8376852126 for immediate sample pick-ups.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
