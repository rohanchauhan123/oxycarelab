import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Navigation, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';

const LocationModal = ({ isOpen, onClose, currentLocation, onSelect }) => {
    const { serviceableCities } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredCities = React.useMemo(() => {
        return (serviceableCities || []).filter(city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.state.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, serviceableCities]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-soft-green rounded-2xl flex items-center justify-center text-medical-green shadow-inner">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-dark-text tracking-tight">Select Location</h2>
                                            <p className="text-xs font-bold text-grey-text uppercase tracking-widest">Sample collection from</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* All India Option */}
                                <button
                                    onClick={() => {
                                        onSelect('India');
                                        onClose();
                                    }}
                                    className={`w-full flex items-center justify-between p-5 mb-4 rounded-3xl transition-all group ${
                                        currentLocation === 'India'
                                            ? 'bg-medical-green/10 border border-medical-green/20'
                                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${
                                            currentLocation === 'India' ? 'bg-medical-green text-white' : 'bg-white text-medical-green'
                                        }`}>
                                            <MapPin size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-dark-text">All India</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show tests from all cities</p>
                                        </div>
                                    </div>
                                    {currentLocation === 'India' && (
                                        <div className="w-5 h-5 bg-medical-green rounded-full flex items-center justify-center text-white">
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>

                                {/* Detect Location Button */}
                                <button
                                    onClick={() => {
                                        onSelect('Current Location');
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-5 bg-medical-green/5 hover:bg-medical-green/10 border border-medical-green/10 rounded-3xl transition-all group mb-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-medical-green shadow-sm group-hover:scale-110 transition-transform">
                                            <Navigation size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-dark-text">Use current location</p>
                                            <p className="text-[10px] font-bold text-medical-green uppercase tracking-wider">Detection via GPS/Browser</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-medical-green/20 flex items-center justify-center text-medical-green group-hover:bg-medical-green group-hover:text-white transition-all">
                                        <Check size={14} />
                                    </div>
                                </button>

                                {/* Search Input */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for your city..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[24px] pl-14 pr-6 py-5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-medium text-dark-text"
                                    />
                                </div>
                            </div>

                            {/* City List */}
                            <div className="px-4 pb-8 max-h-[350px] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 gap-1 px-4">
                                    {filteredCities.length > 0 ? (
                                        filteredCities.map((city) => (
                                            <button
                                                key={city.name}
                                                onClick={() => {
                                                    onSelect(city.name);
                                                    onClose();
                                                }}
                                                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${currentLocation === city.name
                                                        ? 'bg-medical-green/10 border-medical-green/20'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <MapPin size={18} className={currentLocation === city.name ? 'text-medical-green' : 'text-gray-300'} />
                                                    <div className="text-left">
                                                        <p className={`text-sm font-black ${currentLocation === city.name ? 'text-medical-green' : 'text-dark-text'}`}>
                                                            {city.name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                                            {city.state}
                                                        </p>
                                                    </div>
                                                </div>
                                                {currentLocation === city.name && (
                                                    <div className="w-5 h-5 bg-medical-green rounded-full flex items-center justify-center text-white">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-10 text-center space-y-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
                                                <MapPin size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400">No cities found matching your search</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Serving 500+ Cities Across India
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LocationModal;
