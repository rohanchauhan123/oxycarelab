import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    CalendarCheck,
    FlaskConical,
    Package,
    Users,
    Bell,
    Settings,
    Grid3X3,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    UserPlus,
    BarChart3,
    CreditCard,
    PhoneIncoming,
    Clock,
    Home,
    Globe,
    MapPin,
    Tag,
    Zap
} from 'lucide-react';
import Logo from '../ui/Logo';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuItems = [
        { name: 'Go to Website', path: '/', icon: Globe },
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Callback Requests', path: '/admin/callback-requests', icon: PhoneIncoming },
        { name: 'Prescriptions', path: '/admin/prescriptions', icon: FileText },
        { name: 'Lab Bookings', path: '/admin/bookings', icon: CalendarCheck },
        { name: 'Lab Requests', path: '/admin/lab-requests', icon: FlaskConical },
        { name: 'Labs Manager', path: '/admin/labs', icon: FlaskConical },
        { name: 'Packages & Add-ons', path: '/admin/packages', icon: Package },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Blog Management', path: '/admin/blogs', icon: FileText },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Sheet Editor', path: '/admin/sheet-editor', icon: Grid3X3 },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'Slot Management', path: '/admin/slots', icon: Clock },
        { name: 'Serviceable Cities', path: '/admin/cities', icon: MapPin },
        { name: 'Pricing Dashboard', path: '/admin/pricing', icon: Tag },
        { name: 'Pricing Rules', path: '/admin/rules', icon: Zap },
        { name: 'System Settings', path: '/admin/settings', icon: Settings },
        { name: 'Payment Settings', path: '/admin/payment-settings', icon: CreditCard },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            {/* Mobile Backdrop omitted (...) */}
            {isSidebarOpen && window.innerWidth <= 1024 && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-[70] bg-[#1A1A1A] text-white transition-all duration-300 flex flex-col
                    ${isSidebarOpen ? 'w-[85%] sm:w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
                    ${!isSidebarOpen && 'lg:w-20'} 
                    overflow-hidden shadow-2xl
                `}
            >
                {/* Logo Section */}
                <Link to="/" className="p-6 flex items-center gap-4 border-b border-white/5 shrink-0 group hover:bg-white/5 transition-colors">
                    <Logo className="h-10" variant="light" iconOnly={!isSidebarOpen} />
                    {isSidebarOpen && (
                        <span className="text-medical-green italic text-[10px] font-black uppercase opacity-60 ml-[-8px]">Admin</span>
                    )}
                </Link>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth <= 1024 && setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all group ${isActive(item.path)
                                ? 'bg-medical-green text-white shadow-lg shadow-medical-green/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={22} className={`shrink-0 ${isActive(item.path) ? 'text-white' : 'group-hover:text-medical-green transition-colors'}`} />
                            {isSidebarOpen && (
                                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                            )}
                            {isSidebarOpen && isActive(item.path) && (
                                <ChevronRight size={14} className="ml-auto opacity-50" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/admin/login');
                        }}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                    >
                        <LogOut size={22} className="shrink-0" />
                        {isSidebarOpen && <span className="font-semibold text-sm uppercase tracking-widest">Logout</span>}
                    </button>
                    {isSidebarOpen && (
                        <div className="mt-4 p-4 bg-white/5 rounded-2xl hidden md:block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">System Status</span>
                            </div>
                            <p className="text-xs text-medical-green font-bold">All services operational</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Topbar */}
                <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-50 shadow-sm">
                    <div className="flex items-center gap-3 md:gap-6 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-transparent focus-within:border-medical-green/30 focus-within:bg-white transition-all w-96 max-w-full">
                            <Search className="text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search prescriptions, bookings, users..."
                                className="bg-transparent outline-none w-full text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link 
                            to="/" 
                            className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-medical-green/5 text-medical-green hover:bg-medical-green hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-medical-green/10"
                        >
                            <Globe size={14} /> View Website
                        </Link>
                        
                        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-6 w-[1px] bg-gray-100 mx-1 md:mx-2" />
                        <div className="flex items-center gap-2 md:gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-dark-text">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-medical-green font-black uppercase tracking-widest leading-none">{user?.role || 'Super Admin'}</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-medical-green/10 border border-medical-green/20 flex items-center justify-center overflow-hidden">
                                <img src={user?.avatar || "https://i.pravatar.cc/100?img=12"} alt="Admin" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
