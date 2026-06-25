import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Share2, Bookmark, X, Clock, Quote, Check, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';

const Blog = () => {
    const { blogs } = useData();
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Diagnostics", "Wellness", "Nutrition", "Mental Health", "New Technology"];

    const handleImageError = (e) => {
        e.target.src = '/assets/blogs/preventive_care.png';
    };

    const filteredBlogs = blogs.filter(blog =>
        activeCategory === "All" || blog.category === activeCategory
    );

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-2 bg-medical-green/10 text-medical-green rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        Health Blog
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black text-dark-text mb-6 tracking-tight"
                    >
                        Latest in <span className="text-medical-green">Health & Wellness</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
                    >
                        Stay updated with expert medical advice, diagnostic guides, and wellness tips for a better lifestyle.
                    </motion.p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? "bg-medical-green text-white shadow-lg shadow-medical-green/20" : "bg-white text-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {(filteredBlogs || []).length > 0 ? (
                        (filteredBlogs || []).map((post, index) => (
                            <motion.div 
                                key={post?.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
                            >
                            <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setSelectedBlog(post)}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-medical-green shadow-sm">
                                    {post.category}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-6 text-xs font-bold text-gray-400 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-medical-green" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} className="text-medical-green" />
                                        {post.author}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-dark-text mb-4 leading-tight group-hover:text-medical-green transition-colors cursor-pointer" onClick={() => setSelectedBlog(post)}>
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 group/btn font-black text-medical-green !p-0 hover:bg-transparent"
                                        onClick={() => setSelectedBlog(post)}
                                    >
                                        Read More
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                    <div className="flex gap-4">
                                        <button className="text-gray-400 hover:text-medical-green transition-colors">
                                            <Bookmark size={20} />
                                        </button>
                                        <button className="text-gray-400 hover:text-medical-green transition-colors">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-black text-dark-text uppercase tracking-tight">No Articles Found</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Try selecting a different category.</p>
                        </div>
                    )}
                </div>

                {/* Newsletter Section */}
                <div className="mt-20 max-w-4xl mx-auto bg-medical-green rounded-[48px] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="relative z-10 text-white">
                        <h2 className="text-3xl font-black mb-4">Subscribe for Health Tips</h2>
                        <p className="text-white/80 font-medium mb-10 max-w-md mx-auto">Get the latest medical insights and health packages delivered to your inbox.</p>
                        <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-medium"
                            />
                            <Button className="bg-white !text-medical-green py-4 px-10 rounded-2xl">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Read More Modal */}
            <AnimatePresence>
                {selectedBlog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBlog(null)}
                            className="absolute inset-0 bg-dark-text/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] overflow-hidden relative z-10 flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-dark-text hover:text-medical-green shadow-xl transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="overflow-y-auto custom-scrollbar pb-12">
                                {/* Hero Image */}
                                <div className="h-[400px] w-full relative">
                                    <img 
                                        src={selectedBlog.image} 
                                        alt={selectedBlog.title} 
                                        onError={handleImageError}
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-4 py-1.5 bg-medical-green text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-green/20">
                                                {selectedBlog.category}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-3xl">
                                            {selectedBlog.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="px-8 md:px-12 pt-10">
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-medical-green/10 flex items-center justify-center">
                                                <User size={20} className="text-medical-green" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Written By</p>
                                                <p className="text-sm font-black text-dark-text">{selectedBlog.author}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <Calendar size={20} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Published On</p>
                                                <p className="text-sm font-black text-dark-text">{selectedBlog.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                <Clock size={20} className="text-orange-500" />
                                            </div>
                                    <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Read Time</p>
                                                <p className="text-sm font-black text-dark-text">{selectedBlog.readTime || '5 Min Read'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="px-8 md:px-12 pb-12">
                                        <div className="prose prose-lg max-w-none">
                                            <div className="flex gap-4 mb-8">
                                                <Quote size={48} className="text-medical-green/20 shrink-0" />
                                                <p className="text-xl font-bold text-dark-text italic leading-relaxed">
                                                    {selectedBlog.excerpt}
                                                </p>
                                            </div>

                                            <div className="text-gray-600 font-medium leading-[1.8] space-y-6">
                                                {(selectedBlog.content || '').split('\n\n').map((para, i) => (
                                                    <p key={i}>{para}</p>
                                                ))}
                                                
                                                {(!selectedBlog.content) && (
                                                    <p className="italic text-gray-400 text-center py-10">This article is being prepared by our medical experts. Please check back soon.</p>
                                                )}

                                                <p>Regular health monitoring is the cornerstone of preventive healthcare. By staying informed through these articles and scheduling periodic diagnostic tests, you can ensure a healthier future for yourself and your loved ones.</p>
                                            </div>

                                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mt-10">
                                                <h4 className="text-lg font-black text-dark-text mb-4 uppercase tracking-tight">Key Takeaways:</h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3 text-sm">
                                                        <div className="w-5 h-5 rounded-full bg-medical-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check size={12} className="text-medical-green" />
                                                        </div>
                                                        Early detection is crucial for successful treatment of most medical conditions.
                                                    </li>
                                                    <li className="flex items-start gap-3 text-sm">
                                                        <div className="w-5 h-5 rounded-full bg-medical-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check size={12} className="text-medical-green" />
                                                        </div>
                                                        Consult with verified medical professionals to interpret your test results.
                                                    </li>
                                                    <li className="flex items-start gap-3 text-sm">
                                                        <div className="w-5 h-5 rounded-full bg-medical-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check size={12} className="text-medical-green" />
                                                        </div>
                                                        Maintain a balanced lifestyle alongside regular medical screenings.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                                            <div className="flex gap-4">
                                                <Button className="bg-medical-green text-white px-8 rounded-2xl gap-2 font-black uppercase tracking-widest py-4 shadow-lg shadow-medical-green/20">
                                                    Share Article <Share2 size={18} />
                                                </Button>
                                                <button className="h-14 w-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-medical-green hover:bg-gray-50 transition-all">
                                                    <Bookmark size={20} />
                                                </button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSelectedBlog(null)}
                                                className="font-bold text-gray-400"
                                            >
                                                Back to Blog
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Blog;
