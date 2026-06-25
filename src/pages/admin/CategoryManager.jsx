import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, LayoutGrid, CheckCircle2, FlaskConical, Stethoscope } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';

const CategoryManager = () => {
    const { testCategories, addCategory, updateCategory, deleteCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        filter: '',
        type: 'Pathology',
        status: 'Active'
    });

    const handleSave = (e) => {
        e.preventDefault();
        if (editingCategory) {
            updateCategory(editingCategory.id, formData);
        } else {
            addCategory(formData);
        }
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', image: '', filter: '', type: 'Pathology', status: 'Active' });
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        setFormData(cat);
        setIsModalOpen(true);
    };

    const filteredCategories = testCategories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Category Management</h1>
                    <p className="text-grey-text">Manage Pathology and Radiology categories shown on the home page.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 md:w-80 shadow-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', image: '', filter: '', type: 'Pathology', status: 'Active' });
                            setIsModalOpen(true);
                        }}
                        className="h-12 bg-dark-text hover:bg-black gap-2"
                    >
                        <Plus size={18} /> Add Category
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        layout
                        className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 shrink-0">
                                <div className="absolute inset-0 bg-gray-50 rounded-full border border-gray-100" />
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="relative w-full h-full object-contain p-2"
                                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + cat.name }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-dark-text truncate">{cat.name}</h3>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cat.type === 'Pathology' ? 'bg-medical-green/10 text-medical-green' : 'bg-brand-blue/10 text-brand-blue'}`}>
                                        {cat.type}
                                    </span>
                                </div>
                                <p className="text-[10px] text-grey-text font-bold uppercase tracking-widest">Filter: {cat.filter}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="p-2 text-gray-400 hover:text-medical-green hover:bg-medical-green/5 rounded-xl transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-black text-dark-text">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-dark-text transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-dark-text outline-none focus:border-medical-green"
                                        placeholder="e.g. CT Scans"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filter Key</label>
                                    <input
                                        type="text" required
                                        value={formData.filter}
                                        onChange={e => setFormData({ ...formData, filter: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-dark-text outline-none focus:border-medical-green"
                                        placeholder="CT"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-dark-text outline-none focus:border-medical-green appearance-none"
                                    >
                                        <option value="Pathology">Pathology</option>
                                        <option value="Radiology">Radiology</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image Path</label>
                                    <input
                                        type="text" required
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-medium text-grey-text outline-none focus:border-medical-green"
                                        placeholder="/assets/categories/name.png"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 bg-medical-green hover:bg-emerald-600 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-medical-green/20">
                                {editingCategory ? 'Update Category' : 'Save Category'}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
