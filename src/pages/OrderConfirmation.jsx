import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('id');
    const [status, setStatus] = useState(() => orderId ? 'processing' : 'failed'); // processing, success, failed

    useEffect(() => {
        // In a real app, you'd verify the status with your backend here.
        // For now, we'll simulate a success if an orderId exists.
        if (orderId) {
            const timer = setTimeout(() => {
                setStatus('success');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [orderId]);

    return (
        <div className="pt-40 pb-20 px-4 min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-xl border border-gray-100"
            >
                <div className="flex justify-center mb-8">
                    <Logo className="h-10" />
                </div>
                {status === 'processing' && (
                    <>
                        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Loader2 size={48} className="animate-spin" />
                        </div>
                        <h1 className="text-3xl font-black text-dark-text mb-4 tracking-tight">Verifying Payment</h1>
                        <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                            Please wait while we confirm your payment with PhonePe. Do not refresh the page.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-24 h-24 bg-medical-green/10 text-medical-green rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-dark-text mb-4 tracking-tight">Payment Successful!</h1>
                        <p className="text-gray-500 font-bold mb-2 leading-relaxed">
                            Your order <span className="text-dark-text">#{orderId}</span> has been confirmed.
                        </p>
                        <p className="text-gray-400 text-sm mb-8 font-medium">
                            A confirmation email has been sent to your registered email address.
                        </p>
                        <div className="space-y-4">
                            <Button
                                className="w-full h-14 bg-medical-green hover:bg-medical-green-hover text-white shadow-lg shadow-medical-green/20"
                                onClick={() => navigate('/dashboard/bookings')}
                            >
                                View My Booked Tests
                            </Button>
                            <button
                                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark-text transition-colors flex items-center justify-center gap-2"
                                onClick={() => navigate('/')}
                            >
                                Return to Home <ArrowRight size={14} />
                            </button>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <XCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-dark-text mb-4 tracking-tight">Payment Failed</h1>
                        <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                            Something went wrong with your transaction. If money was deducted, it will be refunded within 5-7 working days.
                        </p>
                        <div className="space-y-4">
                            <Button
                                className="w-full h-14 bg-dark-text hover:bg-black text-white"
                                onClick={() => navigate('/checkout')}
                            >
                                Try Again
                            </Button>
                            <button
                                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark-text transition-colors"
                                onClick={() => navigate('/help-support')}
                            >
                                Contact Support
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-6 opacity-40">
                    <img src="https://cdn.worldvectorlogo.com/logos/phonepe-1.svg" alt="PhonePe" className="h-4 grayscale" />
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <ShoppingBag size={12} /> OxyCare Secure
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderConfirmation;
