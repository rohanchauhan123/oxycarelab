import React from 'react';
import { Sparkles, ArrowRight, Smartphone, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CTABanner = () => {
    const navigate = useNavigate();
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="bg-medical-green rounded-[40px] p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center">
                    {/* Decorative circles */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-8">
                            <Sparkles size={16} />
                            <span>Limited Time Offer</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                            Ready to Take Control of Your Health?
                        </h2>

                        <p className="text-white/80 text-lg mb-10">
                            Get an additional 10% OFF on your first booking. Use code <span className="font-bold text-white">HEALTH10</span> at checkout.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => navigate('/book-test')}
                                variant="secondary"
                                size="lg"
                                className="bg-white text-medical-green hover:bg-gray-100 w-full sm:w-auto flex items-center gap-2"
                            >
                                Book Your First Test <ArrowRight size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Subtle Icon Accents */}
                    <HeartPulse className="absolute top-10 left-10 text-white/10" size={80} />
                    <Smartphone className="absolute bottom-10 right-10 text-white/10" size={80} />
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
