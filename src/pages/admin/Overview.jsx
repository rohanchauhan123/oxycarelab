import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CalendarCheck,
    FileText,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    CircleDot,
    Activity,
    Package,
    ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const OverviewCard = ({ value, trend, icon: IconComp, color, bg, label }) => {
    return (
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${bg} bg-opacity-10 shadow-sm group-hover:scale-110 transition-transform`}>
                    {React.createElement(IconComp, { size: 24, className: color })}
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${trend.startsWith('+') ? 'text-medical-green' : 'text-red-500'}`}>
                    {trend.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {trend}
                </div>
            </div>
            <h3 className="text-grey-text text-[10px] md:text-sm font-bold uppercase tracking-widest mb-1">{label}</h3>
            <p className="text-2xl md:text-3xl font-black text-dark-text">{value}</p>
        </div>
    );
};

const AdminOverview = () => {
    const navigate = useNavigate();
    const { packages, users, bookings } = useData();

    const stats = [
        { label: 'Total Packages', value: (packages || []).length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+0%' },
        { label: 'Total Users', value: (users || []).length, icon: Users, color: 'text-medical-green', bg: 'bg-soft-green', trend: '+0%' },
        { label: 'Total Bookings', value: (bookings || []).length, icon: ShoppingBag, color: 'text-brand-teal', bg: 'bg-teal-50', trend: '+0%' },
        {
            label: 'Revenue',
            value: `₹${(bookings || []).filter(b => b && b.amount).reduce((sum, b) => {
                try {
                    const amtStr = b.amount?.toString().replace(/[^\d]/g, '') || '0';
                    return sum + (parseInt(amtStr) || 0);
                } catch (e) {
                    return sum;
                }
            }, 0).toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: '+0%'
        },
    ];

    const recentBookingsTableData = [...(bookings || [])]
        .filter(b => b)
        .sort((a, b) => (b?.id || '').toString().localeCompare((a?.id || '').toString()))
        .slice(0, 5)
        .map(b => ({
            id: b?.id || 'N/A',
            user: b?.userName || b?.user || 'Unknown',
            test: b?.test || 'Unnamed Test',
            date: b?.date || 'Today',
            status: b?.status || 'Pending',
            amount: b?.amount || (b?.total ? `₹${b.total}` : '₹0')
        }));

    return (
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-dark-text mb-1 md:mb-2">Dashboard Overview</h1>
                <p className="text-grey-text font-medium text-sm md:text-lg">System initialized. Ready for production data.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {(stats || []).map((s, i) => (
                    <motion.div
                        key={s?.label || i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <OverviewCard {...s} />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm p-6 md:p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-bold text-dark-text flex items-center gap-3">
                            <CircleDot className="text-medical-green animate-pulse" size={20} />
                            Recent Lab Bookings
                        </h2>
                        <button
                            onClick={() => navigate('/admin/bookings')}
                            className="text-medical-green font-bold text-sm hover:underline uppercase tracking-widest"
                        >
                            View All
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-grey-text text-xs font-bold uppercase tracking-widest border-b border-gray-50 pb-6">
                                    <th className="pb-6">ID</th>
                                    <th className="pb-6">User</th>
                                    <th className="pb-6">Test</th>
                                    <th className="pb-6">Status</th>
                                    <th className="pb-6 text-right">Amount</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-gray-50">
                                {(recentBookingsTableData || []).map((b) => (
                                    <tr key={b?.id || Math.random()} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 font-bold text-dark-text">{b?.id || 'N/A'}</td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={`https://i.pravatar.cc/100?u=${b?.user}`} alt="" />
                                                </div>
                                                <span className="font-semibold text-dark-text text-sm">{b?.user || 'User'}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-sm text-grey-text italic">{b?.test || 'Test'}</td>
                                        <td className="py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b?.status === 'Completed' ? 'bg-medical-green/10 text-medical-green' :
                                                b?.status === 'Upcoming' ? 'bg-brand-teal/10 text-brand-teal' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                {b?.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right font-black text-dark-text text-base">{b?.amount || '₹0'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Activity */}
                <div className="bg-dark-text rounded-2xl md:rounded-[40px] shadow-2xl p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-between group min-h-[300px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-medical-green/20 blur-3xl -mr-16 -mt-16 group-hover:bg-medical-green/40 transition-colors"></div>

                    <div>
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
                            <Activity size={32} className="text-medical-green" />
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">Real-time Performance</h2>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8">
                            Lab request processing time is down by <span className="text-medical-green font-bold">14%</span> since the last update.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Server Load</p>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-medical-green"
                                />
                            </div>
                            <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
                                <span>Optimal</span>
                                <span>65.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
