import React, { useState } from 'react';
import { 
    MapPin, 
    Plus, 
    Search, 
    Trash2, 
    Edit, 
    X, 
    Building2, 
    CheckCircle2, 
    AlertCircle,
    Map
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const LocationManager = () => {
    const { serviceableCities, addCity, updateCity, deleteCity } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [formData, setFormData] = useState({ name: '', state: '' });
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const filteredCities = (serviceableCities || []).filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCity) {
                await updateCity(editingCity.id, formData);
                showStatus('City updated successfully', 'success');
            } else {
                await addCity(formData);
                showStatus('City added successfully', 'success');
            }
            closeModal();
        } catch (err) {
            showStatus('Failed to save city', 'error');
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            try {
                await deleteCity(id);
                showStatus('City removed successfully', 'success');
            } catch (err) {
                showStatus('Failed to delete city', 'error');
            }
        }
    };

    const openModal = (city = null) => {
        if (city) {
            setEditingCity(city);
            setFormData({ name: city.name, state: city.state });
        } else {
            setEditingCity(null);
            setFormData({ name: '', state: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCity(null);
        setFormData({ name: '', state: '' });
    };

    const showStatus = (message, type) => {
        setStatus({ message, type });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2 flex items-center gap-3">
                        <MapPin className="text-medical-green" size={32} /> Serviceable Cities
                    </h1>
                    <p className="text-gray-500 font-medium">Manage locations where OxyCare Labs provides doorstep services.</p>
                </div>
                <Button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl shadow-lg shadow-medical-green/20"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span className="font-bold uppercase tracking-widest text-xs">Add New City</span>
                </Button>
            </div>

            {/* Status Messages */}
            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm tracking-wide">{status.message}</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green">
                        <Building2 size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Cities</p>
                        <h3 className="text-2xl font-black text-dark-text">{serviceableCities.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Map size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">States Covered</p>
                        <h3 className="text-2xl font-black text-dark-text">
                            {new Set(serviceableCities.map(c => c.state)).size}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-medical-green transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search cities or states..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-14 pr-6 py-4 outline-none focus:bg-white focus:border-medical-green/30 transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">City Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">State</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCities.map((city) => (
                                <tr key={city.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-medical-green/10 group-hover:text-medical-green transition-all">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="font-bold text-dark-text">{city.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {city.state}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openModal(city)}
                                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit City"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(city.id, city.name)}
                                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete City"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCities.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                                        No cities found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-dark-text tracking-tight">
                                    {editingCity ? 'Edit City' : 'Add New City'}
                                </h2>
                                <button onClick={closeModal} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">City Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-dark-text outline-none focus:bg-white focus:border-medical-green/30 transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Aligarh"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">State Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 font-bold text-dark-text outline-none focus:bg-white focus:border-medical-green/30 transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Uttar Pradesh"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button type="button" variant="outline" onClick={closeModal} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-medical-green/20">
                                        {editingCity ? 'Update City' : 'Add City'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationManager;
