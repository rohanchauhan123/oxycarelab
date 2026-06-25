import React, { useState, useEffect } from 'react';
import { 
    Zap, 
    Plus, 
    Trash2, 
    Clock, 
    Users, 
    TrendingUp, 
    X, 
    Save, 
    AlertCircle, 
    CheckCircle2,
    Settings2,
    MoveUp,
    MoveDown
} from 'lucide-react';

const RuleEngine = () => {
    const [rules, setRules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const ruleTypes = [
        { id: 'time_based', name: 'Time Based', icon: Clock, desc: 'Peak hours/Night discounts' },
        { id: 'user_type', name: 'User Based', icon: Users, desc: 'First-time/Subscriber special prices' },
        { id: 'demand_based', name: 'Demand Based', icon: TrendingUp, desc: 'Surge pricing for high traffic' },
    ];

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock API call
            setMessage({ type: 'success', text: 'Rule saved successfully!' });
            setIsModalOpen(false);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save rule.' });
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
                        Pricing <span className="text-medical-green">Rule</span> Engine
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Define logic-based price adjustments and priorities</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingRule({
                            rule_type: 'time_based',
                            adjustment_type: 'increase',
                            adjustment_value: 0,
                            priority: 0,
                            condition_json: { start_hour: 18, end_hour: 21 }
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-dark-text text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-gray-900/10"
                >
                    <Plus size={16} /> Create New Rule
                </button>
            </div>

            {/* Rule Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
                {rules.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300">
                            <Zap size={40} strokeWidth={1} />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-black text-dark-text uppercase italic">No Active Rules</p>
                            <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto">
                                Everything is currently static. Create rules to automate price surges or discounts based on time or user behavior.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-medical-green/10 text-medical-green px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-medical-green hover:text-white transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    // Logic to map rules with priority controls
                    null
                )}
            </div>

            {/* Configurable rule types info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ruleTypes.map((type) => (
                    <div key={type.id} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4 group hover:border-medical-green/20 transition-all">
                        <div className="p-4 bg-gray-50 rounded-2xl w-fit text-gray-400 group-hover:bg-medical-green/10 group-hover:text-medical-green transition-all">
                            <type.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-dark-text uppercase tracking-tight text-sm italic">{type.name}</h3>
                            <p className="text-gray-500 text-xs font-medium leading-relaxed mt-1">{type.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-black text-dark-text uppercase italic">
                                Configure <span className="text-medical-green">Rule</span>
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rule Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {ruleTypes.map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setEditingRule(prev => ({ ...prev, rule_type: type.id }))}
                                                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                                                    editingRule?.rule_type === type.id 
                                                    ? 'bg-medical-green/5 border-medical-green text-medical-green' 
                                                    : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                                                }`}
                                            >
                                                <type.icon size={20} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{type.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adjustment Type</label>
                                        <select 
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                            value={editingRule?.adjustment_type}
                                            onChange={(e) => setEditingRule(prev => ({ ...prev, adjustment_type: e.target.value }))}
                                        >
                                            <option value="increase">Price Surge (+)</option>
                                            <option value="decrease">Discount (-)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adjustment Value (₹)</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-medical-green/20 border border-transparent focus:border-medical-green/30 font-semibold"
                                            placeholder="e.g. 50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Condition Settings</label>
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        {editingRule?.rule_type === 'time_based' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Hour (0-23)</span>
                                                    <input type="number" className="w-full bg-white p-3 rounded-xl border border-gray-100 font-bold" defaultValue={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Hour (0-23)</span>
                                                    <input type="number" className="w-full bg-white p-3 rounded-xl border border-gray-100 font-bold" defaultValue={21} />
                                                </div>
                                            </div>
                                        )}
                                        {editingRule?.rule_type === 'user_type' && (
                                            <select className="w-full bg-white p-3 rounded-xl border border-gray-100 font-bold">
                                                <option>First Time User</option>
                                                <option>Returning Customer</option>
                                                <option>Premium Subscriber</option>
                                            </select>
                                        )}
                                        {editingRule?.rule_type === 'demand_based' && (
                                            <p className="text-xs text-gray-500 font-medium italic">Calculated automatically based on booking frequency in last 24h.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-dark-text text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Activate Rule'}
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

export default RuleEngine;
