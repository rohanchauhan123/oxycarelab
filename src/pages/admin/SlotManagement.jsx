import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    Plus, 
    Trash2, 
    Save, 
    RotateCcw, 
    AlertCircle,
    CheckCircle2,
    CalendarDays
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const AdminSlotManagement = () => {
    const { slots, updateSlots } = useData();
    const [newSlot, setNewSlot] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const DEFAULT_SLOTS = [
        "06:30 AM to 07:30 AM",
        "07:30 AM to 08:30 AM",
        "08:30 AM to 09:30 AM",
        "09:30 AM to 10:30 AM",
        "10:30 AM to 11:30 AM",
        "11:30 AM to 12:30 PM",
        "12:30 PM to 01:30 PM",
        "01:30 PM to 02:30 PM",
        "02:30 PM to 03:30 PM"
    ];

    const handleAddSlot = () => {
        if (!newSlot.trim()) {
            setError('Please enter a valid time slot (e.g., 08:00 AM to 09:00 AM)');
            return;
        }

        if (slots.includes(newSlot)) {
            setError('This slot already exists');
            return;
        }

        const updated = [...slots, newSlot].sort((a, b) => {
            // Simple sort by time (AM/PM and hour)
            const parseTime = (s) => {
                const [time, period] = s.split(' to ')[0].split(' ');
                let [h, m] = time.split(':').map(Number);
                if (period === 'PM' && h !== 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                return h * 60 + m;
            };
            return parseTime(a) - parseTime(b);
        });

        updateSlots(updated);
        setNewSlot('');
        setError('');
        showSuccess();
    };

    const handleDeleteSlot = (slotToDelete) => {
        const updated = slots.filter(s => s !== slotToDelete);
        updateSlots(updated);
        showSuccess();
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all slots to default?')) {
            updateSlots(DEFAULT_SLOTS);
            showSuccess();
        }
    };

    const showSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-dark-text tracking-tight mb-2">Slot Management</h1>
                    <p className="text-gray-500 font-medium">Configure available time windows for home sample collection.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="h-12 px-6 border-red-100 text-red-500 hover:bg-red-50"
                    >
                        <RotateCcw size={18} className="mr-2" /> Reset to Defaults
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Slot Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-8">
                        <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-2xl flex items-center justify-center mb-6">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-xl font-black text-dark-text tracking-tight mb-4">Add New Slot</h2>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6 underline decoration-medical-green/30 underline-offset-4">Example: 08:00 AM to 09:00 AM</p>
                        
                        <div className="space-y-4">
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="HH:MM AM to HH:MM PM"
                                    value={newSlot}
                                    onChange={(e) => setNewSlot(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 font-bold text-dark-text"
                                />
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl"
                                >
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}

                            <Button 
                                onClick={handleAddSlot}
                                className="w-full h-14 bg-medical-green hover:bg-medical-green-hover text-white shadow-lg shadow-medical-green/20"
                            >
                                Add Time Slot
                            </Button>
                        </div>

                        <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <div className="flex gap-3">
                                <AlertCircle size={18} className="text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1">Important Note</p>
                                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                                        Ensure the format is exactly "HH:MM AM to HH:MM PM" for proper sorting and filtering on the checkout page.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Slots List */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-dark-text/5 text-dark-text rounded-2xl flex items-center justify-center">
                                    <CalendarDays size={24} />
                                </div>
                                <h2 className="text-xl font-black text-dark-text tracking-tight">Active Time Slots</h2>
                            </div>
                            <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                                {slots.length} Slots Defined
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {slots.map((slot) => (
                                    <motion.div 
                                        key={slot}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-medical-green/20 hover:bg-white hover:shadow-md transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-medical-green shadow-sm group-hover:scale-110 transition-transform">
                                                <Clock size={18} />
                                            </div>
                                            <span className="font-black text-dark-text tracking-tight">{slot}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteSlot(slot)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Slot"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {slots.length === 0 && (
                            <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 shadow-sm">
                                    <Clock size={32} />
                                </div>
                                <h3 className="text-lg font-black text-dark-text mb-2">No slots defined</h3>
                                <p className="text-gray-400 font-bold text-sm">Add your first time slot using the panel on the left.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[100] bg-dark-text text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10"
                    >
                        <div className="w-10 h-10 bg-medical-green rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-black tracking-tight leading-none mb-1 uppercase text-xs">Update Successful</p>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Changes are now live for users</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSlotManagement;
