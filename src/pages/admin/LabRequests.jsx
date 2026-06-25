import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';

const LabRequests = () => {
    const { bookings, updateBooking } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusUpdate = (id, newStatus) => {
        updateBooking(id, { status: newStatus });
    };

    const filteredRequests = bookings.filter(r =>
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.test.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Lab Requests</h1>
                    <p className="text-grey-text">Real-time tracking of sample collections and processing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-gray-200">History</Button>
                    <div className="relative w-64 md:w-80 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Track request ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((r) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-medical-green/30 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green shrink-0">
                                        <FlaskConical size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-dark-text">{r.user}</h3>
                                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-400">#{r.id}</span>
                                        </div>
                                        <p className="text-xs text-grey-text font-semibold uppercase tracking-wider mb-2">{r.test}</p>
                                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><MapPin size={10} /> 2.4 km</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {r.time || 'Today'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${r.status === 'Assigned' ? 'bg-indigo-100 text-indigo-600' :
                                        r.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                            'bg-medical-green/10 text-medical-green'
                                        }`}>
                                        {r.status}
                                    </span>
                                    <div className="flex items-center gap-2 justify-end">
                                        {r.status === 'Assigned' ? (
                                            <button
                                                onClick={() => handleStatusUpdate(r.id, 'Collected')}
                                                className="text-xs font-bold text-medical-green hover:underline"
                                            >
                                                Mark Collected
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusUpdate(r.id, 'Assigned')}
                                                className="text-xs font-bold text-gray-400 hover:underline"
                                            >
                                                Reset Agent
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-300">
                                <Search size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-dark-text">No requests found</h3>
                                <p className="text-grey-text">We couldn't find any collection requests matching your search.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Dashboard */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
                    <h2 className="text-xl font-bold text-dark-text border-b border-gray-50 pb-6">Request Overview</h2>
                    <div className="space-y-6">
                        {[
                            { label: 'Samples Collected', key: 'Collected', color: 'bg-medical-green' },
                            { label: 'Processing at Lab', key: 'Processing', color: 'bg-brand-teal' },
                            { label: 'Reports Ready', key: 'Completed', color: 'bg-amber-500', isInverse: true }
                        ].map((item) => {
                            const count = bookings.filter(b => b.status === item.key).length;
                            const total = bookings.length;
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                            return (
                                <div key={item.label} className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                                        <span className="text-grey-text">{item.label}</span>
                                        <span className="text-dark-text">{percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-6 bg-soft-green/30 rounded-3xl border border-medical-green/10">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="text-medical-green" size={20} />
                            <h4 className="font-bold text-dark-text text-sm">System Alert</h4>
                        </div>
                        <p className="text-xs text-medical-green font-semibold leading-relaxed">
                            Logistics delay detected in South Region due to weather conditions. Expect +30m delay.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabRequests;
