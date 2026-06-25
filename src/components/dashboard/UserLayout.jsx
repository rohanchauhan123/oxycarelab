import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Calendar,
    User,
    MapPin,
    Users,
    LogOut,
    Pencil,
    Receipt,
    Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Go to Home', path: '/', icon: Home },
        { name: 'View Reports', path: '/dashboard/reports', icon: FileText },
        { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
        { name: 'My Invoices', path: '/dashboard/invoices', icon: Receipt },
        { name: 'My Profile', path: '/dashboard/profile', icon: User },
        { name: 'My Addresses', path: '/dashboard/addresses', icon: MapPin },
        { name: 'All Members', path: '/dashboard/members', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Dashboard Header */}
            <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-gray-100 py-4 px-4 md:px-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-2 group">
                            <Logo className="h-8 md:h-10 transition-transform group-hover:scale-105" />
                            <span className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-l border-gray-100 pl-4 ml-2">Patient Dashboard</span>
                        </NavLink>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <NavLink 
                            to="/" 
                            className="flex items-center gap-2 text-[10px] font-black text-white bg-medical-green px-6 py-2.5 rounded-xl uppercase tracking-widest transition-all hover:bg-emerald-700 shadow-lg shadow-medical-green/20"
                        >
                            <Home size={14} className="fill-current" /> Home Page
                        </NavLink>
                    </div>
                </div>
            </header>

            {/* Sidebar Backdrop for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className="pt-20 md:pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">

                {/* Mobile Toggle - Positioned above BottomNav */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-24 right-6 z-[130] w-14 h-14 bg-medical-green text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95"
                >
                    {isSidebarOpen ? <LogOut size={24} className="rotate-180" /> : <LayoutDashboard size={24} />}
                </button>

                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-[120] lg:z-50 w-[85%] sm:w-80 lg:w-80 shrink-0 transition-transform duration-300 transform
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    bg-white lg:bg-transparent shadow-2xl lg:shadow-none
                `}>
                    <div className="bg-white lg:bg-white rounded-none lg:rounded-[32px] border-r lg:border border-gray-100 lg:shadow-sm p-6 md:p-8 h-full lg:h-auto lg:sticky lg:top-28 overflow-y-auto lg:overflow-visible">
                        
                        {/* Sidebar Header/Logo */}
                        <div className="mb-10 flex justify-center lg:mb-8">
                             <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <Logo className="h-8 md:h-10 cursor-pointer" />
                            </NavLink>
                        </div>

                        {/* Profile Section */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 text-gray-300 flex items-center justify-center">
                                    {(user?.avatar && !user.avatar.includes('pravatar.cc') && !user.avatar.includes('liara.run') && !user.avatar.includes('seed=Sara') && !user.avatar.includes('seed=Dylan')) ? (
                                        <img
                                            src={user.avatar}
                                            alt="User Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user?.gender?.toLowerCase() === 'female' ? (
                                        <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=Sasha" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=Oliver" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <NavLink to="/dashboard/profile" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-medical-green transition-colors">
                                    <Pencil size={14} />
                                </NavLink>
                            </div>
                            <h2 className="text-2xl font-black text-dark-text tracking-tight uppercase leading-none mb-1">{user?.name}</h2>
                            <p className="text-gray-400 font-bold text-sm tracking-widest">+91 {user?.phone}</p>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-2 mb-10">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/dashboard'}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300
                                        ${isActive
                                            ? 'bg-medical-green/10 text-medical-green'
                                            : 'text-dark-text hover:bg-gray-50 text-gray-600'
                                        }
                                    `}
                                >
                                    <item.icon size={22} className={item.path === '/dashboard' ? 'text-current' : ''} />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-medical-green hover:bg-medical-green-hover text-white rounded-2xl font-black transition-all shadow-md shadow-medical-green/20"
                        >
                            Logout <LogOut size={20} />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
