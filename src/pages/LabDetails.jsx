import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { Star, MapPin, Clock, ChevronRight, FlaskConical, Target, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const LabDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { labs, packages, tests } = useData();
    const { addToCart, cart } = useCart();

    const lab = useMemo(() => {
        const found = (labs || []).find(l => l && l.id && l.id.toString() === id);
        if (!found) return null;
        
        // Respect status from Admin
        const status = (found.status || 'Active').toLowerCase();
        if (status === 'inactive' || status === 'disabled') return null;
        
        return found;
    }, [id, labs]);

    const labItems = useMemo(() => {
        if (!lab) return [];
        const lName = (lab.name || '').toLowerCase().trim();
        
        const isMatch = (itemLab) => {
            if (!itemLab) return false;
            // Clean strings by removing all non-alphanumeric characters (including spaces) for robust matching
            const iLab = itemLab.toLowerCase().replace(/[^a-z0-9]/g, '');
            const lNameClean = lName.replace(/[^a-z0-9]/g, '');
            
            if (!iLab || !lNameClean) return false;

            return iLab === lNameClean || 
                   (iLab.length >= 3 && lNameClean.includes(iLab)) || 
                   (lNameClean.length >= 3 && iLab.includes(lNameClean));
        };

        const associatedPackages = (packages || []).filter(p => {
            const status = (p.status || 'Active').toLowerCase();
            return isMatch(p.labName || p.lab) && (status === 'active' || status === '');
        });
        const associatedTests = (tests || []).filter(t => {
            const status = (t.status || 'Active').toLowerCase();
            return isMatch(t.labName || t.lab) && (status === 'active' || status === '');
        });
        return [...associatedPackages, ...associatedTests];
    }, [lab, packages, tests]);

    const [searchQuery, setSearchQuery] = useState('');


    if (!lab) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <FlaskConical size={64} className="text-gray-300 mb-6" />
                <h1 className="text-3xl font-black text-dark-text mb-4">Lab Not Found</h1>
                <p className="text-gray-500 font-medium mb-8 max-w-md">We couldn't find the laboratory you're looking for. It might have been removed or marked as inactive.</p>
                <Button onClick={() => navigate('/book-test')}>Browse All Tests</Button>
            </div>
        );
    }

    // Filter items based on search query
    const filteredItems = (labItems || []).filter(item =>
        item && (
            (item.name || item.testName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header Section mimicking the screenshot */}
            <div className="bg-[#108A9E] pt-28 pb-10 px-4 text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Lab Logo Placeholder */}
                        <div className="bg-white rounded-xl shadow-lg w-full md:w-[280px] h-[180px] shrink-0 flex items-center justify-center p-6 mx-auto md:mx-0">
                            <h2 className="text-[#108A9E] text-2xl md:text-3xl font-black text-center leading-tight">
                                {(lab?.name || 'Partner Lab').split(' ').map((word, i) => (
                                    <span key={i} className={i === 0 ? "text-medical-green" : "text-dark-text"}>{word} </span>
                                ))}
                            </h2>
                        </div>

                        {/* Lab Details */}
                        <div className="flex-1 mt-2 w-full text-center md:text-left">
                            <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight">{lab.name}</h1>

                            <div className="inline-flex items-center gap-1.5 bg-white text-[#108A9E] px-3 py-1.5 rounded-md text-sm font-bold mb-6 shadow-sm">
                                <Star size={16} fill="currentColor" />
                                <span>{lab.rating || '4.0'} rating</span>
                            </div>

                            <div className="space-y-3 font-medium text-emerald-50 text-base md:text-lg">
                                <div className="flex items-start gap-2 justify-center md:justify-start">
                                    <span className="font-bold shrink-0">Address:</span>
                                    <span>{lab.address || `${lab.location || 'Delhi Region'}`}</span>
                                </div>
                                <div className="flex items-start gap-2 justify-center md:justify-start">
                                    <span className="font-bold shrink-0">Lab Timing:</span>
                                    <span>{lab.timing || '8AM to 8PM'}</span>
                                </div>
                                {lab.accreditation && (
                                    <div className="flex items-start gap-2 justify-center md:justify-start">
                                        <span className="font-bold shrink-0">Accreditation:</span>
                                        <span>{lab.accreditation}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm font-medium text-gray-400 mb-8 flex items-center gap-2 flex-wrap">
                    <Link to="/" className="hover:text-[#108A9E] transition-colors cursor-pointer">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/book-test" className="hover:text-[#108A9E] transition-colors cursor-pointer">Scans</Link>
                    <ChevronRight size={14} />
                    <Link to="/partner-labs" className="hover:text-[#108A9E] transition-colors cursor-pointer">Partner Labs</Link>
                    <ChevronRight size={14} />
                    <span className="text-[#108A9E] font-bold">{lab.name}</span>
                </div>

                {/* Tests Section Header */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-dark-text mb-2">
                        Radiology & Pathology Tests at {lab.name}
                    </h2>
                    <p className="text-amber-600 font-bold text-sm md:text-base">
                        Get Upto 30% off through OxyCare scans
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Tests List */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Search Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex items-center">
                            <div className="pl-4 pr-3 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for tests or packages at this lab..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base font-medium py-3 placeholder:text-gray-400"
                            />
                        </div>

                        {filteredItems.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                                <Target size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-dark-text">No tests found</h3>
                                <p className="text-gray-500 font-medium">Try adjusting your search criteria.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(filteredItems || []).map((item, idx) => {
                                    const isInCart = item && cart.some(cartItem => cartItem.id === item.id);
                                    const original = Number(item.originalPrice) || Number(item.price);
                                    const current = Number(item.price);
                                    const isDiscounted = original > current;

                                    return (
                                        <div key={item.id || idx} className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                                            {item.isAddon && (
                                                <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                                    Add-on Available
                                                </div>
                                            )}

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                     <h3 className="text-lg md:text-xl font-black text-medical-green mb-2 cursor-pointer hover:underline transition-all"
                                                         onClick={() => navigate(`/item-details/${item.id}`)}
                                                     >
                                                         {item.testName || item.test || item.name || 'Diagnostic Test'}
                                                     </h3>

                                                     <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-gray-500 mb-3">
                                                         {item.sampleType && (
                                                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                                                                 <FlaskConical size={12} className="text-medical-green" />
                                                                 <span className="text-[10px] font-black text-dark-text uppercase">{item.sampleType}</span>
                                                             </div>
                                                         )}
                                                         {item?.parameters && (
                                                             <div className="flex items-center gap-1.5">
                                                                 <CheckCircle2 size={14} className="text-medical-green" />
                                                                 <span className="text-gray-700">{Array.isArray(item.parameters) ? item.parameters.length : (item.testsCount || 0)} Parameters</span>
                                                             </div>
                                                         )}
                                                         {item.reportTime && (
                                                             <div className="flex items-center gap-1.5">
                                                                 <Clock size={14} className="text-[#108A9E]" />
                                                                 <span>Report in {item.reportTime}</span>
                                                             </div>
                                                         )}
                                                     </div>

                                                     {item.desc && (
                                                         <p className="text-sm text-gray-500 line-clamp-2 md:line-clamp-1">{item.desc}</p>
                                                     )}
                                                 </div>

                                                 <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0 md:min-w-[140px]">
                                                     <div className="text-left md:text-right">
                                                         <div className="text-2xl font-black text-dark-text">₹{current}</div>
                                                         {isDiscounted && (
                                                             <div className="text-sm text-gray-400 font-bold line-through">₹{original}</div>
                                                         )}
                                                     </div>

                                                     <Button
                                                         variant={isInCart ? 'outline' : 'primary'}
                                                         className={`mt-0 md:mt-3 px-6 py-2 rounded-xl text-sm ${isInCart ? 'border-medical-green text-medical-green bg-soft-green/30' : 'bg-[#108A9E] hover:bg-[#0d7385] text-white shadow-md'}`}
                                                         onClick={() => addToCart({
                                                             ...item,
                                                             id: item?.id || Date.now(),
                                                             name: item?.testName || item?.test || item?.name || 'Diagnostic Test'
                                                         })}
                                                     >
                                                        {isInCart ? 'Added' : 'Book Now'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#108A9E] to-medical-green rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                            <ShieldCheck size={40} className="text-emerald-300 mb-4" />
                            <h3 className="text-xl font-black mb-2">100% Guaranteed Accuracy</h3>
                            <p className="text-blue-50/90 text-sm font-medium mb-6 leading-relaxed">
                                {lab.name} is a certified partner. We ensure all samples are processed in highly monitored, ISO accredited environments.
                            </p>

                            <ul className="space-y-3 mb-6">
                                {['NABL Accredited', 'Free Home Sample Collection', 'Reports within 24 Hrs', 'Free Doctor Consultation'].map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-white">
                                        <CheckCircle2 size={16} className="text-emerald-300 shrink-0 mt-0.5" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabDetails;
