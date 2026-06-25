import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Timer, UserCircle, MapPin, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const { signup, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [otpValue, setOtpValue] = useState(['', '', '', '']);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: ''
    });

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.phone.length < 10) {
            return setError('Please enter a valid phone number');
        }

        setIsLoading(true);
        try {
            await sendOTP(formData.phone);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otpValue];
        newOtp[index] = value;
        setOtpValue(newOtp);

        // Auto focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        const fullOtp = otpValue.join('');
        if (fullOtp.length < 4) return setError('Please enter the complete 4-digit OTP');

        setIsLoading(true);
        setError('');
        try {
            await verifyOTP(formData.phone, fullOtp);
            await signup(formData);
            setShowSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.message || 'OTP verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-medical-green/5 blur-3xl -mr-16 -mt-16"></div>

                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-medical-green text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-medical-green/30">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h1 className="text-3xl font-black text-dark-text tracking-tight mb-4">Registration Successful!</h1>
                                <p className="text-grey-text font-medium leading-relaxed">
                                    Welcome to the OxyCare family, <span className="text-dark-text font-bold">{formData.name}</span>. <br />
                                    Redirecting you to your dashboard...
                                </p>
                            </motion.div>
                        ) : step === 1 ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-soft-green rounded-2xl flex items-center justify-center text-medical-green mx-auto mb-6 shadow-inner">
                                        <UserCircle size={32} />
                                    </div>
                                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Create Account</h1>
                                    <p className="text-grey-text font-medium text-sm">Join OxyCare Labs today</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 italic">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleInitialSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Enter full name"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="tel"
                                                    maxLength="10"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                                    placeholder="99999 00000"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="name@gmail.com"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Age</label>
                                            <input
                                                required
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                placeholder="Years"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Gender</label>
                                            <select
                                                required
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm appearance-none"
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-grey-text uppercase tracking-widest ml-4">Confirm</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green transition-all font-bold text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button disabled={isLoading} className="w-full h-14 rounded-2xl shadow-lg shadow-medical-green/20 group uppercase tracking-widest text-xs font-black">
                                        {isLoading ? 'Processing...' : 'Continue to Verify'}
                                        {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
                                    </Button>
                                </form>

                                <div className="pt-8 border-t border-gray-50 text-center">
                                    <p className="text-gray-500 font-bold text-sm">
                                        Already have an account? <Link to="/login" className="text-medical-green font-black hover:underline tracking-tight">Sign In</Link>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-medical-green font-black text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                                >
                                    <ChevronLeft size={16} /> Back to Edit
                                </button>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green mx-auto mb-6 shadow-sm">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Verify Phone</h1>
                                    <p className="text-grey-text font-medium text-sm">Enter the 4-digit code sent to <br /><span className="text-dark-text font-bold">+91 {formData.phone}</span></p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 italic">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyAndSignup} className="space-y-8">
                                    <div className="flex justify-between gap-3 md:gap-4 mb-8">
                                        {(otpValue || []).map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-12 h-14 md:w-16 md:h-20 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-2xl font-black text-dark-text focus:border-medical-green focus:bg-white outline-none transition-all shadow-sm"
                                            />
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <Button disabled={isLoading} className="w-full h-14 rounded-2xl shadow-lg shadow-medical-green/20 uppercase tracking-widest text-xs font-black">
                                            {isLoading ? 'Verifying...' : 'Complete Registration'}
                                        </Button>
                                        
                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => sendOTP(formData.phone)}
                                                className="text-xs font-black text-gray-400 hover:text-medical-green tracking-widest uppercase"
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    By continuing, you agree to OxyCare Labs' <br />
                    <Link to="/terms-conditions" className="text-gray-500 hover:text-medical-green transition-colors">Terms of Service</Link> & <Link to="/privacy-policy" className="text-gray-500 hover:text-medical-green transition-colors">Privacy Policy</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
