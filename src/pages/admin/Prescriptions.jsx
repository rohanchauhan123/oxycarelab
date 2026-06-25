import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Eye, CheckCircle, XCircle, Clock, Filter, AlertCircle, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';

const Prescriptions = () => {
    const { bookings, updateBooking } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [toast, setToast] = useState(null);

    // Let's filter bookings that are actually prescriptions
    const prescriptions = bookings
        .filter(b => b && b.test === "Prescription Upload")
        .filter(b => {
            const search = searchTerm.toLowerCase();
            const id = String(b.id || '').toLowerCase();
            const userName = String(b.patientName || b.userName || b.user || '').toLowerCase();
            const phone = String(b.phone || '').toLowerCase();
            
            return id.includes(search) || userName.includes(search) || phone.includes(search);
        });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusUpdate = (id, status) => {
        updateBooking(id, { status });
        showToast(`Prescription ${status} successfully!`, status === 'Approved' ? 'success' : 'error');
        if (selectedPrescription?.id === id) {
            setSelectedPrescription(prev => ({ ...prev, status }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Prescription Manager</h1>
                    <p className="text-grey-text">Verify and process patient prescriptions for home collection.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 gap-2"><Filter size={18} /> Filters</Button>
                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, User, or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green shadow-sm text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-grey-text uppercase tracking-widest mb-1">Waiting Review</p>
                        <p className="text-2xl font-black text-dark-text">{prescriptions.filter(b => b.status === 'Pending').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-grey-text uppercase tracking-widest mb-1">Approved Today</p>
                        <p className="text-2xl font-black text-dark-text">{prescriptions.filter(b => b.status === 'Approved').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-dark-text">
                    <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-grey-text uppercase tracking-widest mb-1">Total Uploads</p>
                        <p className="text-2xl font-black">{prescriptions.length}</p>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 text-left text-xs font-bold text-grey-text uppercase tracking-widest">
                            <th className="px-8 py-6">ID</th>
                            <th className="px-8 py-6">Patient Details</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Upload Date</th>
                            <th className="px-8 py-6">File</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {prescriptions.length > 0 ? (
                            prescriptions.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-dark-text">{p.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-dark-text">{p?.patientName || p?.userName || p?.user || 'Patient'}</p>
                                            <p className="text-xs text-grey-text">{p?.phone || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'Approved' ? 'bg-medical-green/10 text-medical-green' :
                                            p.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                                                'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-grey-text italic font-medium">{p.date}</td>
                                    <td className="px-8 py-6">
                                        {p.prescriptionFile ? (
                                            <a 
                                                href={p.prescriptionFile} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-medical-green font-bold text-xs hover:underline cursor-pointer"
                                            >
                                                <Download size={14} /> {p.prescriptionName || 'prescription.pdf'}
                                            </a>
                                        ) : (
                                            <button className="flex items-center gap-2 text-gray-400 font-bold text-xs cursor-not-allowed" disabled>
                                                <Download size={14} /> No file available
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-grey-text">
                                            <button
                                                onClick={() => setSelectedPrescription(p)}
                                                className="p-2 hover:bg-white hover:text-dark-text hover:shadow-sm rounded-lg transition-all"
                                                title="View Detail"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(p.id, 'Approved')}
                                                className="p-2 hover:text-medical-green rounded-lg transition-all" title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(p.id, 'Rejected')}
                                                className="p-2 hover:text-red-500 rounded-lg transition-all" title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300 mb-4">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Prescriptions Found</h3>
                                    <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Try a different search term or filter.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[200] border font-bold ${toast.type === 'success' ? 'bg-medical-green text-white border-medical-green' : 'bg-red-500 text-white border-red-500'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Prescription Detail Modal */}
            <AnimatePresence>
                {selectedPrescription && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPrescription(null)}
                            className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prescription Review</h2>
                                    <p className="font-bold text-dark-text text-xl">Order #{selectedPrescription.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPrescription(null)}
                                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-dark-text transition-colors shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 space-y-8">
                                {/* Patient Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-l-4 border-medical-green pl-4">Patient Information</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription?.patientName || selectedPrescription?.userName || selectedPrescription?.user || 'Patient'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription.patientAge || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription.patientGender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Relation</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription.patientRelation || 'Self'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-l-4 border-medical-green pl-4">Collection Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</p>
                                                <p className="font-bold text-dark-text text-xs leading-relaxed">
                                                    {typeof selectedPrescription?.address === 'object' && selectedPrescription?.address !== null
                                                        ? `${selectedPrescription.address.houseNo || ''}, ${selectedPrescription.address.area || ''}, ${selectedPrescription.address.city || ''}`
                                                        : String(selectedPrescription?.address || 'Standard Pickup')}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                                    <p className="font-bold text-dark-text">{selectedPrescription.date || 'Today'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${selectedPrescription.status === 'Approved' ? 'bg-medical-green/10 text-medical-green' :
                                                        selectedPrescription.status === 'Rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {selectedPrescription.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* File Preview Section */}
                                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-medical-green shadow-sm">
                                                <Download size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark-text">{selectedPrescription.prescriptionName || 'prescription_file.pdf'}</p>
                                                <p className="text-xs text-grey-text font-medium">{selectedPrescription.fileSize || '1.2 MB'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (selectedPrescription.prescriptionFile) {
                                                    window.open(selectedPrescription.prescriptionFile, '_blank');
                                                }
                                            }}
                                            className="px-6 py-3 bg-white text-dark-text border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-medical-green hover:text-white transition-all shadow-sm"
                                        >
                                            Preview File
                                        </button>
                                    </div>
                                    <div className="aspect-[4/3] bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 overflow-hidden">
                                        {selectedPrescription.prescriptionFile ? (
                                            selectedPrescription.prescriptionFile.startsWith('data:image/') ? (
                                                <img 
                                                    src={selectedPrescription.prescriptionFile} 
                                                    alt="Prescription" 
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : selectedPrescription.prescriptionFile.startsWith('data:application/pdf') ? (
                                                <iframe 
                                                    src={selectedPrescription.prescriptionFile} 
                                                    className="w-full h-full border-none"
                                                    title="PDF Preview"
                                                />
                                            ) : (
                                                <div className="text-center p-8">
                                                    <Download size={48} className="opacity-20 mx-auto mb-4" />
                                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Unsupported file type for preview. Click 'Preview File' to open.</p>
                                                </div>
                                            )
                                        ) : (
                                            <>
                                                <Eye size={48} className="opacity-20 mb-4" />
                                                <p className="text-xs font-bold uppercase tracking-widest opacity-40 text-center px-8">No file content available for preview.</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                                <Button
                                    onClick={() => handleStatusUpdate(selectedPrescription.id, 'Approved')}
                                    className="h-14 flex-1 bg-medical-green text-white hover:bg-emerald-700 shadow-lg shadow-medical-green/20 gap-2"
                                >
                                    <CheckCircle size={18} /> Approve
                                </Button>
                                <Button
                                    onClick={() => handleStatusUpdate(selectedPrescription.id, 'Rejected')}
                                    className="h-14 flex-1 bg-white text-red-500 border border-red-100 hover:bg-red-50 gap-2"
                                >
                                    <XCircle size={18} /> Reject
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Prescriptions;
