import React, { useState } from 'react';
import { 
    Settings, 
    Trash2, 
    RefreshCcw, 
    Database, 
    AlertTriangle, 
    CheckCircle2, 
    FlaskConical, 
    Building2, 
    FileText,
    History
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const AdminSettings = () => {
    const { 
        packages, 
        tests, 
        labs, 
        bookings, 
        removeDemoData, 
        clearAllData 
    } = useData();
    
    const [status, setStatus] = useState(null); // { message, type }
    const [isLoading, setIsLoading] = useState(false);

    const handleRemoveDemo = async () => {
        if (window.confirm('This will remove the default Healthians, CRL, and other demo labs/tests. Your manually added data will be kept. Proceed?')) {
            setIsLoading(true);
            try {
                await removeDemoData();
                showStatus('Demo data removed successfully!', 'success');
            } catch (err) {
                showStatus('Failed to remove demo data.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFactoryReset = async () => {
        const confirm1 = window.confirm('CRITICAL: This will PERMANENTLY DELETE ALL DATA including labs, tests, bookings, and users. This cannot be undone. Are you sure?');
        if (confirm1) {
            const confirm2 = window.prompt('Type "DELETE EVERYTHING" to confirm factory reset:');
            if (confirm2 === 'DELETE EVERYTHING') {
                setIsLoading(true);
                try {
                    await clearAllData();
                    // clearAllData reloads the page
                } catch (err) {
                    showStatus('Reset failed.', 'error');
                    setIsLoading(false);
                }
            }
        }
    };

    const showStatus = (message, type) => {
        setStatus({ message, type });
        setTimeout(() => setStatus(null), 4000);
    };

    const stats = [
        { label: 'Total Labs', value: labs.length, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Tests', value: tests.length, icon: FlaskConical, color: 'text-medical-green', bg: 'bg-medical-green/10' },
        { label: 'Total Bookings', value: bookings.length, icon: History, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Total Packages', value: packages.length, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-dark-text tracking-tight mb-2 flex items-center gap-4">
                        <Settings className="text-medical-green animate-[spin_4s_linear_infinite]" size={40} /> System Settings
                    </h1>
                    <p className="text-gray-500 font-medium">Manage database state and system-wide maintenance tasks.</p>
                </div>
            </div>

            {/* Status Notifications */}
            {status && (
                <div className={`p-5 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 border ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    <span className="font-bold tracking-tight">{status.message}</span>
                </div>
            )}

            {/* System Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-dark-text">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Maintenance Zone */}
            <div className="bg-white rounded-[44px] border border-gray-100 shadow-xl shadow-medical-green/5 overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                    <h2 className="text-2xl font-black text-dark-text tracking-tight mb-2 flex items-center gap-3">
                        <Database className="text-medical-green" size={28} /> Database Maintenance
                    </h2>
                    <p className="text-gray-500 font-medium text-sm">Critical tools to manage your application data lifecycle.</p>
                </div>

                <div className="p-10 space-y-12">
                    {/* Remove Demo Data */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                        <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-black text-dark-text flex items-center gap-3 decoration-medical-green/20 group-hover:underline">
                                Remove Template Demo Data
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl">
                                Clean up your dashboard by removing the built-in Healthians, CRL, and Modern Diagnostics sample data. 
                                <span className="text-medical-green font-bold"> This will preserve any labs or tests you have manually added.</span>
                            </p>
                        </div>
                        <Button 
                            onClick={handleRemoveDemo}
                            disabled={isLoading}
                            variant="outline"
                            className="h-16 px-8 rounded-2xl border-medical-green text-medical-green font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-medical-green hover:text-white transition-all whitespace-nowrap"
                        >
                            <Trash2 size={20} /> Clear Demo Content
                        </Button>
                    </div>

                    <div className="h-[1px] bg-gray-50" />

                    {/* Factory Reset */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                        <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-black text-red-600 flex items-center gap-3 decoration-red-100 group-hover:underline">
                                <AlertTriangle size={24} /> Factory Reset (Wipe All)
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl">
                                Completely reset the application environment. This deletes 
                                <span className="text-red-600 font-bold"> EVERY single record </span> 
                                from the database and local storage. Useful for starting fresh before going live.
                            </p>
                        </div>
                        <Button 
                            onClick={handleFactoryReset}
                            disabled={isLoading}
                            className="h-16 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-red-100 whitespace-nowrap"
                        >
                            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} /> Factory Reset Database
                        </Button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="p-8 bg-gray-50/50 flex items-center justify-center gap-8 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-medical-green" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Environment: Development</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage: IndexedDB (Dexie)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Version: 2.0.4-LTS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
