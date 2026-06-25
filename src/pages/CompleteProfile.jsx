import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const CompleteProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.length < 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update profile with phone
            await updateProfile({ phone: `+91 ${phone}` });

            // Redirect to dashboard or home
            navigate('/dashboard');
        } catch {
            console.error('Failed to parse saved user');
        }
 finally {
            setIsSubmitting(false);
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
                    <div className="absolute top-0 right-0 w-32 h-32 bg-medical-green/5 blur-3xl -mr-16 -mt-16"></div>

                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-soft-green rounded-2xl flex items-center justify-center text-medical-green mx-auto mb-6 shadow-inner">
                                <User size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">Almost There!</h1>
                            <p className="text-grey-text font-medium text-sm">Hi {user?.name}, we just need your mobile number to coordinate your health tests.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Current Mobile Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-medical-green transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        maxLength="10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Enter 10 digit number"
                                        className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-medical-green focus:bg-white rounded-3xl pl-16 pr-8 font-bold text-lg transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="bg-soft-green/30 p-4 rounded-2xl flex items-center gap-4 border border-medical-green/10">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-medical-green shadow-sm">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-xs font-bold text-dark-text/70 leading-relaxed">
                                    Your data is encrypted. We only use this for sample collection updates.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full h-16 rounded-3xl bg-medical-green hover:bg-medical-green-hover text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-medical-green/20 group"
                            >
                                Complete Setup <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CompleteProfile;
