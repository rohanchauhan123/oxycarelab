import { useData } from '../../context/DataContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Building2, MapPin, ArrowUpRight, Trash2, X, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';

const Partnerships = () => {
    const { partnerships, updatePartnershipStatus, deletePartnership } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filteredRequests = (partnerships || []).filter(r => {
        if (!r) return false;
        const search = searchTerm.toLowerCase();
        const labName = String(r.labName || '').toLowerCase();
        const contact = String(r.contactPerson || '').toLowerCase();
        const email = String(r.email || '').toLowerCase();
        
        const matchesSearch = labName.includes(search) || contact.includes(search) || email.includes(search);
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Requests', value: partnerships.length, color: 'bg-medical-green' },
        { label: 'Pending', value: partnerships.filter(r => r.status === 'Pending').length, color: 'bg-amber-500' },
        { label: 'Reviewed', value: partnerships.filter(r => r.status === 'Reviewed' || r.status === 'Approved').length, color: 'bg-medical-green' }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-dark-text tracking-tight mb-2">Partnership Requests</h1>
                    <p className="text-grey-text font-medium">Manage and review lab/hospital partnership inquiries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 md:w-80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-medical-green/20 rounded-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by lab or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none font-medium text-sm"
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
                        <h3 className={`text-4xl font-black ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Table/List View */}
            <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-xl shadow-medical-green/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Filter size={18} className="text-medical-green" />
                        <div className="flex gap-2">
                            {['All', 'Pending', 'Reviewed', 'Rejected'].map(status => (
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
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Lab Detail</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Contact</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Location</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-medical-green/10 rounded-xl flex items-center justify-center text-medical-green">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-dark-text tracking-tight">{req.labName}</p>
                                                <p className="text-[10px] font-bold text-grey-text uppercase tracking-widest">{req.labType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-dark-text text-sm">{req.contactPerson}</p>
                                        <p className="text-xs text-grey-text font-medium">{req.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-dark-text">
                                            <MapPin size={14} className="text-medical-green" />
                                            {req.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                            req.status === 'Reviewed' ? 'bg-blue-100 text-blue-600' :
                                                req.status === 'Approved' ? 'bg-medical-green/10 text-medical-green' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="p-2 bg-white border border-gray-100 rounded-lg text-medical-green hover:shadow-md transition-all"
                                                title="View Details"
                                            >
                                                <ArrowUpRight size={18} />
                                            </button>
                                            <button
                                                onClick={() => deletePartnership(req.id)}
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

                    {filteredRequests.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                                <Filter size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-dark-text">No partnership requests found</h3>
                                <p className="text-grey-text font-medium">Try adjusting your filters or search terms.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-text/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setSelectedRequest(null)} className="p-3 bg-gray-50 rounded-2xl text-grey-text hover:text-medical-green transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 pb-8 border-b border-gray-50">
                                    <div className="w-20 h-20 bg-medical-green/10 rounded-[2rem] flex items-center justify-center text-medical-green">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-dark-text tracking-tight">{selectedRequest.labName}</h2>
                                        <p className="text-grey-text font-bold uppercase text-xs tracking-widest">{selectedRequest.labType}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Contact Person</p>
                                        <p className="font-bold text-dark-text text-lg">{selectedRequest.contactPerson}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Established Location</p>
                                        <p className="font-bold text-dark-text text-lg">{selectedRequest.location}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Phone</p>
                                        <p className="font-bold text-dark-text">{selectedRequest.phone}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Email</p>
                                        <p className="font-bold text-dark-text">{selectedRequest.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-text">Additional Message</p>
                                    <div className="p-6 bg-gray-50 rounded-3xl font-medium text-grey-text text-sm leading-relaxed border border-gray-100">
                                        {selectedRequest.message || 'No additional message provided.'}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-grey-text" />
                                        <span className="text-xs font-bold text-grey-text tracking-tight">Received: {selectedRequest?.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        {selectedRequest.status !== 'Reviewed' && (
                                            <Button
                                                onClick={() => { updatePartnershipStatus(selectedRequest.id, 'Reviewed'); setSelectedRequest(null); }}
                                                variant="outline"
                                                className="rounded-2xl border-medical-green text-medical-green px-6"
                                            >
                                                Mark Reviewed
                                            </Button>
                                        )}
                                        {selectedRequest.status !== 'Approved' && (
                                            <Button
                                                onClick={() => { updatePartnershipStatus(selectedRequest.id, 'Approved'); setSelectedRequest(null); }}
                                                className="rounded-2xl px-8"
                                            >
                                                Approve Partner
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

export default Partnerships;
