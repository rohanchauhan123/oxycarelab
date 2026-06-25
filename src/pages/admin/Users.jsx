import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import {
    Filter,
    UserPlus,
    Users,
    ShieldCheck,
    Mail,
    Phone,
    Calendar,
    Trash2,
    MoreVertical,
    Search,
    X,
    FolderHeart,
    Package,
    MapPin as MapPinIcon,
    ChevronRight,
    Eye,
    Activity,
    PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
    const { users, addUser, updateUser, deleteUser, bookings, members } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        role: 'Customer',
        status: 'Active'
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        addUser({
            ...newUser,
            joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            avatar: `https://api.dicebear.com/7.x/big-smile/svg?seed=${newUser.name}`
        });
        setIsAddingUser(false);
        setNewUser({ name: '', email: '', phone: '', age: '', gender: 'Male', role: 'Customer', status: 'Active' });
    };

    const handleStatusUpdate = (id, newStatus) => {
        updateUser(id, { status: newStatus });
    };

    const filteredUsers = (users || []).filter(user => {
        if (!user) return false;
        const search = searchTerm.toLowerCase();
        const userName = String(user.name || '').toLowerCase();
        const userEmail = String(user.email || '').toLowerCase();
        const userPhone = String(user.phone || '').toLowerCase();
        
        return userName.includes(search) || userEmail.includes(search) || userPhone.includes(search);
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">User Management</h1>
                    <p className="text-grey-text">Manage accounts, roles, and administrative access.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 md:w-80 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find user by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm"
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-gray-200"><Filter size={18} /> Filters</Button>
                    <Button
                        onClick={() => setIsAddingUser(true)}
                        className="h-12 bg-medical-green hover:bg-emerald-600 gap-2"
                    >
                        <UserPlus size={18} /> Add New User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: (users || []).length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Admins', value: (users || []).filter(u => String(u?.role || '').toLowerCase().includes('admin')).length, icon: ShieldCheck, color: 'text-medical-green bg-soft-green' },
                    { label: 'Customers', value: (users || []).filter(u => u?.role === 'Customer').length, icon: Users, color: 'text-brand-teal bg-teal-50' },
                    { label: 'Active', value: (users || []).filter(u => u?.status === 'Active').length, icon: UserPlus, color: 'text-purple-600 bg-purple-50' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-dark-text">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 text-left text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">
                            <th className="px-8 py-6">User Profile</th>
                            <th className="px-8 py-6">Age / Gender</th>
                            <th className="px-8 py-6">Role</th>
                            <th className="px-8 py-6">Joined Date</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden ring-4 ring-gray-50">
                                                <img src={user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} alt="" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-dark-text tracking-tight">{user.name}</p>
                                                <div className="flex items-center gap-3 text-[10px] text-grey-text font-semibold uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                                                    <span className="flex items-center gap-1"><Phone size={10} /> {user.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-dark-text">{user.age || 'N/A'} Yrs</p>
                                            <p className="text-[10px] text-grey-text font-black uppercase tracking-widest">{user.gender || 'Not Set'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-dark-text bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-grey-text font-medium italic">
                                        <div className="flex items-center gap-2"><Calendar size={14} /> {user.joined || 'Joined Recently'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-medical-green' : user.status === 'Pending' ? 'text-amber-500' : 'text-red-400'}`}>
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-medical-green' : user.status === 'Pending' ? 'bg-amber-500' : 'bg-red-400'}`} />
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-gray-400 hover:text-medical-green transition-colors"
                                                title="View Full Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {user.status === 'Pending' || user.status === 'Inactive' ? (
                                                <button
                                                    onClick={() => handleStatusUpdate(user.id, 'Active')}
                                                    className="px-3 py-1 bg-medical-green/10 text-medical-green rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-medical-green hover:text-white transition-all"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusUpdate(user.id, 'Inactive')}
                                                    className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300 mb-4">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Users Found</h3>
                                    <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Try a different search term or filter.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm overflow-hidden ring-4 ring-white">
                                        <img src={selectedUser.avatar || `https://i.pravatar.cc/100?u=${selectedUser.email}`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-dark-text tracking-tight">{selectedUser.name}</h2>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{selectedUser.role} • Joined {selectedUser.joined || 'Recently'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all shadow-sm"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                {/* Basic Info & Status */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Contact Details</p>
                                        <div className="space-y-3">
                                            <p className="flex items-center gap-3 text-sm font-bold text-dark-text"><Mail size={16} className="text-medical-green" /> {selectedUser.email}</p>
                                            <p className="flex items-center gap-3 text-sm font-bold text-dark-text"><Phone size={16} className="text-medical-green" /> {selectedUser.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Profile Stats</p>
                                        <div className="space-y-3">
                                            <p className="text-sm font-bold text-dark-text">Age: <span className="text-gray-500 ml-2">{selectedUser.age || 'N/A'} Yrs</span></p>
                                            <p className="text-sm font-bold text-dark-text">Gender: <span className="text-gray-500 ml-2">{selectedUser.gender || 'N/A'}</span></p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Account Status</p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedUser.status === 'Active' ? 'bg-medical-green' : 'bg-red-400'}`} />
                                            <span className={`text-sm font-black uppercase tracking-widest ${selectedUser.status === 'Active' ? 'text-medical-green' : 'text-red-400'}`}>{selectedUser.status || 'Active'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Family Members Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-soft-green text-medical-green rounded-xl flex items-center justify-center">
                                            <FolderHeart size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-dark-text tracking-tight">Family Members ({members.filter(m => m.userId === selectedUser.id).length})</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {members.filter(m => m.userId === selectedUser.id).length > 0 ? (
                                            members.filter(m => m.userId === selectedUser.id).map(member => (
                                                <div key={member.id} className="p-5 bg-white border border-gray-100 rounded-3xl flex items-center justify-between hover:border-medical-green/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-medical-green font-black">
                                                            {String(member?.name || '?').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-dark-text">{member.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.relation} • {member.age} Yrs</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] bg-gray-50 px-3 py-1 rounded-full font-black text-gray-400 uppercase tracking-widest">{member.gender}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 font-bold italic py-4">No family members added yet.</p>
                                        )}
                                    </div>
                                </section>

                                {/* Booking History Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                            <Package size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-dark-text tracking-tight">Booking History ({bookings.filter(b => b.userId === selectedUser.id).length})</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {bookings.filter(b => b.userId === selectedUser.id).length > 0 ? (
                                            bookings.filter(b => b.userId === selectedUser.id).map(booking => (
                                                <div key={booking.id} className="p-6 bg-white border border-gray-100 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-medical-green">
                                                            <Activity size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{booking.id}</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${booking.status === 'Completed' ? 'bg-medical-green/10 text-medical-green' : 'bg-amber-100 text-amber-600'}`}>{booking.status}</span>
                                                            </div>
                                                            <p className="font-black text-dark-text text-lg">{booking.test}</p>
                                                            <p className="text-gray-400 font-bold text-xs">{booking.lab || 'OxyCare Lab'} • {booking.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:justify-end gap-10">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                                            <p className="text-xl font-black text-dark-text">₹{booking.total?.toLocaleString('en-IN')}</p>
                                                        </div>
                                                        <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-medical-green transition-all">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 font-bold italic py-4">No bookings found for this user.</p>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
                                <Button variant="outline" onClick={() => setSelectedUser(null)} className="h-12 border-gray-200">Close Details</Button>
                                <Button className="h-12 bg-dark-text hover:bg-black text-white">Edit User Profile</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add User Modal */}
            <AnimatePresence>
                {isAddingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingUser(false)}
                            className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-dark-text">Register New User</h2>
                                <button onClick={() => setIsAddingUser(false)} className="p-2 text-gray-400 hover:text-red-500"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddUser} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                        <input
                                            type="text" required
                                            value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                        <input
                                            type="email" required
                                            value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                                        <input
                                            type="tel" required
                                            value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                            placeholder="+91 9999988888"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Age</label>
                                        <input
                                            type="number"
                                            value={newUser.age} onChange={e => setNewUser({ ...newUser, age: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                            placeholder="25"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Gender</label>
                                        <select
                                            value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Role</label>
                                        <select
                                            value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20"
                                        >
                                            <option>Customer</option>
                                            <option>Admin</option>
                                            <option>Lab Staff</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)} className="flex-1 h-14 border-gray-100">Cancel</Button>
                                    <Button type="submit" className="flex-1 h-14 bg-medical-green text-white shadow-lg shadow-medical-green/20">Create Account</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
