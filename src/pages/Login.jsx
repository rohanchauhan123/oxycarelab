import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, ChevronLeft, MessageSquare, ShieldCheck, ArrowRight, User } from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
    const { login, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';

    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [step, setStep] = useState(1); // 1: Input, 2: OTP (if method is otp)
    
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [otpValue, setOtpValue] = useState(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await login(formData.identifier, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!formData.identifier) return setError('Please enter your phone number');
        
        setIsSubmitting(true);
        setError('');
        try {
            await sendOTP(formData.identifier);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otpValue];
        newOtp[index] = value;
        setOtpValue(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otpValue.join('');
        if (fullOtp.length < 4) return setError('Please enter 4-digit OTP');

        setIsSubmitting(true);
        setError('');
        try {
            await verifyOTP(formData.identifier, fullOtp);
            // After OTP verify, we need to find the user to log them in. 
            // In a real app, verifyOTP would return a token.
            // For now, we simulate by finding the user in DB using phone.
            await login(formData.identifier, 'user123'); // Demo auto-login
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-medical-green/5 blur-3xl -mr-24 -mt-24"></div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h1 className="text-4xl font-black text-dark-text tracking-tight mb-2">Welcome Back</h1>
                                        <p className="text-gray-400 font-bold text-sm">Choose your preferred login method</p>
                                    </div>

                                    {/* Tab Switcher */}
                                    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <button
                                            onClick={() => setLoginMethod('password')}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'password' ? 'bg-white text-medical-green shadow-sm' : 'text-gray-400'}`}
                                        >
                                            Password
                                        </button>
                                        <button
                                            onClick={() => setLoginMethod('otp')}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'otp' ? 'bg-white text-medical-green shadow-sm' : 'text-gray-400'}`}
                                        >
                                            OTP Login
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 italic">
                                            {error}
                                        </div>
                                    )}

                                    {loginMethod === 'password' ? (
                                        <form onSubmit={handlePasswordLogin} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone or Email</label>
                                                <div className="relative group">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.identifier}
                                                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                                        placeholder="name@example.com"
                                                        className="w-full bg-gray-50 border border-transparent focus:border-medical-green focus:bg-white rounded-3xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                    <input
                                                        required
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        placeholder="••••••••"
                                                        className="w-full bg-gray-50 border border-transparent focus:border-medical-green focus:bg-white rounded-3xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <Button disabled={isSubmitting} className="w-full h-14 rounded-3xl shadow-xl shadow-gray-200 uppercase tracking-widest text-xs font-black">
                                                {isSubmitting ? 'Verifying...' : 'Sign In Now'}
                                            </Button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleSendOTP} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Number</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                                                    <input
                                                        required
                                                        type="tel"
                                                        maxLength="10"
                                                        value={formData.identifier}
                                                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value.replace(/\D/g, '') })}
                                                        placeholder="99999 00000"
                                                        className="w-full bg-gray-50 border border-transparent focus:border-medical-green focus:bg-white rounded-3xl pl-12 pr-6 py-4 outline-none transition-all font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <Button disabled={isSubmitting} className="w-full h-14 rounded-3xl shadow-xl shadow-medical-green/20 uppercase tracking-widest text-xs font-black">
                                                {isSubmitting ? 'Sending OTP...' : 'Send Login Code'}
                                            </Button>
                                        </form>
                                    )}
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
                                        className="flex items-center gap-2 text-medical-green font-black text-xs uppercase tracking-widest"
                                    >
                                        <ChevronLeft size={16} /> Edit Number
                                    </button>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green mx-auto mb-6 shadow-sm">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Verify OTP</h1>
                                        <p className="text-gray-400 font-bold text-sm leading-relaxed">Enter the code sent to your phone</p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 italic text-center">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleVerifyOtp} className="space-y-8">
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

                                        <Button disabled={isSubmitting} className="w-full h-14 rounded-3xl shadow-xl shadow-medical-green/20 uppercase tracking-widest text-xs font-black">
                                            {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                                        </Button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                className="text-xs font-black text-gray-400 hover:text-medical-green tracking-widest uppercase"
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-8 border-t border-gray-50 text-center mt-8">
                            <p className="text-gray-500 font-bold text-sm">
                                Don't have an account? <Link to="/signup" className="text-medical-green font-black hover:underline tracking-tight">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest lg:px-12 leading-loose opacity-60">
                    Your data is secure with bank-grade encryption. <br />
                    <Link to="/privacy-policy" className="text-gray-500 hover:text-medical-green transition-colors">Safety Standards</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
