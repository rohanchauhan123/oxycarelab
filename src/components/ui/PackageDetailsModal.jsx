import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Circle,
    FlaskConical,
    ShieldCheck,
    X,
    Clock,
    Utensils,
    TestTube2
} from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import { useCart } from '../../context/CartContext';

const PackageDetailsModal = ({ isOpen, onClose, pkg }) => {
    const { addToCart, cart } = useCart();
    const [expandedGroup, setExpandedGroup] = useState(null);

    if (!isOpen || !pkg) return null;

    const isInCart = cart.find(i => i.id === pkg.id);

    // Grouping logic for parameters
    // Format: param object could just be a flat list, but user wants grouped accordion
    // Here we try to group by 'category' or provide a default grouped view if it's flat

    const renderParameters = () => {
        if (!pkg.parameters || pkg.parameters.length === 0) {
            return (
                <div className="py-12 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-4">
                    <FlaskConical size={40} className="text-gray-300 mx-auto" />
                    <div>
                        <p className="text-dark-text font-bold">Standard Parameters Included</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            This package includes {pkg.tests || 'various'} specialized tests.
                        </p>
                    </div>
                </div>
            );
        }

        let groupedParams = [];
        const paramsArray = Array.isArray(pkg.parameters) ? pkg.parameters : [];

        // Check for 'groupName' or 'testName' field for grouping
        const groupsMap = paramsArray.reduce((acc, curr) => {
            const groupKey = curr.groupName || curr.testName || 'Included Parameters';
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(curr);
            return acc;
        }, {});

        groupedParams = Object.keys(groupsMap).map((key, index) => ({
            id: index,
            name: key,
            items: groupsMap[key]
        }));

        // Default expand first group if not set
        if (expandedGroup === null && groupedParams.length > 0) {
            setExpandedGroup(0);
        }

        return (
            <div className="space-y-4">
                {groupedParams.map((group, index) => {
                    const isExpanded = expandedGroup === index;

                    return (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <button
                                onClick={() => setExpandedGroup(isExpanded ? null : index)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-dark-text">
                                        {index + 1}. {group.name}
                                    </span>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-medical-green text-white rotate-180' : 'bg-white border border-gray-200 text-gray-400 font-bold hover:bg-gray-100 hover:text-dark-text'}`}>
                                    <ChevronDown size={18} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-gray-100"
                                    >
                                        <div className="p-4 space-y-3 bg-white">
                                            {group.items.map((param, pIndex) => {
                                                const paramName = typeof param === 'object' ? param.name : param;
                                                const paramDetail = typeof param === 'object' && param.unit ? ` (${param.range} ${param.unit})` : '';
                                                return (
                                                    <div key={pIndex} className="flex items-center gap-3 px-2">
                                                        <Circle size={8} fill="currentColor" className="text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {paramName}{paramDetail}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-dark-text/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 pb-6 border-b border-gray-100 flex-shrink-0 relative overflow-hidden bg-gray-50/50">
                            {/* Decorative Blur */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-medical-green/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="pr-8">
                                    {pkg.tag && (
                                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-medical-green/10 text-medical-green text-[10px] font-black uppercase tracking-widest">
                                            {pkg.tag}
                                        </div>
                                    )}
                                    <h2 className="text-2xl md:text-3xl font-black text-dark-text tracking-tight mb-2">
                                        {pkg.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-medical-green font-bold text-sm bg-soft-green py-1.5 px-3 rounded-xl inline-flex shadow-sm">
                                        <ShieldCheck size={16} />
                                        <span>Total Tests Included ({pkg.testsCount || pkg.tests || '0'})</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-dark-text transition-all shadow-sm flex-shrink-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                    Clinical Info
                                </h3>
                                {pkg.labName && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <FlaskConical size={12} />
                                        Lab: {pkg.labName}
                                    </div>
                                )}
                            </div>

                            {/* Clinical Details Section - Moved Up for Visibility */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-white">
                                    <div className="w-10 h-10 bg-medical-green/10 rounded-xl flex items-center justify-center mb-2 text-medical-green">
                                        <Utensils size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fasting</span>
                                    <strong className="text-xs font-black text-dark-text">{pkg.fasting !== false ? 'Required' : 'Not Required'}</strong>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-white">
                                    <div className="w-10 h-10 bg-medical-green/10 rounded-xl flex items-center justify-center mb-2 text-medical-green">
                                        <Clock size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TAT</span>
                                    <strong className="text-xs font-black text-dark-text">{pkg.tat || '24 Hours'}</strong>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-white">
                                    <div className="w-10 h-10 bg-medical-green/10 rounded-xl flex items-center justify-center mb-2 text-medical-green">
                                        <TestTube2 size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sample</span>
                                    <strong className="text-xs font-black text-dark-text">{pkg.sampleType || 'Blood'}</strong>
                                </div>
                                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-white">
                                    <div className="w-10 h-10 bg-medical-green/10 rounded-xl flex items-center justify-center mb-2 text-medical-green">
                                        <FileText size={20} />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Method</span>
                                    <strong className="text-xs font-black text-dark-text">{pkg.testMethod || 'EIA/CLIA'}</strong>
                                </div>
                            </div>

                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                                Parameters Details
                            </h3>
                            {renderParameters()}

                            {pkg.desc && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                                        Package Description
                                    </h3>
                                    <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        {pkg.desc}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer for action */}
                        <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0 z-10 relative">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    Package Price
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-black text-dark-text leading-none">
                                        ₹{pkg.price}
                                    </span>
                                    {pkg.originalPrice && (
                                        <span className="text-sm font-bold text-gray-400 line-through">
                                            ₹{pkg.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    if (!isInCart) {
                                        addToCart({ 
                                            ...pkg, 
                                            name: pkg.name || pkg.testName || pkg.test || 'Diagnostic Package',
                                            price: typeof pkg.price === 'string' && pkg.price.includes('₹') ? pkg.price : `₹${pkg.price}` 
                                        });
                                    }
                                    onClose(); // Optional: Close modal after adding
                                }}
                                className={`h-14 px-10 rounded-2xl font-black uppercase tracking-widest w-full md:w-auto shadow-xl transition-all duration-300 ${isInCart
                                    ? 'bg-soft-green text-medical-green shadow-none border border-medical-green/20 cursor-default hover:bg-soft-green hover:text-medical-green'
                                    : 'bg-medical-green shadow-medical-green/20 hover:bg-medical-green-hover hover:shadow-medical-green/40 text-white hover:scale-105'
                                    }`}
                            >
                                {isInCart ? "Added to Cart" : "Book Now"}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PackageDetailsModal;
