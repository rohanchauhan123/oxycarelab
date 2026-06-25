import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Plus,
    MoreVertical,
    Home,
    Briefcase,
    Navigation,
    Star,
    Trash2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const MyAddresses = () => {
    const { addresses, deleteAddress, addAddress } = useData();
    const { reverseGeocode } = useLocation();
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [formData, setFormData] = useState({ type: 'Home', address: '', phone: '', tag: 'Secondary' });

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const fullAddress = await reverseGeocode(latitude, longitude);

                if (fullAddress) {
                    setFormData(prev => ({
                        ...prev,
                        address: fullAddress
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        address: `Located at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    }));
                }
                setIsFetchingLocation(false);
            },
            (error) => {
                alert("Unable to retrieve your location: " + error.message);
                setIsFetchingLocation(false);
            }
        );
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        await addAddress(formData, user?.id);
        setIsAdding(false);
        setFormData({ type: 'Home', address: '', phone: '', tag: 'Secondary' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Home': return Home;
            case 'Office': return Briefcase;
            default: return MapPin;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">My Addresses</h1>
                    <p className="text-gray-400 font-bold">Manage locations for home sample collection.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="h-12 bg-medical-green hover:bg-medical-green-hover gap-2"
                >
                    <Plus size={18} /> Add New Address
                </Button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[40px] border border-medical-green/20 shadow-xl space-y-6"
                >
                    <h3 className="text-xl font-black text-dark-text">Add New Address</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                            >
                                <option>Home</option>
                                <option>Office</option>
                                <option>Other</option>
                            </select>
                            <input
                                type="tel" placeholder="Contact Phone" required
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20"
                            />
                        </div>
                        <div className="relative">
                            <textarea
                                placeholder="Complete Address (Flat No, Building, Street)" required
                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-16 font-bold text-dark-text outline-none focus:ring-2 focus:ring-medical-green/20 min-h-[140px]"
                            ></textarea>
                            <button
                                type="button"
                                onClick={fetchLocation}
                                disabled={isFetchingLocation}
                                className={`absolute right-4 top-4 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center gap-2 transition-all hover:border-medical-green ${isFetchingLocation ? 'animate-pulse text-medical-green' : 'text-gray-400'}`}
                                title="Fetch Current Location"
                            >
                                <Navigation size={16} fill={isFetchingLocation ? "currentColor" : "none"} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {isFetchingLocation ? 'Fetching...' : 'Use GPS'}
                                </span>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1">Cancel</Button>
                            <Button type="submit" className="bg-medical-green hover:bg-emerald-600 flex-1">Save Address</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(addresses || []).filter(addr => addr && addr.userId === user?.id).map((addr) => (
                    <div key={addr?.id || Math.random()} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-medical-green shadow-inner group-hover:bg-medical-green/10 transition-colors">
                                {React.createElement(getIcon(addr?.type), { size: 32 })}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => deleteAddress(addr?.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button className="p-2 text-gray-300 hover:text-dark-text hover:bg-gray-50 rounded-xl transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-dark-text tracking-tight">{addr?.type || 'Address'}</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${addr?.tag === 'Default' ? 'bg-medical-green/10 text-medical-green' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {addr?.tag || 'Secondary'}
                                </span>
                            </div>
                            <p className="text-gray-500 font-bold text-sm leading-relaxed">{addr?.address || 'No address provided'}</p>
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-black text-dark-text uppercase tracking-widest">
                                    <Navigation size={14} className="text-medical-green" /> Directions
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Contact: <span className="text-dark-text">{addr?.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center p-12 hover:border-medical-green/30 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm group-hover:text-medical-green transition-colors mb-4">
                        <Plus size={32} />
                    </div>
                    <p className="text-center text-gray-400 font-black text-sm uppercase tracking-widest">Add a new collection address</p>
                </div>
            </div>
        </div>
    );
};

export default MyAddresses;
