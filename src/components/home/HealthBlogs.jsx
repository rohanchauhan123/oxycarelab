import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const HealthBlogs = () => {
    const navigate = useNavigate();
    const { blogs: contextBlogs } = useData();
    const scrollRef = useRef(null);

    // Take top 6 blogs for home page
    const blogs = (contextBlogs || []).slice(0, 6);

    const handleImageError = (e) => {
        e.target.src = '/assets/blogs/preventive_care.png';
    };

    if (blogs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-6 px-4">
                    <div className="inline-flex items-center gap-2 bg-medical-green/5 px-4 py-2 rounded-full text-medical-green text-[10px] font-black uppercase tracking-[0.2em]">
                        Health Insights
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-dark-text tracking-tight uppercase">
                        Latest from <span className="text-medical-green">OxyCare Voice</span>
                    </h2>
                    <p className="text-slate-500 font-bold max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Expert medical advice, health tips, and diagnostics guides curated for your well-being.
                    </p>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {blogs.map((blog, idx) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[280px] md:min-w-[380px] lg:min-w-[400px] snap-start group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="relative h-48 md:h-56 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-medical-green shadow-lg border border-white/20">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-medical-green" />
                                        {blog.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                                        <User size={14} className="text-medical-green" />
                                        {blog.author}
                                    </div>
                                </div>

                                <h3 className="text-lg md:text-xl font-black text-dark-text mb-4 leading-tight group-hover:text-medical-green transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed mb-8 flex-1 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <button
                                    onClick={() => navigate(`/blog?id=${blog.id}`)}
                                    className="pt-6 border-t border-slate-50 flex items-center gap-2 text-medical-green text-[10px] font-black uppercase tracking-[0.2em] group/btn"
                                >
                                    Read Article <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HealthBlogs;
