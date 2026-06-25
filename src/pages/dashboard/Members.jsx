import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import {
    UserCheck,
    Heart,
    Contact2,
    Baby,
    Users,
    UserPlus,
    Trash2,
    ChevronRight,
    Plus,
    X,
    UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FamilyMembers = () => {
    const { members, deleteMember, addMember, updateMember } = useData();
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', relation: 'Self', age: '', gender: 'Male' });

    const handleAdd = async (e) => {
        e.preventDefault();
        await addMember(formData, user?.id);
        setIsAdding(false);
        setFormData({ name: '', relation: 'Self', age: '', gender: 'Male' });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateMember(editingMember.id, formData);
        setEditingMember(null);
        setFormData({ name: '', relation: 'Self', age: '', gender: 'Male' });
    };

    const startEditing = (member) => {
        setEditingMember(member);
        setFormData({ name: member.name, relation: member.relation, age: member.age, gender: member.gender });
        setIsAdding(false);
    };

    const fetchFromProfile = () => {
        if (user) {
            setFormData({
                name: user.name,
                relation: 'Self',
                age: user.age || '',
                gender: user.gender || 'Male'
            });
        }
    };

    const getIcon = (relation) => {
        switch (relation) {
            case 'Self': return UserCheck;
            case 'Mother': return Heart;
            case 'Father': return Contact2;
            case 'Child': return Baby;
            default: return Users;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Family Members</h1>
                    <p className="text-gray-400 font-bold">Manage medical records for your loved ones.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="h-12 bg-dark-text hover:bg-black gap-2"
                >
                    <Plus size={18} /> Add Member
                </Button>
            </div>

            {(isAdding || editingMember) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[40px] border border-medical-green/20 shadow-xl shadow-medical-green/5 space-y-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black text-dark-text">{editingMember ? 'Edit Member' : 'New Family Member'}</h3>
                        <div className="flex items-center gap-3">
                            {!editingMember && (
                                <button
                                    type="button"
                                    onClick={fetchFromProfile}
                                    className="flex items-center gap-2 px-4 py-2 bg-soft-green text-medical-green rounded-xl font-bold text-xs hover:bg-medical-green hover:text-white transition-all"
                                >
                                    <UserCircle size={16} /> Fetch from Profile
                                </button>
                            )}
                            <button onClick={() => { setIsAdding(false); setEditingMember(null); }} className="text-gray-300 hover:text-red-500 transition-colors p-2"><X size={20} /></button>
                        </div>
                    </div>
                    <form onSubmit={editingMember ? handleUpdate : handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-4">Full Name</label>
                            <input
                                type="text" placeholder="Full Name" required
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-4">Relation</label>
                            <select
                                value={formData.relation} onChange={e => setFormData({ ...formData, relation: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                            >
                                <option>Self</option>
                                <option>Father</option>
                                <option>Mother</option>
                                <option>Spouse</option>
                                <option>Child</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-4">Age</label>
                            <input
                                type="number" placeholder="Age" required
                                value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-4">&nbsp;</label>
                            <Button type="submit" className="bg-medical-green hover:bg-emerald-600 h-[60px] w-full shadow-lg shadow-medical-green/20">
                                {editingMember ? 'Save Changes' : 'Add Member'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {(members || []).filter(m => m && m.userId === user?.id).length > 0 ? (
                    (members || []).filter(m => m && m.userId === user?.id).map((member) => (
                        <div key={member?.id || Math.random()} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group text-center relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-medical-green/10 rounded-b-full group-hover:h-32 group-hover:rounded-full group-hover:-mt-16 transition-all" />

                            <div className="relative z-10 flex flex-col items-center">
                                <button
                                    onClick={() => deleteMember(member?.id)}
                                    className="absolute -top-4 -right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-medical-green mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                    {React.createElement(getIcon(member?.relation), { size: 40 })}
                                </div>
                                <h3 className="text-xl font-black text-dark-text mb-1 tracking-tight">{member?.name || 'Member'}</h3>
                                <p className="text-medical-green font-black text-[10px] uppercase tracking-widest mb-6">{member?.relation || 'Self'}</p>

                                <div className="w-full flex items-center justify-around bg-gray-50 py-4 rounded-2xl mb-8">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</p>
                                        <p className="text-base font-black text-dark-text">{member?.age || 'N/A'}</p>
                                    </div>
                                    <div className="w-[1px] h-6 bg-gray-200" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</p>
                                        <p className="text-base font-black text-dark-text">{member?.gender || 'N/A'}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => startEditing(member)}
                                    className="flex items-center gap-2 text-[10px] font-black text-dark-text uppercase tracking-widest group/btn hover:text-medical-green transition-colors"
                                >
                                    Edit Profile <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
                        <Users size={48} className="text-gray-100 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Members Added</h3>
                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Add your family members to manage their health records.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyMembers;
