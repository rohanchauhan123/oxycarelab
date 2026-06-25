import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User, Percent, Menu, X, ChevronDown, LogOut, LayoutDashboard, UserCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LocationModal from '../ui/LocationModal';
import SearchOverlay from '../ui/SearchOverlay';
import Logo from '../ui/Logo';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
    const { location, setLocation, getLocation } = useLocation();
    const { cartCount } = useCart();

    const [initialSearchQuery, setInitialSearchQuery] = useState('');

    useEffect(() => {
        const handleOpenSearch = (e) => {
            if (e.detail?.query) {
                setInitialSearchQuery(e.detail.query);
            } else {
                setInitialSearchQuery('');
            }
            setIsSearchOverlayOpen(true);
        };
        const handleOpenLocation = () => setIsLocationModalOpen(true);

        window.addEventListener('oxycare:openSearch', handleOpenSearch);
        window.addEventListener('oxycare:openLocationModal', handleOpenLocation);
        return () => {
            window.removeEventListener('oxycare:openSearch', handleOpenSearch);
            window.removeEventListener('oxycare:openLocationModal', handleOpenLocation);
        };
    }, []);

    const navLinks = [
        { title: 'Search Tests', path: '/book-test' },
        { title: 'Radiology Tests', path: '/book-test?type=Radiology' },
        { title: 'Partner Labs', path: '/partner-labs' },
        { title: 'Upload Prescription', path: '/upload-prescription' },
        { title: 'Health Packages', path: '/health-packages' },
        { title: 'About Us', path: '/about' },
        { title: 'Health Blog', path: '/blog' },
        { title: 'Help & Support', path: '/help-support' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-gray-100 pt-[env(safe-area-inset-top)]">
            {/* Top Row: Main Logo, Location, Search, Auth, Offers, Cart */}
            <div className="container mx-auto px-4 py-3 flex items-center gap-6 lg:gap-10">
                {/* Logo */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="h-8 lg:h-12" />
                    </Link>

                    {/* Mobile Location Header */}
                    <button 
                        onClick={() => setIsLocationModalOpen(true)}
                        className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl active:scale-95 transition-transform"
                    >
                        <MapPin size={12} className="text-medical-green" />
                        <span className="text-[10px] font-black text-dark-text tracking-tight max-w-[70px] truncate">{location}</span>
                        <ChevronDown size={10} className="text-gray-400" />
                    </button>

                    {/* Mobile Search Icon */}
                    <button 
                        onClick={() => setIsSearchOverlayOpen(true)}
                        className="lg:hidden p-2 bg-gray-50 border border-gray-100 rounded-xl active:scale-95 transition-transform"
                    >
                        <Search size={16} className="text-medical-green" />
                    </button>
                </div>

                {/* Desktop Location & Search */}
                <div className="hidden lg:flex items-center flex-1 gap-4">
                    {/* Location Picker */}
                    <div
                        onClick={() => setIsLocationModalOpen(true)}
                        className="flex items-center gap-2 cursor-pointer group shrink-0 py-2 border-r border-gray-100 pr-4"
                    >
                        <MapPin size={18} className="text-medical-green" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Collect sample from</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-dark-text group-hover:text-medical-green transition-colors">{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar Bar */}
                    <div
                        onClick={() => setIsSearchOverlayOpen(true)}
                        className="flex-1 max-w-2xl flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 gap-3 cursor-pointer hover:border-medical-green/40 transition-all group"
                    >
                        <Search size={18} className="text-medical-green group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-gray-400 font-medium">Search for lab tests, health packages...</span>
                    </div>
                </div>

                {/* Right Actions: Login, Offers, Cart */}
                <div className="hidden lg:flex items-center gap-8 shrink-0">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-medical-green/30 transition-all group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-medical-green text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                                    {(user?.avatar) ? (
                                        <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        (user?.name || 'U').charAt(0)
                                    )}
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">Welcome back</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-black text-dark-text">{user?.name || 'User'}</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-gray-50 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-gray-50 mb-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                                            <span className="px-2 py-0.5 bg-medical-green/10 text-medical-green rounded text-[10px] font-black uppercase tracking-widest">{user?.role || 'User'}</span>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-soft-green text-medical-green flex items-center justify-center group-hover:bg-medical-green group-hover:text-white transition-all">
                                                <LayoutDashboard size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-dark-text">My Dashboard</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Bookings & Reports</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                                navigate('/');
                                            }}
                                            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 transition-colors group text-left"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <LogOut size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-red-500">Sign Out</span>
                                                <span className="text-[10px] text-red-400/60 font-medium">End session safely</span>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div onClick={() => navigate('/login')} className="flex items-center gap-2 cursor-pointer group">
                            <User size={20} className="text-gray-600 group-hover:text-medical-green transition-colors" />
                            <span className="text-sm font-bold text-gray-600 group-hover:text-medical-green transition-colors">Login / Signup</span>
                        </div>
                    )}

                    <Link to="/offers" className="flex items-center gap-2 cursor-pointer group">
                        <div className="bg-gray-100 p-1.5 rounded-full text-gray-400 group-hover:bg-medical-green/10 group-hover:text-medical-green transition-all">
                            <Percent size={14} className="animate-pulse" />
                        </div>
                        <span className="text-sm font-bold text-gray-600 group-hover:text-medical-green transition-colors">Offers</span>
                    </Link>

                    <Link to="/checkout" className="relative p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-medical-green/10 transition-colors group">
                        <ShoppingCart size={20} className="text-gray-600 group-hover:text-medical-green transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-medical-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="lg:hidden ml-auto p-2 text-dark-text" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Bottom Row / Sub-Nav (Desktop Only) */}
            <div className="hidden lg:block border-t border-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-12 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.title}
                                to={link.path}
                                className="text-sm font-bold text-gray-600 hover:text-medical-green transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-medical-green hover:after:w-full after:transition-all"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[101] bg-white pt-20 px-6 animate-in slide-in-from-top duration-300 overflow-y-auto pb-32">
                    <div className="flex flex-col gap-6 py-6 border-b border-gray-100">
                        <div onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <MapPin className="text-medical-green" size={20} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Sample from</span>
                                <span className="text-sm font-bold text-dark-text">{location}</span>
                            </div>
                        </div>
                        <div onClick={() => setIsSearchOverlayOpen(true)} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <Search className="text-gray-400" size={20} />
                            <span className="text-sm text-gray-400 font-medium">Search tests, packages...</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 py-8">
                        {navLinks.map(link => (
                            <Link key={link.title} to={link.path} className="text-lg font-bold text-dark-text flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                                {link.title} <ArrowRight size={18} className="text-gray-300" />
                            </Link>
                        ))}

                        <div className="h-px bg-gray-100 my-2" />

                        <Link to="/offers" className="flex items-center gap-4 text-lg font-bold text-medical-green" onClick={() => setIsMobileMenuOpen(false)}>
                            <Percent size={24} /> Exclusive Offers
                        </Link>

                        <Link to="/checkout" className="flex items-center gap-4 text-lg font-bold text-dark-text" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="relative">
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-medical-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            My Cart
                        </Link>

                        <div className="h-px bg-gray-100 my-2" />

                        {isAuthenticated ? (
                            <>
                                <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 bg-medical-green/5 p-4 rounded-2xl text-medical-green text-left">
                                    <div className="w-12 h-12 rounded-xl bg-medical-green text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                                        {(user?.avatar) ? (
                                            <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            (user?.name || 'U').charAt(0)
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Dashboard</span>
                                        <span className="text-lg font-black">{user?.name || 'User'}</span>
                                    </div>
                                </button>
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="flex items-center gap-3 text-lg font-bold text-red-500 px-4">
                                    <LogOut size={24} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-lg font-bold text-medical-green mt-4 px-4">
                                <UserCircle size={24} /> Login / Signup
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                currentLocation={location}
                onSelect={(city) => {
                    if (city === 'Current Location') {
                        getLocation();
                    } else {
                        setLocation(city);
                    }
                }}
            />
            <SearchOverlay
                isOpen={isSearchOverlayOpen}
                onClose={() => setIsSearchOverlayOpen(false)}
                initialQuery={initialSearchQuery}
            />
        </header>
    );
};

export default Navbar;
