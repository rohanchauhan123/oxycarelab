import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Activity, MousePointer2, PieChart } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Analytics = () => {
    const { bookings, users } = useData();

    // Calculate total revenue from all completed bookings
    const totalRevenue = bookings.reduce((sum, b) => {
        const amount = parseInt(b.amount?.replace(/[^\d]/g, '') || 0);
        return sum + amount;
    }, 0);

    // Calculate conversion rates
    const siteVisits = 120000; // Mock traffic but keep it realistic
    const cartAdds = users.length * 4; // Mock logic based on users
    const bookingCount = bookings.length;

    const conversionRate = siteVisits > 0 ? ((bookingCount / siteVisits) * 100).toFixed(1) : 0;
    const avgTicket = bookingCount > 0 ? Math.round(totalRevenue / bookingCount) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Cart & Business Analytics</h1>
                <p className="text-grey-text font-medium">Conversion rates, revenue tracking, and traffic insights.</p>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Overview */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Project Revenue</p>
                                <h2 className="text-4xl font-black text-dark-text tracking-tighter">₹{totalRevenue.toLocaleString()}</h2>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-soft-green text-medical-green rounded-2xl text-xs font-bold ring-1 ring-medical-green/10">
                                <TrendingUp size={16} /> +{bookingCount}% vs Launch
                            </div>
                        </div>

                        {/* Custom CSS Bar Chart - Scaled to bookings */}
                        <div className="flex items-end justify-between h-48 gap-4 mb-8">
                            {[45, 60, 30, 80, 55, 90, 75, 40, 65, 85, 50, 70].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${bookingCount > 0 ? Math.min(100, Math.max(10, h * (bookingCount / 20))) : 5}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className={`w-full rounded-t-xl transition-all duration-500 hover:scale-x-110 shadow-lg ${i === 5 ? 'bg-medical-green shadow-medical-green/20' : 'bg-gray-100 group-hover:bg-soft-green'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-dark-text p-10 rounded-[40px] shadow-2xl text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-display font-bold mb-8">User Conversion Funnel</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Site Visits', value: `${(siteVisits / 1000).toFixed(0)}k`, icon: MousePointer2, color: 'bg-indigo-500', width: '100%' },
                                { label: 'Added to Cart', value: `${(cartAdds / 1000).toFixed(1)}k`, icon: ShoppingCart, color: 'bg-brand-teal', width: '37%' },
                                { label: 'Bookings', value: bookingCount, icon: Activity, color: 'bg-medical-green', width: `${(bookingCount / 500) * 100}%` }
                            ].map((step, i) => (
                                <div key={step.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                        <span>{step.label}</span>
                                        <span>{step.value}</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: step.width }}
                                            transition={{ duration: 1.5, delay: i * 0.2 }}
                                            className={`h-full ${step.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conv. Rate</p>
                            <p className="text-3xl font-black text-medical-green tracking-tighter">{conversionRate}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg. Ticket</p>
                            <p className="text-xl font-black text-white tracking-tighter">₹{avgTicket.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
