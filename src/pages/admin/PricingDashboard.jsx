import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
    Plus, 
    Search, 
    Filter, 
    ChevronDown, 
    Edit, 
    Trash2, 
    Save, 
    X, 
    TrendingUp, 
    DollarSign, 
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const PricingDashboard = () => {
    const { tests, packages, labs, serviceableCities } = useData();
    const [activeTab, setActiveTab] = useState('tests');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPricing, setEditingPricing] = useState(null);
    const [pricingList, setPricingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch existing pricing from API
        const fetchPricing = async () => {
            setLoading(true);
            try {
                // For now, we'll mock some data or use empty array
                // In production, this would be: 
                // const res = await axios.get('/api/admin/pricing');
                setPricingList([]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPricing();
    }, [activeTab]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock API call
            // await axios.post(`/api/admin/${activeTab}-pricing`, editingPricing);
            setMessage({ type: 'success', text: 'Pricing updated successfully!' });
            setIsEditModalOpen(false);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update pricing.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-dark-text tracking-tight uppercase italic">
                        Advanced <span className="text-medical-green">Pricing</span> Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Manage lab-wise and city-wise dynamic pricing logic</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingPricing({ 
                            type: activeTab,
                            lab_cost: 0,
                            margin_type: 'percentage',
                            margin_value: 10,
                            city: serviceableCities[0]?.name || 'Delhi'
                        });
                        setIsEditModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-medical-green text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-medical-green/20"
                >
                    <Plus size={16} /> Add New Pricing
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Active Pricing', value: '124', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg. Margin', value: '24.5%', icon: TrendingUp, color: 'text-medical-green', bg: 'bg-medical-green/5' },
                    { label: 'Cities Covered', value: serviceableCities.length, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-[2rem] border border-white bg-white/60 backdrop-blur-xl shadow-xl shadow-gray-200/50 flex items-center gap-5 group hover:border-medical-green/20 transition-all`}>
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-dark-text">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Tabs & Search */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50">
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
                        {['tests', 'packages'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab 
                                    ? 'bg-white text-medical-green shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-3 bg-gray-50 border border-transparent focus:border-medical-green/30 focus:bg-white rounded-2xl text-sm font-semibold outline-none w-72 transition-all"
                            />
                        </div>
                        <select 
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-gray-50 px-6 py-3 rounded-2xl text-sm font-semibold border border-transparent focus:border-medical-green/30 outline-none cursor-pointer"
                        >
                            <option>All Cities</option>
                            {serviceableCities.map(city => <option key={city.id}>{city.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entity Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lab</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cost/Margin</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Price</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Empty State Mock */}
                            {pricingList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                <AlertCircle size={48} strokeWidth={1} />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No custom pricing found</p>
                                                <p className="text-gray-400 text-sm">Add a new pricing rule to get started</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Data mapping would go here
                                null
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-black text-dark-text uppercase italic">
                                Edit <span className="text-medical-green">Pricing</span>
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select {activeTab === 'tests' ? 'Test' : 'Package'}</label>
                                    <select 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                        required
                                    >
                                        <option value="">Select {activeTab}</option>
                                        {(activeTab === 'tests' ? tests : packages).map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Lab</label>
                                    <select 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                        required
                                    >
                                        <option value="">Select Lab</option>
                                        {labs.map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                                    <select 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                        required
                                    >
                                        {serviceableCities.map(city => <option key={city.id}>{city.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lab Cost (Base)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                        placeholder="Enter cost"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Margin Type</label>
                                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                                        {['fixed', 'percentage'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setEditingPricing(prev => ({ ...prev, margin_type: type }))}
                                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    editingPricing?.margin_type === type ? 'bg-white text-medical-green shadow-sm' : 'text-gray-400'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Margin Value</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                        placeholder={editingPricing?.margin_type === 'percentage' ? 'e.g. 15%' : 'e.g. ₹50'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-medical-green text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-medical-green/20 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Pricing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {message && (
                <div className={`fixed bottom-8 right-8 z-[200] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
                    message.type === 'success' ? 'bg-medical-green text-white' : 'bg-red-500 text-white'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm tracking-wide">{message.text}</span>
                </div>
            )}
        </div>
    );
};

export default PricingDashboard;
