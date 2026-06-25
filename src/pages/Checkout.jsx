import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle2,
    Building2,
    Plus,
    Trash2,
    Calendar,
    Clock,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Star,
    Users,
    User,
    Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLocation as useAppLocation } from '../context/LocationContext';
import Button from '../components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import PackageDetailsModal from '../components/ui/PackageDetailsModal';
import { initiatePhonePePayment } from '../services/phonepeService';
import { getAvailableSlots } from '../utils/slotUtils';

const Checkout = () => {
    const { totalAmount, clearCart, cart } = useCart();
    const { labs, addBooking, addAddress: addAddressToData, addresses, members, slots } = useData();
    const { user, isAuthenticated } = useAuth();
    const { location: appLocation } = useAppLocation();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [error, setError] = useState('');

    // Guards
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if ((cart || []).length === 0 && !isSuccess) {
            navigate('/health-packages');
            return;
        }
    }, [isAuthenticated, navigate, location.pathname, (cart || []).length, isSuccess]);

    const availableSlots = getAvailableSlots(selectedDate, slots || []);

    // Initial Patient Selection (Self)
    useEffect(() => {
        if (user && !selectedPatient) {
            setSelectedPatient({ 
                id: 'self', 
                name: user?.name || 'Self', 
                relation: 'Self', 
                age: user?.age || 'N/A', 
                gender: user?.gender || 'Unisex' 
            });
        }
    }, [user, selectedPatient]);

    // Initial Address Selection
    useEffect(() => {
        const userAddrs = (addresses || []).filter(a => a && a.userId === user?.id);
        if (userAddrs.length > 0 && !selectedAddress) {
            setSelectedAddress(userAddrs[0]);
        }
    }, [addresses, user?.id, selectedAddress]);

    const filteredLabs = (labs || []).filter(l => {
        if (!l) return false;
        const searchLocation = (appLocation || '').toLowerCase();
        const isDefault = !searchLocation || searchLocation.includes('set location') || searchLocation === 'india';
        
        if (isDefault) return l.status === 'Active';
        
        const labLocation = (l.location || '').toLowerCase();
        return (labLocation.includes(searchLocation) || searchLocation.includes(labLocation)) && l.status === 'Active';
    });

    const [newAddr, setNewAddr] = useState({ type: 'Home', address: '', landmark: '' });

    const handleAutoFetch = () => {
        if (!("geolocation" in navigator)) return;
        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                const data = await response.json();
                setNewAddr(prev => ({ ...prev, address: data.display_name }));
            } catch (error) {
                console.error("Location fetch failed", error);
            } finally {
                setIsFetchingLocation(false);
            }
        }, () => setIsFetchingLocation(false));
    };

    const handleSaveAddress = async () => {
        if (!newAddr.address) return;
        const saved = await addAddressToData(newAddr, user?.id);
        setSelectedAddress(saved);
        setIsAddingNew(false);
        setNewAddr({ type: 'Home', address: '', landmark: '' });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handlePlaceOrder = async () => {
        setError('');
        setIsProcessing(true);

        const orderData = {
            userId: user?.id,
            userName: user?.name,
            test: (cart || []).map(item => item?.name).filter(Boolean).join(', '),
            items: [...(cart || [])],
            total: totalAmount || 0,
            amount: `₹${(totalAmount || 0).toLocaleString('en-IN')}`, 
            lab: selectedLab?.name || 'Partner Lab',
            labId: selectedLab?.id,
            address: selectedAddress || { address: 'N/A' },
            addressId: selectedAddress?.id,
            phone: user?.phone || '',
            patientId: selectedPatient?.id,
            patientName: selectedPatient?.name || user?.name || 'Patient',
            patientAge: selectedPatient?.age || user?.age || 'N/A',
            patientGender: selectedPatient?.gender || user?.gender || 'Unisex',
            patientRelation: selectedPatient?.relation || 'Self',
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Success', 
            date: selectedDate || new Date().toISOString().split('T')[0],
            time: selectedTimeSlot || 'N/A',
            status: 'Processing',
            createdAt: new Date().toISOString()
        };

        try {
            if (paymentMethod === 'online') {
                const orderId = 'ORD-' + Math.floor(Date.now() / 1000);
                const result = await initiatePhonePePayment(totalAmount, orderId, user);

                if (result.success) {
                    if (result.mock) {
                        // Mock Mode - Just save booking locally
                        console.info('Using Mock Payment Success flow...');
                    } else {
                        // Real payment initiation has already redirected the user.
                        // The orderData is essentially "in transit" now.
                        // For this demo, we'll save it to IndexedDB first so it's there when they return.
                        await addBooking({ ...orderData, id: orderId, paymentStatus: 'Initiated' });
                        return; // User is being redirected
                    }
                } else {
                    throw new Error(result.error || 'Payment gateway failed');
                }
            }

            // COD or Mock Online Flow
            await addBooking(orderData);
            setIsSuccess(true);
            clearCart();
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="pt-40 pb-20 px-4 min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-xl border border-gray-100">
                    <div className="w-24 h-24 bg-medical-green/10 text-medical-green rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-dark-text mb-4 tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-500 font-bold mb-8 leading-relaxed">Your lab test booking has been successfully placed. You can track its status in your dashboard.</p>
                    <div className="space-y-4">
                        <Button className="w-full h-14 bg-medical-green hover:bg-emerald-700 text-white" onClick={() => navigate('/dashboard/bookings')}>Track My Order</Button>
                        <button className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark-text transition-colors" onClick={() => navigate('/')}>Return to Home</button>
                    </div>
                </motion.div>
            </div>
        );
    }    return (
        <div className="pt-24 pb-16 md:pt-32 md:pb-20 px-4 md:px-8 bg-[#F8FAFC] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Stepper Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-medical-green font-black text-[10px] md:text-xs uppercase tracking-widest mb-2 cursor-pointer" onClick={() => navigate(-1)}>
                            <ArrowLeft size={14} /> Back to Packages
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-dark-text tracking-tight">Checkout</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {[1, 2, 3, 4].map((num) => (
                            <React.Fragment key={num}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${step >= num ? 'bg-medical-green text-white shadow-lg shadow-medical-green/20' : 'bg-white text-gray-300 border border-gray-100 shadow-sm'}`}>{num}</div>
                                {num < 4 && <div className={`w-12 h-1 ${step > num ? 'bg-medical-green' : 'bg-gray-200'} rounded-full`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-6 rounded-[24px] text-red-600 font-bold text-sm flex items-center gap-3">
                                <ShieldCheck size={20} className="shrink-0" /> {error}
                            </div>
                        )}

                        {/* STEP 1: LAB & SLOT */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-2xl flex items-center justify-center"><Building2 size={24} /></div>
                                        <h2 className="text-2xl font-black text-dark-text tracking-tight">Select Partner Lab</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(filteredLabs || []).length > 0 ? (
                                            (filteredLabs || []).map(lab => (
                                                <div 
                                                    key={lab?.id || Math.random()} 
                                                    onClick={() => setSelectedLab(lab)}
                                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${selectedLab && String(selectedLab?.id) === String(lab?.id) ? 'border-medical-green bg-medical-green/5 shadow-inner' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-black text-dark-text">{lab?.name || 'Lab'}</h3>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{lab?.location || 'Location'}</p>
                                                        </div>
                                                        {selectedLab && String(selectedLab?.id) === String(lab?.id) && <CheckCircle2 size={24} className="text-medical-green" />}
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{lab?.address || 'Address information'}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                                                <p className="text-sm font-bold text-gray-500">No partner labs found in "{appLocation}".</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-1">Please try searching for another location or Delhi NCR.</p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedLab && (
                                        <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={14} /> Appointment Date</label>
                                                <input type="date" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Clock size={14} /> Preferred Slot</label>
                                                <select value={selectedTimeSlot} onChange={e => setSelectedTimeSlot(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-medical-green/20">
                                                    <option value="">Select Slot</option>
                                                    {(availableSlots || []).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button disabled={!selectedLab || !selectedDate || !selectedTimeSlot} onClick={nextStep} className="h-14 px-12 bg-dark-text text-white">Continue Checkout <ChevronRight size={18} className="ml-2" /></Button>
                            </motion.div>
                        )}

                        {/* STEP 2: PATIENT */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-2xl flex items-center justify-center"><Users size={24} /></div>
                                            <h2 className="text-2xl font-black text-dark-text tracking-tight">Patient Information</h2>
                                        </div>
                                        <Button variant="outline" onClick={() => navigate('/dashboard/members')} className="h-10 px-4 rounded-xl text-[10px]">Manage Family</Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => setSelectedPatient({ id: 'self', name: user?.name, relation: 'Self', age: user?.age, gender: user?.gender })}
                                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedPatient?.id === 'self' ? 'border-medical-green bg-medical-green/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-medical-green"><User size={20} /></div>
                                                <div>
                                                    <h3 className="font-black text-dark-text">{user?.name}</h3>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black">Self ({user?.age}Y, {user?.gender})</p>
                                                </div>
                                            </div>
                                            {selectedPatient?.id === 'self' && <CheckCircle2 size={24} className="text-medical-green" />}
                                        </div>
                                        {(members || []).filter(m => m && m.userId === user?.id).map(member => (
                                            <div 
                                                key={member?.id || Math.random()}
                                                onClick={() => setSelectedPatient(member)}
                                                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedPatient && selectedPatient?.id === member?.id ? 'border-medical-green bg-medical-green/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-medical-green"><Users size={20} /></div>
                                                    <div>
                                                        <h3 className="font-black text-dark-text">{member?.name || 'Member'}</h3>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black">{member?.relation || 'Relation'} ({member?.age || 'N/A'}Y, {member?.gender || 'N/A'})</p>
                                                    </div>
                                                </div>
                                                {selectedPatient && selectedPatient?.id === member?.id && <CheckCircle2 size={24} className="text-medical-green" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={prevStep} className="h-14 px-8 border-gray-100">Go Back</Button>
                                    <Button disabled={!selectedPatient} onClick={nextStep} className="h-14 flex-1 bg-dark-text text-white">Select Address <ChevronRight size={18} className="ml-2" /></Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: ADDRESS */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-2xl flex items-center justify-center"><MapPin size={24} /></div>
                                            <h2 className="text-2xl font-black text-dark-text tracking-tight">Collection Location</h2>
                                        </div>
                                        {!isAddingNew && <Button variant="outline" onClick={() => setIsAddingNew(true)} className="h-10 px-4 rounded-xl text-[10px]">Add New</Button>}
                                    </div>
                                    
                                    {isAddingNew ? (
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <textarea value={newAddr.address} onChange={e => setNewAddr({...newAddr, address: e.target.value})} placeholder="Enter detailed address for sample collection..." className="w-full bg-gray-50 p-6 rounded-3xl border-none outline-none focus:ring-2 focus:ring-medical-green/20 min-h-[120px] font-bold text-sm" />
                                                <button onClick={handleAutoFetch} disabled={isFetchingLocation} className="absolute bottom-4 right-4 bg-medical-green text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-sm">
                                                    <MapPin size={12} /> {isFetchingLocation ? 'Locating...' : 'Get GPS Location'}
                                                </button>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button onClick={handleSaveAddress} className="flex-1 bg-medical-green text-white h-12">Save Address</Button>
                                                <Button variant="outline" onClick={() => setIsAddingNew(false)} className="px-8 h-12 border-gray-100">Cancel</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {(addresses || []).filter(a => a && a.userId === user?.id).map((addr) => (
                                                <div 
                                                    key={addr?.id || Math.random()}
                                                    onClick={() => setSelectedAddress(addr)}
                                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAddress && selectedAddress?.id === addr?.id ? 'border-medical-green bg-medical-green/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAddress && selectedAddress?.id === addr?.id ? 'bg-medical-green text-white' : 'bg-white text-gray-400'}`}><MapPin size={20} /></div>
                                                        <div>
                                                            <h3 className="font-black text-dark-text text-sm uppercase tracking-widest">{addr?.type || 'Address'}</h3>
                                                            <p className="text-gray-400 font-bold text-xs truncate max-w-xs">{addr?.address || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    {selectedAddress && selectedAddress?.id === addr?.id && <CheckCircle2 size={24} className="text-medical-green" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={prevStep} className="h-14 px-8 border-gray-100">Go Back</Button>
                                    <Button disabled={!selectedAddress} onClick={nextStep} className="h-14 flex-1 bg-dark-text text-white text-xs font-black uppercase tracking-widest">Proced to Payment <ChevronRight size={18} className="ml-2" /></Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: PAYMENT */}
                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-medical-green/10 text-medical-green rounded-2xl flex items-center justify-center"><CreditCard size={24} /></div>
                                        <h2 className="text-2xl font-black text-dark-text tracking-tight">Payment Confirmation</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {/* Dynamic Online Payment Option */}
                                        {paymentSettings?.isActive && (
                                            <div onClick={() => setPaymentMethod('online')} className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'online' ? 'border-medical-green bg-medical-green/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-medical-green"><CreditCard size={20} /></div>
                                                    <div>
                                                        <h3 className="font-black text-dark-text">Online Payment</h3>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{paymentSettings?.activeGateway === 'phonepe' ? 'PhonePe / UPI / Cards' : 'Digital Payment Selection'}</p>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'online' && <CheckCircle2 size={24} className="text-medical-green" />}
                                            </div>
                                        )}

                                        <div onClick={() => setPaymentMethod('cod')} className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'cod' ? 'border-medical-green bg-medical-green/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white'}`}>
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-medical-green"><Truck size={20} /></div>
                                                <div>
                                                    <h3 className="font-black text-dark-text">Cash on Collection</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pay during sample pickup</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'cod' && <CheckCircle2 size={24} className="text-medical-green" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={prevStep} className="h-14 px-8 border-gray-100">Go Back</Button>
                                    <Button 
                                        disabled={isProcessing || !selectedLab || !selectedAddress || !selectedPatient || !selectedDate || !selectedTimeSlot} 
                                        onClick={handlePlaceOrder} 
                                        className="h-14 flex-1 bg-medical-green text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-medical-green/20"
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" size={24} /> : `Confirm Booking • ₹${(totalAmount || 0).toLocaleString('en-IN')}`}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 sticky top-32">
                            <h3 className="text-xl font-black text-dark-text tracking-tight mb-8">Summary</h3>
                            <div className="space-y-4 mb-8">
                                {(cart || []).map(item => (
                                    <div 
                                        key={item?.id || Math.random()} 
                                        onClick={() => setSelectedPackage(item)}
                                        className="flex justify-between items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-gray-50 cursor-pointer group/item transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-black text-dark-text text-sm leading-tight mb-1 group-hover/item:text-medical-green transition-colors">{item?.name || 'Package'}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedLab?.name || item?.labName || 'Partner Lab'}</p>
                                                <span className="text-[10px] text-medical-green uppercase font-black opacity-0 group-hover/item:opacity-100 transition-opacity translate-x-[-5px] group-hover/item:translate-x-0 duration-300">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-black text-dark-text text-sm mt-1">
                                            {item?.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : '₹0'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 pt-6 border-t border-gray-50">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-dark-text">₹{(totalAmount || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Collection Fee</span>
                                    <span className="text-medical-green">FREE</span>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <h2 className="text-4xl font-black text-dark-text tracking-tighter">₹{(totalAmount || 0).toLocaleString('en-IN')}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PackageDetailsModal
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                pkg={selectedPackage}
            />
        </div>
    );
};

export default Checkout;
