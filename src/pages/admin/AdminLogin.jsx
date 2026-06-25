import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, FlaskConical, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-dark-text flex items-center justify-center p-4 relative overflow-hidden font-display">
            {/* Abstract Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-green/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-medical-green/5 rounded-full blur-[120px] -ml-64 -mb-64" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <Logo className="h-16 mb-6" variant="light" />
                        <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">Management Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-red-500 font-medium">{error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Administrative Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-medical-green transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-medical-green/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="admin@oxycare.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Master Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-medical-green transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-medical-green/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full h-14 bg-medical-green hover:bg-emerald-600 text-white rounded-2xl text-base font-black uppercase tracking-widest gap-2"
                        >
                            Verify Identity <ArrowRight size={20} />
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <Shield size={12} className="text-medical-green" />
                            End-to-End Secure
                        </div>
                        <p className="text-[10px] text-gray-600 max-w-[200px] leading-relaxed">
                            Authorized personnel only. All access attempts are logged and monitored.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
