import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, FlaskConical, Package, Clock, ShoppingCart, Plus, ChevronRight, Zap } from 'lucide-react';
import Button from './Button';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

const popularTests = [
    { id: 1, name: 'Full Body Checkup', price: '₹1,999', lab: 'OxyCare Premium', time: '24h', type: 'Package' },
    { id: 2, name: 'Diabetes Screen', price: '₹499', lab: 'Hitech Labs', time: '12h', type: 'Test' },
    { id: 3, name: 'CBC (Hemogram)', price: '₹299', lab: 'Apollo 24/7', time: '8h', type: 'Test' },
    { id: 4, name: 'Lipid Profile', price: '₹699', lab: 'Thyrocare', time: '18h', type: 'Test' },
];

const categories = [
    { name: 'Fever', icon: Zap },
    { name: 'Diabetes', icon: FlaskConical },
    { name: 'Heart', icon: Package },
    { name: 'Kidney', icon: FlaskConical },
    { name: 'Full Body', icon: Package },
];

const SearchOverlay = ({ isOpen, onClose, initialQuery = '' }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState(initialQuery);
    const { addToCart } = useCart();
    const { packages, tests } = useData();



    const results = React.useMemo(() => {
        if (query.trim().length === 0) return [];
        
        const lowerQuery = query.toLowerCase().trim();
        
        // Search in Packages
        const filteredPackages = (packages || []).filter(p => {
            if (!p) return false;
            const name = p?.name || p?.packageName || '';
            const category = p?.category || '';
            const desc = p?.desc || p?.description || '';
            const lab = p?.labName || p?.lab || '';
            const params = (p?.parameters || [])
                .map(pr => {
                    if (!pr) return '';
                    return typeof pr === 'object' ? (pr.name || pr.groupName || '') : pr;
                })
                .join(' ');
            
            return name.toLowerCase().includes(lowerQuery) || 
                   category.toLowerCase().includes(lowerQuery) ||
                   desc.toLowerCase().includes(lowerQuery) ||
                   lab.toLowerCase().includes(lowerQuery) ||
                   params.toLowerCase().includes(lowerQuery);
        }).map(p => {
            if (!p) return null;
            return {
                id: p.id,
                name: p.name || p.packageName,
                price: p.price ? (String(p.price).startsWith('₹') ? p.price : `₹${p.price}`) : '₹0',
                lab: p.labName || p.lab || 'OxyCare Premium',
                time: p.tat || '24h',
                type: 'Package',
                raw: p
            }
        }).filter(Boolean);

        // Search in Tests
        const filteredTests = (tests || []).filter(t => {
            if (!t) return false;
            const name = t?.testName || t?.name || t?.test || '';
            const lab = t?.lab || t?.labName || '';
            const category = t?.category || '';
            
            return name.toLowerCase().includes(lowerQuery) ||
                   lab.toLowerCase().includes(lowerQuery) ||
                   category.toLowerCase().includes(lowerQuery);
        }).map(t => {
            if (!t) return null;
            return {
                id: t.id || t.testName || t.name,
                name: t.testName || t.test || t.name,
                price: t.price ? `₹${t.price}` : '₹499',
                lab: t.lab || t.labName || 'OxyCare Partner',
                time: t.tat || '12h',
                type: 'Test',
                raw: t
            }
        }).filter(Boolean);

        return [...filteredPackages, ...filteredTests];
    }, [query, packages, tests]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-white z-[2000] flex flex-col pt-24"
                >
                    {/* Header Area */}
                    <div className="max-w-4xl mx-auto w-full px-6 pt-4 md:pt-0">
                        <div className="flex items-center justify-between mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-4xl font-black text-dark-text tracking-tight">Search Lab Tests</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 md:w-14 md:h-14 bg-gray-100 rounded-full flex items-center justify-center text-dark-text hover:bg-red-50 hover:text-red-500 transition-all group"
                            >
                                <X size={20} className="md:size-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Large Search Bar */}
                        <div className="relative mb-8 md:mb-16">
                            <div className={`absolute inset-0 bg-medical-green/5 blur-3xl transition-opacity duration-500 ${query ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="relative glass-morphism p-1.5 md:p-2 rounded-[24px] md:rounded-[32px] flex items-center shadow-[0_20px_40px_-10px_rgba(25,185,145,0.1)] border border-white group focus-within:ring-8 focus-within:ring-medical-green/5 transition-all">
                                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-medical-green">
                                    <Search size={24} className="md:size-8" />
                                </div>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Type symptoms or tests..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="bg-transparent flex-1 text-lg md:text-2xl font-bold p-2 md:p-4 outline-none placeholder:text-gray-300 text-dark-text"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="p-3 md:p-4 text-gray-400 hover:text-dark-text"
                                    >
                                        <X size={20} className="md:size-6" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {/* Left Column: Quick Actions & Categories */}
                            <div className="md:col-span-1 space-y-12">
                                <div>
                                    <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Popular Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => setQuery(cat.name)}
                                                className="px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 hover:bg-medical-green hover:text-white rounded-xl md:rounded-2xl text-[13px] md:text-sm font-bold transition-all flex items-center gap-2 border border-gray-100 shadow-sm"
                                            >
                                                <cat.icon size={14} className="md:size-4" /> {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-soft-green/30 rounded-[32px] border border-medical-green/10">
                                    <div className="flex items-center gap-4 mb-4 text-medical-green">
                                        <FlaskConical size={24} />
                                        <h4 className="font-black text-dark-text">Need Help?</h4>
                                    </div>
                                    <p className="text-sm font-medium text-grey-text leading-relaxed mb-6">
                                        Our health experts can help you choose the right tests based on your symptoms.
                                    </p>
                                    <Button variant="outline" className="w-full text-xs py-3 border-medical-green/20 text-medical-green hover:bg-medical-green hover:text-white">
                                        Talk to Expert
                                    </Button>
                                </div>
                            </div>

                            {/* Middle/Right Column: Results */}
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                        {query ? `Results for "${query}"` : 'Quick Pick Tests'}
                                    </h3>
                                    <TrendingUp size={16} className="text-medical-green" />
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                    {(query ? results : popularTests).map((test) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={test.id}
                                            onClick={() => {
                                                navigate(`/item-details/${test.id}`);
                                                onClose();
                                            }}
                                            className="group p-6 bg-gray-50 hover:bg-white rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] transition-all flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${test.type === 'Package' ? 'bg-amber-100 text-amber-600' : 'bg-medical-green/10 text-medical-green'}`}>
                                                    {test.type === 'Package' ? <Package size={24} /> : <FlaskConical size={24} />}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{test.type}</p>
                                                    <h4 className="text-xl font-black text-dark-text group-hover:text-medical-green transition-colors">{test.name}</h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <Clock size={12} /> Reports in {test.time}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-medical-green uppercase tracking-widest bg-medical-green/5 px-2 py-0.5 rounded-md">
                                                            Verified Lab
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts from</p>
                                                    <p className="text-xl font-black text-dark-text">{test.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(test)}
                                                    className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-medical-green hover:bg-medical-green hover:text-white hover:scale-110 transition-all"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {query && results.length === 0 && (
                                        <div className="py-20 text-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto">
                                                <Search size={40} />
                                            </div>
                                            <p className="text-lg font-bold text-gray-400">No tests found matching your search</p>
                                            <Button 
                                                onClick={() => {
                                                    navigate(`/book-test?q=${query}`);
                                                    onClose();
                                                }}
                                                variant="outline" 
                                                className="text-xs"
                                            >
                                                Browse all tests
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {!query && (
                                    <button 
                                        onClick={() => {
                                            navigate('/book-test');
                                            onClose();
                                        }}
                                        className="w-full mt-6 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-medical-green/40 hover:text-medical-green transition-all"
                                    >
                                        View All 1500+ Tests <ChevronRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
