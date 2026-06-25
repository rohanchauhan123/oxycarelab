import React, { useState } from 'react';
import {
    Search,
    Plus,
    MapPin,
    Star,
    Activity,
    FlaskConical,
    CheckCircle2,
    XCircle,
    Filter,
    Trash2,
    Edit,
    X,
    Check
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const Labs = () => {
    const { labs, addLab, updateLab, deleteLab } = useData();
    const [editingLab, setEditingLab] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newLab, setNewLab] = useState({
        name: '',
        location: '',
        address: '',
        timing: '8:00 AM - 8:00 PM',
        accreditation: 'NABL',
        rating: 4.5,
        activeTests: 0,
        status: 'Active'
    });
    const [editFormData, setEditFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddLab = (e) => {
        e.preventDefault();
        addLab({ ...newLab, id: Date.now() });
        setIsAdding(false);
        setNewLab({ name: '', location: '', address: '', timing: '8:00 AM - 8:00 PM', accreditation: 'NABL', rating: 4.5, activeTests: 0, status: 'Active' });
    };

    const handleEditClick = (lab) => {
        setEditingLab(lab);
        setEditFormData(lab);
        setIsEditing(true);
    };

    const handleUpdateLab = (e) => {
        e.preventDefault();
        if (editingLab?.id) {
            updateLab(editingLab.id, editFormData);
        }
        setIsEditing(false);
        setEditingLab(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Partner Labs</h1>
                    <p className="text-grey-text">Manage laboratory partnerships and quality accreditation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 border-gray-200">Accreditation Audit</Button>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="h-12 bg-medical-green hover:bg-medical-green-hover gap-2"
                    >
                        <Plus size={18} /> Add Partner Lab
                    </Button>
                </div>
            </div>

            {/* Add Lab Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-text/80 backdrop-blur-sm"
                            onClick={() => setIsAdding(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-black text-dark-text text-xl">Add New Partner Lab</h3>
                                <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-dark-text transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddLab} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lab Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newLab.name}
                                            onChange={(e) => setNewLab({ ...newLab, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            placeholder="Enter lab name..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                                            <input
                                                required
                                                type="text"
                                                value={newLab.location}
                                                onChange={(e) => setNewLab({ ...newLab, location: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                                placeholder="e.g. Gurugram, HR"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Timing</label>
                                            <input
                                                required
                                                type="text"
                                                value={newLab.timing}
                                                onChange={(e) => setNewLab({ ...newLab, timing: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                                placeholder="e.g. 8:00 AM - 8:00 PM"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Address</label>
                                        <textarea
                                            required
                                            value={newLab.address}
                                            onChange={(e) => setNewLab({ ...newLab, address: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold resize-none h-24"
                                            placeholder="Enter full address..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Accreditation</label>
                                            <input
                                                type="text"
                                                value={newLab.accreditation}
                                                onChange={(e) => setNewLab({ ...newLab, accreditation: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Active Tests</label>
                                            <input
                                                type="number"
                                                value={newLab.activeTests}
                                                onChange={(e) => setNewLab({ ...newLab, activeTests: parseInt(e.target.value) })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-medical-green">Add Lab</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Lab Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-text/80 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-black text-dark-text text-xl">Edit Partner Lab</h3>
                                <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:text-dark-text transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateLab} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lab Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            placeholder="Enter lab name..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                                            <input
                                                required
                                                type="text"
                                                value={editFormData.location}
                                                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                                placeholder="e.g. Gurugram, HR"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Timing</label>
                                            <input
                                                required
                                                type="text"
                                                value={editFormData.timing}
                                                onChange={(e) => setEditFormData({ ...editFormData, timing: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                                placeholder="e.g. 8:00 AM - 8:00 PM"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Address</label>
                                        <textarea
                                            required
                                            value={editFormData.address}
                                            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold resize-none h-24"
                                            placeholder="Enter full address..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Accreditation</label>
                                            <input
                                                type="text"
                                                value={editFormData.accreditation}
                                                onChange={(e) => setEditFormData({ ...editFormData, accreditation: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Active Tests</label>
                                            <input
                                                type="number"
                                                value={editFormData.activeTests}
                                                onChange={(e) => setEditFormData({ ...editFormData, activeTests: parseInt(e.target.value) })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-medical-green">Save Changes</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="relative w-full max-w-xs">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search labs..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-gray-200 gap-2">
                        <Filter size={18} /> Filter
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="px-8 py-4">Lab Name</th>
                                <th className="px-8 py-4">Location</th>
                                <th className="px-8 py-4">Accreditation</th>
                                <th className="px-8 py-4">Rating</th>
                                <th className="px-8 py-4">Active Tests</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(labs || []).filter(lab => {
                                if (!lab) return false;
                                const search = searchTerm.toLowerCase();
                                return (lab.name?.toLowerCase() || '').includes(search) ||
                                       (lab.location?.toLowerCase() || '').includes(search);
                            }).length > 0 ? (
                                (labs || []).filter(lab => {
                                    if (!lab) return false;
                                    const search = searchTerm.toLowerCase();
                                    const name = String(lab.name || '').toLowerCase();
                                    const loc = String(lab.location || '').toLowerCase();
                                    return name.includes(search) || loc.includes(search);
                                }).map((lab) => (
                                    <tr key={lab?.id || Math.random()} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-8 py-6 font-bold text-dark-text">{lab?.name || 'Unnamed Lab'}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-grey-text">
                                                <MapPin size={14} /> {lab?.location || 'Location N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-gray-400">{lab?.accreditation || 'NABL'}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1 text-medical-green font-bold">
                                                <Star size={14} fill="currentColor" /> {lab?.rating || '0.0'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-dark-text">{lab?.activeTests || 0}</td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => {
                                                    if (!lab?.id) return;
                                                    const s = String(lab.status || '').toLowerCase();
                                                    updateLab(lab.id, { status: s === 'active' ? 'Inactive' : 'Active' });
                                                }}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${String(lab?.status || '').toLowerCase() === 'active' ? 'bg-medical-green/10 text-medical-green' : 'bg-red-50 text-red-400'
                                                    }`}>
                                                {lab?.status || 'Active'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(lab)}
                                                    className="p-2 text-gray-400 hover:text-medical-green transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (lab?.id && window.confirm(`Are you sure you want to delete "${lab.name}"? This action cannot be undone.`)) {
                                                            try {
                                                                await deleteLab(lab.id);
                                                            } catch (error) {
                                                                console.error("Lab deletion failed:", error);
                                                                alert("Failed to delete lab. Please try again.");
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete Lab"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <FlaskConical size={48} className="text-gray-200 mx-auto mb-4" />
                                        <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Labs Found</h3>
                                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Try a different search term or add a new partner lab.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Labs;
