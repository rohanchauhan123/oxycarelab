import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PhoneIncoming,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    User,
    Phone,
    Calendar,
    ChevronRight,
    MoreVertical,
    RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const CallbackRequests = () => {
    const { callbackRequests, updateCallbackStatus, deleteCallbackRequest, refreshCallbackRequests } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshCallbackRequests();
        } finally {
            setTimeout(() => setIsRefreshing(false), 600);
        }
    };

    const filteredRequests = callbackRequests.filter(req => {
        if (!req) return false;
        const reqName = String(req.name || '').toLowerCase();
        const reqPhone = String(req.phone || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = reqName.includes(search) || reqPhone.includes(search);
        const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        'Pending': 'bg-amber-100 text-amber-600 border-amber-200',
        'Resolved': 'bg-medical-green/10 text-medical-green border-medical-green/20',
        'Cancelled': 'bg-red-50 text-red-500 border-red-100'
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2 tracking-tight">Callback Requests</h1>
                    <p className="text-grey-text font-medium text-lg">Manage and respond to user expert consultations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        className={`p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-medical-green hover:border-medical-green/40 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm font-black text-dark-text tracking-tight">
                            {callbackRequests.filter(r => r.status === 'Pending').length} Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-medical-green/5 focus:border-medical-green transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Pending', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border ${filterStatus === status
                                    ? 'bg-dark-text text-white border-dark-text shadow-lg'
                                    : 'bg-white text-grey-text border-gray-100 hover:border-medical-green/30'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((req, index) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-dark-text/40 group-hover:bg-medical-green/10 group-hover:text-medical-green transition-colors shrink-0">
                                        <User size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-dark-text tracking-tight">{req.name || 'Anonymous'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[req.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {req.status || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-medical-green" /> {req?.phone || 'N/A'}</span>
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {req?.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Date N/A'}</span>
                                            <span className="flex items-center gap-1.5 text-xs text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{req?.id || 'ID N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 md:border-l border-gray-50 md:pl-6">
                                    {req.status === 'Pending' && (
                                        <button
                                            onClick={() => updateCallbackStatus(req.id, 'Resolved')}
                                            className="flex items-center gap-2 px-6 py-3 bg-medical-green text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-medical-green/20 hover:bg-emerald-600 transition-all hover:-translate-y-0.5"
                                        >
                                            <CheckCircle2 size={16} /> Mark Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteCallbackRequest(req.id)}
                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Request"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                                <PhoneIncoming size={40} />
                            </div>
                            <h3 className="text-xl font-black text-dark-text mb-2">No Callback Requests Found</h3>
                            <p className="text-gray-400 font-medium">When users submit the expert popup form, they will appear here.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CallbackRequests;
