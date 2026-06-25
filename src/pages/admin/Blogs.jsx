import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Calendar,
    User,
    Check,
    Upload,
    X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const AdminBlogs = () => {
    const { blogs, addBlog, updateBlog, deleteBlog } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const fileInputRef = React.useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Wellness',
        author: '',
        image: '',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    const categories = ["Diagnostics", "Wellness", "Nutrition", "Mental Health", "New Technology"];

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({ ...blog });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                category: 'Wellness',
                author: '',
                image: '',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBlog) {
            updateBlog(editingBlog.id, formData);
        } else {
            addBlog(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            deleteBlog(id);
        }
    };

            const handleImageError = (e) => {
                e.target.src = '/assets/blogs/preventive_care.png';
            };

            return (
                <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight uppercase">Blog Management</h1>
                    <p className="text-gray-500 font-medium">Create and manage health & wellness articles</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-medical-green hover:bg-emerald-600 text-white gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-medical-green/20"
                >
                    <Plus size={20} /> New Article
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green mb-4">
                        <FileText size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Articles</p>
                    <p className="text-2xl font-black text-dark-text">{blogs?.length || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                        <User size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Authors</p>
                    <p className="text-2xl font-black text-dark-text">{blogs ? [...new Set(blogs.map(b => b.author))].length : 0}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search articles by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-12 pr-4 outline-none focus:border-medical-green/30 transition-all font-medium"
                    />
                </div>
                <button className="h-14 px-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-2 text-gray-500 font-bold hover:bg-gray-50 transition-colors">
                    <Filter size={20} /> Filters
                </button>
            </div>

            {/* Blogs List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            layout
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group"
                        >
                            <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                                <img 
                                    src={blog.image} 
                                    alt={blog.title} 
                                    onError={handleImageError}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                            <div className="flex-1 py-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {blog.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Calendar size={12} /> {blog.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-dark-text mb-2 group-hover:text-medical-green transition-colors line-clamp-1">{blog.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-4">{blog.excerpt}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <User size={16} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{blog.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(blog)}
                                            className="flex items-center gap-1.5 text-medical-green font-black text-[10px] uppercase tracking-widest group/img hover:bg-medical-green/5 px-3 py-2 rounded-xl transition-all"
                                        >
                                            <Upload size={14} className="group-hover/img:scale-110 transition-transform" /> Change Image
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(blog)}
                                            className="p-2 text-gray-400 hover:text-medical-green hover:bg-medical-green/5 rounded-lg transition-all"
                                            title="Edit Details"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Article"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
                        <FileText size={48} className="text-gray-100 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">No Articles Found</h3>
                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">Try a different search term or create a new article.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-dark-text/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-dark-text uppercase tracking-tight">
                                        {editingBlog ? 'Edit Article' : 'New Article'}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium">Fill in the details for your blog post</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-text transition-colors shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Article Title</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-medium"
                                            placeholder="e.g. Understanding CBC Blood Test"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Author Name</label>
                                        <input
                                            required
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-medium"
                                            placeholder="e.g. Dr. Aarti Sharma"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl px-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-bold appearance-none cursor-pointer"
                                        >
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex items-center justify-between ml-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Article Featured Image</label>
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({ ...formData, showUrlInput: !formData.showUrlInput })}
                                                className="text-[10px] font-black text-medical-green uppercase tracking-widest hover:underline"
                                            >
                                                {formData.showUrlInput ? 'Hide URL Input' : 'Edit URL manually'}
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({ ...formData, image: reader.result });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            
                                            {/* Premium Click-to-Upload Zone */}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`
                                                    relative w-full h-56 rounded-[32px] border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                                                    ${formData.image 
                                                        ? 'border-medical-green/20 bg-white' 
                                                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-medical-green/40'
                                                    }
                                                `}
                                            >
                                                {formData.image ? (
                                                    <>
                                                        <img 
                                                            src={formData.image} 
                                                            alt="Preview" 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            onError={handleImageError}
                                                        />
                                                        <div className="absolute inset-0 bg-dark-text/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                                                <Upload size={20} />
                                                            </div>
                                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Click to Change Image</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                        <div className="w-16 h-16 bg-medical-green/10 rounded-3xl flex items-center justify-center text-medical-green group-hover:scale-110 transition-transform">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-black text-dark-text uppercase tracking-tight">Click to Upload Featured Image</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG or WebP supported</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {formData.showUrlInput && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="relative"
                                                >
                                                    <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.image}
                                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                        className="w-full h-14 bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-medium text-sm"
                                                        placeholder="Paste image URL here manually..."
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Excerpt (Short Summary)</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-medium resize-none"
                                        placeholder="Brief summary for the blog card..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Content</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 outline-none focus:bg-white focus:border-medical-green/20 transition-all font-medium resize-none"
                                        placeholder="Write your article content here..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-14 px-8 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <Button
                                        type="submit"
                                        className="h-14 bg-dark-text text-white px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-dark-text/20"
                                    >
                                        {editingBlog ? 'Save Changes' : 'Publish Article'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBlogs;
