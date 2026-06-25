import { motion } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Globe,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const PartnerWithUs = () => {
    const { addPartnership } = useData();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        labName: '',
        contactPerson: '',
        email: '',
        phone: '',
        location: '',
        labType: 'Diagnostic Lab',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addPartnership(formData);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Partnership submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-2xl mx-auto text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl shadow-medical-green/5 border border-medical-green/10">
                    <div className="w-24 h-24 bg-medical-green/10 rounded-full flex items-center justify-center mx-auto text-medical-green">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-dark-text tracking-tight">Application Received!</h1>
                        <p className="text-grey-text text-lg font-medium">
                            Thank you for your interest in partnering with OxyCare Labs. Our partnership team will review your details and get back to you within 24-48 business hours.
                        </p>
                    </div>
                    <Button onClick={() => window.location.href = '/'} className="px-10 py-4 rounded-2xl">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-[#F9FBFE]">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-medical-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-medical-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-medical-green/10 text-medical-green rounded-full text-xs font-black uppercase tracking-widest"
                    >
                        <Building2 size={14} /> Partnership Program
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-dark-text tracking-tight leading-[1.1]"
                    >
                        Grow Your <span className="text-medical-green italic">Lab Network</span> <br />
                        with OxyCare Labs
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-grey-text text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        Join India's fastest-growing diagnostic aggregator and digitize your pathology services with precision and speed.
                    </motion.p>
                </div>
            </section>

            {/* Why Partner Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Zap className="text-amber-500" />,
                                title: "Boost Volume",
                                desc: "Get access to thousands of daily bookings across our nationwide network."
                            },
                            {
                                icon: <Globe className="text-medical-green" />,
                                title: "Digital Reach",
                                desc: "Instantly digitize your lab with our advanced reporting and tracking systems."
                            },
                            {
                                icon: <ShieldCheck className="text-medical-green" />,
                                title: "Trust & Quality",
                                desc: "Align with a brand known for clinical excellence and global benchmark standards."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 space-y-4 hover:border-medical-green/20 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-dark-text">{item.title}</h3>
                                <p className="text-grey-text text-sm font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white p-8 md:p-16 rounded-[3.5rem] shadow-2xl shadow-medical-green/5 border border-gray-100">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-dark-text tracking-tight">Register Your Interest</h2>
                            <p className="text-grey-text font-medium">Fill in the details below and our team will reach out to you.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Lab/Hospital Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Sunrise Diagnostics"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text"
                                        value={formData.labName}
                                        onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Contact Person</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Rajesh Kumar"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text"
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Email ID</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="contact@sunrisediagnostics.in"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Location / City</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. New Delhi"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Establishment Type</label>
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text appearance-none"
                                        value={formData.labType}
                                        onChange={(e) => setFormData({ ...formData, labType: e.target.value })}
                                    >
                                        <option>Diagnostic Lab</option>
                                        <option>Hospital</option>
                                        <option>Clinic</option>
                                        <option>Collection Center</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 pl-1">Additional Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your services or certifications (e.g. NABL, ISO)..."
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green transition-all font-bold text-dark-text resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-xl shadow-medical-green/20"
                            >
                                {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                                {!loading && <ArrowRight size={20} />}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnerWithUs;
