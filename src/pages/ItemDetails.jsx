import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    ChevronRight,
    Clock,
    FlaskConical,
    TestTube2,
    Users,
    Calendar,
    Utensils,
    FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tests, packages } = useData();
    const { addToCart } = useCart();

    const item = useMemo(() => {
        let found = tests.find(t => t.id === id || t.id.toString() === id);
        if (!found) {
            found = packages.find(p => p.id === id || p.id.toString() === id);
        }
        
        if (found) {
            const status = (found.status || 'Active').toLowerCase();
            if (status === 'inactive' || status === 'disabled') return null;
        }
        
        return found;
    }, [id, tests, packages]);


    if (!item) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-black text-dark-text mb-2">Item not found</h2>
                <p className="text-gray-500 mb-6 font-medium">The test or package you are looking for does not exist.</p>
                <button
                    onClick={() => navigate('/book-test')}
                    className="px-6 py-3 bg-medical-green text-white font-black rounded-xl shadow-lg shadow-medical-green/20"
                >
                    Browse Tests
                </button>
            </div>
        );
    }

    const price = Number(item.price) || 0;
    const originalPrice = Number(item.originalPrice) || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Use real data from item
    const parameters = Array.isArray(item.parameters) ? item.parameters.length : (item.testsCount || item.tests || 0);
    const fastingValue = item.fasting !== undefined ? item.fasting : (item.desc?.toLowerCase().includes('fasting') || item.name?.toLowerCase().includes('fasting'));
    const isFasting = fastingValue ? 'Required' : 'Not Required';
    const tat = item.tat || item.reportTime || '24 Hours';
    const sampleType = item.sampleType || 'Blood/Urine';
    const bookedCount = item.bookedCount || 10.5;

    const handleAddToCart = () => {
        addToCart({
            ...item,
            id: item.id || Date.now(),
            name: item.testName || item.test || item.name || 'Diagnostic Test'
        });
    };

    return (
        <div className="pt-24 pb-32 bg-gray-50 min-h-screen selection:bg-medical-green/20">
            {/* Promo Banner */}
            <div className="bg-purple-100 text-purple-700 py-3 px-4 flex justify-center items-center gap-2 text-sm font-bold shadow-sm">
                <FlaskConical size={16} /> <span>Get your sample collected in the next 2 hours!</span>
            </div>

            <div className="container mx-auto max-w-2xl px-4 py-6">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-400 font-bold mb-4 flex items-center gap-1">
                    <span className="cursor-pointer hover:text-medical-green transition-colors" onClick={() => navigate('/')}>Home</span>
                    <span>/</span>
                    <span className="cursor-pointer hover:text-medical-green transition-colors" onClick={() => navigate('/book-test')}>Pathology</span>
                    <span>/</span>
                    <span className="text-gray-600 truncate max-w-[200px]">{item.testName || item.name || item.test || 'Diagnostic Test'}</span>
                </div>

                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-6 text-dark-text relative overflow-hidden shadow-md border border-gray-100"
                >
                    <div className="relative z-10 w-full flex flex-col items-center text-center">
                        <h1 className="text-2xl sm:text-3xl font-black mb-4 leading-tight max-w-lg">
                            {item.testName || item.name || item.test || 'Diagnostic Test'}
                        </h1>
                        <p className="text-gray-500 text-base font-medium mb-8">
                            Includes {parameters} Parameters
                        </p>

                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className="text-4xl font-black leading-none tracking-tight text-medical-green">₹{price}</span>
                            {discount > 0 && (
                                <div className="flex flex-col items-start">
                                    <span className="text-sm text-gray-400 line-through font-bold">₹{originalPrice}</span>
                                    <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-md">
                                        {discount}% Off
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="bg-medical-green hover:bg-medical-green-hover text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-medical-green/20 transition-all active:scale-95 group mb-8"
                        >
                            Add to Cart <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                            <Users size={16} /> <span>{bookedCount}k people booked this test</span>
                        </div>
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[32px] mt-6 p-6 md:p-8 shadow-sm border border-gray-100 relative z-20 -mt-8 mx-4 sm:mx-0"
                >
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-y-8 gap-x-8 text-sm font-medium text-gray-500">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center">
                                <Utensils size={20} className="text-medical-green" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Fasting</span>
                                <strong className="text-dark-text font-black text-base">{isFasting}</strong>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center">
                                <Clock size={20} className="text-medical-green" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">TAT</span>
                                <strong className="text-dark-text font-black text-base">{tat}</strong>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center">
                                <TestTube2 size={20} className="text-medical-green" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Sample</span>
                                <strong className="text-dark-text font-black text-base">{sampleType}</strong>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center">
                                <FileText size={20} className="text-medical-green" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Method</span>
                                <strong className="text-dark-text font-black text-base">{item.testMethod || 'EIA/CLIA'}</strong>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Description & Parameters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10 px-4 sm:px-0"
                >
                    <h3 className="font-black text-dark-text text-lg mb-6 leading-tight">
                        Included Clinical Parameters
                    </h3>

                    {item.desc && (
                        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-medical-green/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-2">Package Description</h4>
                            <p className="text-gray-600 leading-relaxed font-medium text-sm relative z-10">{item.desc}</p>
                        </div>
                    )}

                    {item.parameters && item.parameters.length > 0 ? (() => {
                        const paramsArray = Array.isArray(item.parameters) ? item.parameters : [];
                        const groupsMap = paramsArray.reduce((acc, curr) => {
                            const groupKey = curr.groupName || curr.testName || 'Standard Parameters';
                            if (!acc[groupKey]) acc[groupKey] = [];
                            acc[groupKey].push(curr);
                            return acc;
                        }, {});

                        const groupedParams = Object.keys(groupsMap).map((key, index) => ({
                            id: index,
                            name: key,
                            items: groupsMap[key]
                        }));

                        const [expandedGroup, setExpandedGroup] = React.useState(0);

                        return (
                            <div className="space-y-4">
                                {groupedParams.map((group, index) => {
                                    const isExpanded = expandedGroup === index;
                                    const itemsCount = group.items.length;

                                    return (
                                        <div key={index} className="bg-white rounded-[28px] border border-gray-100 overflow-hidden transition-all shadow-sm hover:shadow-md">
                                            <button
                                                onClick={() => setExpandedGroup(isExpanded ? null : index)}
                                                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isExpanded ? 'bg-medical-green/5' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? 'bg-medical-green text-white shadow-lg shadow-medical-green/30' : 'bg-medical-green/10 text-medical-green'}`}>
                                                        <span className="font-black text-sm">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-dark-text text-base leading-tight">
                                                            {group.name} {itemsCount > 1 && <span className="text-medical-green ml-1">({itemsCount} Tests)</span>}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isExpanded ? 'rotate-180 bg-medical-green text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                                    <span className="font-black text-xl leading-none">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                    </span>
                                                </div>
                                            </button>

                                            <motion.div
                                                initial={false}
                                                animate={{ 
                                                    height: isExpanded ? 'auto' : 0,
                                                    opacity: isExpanded ? 1 : 0
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pt-2 space-y-4">
                                                    <div className="h-[1px] bg-gray-100 mb-4" />
                                                    {group.items.map((param, pIndex) => (
                                                        <div key={pIndex} className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group/item">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-2 h-2 rounded-full bg-medical-green/40 group-hover/item:scale-150 group-hover/item:bg-medical-green transition-all" />
                                                                <div>
                                                                    <p className="font-bold text-dark-text text-sm">{typeof param === 'object' ? param.name : param}</p>
                                                                    {typeof param === 'object' && param.unit && (
                                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 block">Unit: {param.unit}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {typeof param === 'object' && param.range && (
                                                                <div className="text-right">
                                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Ref Range</span>
                                                                    <span className="text-xs font-black text-medical-green whitespace-nowrap">{param.range}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })() : (
                        <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-gray-100">
                             <Activity size={48} className="text-gray-200 mx-auto mb-4" />
                             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Clinical Parameters Pending</p>
                             <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Specific parameters for this item are being updated. Standard diagnostic protocols apply.</p>
                        </div>
                    )}
                </motion.div>

                {/* Padding to ensure content isn't eaten by fixed footer if cart is full */}
                <div className="h-20"></div>
            </div>
        </div>
    );
};

export default ItemDetails;
