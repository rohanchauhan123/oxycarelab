import React, { useState } from 'react';
import {
    Search,
    MoreHorizontal,
    Trash2,
    CalendarCheck,
    Users,
    FlaskConical,
    Clock,
    CreditCard,
    Check,
    Upload,
    User,
    Phone,
    FileText,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { downloadExcel } from '../../utils/exportUtils';

const Bookings = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabFilter, setSelectedLabFilter] = useState('All');
    const [tempReportUrl, setTempReportUrl] = useState('');
    const [tempBillUrl, setTempBillUrl] = useState('');
    const [tempPhone, setTempPhone] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { bookings, labs, users, updateBooking, deleteBooking } = useData();

    const handleStatusUpdate = (id, status) => {
        const updateData = { status };
        // Force document persistence during status changes
        if (tempReportUrl) updateData.reportUrl = tempReportUrl;
        if (tempBillUrl) updateData.billUrl = tempBillUrl;
        updateBooking(id, updateData);
        // Clear local temp states
        setTempReportUrl('');
        setTempBillUrl('');
    };

    const handleSaveDocuments = async (autoComplete = false) => {
        if (!selectedBooking) return;
        try {
            const updateData = {};
            if (tempReportUrl !== undefined) updateData.reportUrl = tempReportUrl;
            if (tempBillUrl !== undefined) updateData.billUrl = tempBillUrl;
            if (tempPhone !== undefined) updateData.phone = tempPhone;
            
            if (autoComplete && tempReportUrl) {
                updateData.status = 'Report completed';
            }
            
            await updateBooking(selectedBooking.id, updateData);
            
            // Sync the local selected booking so the UI reflects changes
            setSelectedBooking(prev => ({ ...prev, ...updateData }));
            
            alert(autoComplete ? "Documents and phone saved, status updated!" : "Details saved successfully!");
        } catch (error) {
            console.error("Error saving documents:", error);
            alert("Failed to save changes.");
        }
    };

    const filteredBookings = (bookings || []).filter(b => {
        if (!b) return false;
        const matchesSearch = (b.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.user?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.test?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.patientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            
        const matchesLab = selectedLabFilter === 'All' || b.lab === selectedLabFilter || b.labName === selectedLabFilter;
        
        return matchesSearch && matchesLab;
    }).map(b => {
        // Fallback: If booking phone is missing, check user profile phone
        if (!b.phone || b.phone === 'N/A') {
            const userProfile = (users || []).find(u => u.id === b.userId);
            if (userProfile?.phone) {
                return { ...b, phone: userProfile.phone };
            }
        }
        return b;
    });

    const handleExportAll = () => {
        const exportData = filteredBookings.map(b => ({
            'Booking ID': b.id,
            'Patient': b.patientName || b.userName || 'N/A',
            'Phone': b.phone || 'N/A',
            'Lab': b.lab || b.labName || 'N/A',
            'Test': b.test || 'N/A',
            'Date': b.date || 'N/A',
            'Time': b.time || 'N/A',
            'Status': b.status || 'Pending',
            'Amount': b.amount || (b.total ? `₹${b.total}` : '₹0'),
            'Address': typeof b.address === 'object' && b.address !== null 
                ? (b.address.houseNo || b.address.area || b.address.city
                    ? `${b.address.houseNo || ''}, ${b.address.area || ''}, ${b.address.landmark ? b.address.landmark + ',' : ''} ${b.address.city || ''}`
                    : (b.address.address || ''))
                : String(b.address || '')
        }));
        
        downloadExcel(exportData, `oxycare_bookings_${new Date().toISOString().split('T')[0]}.xlsx`, 'Bookings');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header omitted for brevity in replace tool, but included in my strategy */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Lab Bookings</h1>
                    <p className="text-grey-text">Manage collection requests and track sample status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={selectedLabFilter}
                        onChange={(e) => setSelectedLabFilter(e.target.value)}
                        className="h-12 bg-white border border-gray-100 rounded-2xl px-4 text-sm font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green shadow-sm"
                    >
                        <option value="All">All Labs</option>
                        {(labs || []).map(lab => (
                            <option key={lab?.id || Math.random()} value={lab?.name}>{lab?.name || 'Lab'}</option>
                        ))}
                    </select>
                    <Button 
                        variant="secondary" 
                        onClick={() => handleExportAll()}
                        disabled={filteredBookings.length === 0}
                        className="h-12"
                    >
                        Export All
                    </Button>
                    <div className="relative w-64 md:w-80 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                 {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <div key={booking?.id || Math.random()} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all flex flex-col xl:flex-row items-center justify-between gap-6 group">
                            <div className="flex items-start gap-6 flex-1 w-full">
                                <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex flex-col items-center justify-center shrink-0 group-hover:bg-soft-green transition-colors border border-gray-100">
                                    <CalendarCheck size={24} className="text-medical-green" />
                                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-tighter">
                                        {String(booking?.id || '').includes('-') ? booking.id.split('-')[1] : String(booking?.id || '').slice(-4)}
                                    </p>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-dark-text tracking-tight">{booking?.test || 'Test'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking?.status === 'Report completed' ? 'bg-medical-green/10 text-medical-green' :
                                                booking?.status === 'Cancelled' ? 'bg-red-50 text-red-500' :
                                                    'bg-blue-50 text-blue-500'
                                                }`}>{booking?.status || 'Pending'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {booking?.phone && booking.phone !== 'N/A' ? (
                                                <a 
                                                    href={`tel:${booking.phone}`}
                                                    className="flex items-center gap-2 bg-medical-green text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-emerald-700 transition-all hover:scale-105"
                                                >
                                                    <Phone size={14} className="fill-current" /> Call {booking.phone}
                                                </a>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setTempReportUrl(booking?.reportUrl || '');
                                                        setTempBillUrl(booking?.billUrl || '');
                                                        setTempPhone('');
                                                    }}
                                                    className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-100 transition-all border border-red-200"
                                                >
                                                    <Phone size={14} /> No Number
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] text-grey-text font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-dark-text">
                                            <User size={14} className="text-medical-green" /> 
                                            <span className="text-sm font-black">{booking?.patientName || booking?.userName || 'Patient'}</span>
                                            {booking?.phone && booking.phone !== 'N/A' && (
                                                <span className="text-medical-green ml-1 font-black underline decoration-2 underline-offset-4">{booking.phone}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FlaskConical size={14} className="text-medical-green" /> {booking?.lab || booking?.labName || 'Partner Lab'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-medical-green" /> {booking?.date || 'Today'} • {booking?.time || '10:00 AM'}
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-500">
                                            <Users size={14} /> 
                                            {[
                                                booking?.patientAge && booking.patientAge !== 'N/A' ? `${booking.patientAge}Y` : '',
                                                booking?.patientGender && booking.patientGender !== 'Unisex' ? booking.patientGender : '',
                                                booking?.patientRelation && booking.patientRelation !== 'Self' ? `(${booking.patientRelation})` : '(Self)'
                                            ].filter(Boolean).join(' • ')}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium">
                                        <div className="bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-black uppercase">ID: {booking?.id || 'N/A'}</div>
                                        
                                        {(() => {
                                            const addrParts = typeof booking.address === 'object' && booking.address !== null
                                                ? [booking.address.houseNo, booking.address.area, booking.address.city].filter(p => p && p !== 'N/A')
                                                : [];
                                            const addrStr = addrParts.length > 0 ? addrParts.join(', ') : (typeof booking.address === 'string' ? booking.address : (booking.address?.address || ''));
                                            
                                            return addrStr && addrStr !== 'N/A' ? (
                                                <div className="bg-medical-green/5 text-medical-green px-2 py-1 rounded-lg truncate max-w-md border border-medical-green/10 font-bold">
                                                    Pickup: {addrStr}
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-none border-gray-50">
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end text-medical-green mb-1">
                                        <CreditCard size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Paid</span>
                                    </div>
                                    <p className="text-2xl font-black text-dark-text">{booking?.amount || (booking?.total ? `₹${booking.total}` : '₹0')}</p>
                                </div>
                                <div className="h-12 w-[1px] bg-gray-100 hidden xl:block" />
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedBooking(booking);
                                            setTempReportUrl(booking?.reportUrl || '');
                                            setTempBillUrl(booking?.billUrl || '');
                                            setTempPhone(booking?.phone || '');
                                        }}
                                        className="bg-dark-text text-white hover:bg-black group-hover:bg-medical-green transition-colors duration-500"
                                    >
                                        Update Details
                                    </Button>
                                    <button
                                        onClick={() => deleteBooking(booking?.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center">
                        <CalendarCheck size={48} className="text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Bookings Found</h3>
                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Try searching for a different patient or test ID.</p>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-text/80 backdrop-blur-sm"
                            onClick={() => setSelectedBooking(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-black text-dark-text text-xl">Update Status: {selectedBooking.id}</h3>
                                {isUploading && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        <div className="w-1 h-1 bg-medical-green rounded-full" /> Processing...
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 text-gray-400 hover:text-dark-text transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                                {/* Documents Upload (Always Visible) */}
                                <div className="space-y-4 bg-medical-green/5 p-6 rounded-3xl border border-medical-green/20">
                                    <div className="flex items-center justify-between border-b border-medical-green/20 pb-3 mb-4">
                                        <h4 className="text-[10px] font-black text-medical-green uppercase tracking-widest border-l-2 border-medical-green pl-2">Upload Documents</h4>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleSaveDocuments(false)} className="h-8 px-4 text-[10px] font-black bg-white border border-medical-green/20 text-medical-green hover:bg-medical-green/5">
                                                Save Only
                                            </Button>
                                            <Button size="sm" onClick={() => handleSaveDocuments(true)} className="h-8 px-4 text-[10px] font-black bg-medical-green hover:bg-emerald-700 text-white shadow-sm">
                                                Save & Complete
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Report Upload */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500">Test Report</label>
                                                <input
                                                    type="text"
                                                    placeholder="File URL or browse..."
                                                    value={tempReportUrl}
                                                    onChange={(e) => setTempReportUrl(e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                                                />
                                            </div>

                                            <div className="relative">
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-all group overflow-hidden relative">
                                                        {tempReportUrl ? (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-medical-green/5">
                                                                {tempReportUrl.startsWith('data:image') ? (
                                                                    <img src={tempReportUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                                                                ) : (
                                                                    <FileText size={32} className="text-medical-green/40" />
                                                                )}
                                                                <p className="relative z-10 text-[10px] font-black text-medical-green uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md">Report Uploaded</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload size={24} className="text-gray-400 mb-2 group-hover:text-medical-green transition-colors" />
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Report</p>
                                                            </div>
                                                        )}
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setIsUploading(true);
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        const base64 = event.target.result;
                                                                        setTempReportUrl(base64);
                                                                        setIsUploading(false);
                                                                    };
                                                                    reader.onerror = () => setIsUploading(false);
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bill Upload */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500">Invoice / Bill</label>
                                                <input
                                                    type="text"
                                                    placeholder="Bill URL or browse..."
                                                    value={tempBillUrl}
                                                    onChange={(e) => setTempBillUrl(e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                                                />
                                            </div>

                                            <div className="relative">
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-all group overflow-hidden relative">
                                                        {tempBillUrl ? (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50">
                                                                {tempBillUrl.startsWith('data:image') ? (
                                                                    <img src={tempBillUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                                                                ) : (
                                                                    <CreditCard size={32} className="text-blue-400/40" />
                                                                )}
                                                                <p className="relative z-10 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md">Bill Uploaded</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload size={24} className="text-gray-400 mb-2 group-hover:text-medical-green transition-colors" />
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Bill</p>
                                                            </div>
                                                        )}
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setIsUploading(true);
                                                                    const reader = new FileReader();
                                                                    reader.onload = (event) => {
                                                                        const base64 = event.target.result;
                                                                        setTempBillUrl(base64);
                                                                        setIsUploading(false);
                                                                    };
                                                                    reader.onerror = () => setIsUploading(false);
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 text-center">Uploading a file updates the field automatically. <span className="text-amber-600 font-bold">Max 5MB per file. Click Save Docs when done.</span></p>
                                </div>

                                {/* Patient & Collection Details */}
                                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-medical-green pl-2">Patient Details</h4>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-dark-text">{selectedBooking.patientName || selectedBooking.user}</p>
                                            <p className="text-xs text-grey-text font-bold uppercase">{selectedBooking.patientAge ? `${selectedBooking.patientAge} Years` : ''} • {selectedBooking.patientGender || ''}</p>
                                            <p className="text-[10px] text-grey-text font-medium">{selectedBooking.patientRelation ? `(${selectedBooking.patientRelation})` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-medical-green pl-2">Patient Contact</h4>
                                        <div className="space-y-2">
                                            {tempPhone ? (
                                                <a 
                                                    href={`tel:${tempPhone}`}
                                                    className="inline-flex items-center gap-2 bg-medical-green text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-medical-green/20 hover:scale-105 transition-transform"
                                                >
                                                    <Phone size={14} /> Call {tempPhone}
                                                </a>
                                            ) : (
                                                <div className="bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 font-black text-[10px] uppercase tracking-widest text-center">
                                                    Phone Not Provided
                                                </div>
                                            )}
                                            
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Edit Contact Number</label>
                                                <input 
                                                    type="tel"
                                                    value={tempPhone}
                                                    onChange={(e) => setTempPhone(e.target.value)}
                                                    placeholder="Enter mobile number..."
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-medical-green pl-2">Collection Address</h4>
                                        <p className="text-xs font-bold text-dark-text leading-relaxed">
                                            {typeof selectedBooking.address === 'object' && selectedBooking.address !== null
                                                ? ([selectedBooking.address.houseNo, selectedBooking.address.area, selectedBooking.address.landmark, selectedBooking.address.city].filter(p => p && p !== 'N/A').join(', ') || selectedBooking.address.address || 'Address not provided')
                                                : String(selectedBooking.address || 'Address not provided')}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-medical-green pl-2 mb-4">Update Status</h4>
                                    {['Pending', 'Assigned', 'Collected', 'Processing', 'Report completed', 'Cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                handleStatusUpdate(selectedBooking.id, status);
                                                setSelectedBooking(null);
                                                setTempReportUrl('');
                                                setTempBillUrl('');
                                            }}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedBooking.status === status
                                                ? 'bg-medical-green/10 border-medical-green text-medical-green shadow-sm'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="font-bold text-sm">{status}</span>
                                            {selectedBooking.status === status && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 flex items-center justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Bookings;
