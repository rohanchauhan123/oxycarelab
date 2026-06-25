import React from 'react';
import { Calendar, Clock, MapPin, Download, ChevronRight, Activity, Search, Filter, X, ShieldCheck, AlertCircle, RefreshCw, User, CheckCircle2, FileText, Receipt } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../components/ui/Button';

const MyBookings = () => {
    const { bookings, cancelBooking, rescheduleBooking } = useData();
    const { user } = useAuth();
    const [selectedBooking, setSelectedBooking] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Filter bookings for current user and search term
    const userBookings = (bookings || []).filter(b => 
        b && b.userId === user?.id &&
        ((b.test?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (b.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
    );

    // Derived stats
    const stats = [
        { label: 'Active Bookings', value: userBookings.filter(b => b && b.status !== 'Completed' && b.status !== 'Cancelled').length.toString().padStart(2, '0'), color: 'text-dark-text', bg: 'bg-gray-50' },
        { label: 'Completed', value: userBookings.filter(b => b && b.status === 'Completed').length.toString().padStart(2, '0'), color: 'text-medical-green', bg: 'bg-soft-green' },
    ];

    const handleDownloadReport = (booking) => {
        if (!booking.reportUrl) {
            alert('Your medical report is being prepared by our medical experts. Please check back later.');
            return;
        }
        const link = document.createElement('a');
        link.href = booking.reportUrl;
        link.download = `OxyCare_Report_${booking.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadInvoice = (booking) => {
        if (!booking.billUrl) {
            alert('Billing information is not yet available for this session.');
            return;
        }
        const link = document.createElement('a');
        link.href = booking.billUrl;
        link.download = `OxyCare_Invoice_${booking.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            cancelBooking(id);
            setSelectedBooking(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">My Bookings</h1>
                    <p className="text-gray-400 font-bold">Manage and track your diagnostic test appointments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-12 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-medical-green transition-colors shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {(stats || []).map((stat, index) => (
                    <div key={index} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`w-10 h-10 md:w-14 md:h-14 ${stat?.bg || 'bg-gray-50'} ${stat?.color || 'text-gray-400'} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                            {stat?.icon && <stat.icon size={20} />}
                        </div>
                        <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-1">{stat?.label || 'Stat'}</p>
                        <h3 className="text-xl md:text-3xl font-black text-dark-text tracking-tight">{stat?.value || '00'}</h3>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                 {userBookings.length > 0 ? (
                    (userBookings || []).map((booking) => (
                        <div key={booking?.id || Math.random()} className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 hover:shadow-xl transition-all group border-l-4 border-l-transparent hover:border-l-medical-green">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-medical-green shrink-0 shadow-inner group-hover:bg-medical-green/10 transition-colors">
                                        <Activity size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-dark-text tracking-tight shrink-0">{booking?.test || 'Test'}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking?.status === 'Completed' ? 'bg-medical-green/10 text-medical-green' :
                                                booking?.status === 'Cancelled' ? 'bg-red-50 text-red-500' :
                                                    'bg-amber-50 text-amber-500'
                                                }`}>
                                                {booking?.status || 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Booking ID: <span className="text-dark-text">{booking?.id || 'N/A'}</span></p>
                                        {/* Patient Identification Badge */}
                                        {(booking?.patientName || booking?.userName || user?.name) && (
                                            <div className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 border border-gray-100 rounded-xl w-fit mt-1">
                                                <div className="w-5 h-5 bg-medical-green rounded-lg flex items-center justify-center text-white shadow-sm">
                                                    <User size={12} />
                                                </div>
                                                <span className="text-[10px] font-black text-dark-text uppercase tracking-[0.1em]">
                                                    {booking?.patientName || booking?.userName || user?.name}
                                                    {booking?.patientRelation && booking?.patientRelation !== 'Self' && (
                                                        <span className="text-gray-400 font-bold ml-1 opacity-80">({booking.patientRelation})</span>
                                                    )}
                                                    {(booking?.patientAge || user?.age) && (
                                                        <span className="text-gray-400 font-bold ml-1 opacity-80">• {booking.patientAge || user?.age}Y</span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Calendar size={14} className="text-medical-green" /> {booking?.date || 'Pending'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Clock size={14} className="text-medical-green" /> {booking?.time || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <MapPin size={14} className="text-medical-green" /> {booking?.lab || 'Partner Lab'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between lg:justify-end gap-10">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                                        <p className="text-2xl font-black text-dark-text">
                                            {booking?.amount
                                                ? (String(booking.amount).startsWith('₹') ? booking.amount : `₹${Number(booking.amount || 0).toLocaleString('en-IN')}`)
                                                : booking?.total
                                                    ? `₹${Number(booking.total || 0).toLocaleString('en-IN')}`
                                                    : '₹0'
                                            }
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {booking?.billUrl && (
                                            <button
                                                onClick={() => handleDownloadInvoice(booking)}
                                                className="p-4 bg-gray-50 text-dark-text rounded-2xl hover:bg-medical-green hover:text-white transition-all shadow-sm"
                                                title="Download Invoice"
                                            >
                                                <Receipt size={20} />
                                            </button>
                                        )}
                                        {booking?.reportUrl && (
                                            <button
                                                onClick={() => handleDownloadReport(booking)}
                                                className="p-4 bg-medical-green text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-medical-green/20"
                                                title="Download Report"
                                            >
                                                <Download size={20} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="h-14 px-6 bg-gray-50 rounded-2xl text-dark-text group-hover:bg-medical-green group-hover:text-white transition-all shadow-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                        >
                                            View Order <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-dark-text mb-2">No Bookings Found</h3>
                        <p className="text-gray-400 font-medium">You haven't booked any health tests yet.</p>
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedBooking(null); }}
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
                                    <h2 className="text-2xl font-black text-dark-text tracking-tight uppercase tracking-widest text-xs mb-1">Booking Details</h2>
                                    <p className="font-bold text-dark-text text-lg">Order #{selectedBooking?.id || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedBooking(null); }}
                                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-dark-text transition-colors shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                                {/* Status Banner */}
                                <div className={`p-6 rounded-3xl flex items-center justify-between ${selectedBooking?.status === 'Completed' ? 'bg-medical-green/10 text-medical-green' :
                                    selectedBooking?.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-dark-text'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            {selectedBooking?.status === 'Completed' ? <CheckCircle2 size={24} /> :
                                                selectedBooking?.status === 'Cancelled' ? <AlertCircle size={24} /> : <Clock size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Status</p>
                                            <p className="font-black text-lg uppercase tracking-tight">{selectedBooking?.status || 'Processing'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Patient Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-medical-green pl-4">Patient Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-medical-green"><User size={20} /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</p>
                                                    <p className="font-bold text-dark-text">{selectedBooking?.patientName || user?.name || 'Patient'}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400">Relation: {selectedBooking?.patientRelation || 'Self'} • Age: {selectedBooking?.patientAge || 'N/A'}Y</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-medical-green pl-4">Lab & Schedule</h3>
                                        <div className="space-y-4">
                                            <p className="text-sm font-bold text-dark-text">{selectedBooking?.lab || 'OxyCare Partner Lab'}</p>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><Calendar size={14} className="text-medical-green" /> {selectedBooking?.date || 'N/A'}</div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><Clock size={14} className="text-medical-green" /> {selectedBooking?.time || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Collection Address</h3>
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-4">
                                        <MapPin size={20} className="text-medical-green shrink-0 mt-1" />
                                        <p className="text-sm font-bold text-gray-600 leading-relaxed">
                                            {typeof selectedBooking?.address === 'object' && selectedBooking?.address !== null
                                                ? ([selectedBooking.address.houseNo, selectedBooking.address.area, selectedBooking.address.landmark, selectedBooking.address.city].filter(p => p && p !== 'N/A').join(', ') || selectedBooking.address.address || 'Standard Pickup Address')
                                                : String(selectedBooking?.address || 'Standard Pickup Address')}
                                        </p>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                {(selectedBooking.reportUrl || selectedBooking.billUrl) && (
                                    <div className="space-y-4 pt-6 border-t border-gray-100">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-medical-green pl-4">Booking Documents</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedBooking.billUrl && (
                                                <div 
                                                    onClick={() => handleDownloadInvoice(selectedBooking)}
                                                    className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-dark-text shadow-sm transition-transform group-hover:scale-110">
                                                            <Receipt size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Billing</p>
                                                            <p className="font-bold text-dark-text text-sm">Download Invoice</p>
                                                        </div>
                                                    </div>
                                                    <Download size={18} className="text-gray-400" />
                                                </div>
                                            )}
                                            {selectedBooking.reportUrl && (
                                                <div 
                                                    onClick={() => handleDownloadReport(selectedBooking)}
                                                    className="p-6 bg-medical-green/5 border border-medical-green/10 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-medical-green/10 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-medical-green shadow-sm transition-transform group-hover:scale-110">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-medical-green uppercase tracking-widest">Medical</p>
                                                            <p className="font-bold text-dark-text text-sm">Download Report</p>
                                                        </div>
                                                    </div>
                                                    <Download size={18} className="text-medical-green" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            {selectedBooking.status !== 'Completed' && selectedBooking.status !== 'Cancelled' && (
                                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                                    <Button onClick={() => handleCancel(selectedBooking.id)} className="w-full h-14 bg-red-600 text-white hover:bg-red-700 gap-2"><X size={18} /> Cancel Booking</Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBookings;
