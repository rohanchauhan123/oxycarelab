import { useData } from '../../context/DataContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, Award, ArrowUpRight, Trash2, X, FileText, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

const JobApplications = () => {
    const { jobApplications, updateJobApplicationStatus, deleteJobApplication } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);

    const filteredApps = jobApplications.filter(app => {
        if (!app) return false;
        const search = searchTerm.toLowerCase();
        const appName = String(app.name || '').toLowerCase();
        const appTitle = String(app.jobTitle || '').toLowerCase();
        const appEmail = String(app.email || '').toLowerCase();
        
        const matchesSearch = appName.includes(search) || appTitle.includes(search) || appEmail.includes(search);
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Applications', value: jobApplications.length, color: 'text-medical-green' },
        { label: 'Pending Review', value: jobApplications.filter(a => a.status === 'Pending').length, color: 'text-amber-500' },
        { label: 'Shortlisted', value: jobApplications.filter(a => a.status === 'Shortlisted').length, color: 'text-medical-green' }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-dark-text tracking-tight mb-2">Job Applications</h1>
                    <p className="text-grey-text font-medium">Review and manage candidates for open positions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, role, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none font-medium text-sm shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
                    >
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-grey-text mb-4">{stat.label}</p>
                        <h3 className={`text-4xl font-black ${stat.color}`}>{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Content */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-xl shadow-medical-green/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Filter size={18} className="text-medical-green" />
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Shortlisted', 'Rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status
                                            ? 'bg-medical-green text-white shadow-lg shadow-medical-green/20'
                                            : 'bg-gray-50 text-grey-text hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Candidate</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Applied For</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Experience</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-medical-green/10 rounded-xl flex items-center justify-center text-medical-green font-black text-lg">
                                                {String(app?.name || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-dark-text tracking-tight">{app.name}</p>
                                                <p className="text-xs font-medium text-grey-text">{app.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-medical-green" />
                                            <span className="font-bold text-dark-text text-sm">{app.jobTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-dark-text">
                                            <Award size={14} className="text-amber-500" />
                                            {app.experience}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                                app.status === 'Shortlisted' ? 'bg-medical-green/10 text-medical-green' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="p-2 bg-white border border-gray-100 rounded-lg text-medical-green hover:shadow-md transition-all"
                                                title="Review Application"
                                            >
                                                <ArrowUpRight size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteJobApplication(app.id)}
                                                className="p-2 bg-white border border-gray-100 rounded-lg text-medical-green hover:shadow-md transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredApps.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                                <Search size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-dark-text">No applications found</h3>
                                <p className="text-grey-text font-medium">No candidates match your current search criteria.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail View Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-text/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setSelectedApp(null)} className="p-3 bg-gray-50 rounded-2xl text-grey-text hover:text-medical-green transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                                    <div className="w-20 h-20 bg-medical-green/10 rounded-[2rem] flex items-center justify-center text-medical-green font-black text-2xl">
                                        {selectedApp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-dark-text tracking-tight">{selectedApp.name}</h2>
                                        <p className="text-grey-text font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                                            <Briefcase size={12} className="text-medical-green" /> {selectedApp.jobTitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Candidate Email</p>
                                        <p className="font-bold text-dark-text">{selectedApp.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Phone Number</p>
                                        <p className="font-bold text-dark-text">{selectedApp.phone}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Experience Level</p>
                                        <p className="font-bold text-dark-text">{selectedApp.experience}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Resume Link</p>
                                        <a href={selectedApp.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-medical-green font-black hover:underline">
                                            <FileText size={16} /> View CV <ArrowUpRight size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Cover Message / Introduction</p>
                                    <div className="p-6 bg-gray-50 rounded-3xl font-medium text-grey-text text-sm leading-relaxed border border-gray-100">
                                        {selectedApp.message || 'No additional message provided.'}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-grey-text" />
                                        <span className="text-xs font-bold text-grey-text tracking-tight">Applied: {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        {selectedApp.status !== 'Rejected' && (
                                            <Button
                                                onClick={() => { updateJobApplicationStatus(selectedApp.id, 'Rejected'); setSelectedApp(null); }}
                                                variant="outline"
                                                className="rounded-2xl border-medical-green text-medical-green px-6"
                                            >
                                                Reject
                                            </Button>
                                        )}
                                        {selectedApp.status !== 'Shortlisted' && (
                                            <Button
                                                onClick={() => { updateJobApplicationStatus(selectedApp.id, 'Shortlisted'); setSelectedApp(null); }}
                                                className="rounded-2xl px-8 bg-medical-green hover:bg-medical-green-dark"
                                            >
                                                Shortlist
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobApplications;
