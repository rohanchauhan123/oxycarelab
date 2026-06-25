import React from 'react';
import {
    Calendar,
    FileText,
    Users,
    Clock,
    CheckCircle2,
    Activity,
    Plus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Home as HomeIcon } from 'lucide-react';

const DashboardOverview = () => {
    const navigate = useNavigate();
    const { bookings, members } = useData();
    const { user } = useAuth();
    
    const userBookings = (bookings || []).filter(b => b && (b.userId === user?.id || b.phone === user?.phone));
    const userMembers = (members || []).filter(m => m && m.userId === user?.id);

    const stats = [
        { label: 'Total Bookings', value: userBookings.length.toString().padStart(2, '0'), icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'All Reports', value: userBookings.filter(b => b.status === 'Completed').length.toString().padStart(2, '0'), icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Family Members', value: userMembers.length.toString().padStart(2, '0'), icon: Users, color: 'text-medical-green', bg: 'bg-medical-green/10' },
        { label: 'Pending Tests', value: userBookings.filter(b => b.status === 'Pending').length.toString().padStart(2, '0'), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-medical-green hover:bg-medical-green hover:text-white shadow-sm transition-all group"
                        title="Back to Home"
                    >
                        <HomeIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-dark-text tracking-tight mb-1 md:mb-2">My Health Dashboard</h1>
                        <p className="text-gray-400 font-bold text-xs md:text-base">Welcome back, {user?.name || 'User'}!</p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/book-test')}
                    className="h-12 bg-medical-green hover:bg-medical-green-hover gap-2"
                >
                    <Plus size={18} /> Book New Test
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {stats.map((stat, index) => {
                    const paths = [
                        '/dashboard/bookings',
                        '/dashboard/reports',
                        '/dashboard/members',
                        '/dashboard/bookings'
                    ];
                    return (
                        <div 
                            key={index} 
                            onClick={() => navigate(paths[index])}
                            className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer active:scale-95"
                        >
                            <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-xl md:text-3xl font-black text-dark-text tracking-tight">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h3 className="text-lg md:text-xl font-black text-dark-text tracking-tight">Appointments</h3>
                        <button
                            onClick={() => navigate('/dashboard/bookings')}
                            className="text-medical-green font-bold text-xs md:text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {userBookings.length > 0 ? (
                            userBookings.slice(0, 3).map((booking) => (
                                <div 
                                    key={booking?.id || Math.random()} 
                                    onClick={() => navigate('/dashboard/bookings')}
                                    className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-medical-green/20 transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-medical-green shadow-sm shrink-0">
                                            <Activity size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-dark-text text-sm md:text-base truncate">{booking?.test || 'Test'}</p>
                                            <p className="text-gray-400 font-bold text-[10px] md:text-xs truncate">{booking?.lab || 'OxyCare Lab'} • {booking?.time || 'Today'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest shrink-0 ${booking?.status === 'Assigned' || booking?.status === 'Collected' ? 'bg-medical-green/10 text-medical-green' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {booking?.status || 'Pending'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <Activity size={40} className="text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold text-sm">No upcoming appointments.</p>
                                <button
                                    onClick={() => navigate('/book-test')}
                                    className="text-medical-green font-black text-xs uppercase tracking-widest mt-2 hover:underline"
                                >
                                    Book a Test Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Health Tips */}
                <div className="bg-medical-green/5 rounded-[32px] border border-medical-green/10 p-8 flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-medical-green mb-6 shadow-sm">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-xl font-black text-dark-text tracking-tight mb-4">Complete your Profile</h3>
                        <p className="text-gray-500 font-bold text-sm mb-6 leading-relaxed">
                            A complete profile helps us provide better health insights and faster report processing.
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard/profile')}
                            className="w-full bg-dark-text hover:bg-black text-white"
                        >
                            Update Now
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-medical-green/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
