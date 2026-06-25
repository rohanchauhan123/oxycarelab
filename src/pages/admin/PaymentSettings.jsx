import React, { useState } from 'react';
import {
    CreditCard,
    ShieldCheck,
    Key,
    Settings,
    CheckCircle2,
    AlertCircle,
    Info,
    ExternalLink,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const PAYMENT_GATEWAYS = [
    {
        id: 'phonepe',
        name: 'PhonePe',
        description: 'Accept payments via PhonePe UPI and Cards',
        icon: 'https://cdn.worldvectorlogo.com/logos/phonepe-1.svg',
        color: '#5f259f'
    },
    {
        id: 'paytm',
        name: 'Paytm',
        description: 'Most popular Indian wallet and payment gateway',
        icon: 'https://cdn.worldvectorlogo.com/logos/paytm-1.svg',
        color: '#00baf2'
    },
    {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'Complete payments solution for Indian businesses',
        icon: 'https://cdn.worldvectorlogo.com/logos/razorpay.svg',
        color: '#3395ff'
    },
    {
        id: 'cashfree',
        name: 'Cashfree',
        description: 'Fastest growing payment gateway in India',
        icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_pXqU3VwY5O9R0eX8f8f8f8f8f8f8f8f8f8&s',
        color: '#2951ed'
    }
];

const PaymentSettings = () => {
    const { paymentSettings, setPaymentSettings: setContextPayment } = useData();
    const [settings, setSettings] = useState(paymentSettings);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        setError('');

        const currentGateway = settings.gateways[settings.activeGateway];
        if (!currentGateway.apiKey || !currentGateway.secretKey || !currentGateway.merchantId) {
            setError('Please fill in all the configuration fields for the active gateway.');
            return;
        }

        localStorage.setItem('oxycare_payment_settings', JSON.stringify(settings));
        setContextPayment(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'isActive' || name === 'env') {
            setSettings(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                gateways: {
                    ...prev.gateways,
                    [prev.activeGateway]: {
                        ...prev.gateways[prev.activeGateway],
                        [name]: value
                    }
                }
            }));
        }
    };

    const handleGatewaySelect = (id) => {
        setSettings(prev => ({ ...prev, activeGateway: id }));
    };

    const activeGateway = PAYMENT_GATEWAYS.find(g => g.id === settings.activeGateway);
    const currentConfig = settings.gateways[settings.activeGateway] || { apiKey: '', secretKey: '', merchantId: '' };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Payment Settings</h1>
                    <p className="text-grey-text">Configure your payment gateways for handling customer transactions.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-blue-100 italic">
                    <ShieldCheck size={14} />
                    Secure Configuration
                </div>
            </div>

            {/* Gateway Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PAYMENT_GATEWAYS.map((gateway) => (
                    <button
                        key={gateway.id}
                        onClick={() => handleGatewaySelect(gateway.id)}
                        className={`group relative p-6 rounded-[24px] border-2 transition-all duration-300 text-left ${settings.gateway === gateway.id
                            ? 'bg-white border-medical-green shadow-xl shadow-medical-green/5'
                            : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                    >
                        {settings.gateway === gateway.id && (
                            <div className="absolute top-4 right-4 text-medical-green">
                                <CheckCircle2 size={24} />
                            </div>
                        )}
                        <div className="w-12 h-12 mb-4 p-2 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img src={gateway.icon} alt={gateway.name} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-black text-lg text-dark-text tracking-tight mb-1">{gateway.name}</h3>
                        <p className="text-xs text-grey-text font-medium leading-relaxed">{gateway.description}</p>
                    </button>
                ))}
            </div>

            {/* Configuration Form */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-medical-green rounded-2xl flex items-center justify-center text-white">
                            <Settings size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-dark-text tracking-tight">Configuration: {activeGateway?.name}</h2>
                            <p className="text-sm font-bold text-grey-text uppercase tracking-widest text-[10px]">Merchant Application Settings</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${settings.isActive ? 'text-medical-green' : 'text-gray-400'}`}>
                                {settings.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={settings.isActive}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${settings.isActive ? 'bg-medical-green' : 'bg-gray-200'}`} />
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.isActive ? 'translate-x-6' : ''} shadow-sm`} />
                            </div>
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8">
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* API Key */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-dark-text uppercase tracking-widest ml-1">
                                <Key size={14} className="text-medical-green" /> API / App Key
                            </label>
                            <input
                                type="text"
                                name="apiKey"
                                value={currentConfig.apiKey}
                                onChange={handleChange}
                                placeholder="Enter your provider API key"
                                className="w-full bg-gray-50 border border-transparent focus:border-medical-green/30 focus:bg-white rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-dark-text shadow-inner"
                            />
                        </div>

                        {/* Secret Key */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-dark-text uppercase tracking-widest ml-1">
                                <ShieldCheck size={14} className="text-medical-green" /> Secret Key / Salt Key
                            </label>
                            <input
                                type="password"
                                name="secretKey"
                                value={currentConfig.secretKey}
                                onChange={handleChange}
                                placeholder="••••••••••••••••"
                                className="w-full bg-gray-50 border border-transparent focus:border-medical-green/30 focus:bg-white rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-dark-text shadow-inner"
                            />
                        </div>

                        {/* Merchant ID */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-dark-text uppercase tracking-widest ml-1">
                                <Info size={14} className="text-medical-green" /> Merchant ID
                            </label>
                            <input
                                type="text"
                                name="merchantId"
                                value={currentConfig.merchantId}
                                onChange={handleChange}
                                placeholder="MID-XXXXXXX"
                                className="w-full bg-gray-50 border border-transparent focus:border-medical-green/30 focus:bg-white rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-dark-text shadow-inner"
                            />
                        </div>

                        {/* Environment */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-dark-text uppercase tracking-widest ml-1">
                                <Settings size={14} className="text-medical-green" /> Environment
                            </label>
                            <select
                                name="env"
                                value={settings.env}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-transparent focus:border-medical-green/30 focus:bg-white rounded-[20px] px-6 py-4 outline-none transition-all font-black text-dark-text shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="sandbox">Sandbox (Testing)</option>
                                <option value="production">Production (Live)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-soft-green/30 border border-medical-green/10 p-6 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-medical-green">
                                <Info size={20} />
                            </div>
                            <p className="text-sm font-bold text-medical-green leading-relaxed text-center sm:text-left">
                                Need help getting your API credentials? <br />
                                <span className="text-xs opacity-70 font-medium">Check the {activeGateway?.name} developer documentation.</span>
                            </p>
                        </div>
                        <a
                            href={`https://www.google.com/search?q=${activeGateway?.name}+gateway+api+documentation`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-white text-medical-green rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            Documentation <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center gap-4">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto min-w-[200px] h-14 bg-dark-text hover:bg-black rounded-2xl flex items-center gap-3"
                        >
                            {isSaved ? (
                                <>
                                    <CheckCircle2 size={20} className="text-medical-green" />
                                    <span>Settings Saved!</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    <span>Save Configuration</span>
                                </>
                            )}
                        </Button>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {isSaved ? 'Your changes are now live across the platform.' : 'Credentials are encrypted and stored securely.'}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentSettings;
