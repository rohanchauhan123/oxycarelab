import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, XCircle, RefreshCcw, HelpCircle, ChevronRight } from 'lucide-react';

const PolicyPage = () => {
    const { pathname } = useLocation();

    const policies = [
        { name: 'Terms & Conditions', path: '/terms-conditions', icon: FileText },
        { name: 'Privacy Policy', path: '/privacy-policy', icon: Shield },
        { name: 'Cancellation Policy', path: '/cancellation-policy', icon: XCircle },
        { name: 'Refund Policy', path: '/refund-policy', icon: RefreshCcw },
        { name: 'FAQ', path: '/faq', icon: HelpCircle },
    ];

    const currentPolicy = policies.find(p => p.path === pathname) || policies[0];

    const renderContent = () => {
        switch (pathname) {
            case '/terms-conditions':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-grey-text italic mb-4 text-sm">Last updated: February 14, 2026</p>
                            <p className="text-grey-text leading-relaxed">By accessing and using OxyCare Labs services, you agree to be bound by these Terms and Conditions. Please read them carefully before booking any tests.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">2. Service Description</h2>
                            <p className="text-grey-text leading-relaxed">OxyCare Labs is a diagnostic booking platform that connects users with certified laboratories. We provide home collection services and digital report delivery.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">3. User Obligations</h2>
                            <p className="text-grey-text leading-relaxed">Users are responsible for providing accurate medical history and following necessary pre-test instructions (e.g., fasting).</p>
                        </section>
                    </div>
                );
            case '/privacy-policy':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">1. Data Collection</h2>
                            <p className="text-grey-text leading-relaxed">We collect personal and health information to provide accurate diagnostic services. This data is stored securely and handled with strict confidentiality.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">2. Data Usage</h2>
                            <p className="text-grey-text leading-relaxed">Your data is used solely for processing test bookings, generating reports, and communicating essential health updates.</p>
                        </section>
                    </div>
                );
            case '/cancellation-policy':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Cancellation Window</h2>
                            <p className="text-grey-text leading-relaxed">Bookings can be cancelled up to 4 hours before the scheduled home collection time without any penalty.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">Fee Structure</h2>
                            <ul className="list-disc pl-6 space-y-2 text-grey-text">
                                <li><strong>4+ Hours:</strong> Zero cancellation fee.</li>
                                <li><strong>2-4 Hours:</strong> Nominal convenience fee of ₹150.</li>
                                <li><strong>&lt; 2 Hours:</strong> 50% of the booking amount will be charged.</li>
                                <li><strong>After Collection:</strong> No cancellations or refunds allowed once the sample has been collected.</li>
                            </ul>
                        </section>
                    </div>
                );
            case '/refund-policy':
                return (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Refund Process</h2>
                            <p className="text-grey-text leading-relaxed">All eligible refunds are processed automatically to the original payment method (Bank Account/UPI/Card) within 24 hours of cancellation.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">Timeline</h2>
                            <p className="text-grey-text leading-relaxed">While we initiate the refund within 24 hours, it may take 5-7 working days to reflect in your account, depending on your bank's processing time.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold mb-4">Exceptions</h2>
                            <p className="text-grey-text leading-relaxed">No refunds will be provided for tests already conducted or for "No Show" cases where the collection agent arrived but the patient was unavailable.</p>
                        </section>
                    </div>
                );
            case '/faq':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-dark-text mb-2">How do I book a test?</h3>
                            <p className="text-grey-text text-sm">Select your required package from the "Health Packages" section, add it to your cart, and follow the checkout process to select a slot.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-dark-text mb-2">When will I get my reports?</h3>
                            <p className="text-grey-text text-sm">Most routine reports are delivered within 24 hours of sample collection via email and our platform dashboard.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-dark-text mb-2">Is fasting required for all tests?</h3>
                            <p className="text-grey-text text-sm">No, only specific tests (like Blood Sugar or Lipid Profile) require 8-12 hours of fasting. Requirements are mentioned in the test details.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-dark-text mb-2">How valid are your reports?</h3>
                            <p className="text-grey-text text-sm">We only partner with NABL and CAP accredited laboratories, ensuring the highest standards of accuracy and clinical validity.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="py-10 text-center">
                        <p className="text-grey-text italic">Comprehensive policy content for {currentPolicy.name} is being updated. Please contact support for immediate queries.</p>
                    </div>
                );
        }
    };

    return (
        <div className="pt-32 pb-20 bg-gray-50/50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Sidebar Nav */}
                    <aside className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="font-bold text-dark-text">Support Center</h3>
                            </div>
                            <nav className="p-2">
                                {policies.map((p) => (
                                    <Link
                                        key={p.path}
                                        to={p.path}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === p.path
                                                ? 'bg-soft-green text-medical-green font-semibold ring-1 ring-medical-green/10'
                                                : 'text-grey-text hover:bg-gray-50'
                                            }`}
                                    >
                                        <p.icon size={18} />
                                        <span className="text-sm">{p.name}</span>
                                        {pathname === p.path && <ChevronRight size={14} className="ml-auto" />}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <main className="lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-soft-green rounded-xl flex items-center justify-center text-medical-green">
                                    <currentPolicy.icon size={24} />
                                </div>
                                <h1 className="text-3xl font-display font-bold text-dark-text">{currentPolicy.name}</h1>
                            </div>

                            <div className="mt-8 prose prose-slate prose-p:text-grey-text max-w-none">
                                {renderContent()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
