import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Camera,
    ShieldCheck,
    Calendar,
    ChevronRight,
    Save
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext path

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dob: user?.dob || ''
    });
    const [, setIsEditing] = useState(false);

    // Effect to update formData if user object changes (e.g., after initial load or external update)
    React.useEffect(() => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            gender: user?.gender || '',
            dob: user?.dob || ''
        });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await updateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Account Settings</h1>
                    <p className="text-gray-400 font-bold">Manage your personal information and security.</p>
                </div>
                <Button
                    className="h-12 bg-medical-green hover:bg-medical-green-hover gap-2"
                    onClick={handleSave}
                >
                    <Save size={18} /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Photo */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-gray-50 shadow-xl group cursor-pointer relative bg-gray-50">
                            {(user?.avatar && !user.avatar.includes('pravatar.cc') && !user.avatar.includes('liara.run') && !user.avatar.includes('seed=Sara') && !user.avatar.includes('seed=Dylan')) ? (
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : user?.gender?.toLowerCase() === 'female' ? (
                                <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=Sasha" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=Oliver" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-dark-text tracking-tight mb-2">{user?.name}</h3>
                    <p className="text-gray-400 font-bold text-sm mb-6">Joined {user?.joined || 'Recently'}</p>
                    <div className="w-full pt-6 border-t border-gray-50 space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</span>
                            <span className="flex items-center gap-1.6 text-[10px] font-black text-medical-green uppercase tracking-widest">
                                <ShieldCheck size={12} /> Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 font-bold text-dark-text"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 font-bold text-dark-text"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 font-bold text-dark-text"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-medical-green/20 font-bold text-dark-text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-dark-text tracking-tight uppercase tracking-widest text-xs mb-1">Security Settings</h4>
                                <p className="text-gray-500 font-bold text-sm">Update your password or enable Two-Factor Authentication.</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-dark-text transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
