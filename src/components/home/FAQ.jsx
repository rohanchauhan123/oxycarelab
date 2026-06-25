import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "How do I book a test with OxyCareLabs?",
        answer: "Booking a test is simple. Search for the test or package you need, select a certified lab, choose a convenient time for home collection, and pay securely online. You will receive a confirmation message instantly."
    },
    {
        question: "Is home sample collection free?",
        answer: "Yes! We offer free home sample collection for most health packages and tests above ₹500. Our trained phlebotomists ensure a safe and sterile sample collection process at your doorstep."
    },
    {
        question: "When will I receive my test reports?",
        answer: "Most test reports are delivered within 12-24 hours after sample collection. You will be notified via SMS, Email, and WhatsApp. You can also download them from your dashboard."
    },
    {
        question: "Are your partner labs certified?",
        answer: "Absolutely. We only partner with laboratories that are NABL (National Accreditation Board for Testing and Calibration Laboratories) and ISO certified to ensure 100% accuracy and reliability."
    },
    {
        question: "How do I choose the best lab for my test?",
        answer: "When you search for a test, we show you a list of all available partner labs along with their prices, ratings, and distance. You can also explore our 'Partner Labs' directory to view full lab profiles, accreditations, and available packages."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-text mb-4">
                        Frequently Asked <span className="text-medical-green">Questions</span>
                    </h2>
                    <p className="text-grey-text">Everything you need to know about our diagnostic services.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`border rounded-2xl transition-all duration-300 ${openIndex === i ? 'border-medical-green shadow-md' : 'border-gray-200'
                                }`}
                        >
                            <button
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                            >
                                <span className={`font-bold text-lg ${openIndex === i ? 'text-medical-green' : 'text-dark-text'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === i ? <ChevronUp size={20} className="text-medical-green" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </button>

                            {openIndex === i && (
                                <div className="px-6 pb-6 text-grey-text leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
