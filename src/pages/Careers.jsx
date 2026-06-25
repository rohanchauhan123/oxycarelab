import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    CheckCircle2,
    Search,
    MapPin,
    Clock,
    IndianRupee,
    ArrowRight,
    Mail,
    User,
    Phone,
    FileText,
    X
} from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';

const Careers = () => {
    const { addJobApplication } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: 'Freshers',
        resumeUrl: '',
        message: ''
    });

    const jobs = [
        {
            id: 'job-1',
            title: 'Lab Technician',
            location: 'Ghaziabad, UP',
            type: 'Full Time',
            salary: '₹15,000 - ₹25,000',
            exp: '1-3 Years',
            desc: 'We are looking for a skilled Lab Technician to perform diagnostic tests and maintain laboratory equipment.'
        },
        {
            id: 'job-2',
            title: 'Senior Phlebotomist',
            location: 'Delhi NCR',
            type: 'Full Time',
            salary: '₹20,000 - ₹35,000',
            exp: '3-5 Years',
            desc: 'Certified phlebotomist required for home sample collection and clinical procedures.'
        },
        {
            id: 'job-3',
            title: 'Area Sales Executive',
            location: 'Noida, UP',
            type: 'Full Time',
            salary: '₹25,000 - ₹45,000',
            exp: '2-4 Years',
            desc: 'Drive growth and partnerships with local clinics and hospitals in the assigned territory.'
        }
    ];

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addJobApplication({
                ...formData,
                jobId: selectedJob.id,
                jobTitle: selectedJob.title
            });
            setSubmitted(true);
            setIsApplying(false);
        } catch (error) {
            console.error("Application submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen bg-[#F9FBFE] pb-20">
            {/* Header Section */}
            <section className="py-20 text-center space-y-6 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-medical-green/10 text-medical-green rounded-full text-xs font-black uppercase tracking-widest"
                >
                    <Briefcase size={14} /> Join Our Mission
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black text-dark-text tracking-tight leading-tight">
                    Build the Future of <br />
                    <span className="text-medical-green italic">Digital Healthcare</span>
                </h1>
                <p className="text-grey-text text-lg font-medium max-w-2xl mx-auto">
                    We're looking for passionate individuals to join our team and help us redefine precision diagnostics across India.
                </p>
            </section>

            {/* Application Success State */}
            {submitted && (
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-medical-green text-white p-8 rounded-[3rem] flex items-center justify-between gap-8 flex-wrap shadow-xl shadow-medical-green/20"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">Application Submitted Successfully!</h3>
                                <p className="text-white/80 font-medium">Our HR team will reach out to you if your profile matches our requirements.</p>
                            </div>
                        </div>
                        <Button onClick={() => setSubmitted(false)} variant="outline" className="border-white text-white hover:bg-white hover:text-medical-green px-8">
                            View Other Openings
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* Job Search & List */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-dark-text tracking-tight">Current Openings</h2>
                        <div className="relative w-64">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by role or city..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-sm shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-medical-green/20 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-dark-text group-hover:text-medical-green transition-colors">{job.title}</h3>
                                            <span className="px-3 py-1 bg-blue-50 text-medical-green rounded-lg text-[10px] font-black uppercase tracking-wider">{job.type}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-grey-text font-bold text-sm">
                                            <span className="flex items-center gap-2"><MapPin size={16} className="text-medical-green" /> {job.location}</span>
                                            <span className="flex items-center gap-2"><Clock size={16} className="text-medical-green" /> {job.exp}</span>
                                            <span className="flex items-center gap-2"><IndianRupee size={16} className="text-amber-500" /> {job.salary}</span>
                                        </div>
                                        <p className="text-grey-text text-sm leading-relaxed max-w-xl">
                                            {job.desc}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => { setSelectedJob(job); setIsApplying(true); }}
                                        className="rounded-2xl px-10 py-4 shadow-lg shadow-medical-green/10"
                                    >
                                        Apply Now <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Benefits / FAQ Side Card */}
                <div className="space-y-8">
                    <div className="bg-medical-green-hover p-8 rounded-[3rem] text-white space-y-6 shadow-2xl">
                        <h3 className="text-2xl font-black tracking-tight leading-tight">Perks of working <br /> with OxyCare</h3>
                        <ul className="space-y-4">
                            {[
                                "Competitive Salary & Incentives",
                                "Comprehensive Medical Insurance",
                                "Flexible Working Hours",
                                "Continuous Growth & Learning",
                                "Modern Diagnostic Tech Stack"
                            ].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                                    <CheckCircle2 size={16} className="text-medical-green shrink-0" />
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4 text-center">
                        <div className="w-16 h-16 bg-medical-green/10 rounded-full flex items-center justify-center mx-auto text-medical-green">
                            <Mail size={24} />
                        </div>
                        <h4 className="text-lg font-black text-dark-text">Can't find a fit?</h4>
                        <p className="text-grey-text text-sm font-medium">Send your CV to our talent database.</p>
                        <a href="mailto:careers@oxycarelabs.com" className="block text-medical-green font-black text-sm hover:underline">careers@oxycarelabs.com</a>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {isApplying && selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-text/80 backdrop-blur-sm"
                            onClick={() => setIsApplying(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-medical-green">Apply for</span>
                                    <h2 className="text-3xl font-black text-dark-text tracking-tight">{selectedJob.title}</h2>
                                </div>
                                <button onClick={() => setIsApplying(false)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-medical-green/10 hover:text-medical-green transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleApply} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="text"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text transition-all"
                                                placeholder="e.g. Rahul Sharma"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email ID</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="email"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text transition-all"
                                                placeholder="rahul.sharma@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                required
                                                type="tel"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text transition-all"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Experience Level</label>
                                        <select
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text appearance-none"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        >
                                            <option>Freshers</option>
                                            <option>1-3 Years</option>
                                            <option>3-5 Years</option>
                                            <option>5+ Years</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Resume Link (GDrive/Dropbox)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="url"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text transition-all"
                                            placeholder="https://drive.google.com/file/d/..."
                                            value={formData.resumeUrl}
                                            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Why should we hire you?</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-medical-green font-bold text-dark-text transition-all resize-none"
                                        placeholder="Briefly describe your fit for this role..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 rounded-2xl shadow-xl shadow-medical-green/20"
                                >
                                    {loading ? "SUBMITTING..." : "CONFIRM APPLICATION"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Careers;
