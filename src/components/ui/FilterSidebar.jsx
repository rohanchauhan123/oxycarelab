import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';

const FilterSidebar = ({ 
    isOpen, 
    onClose, 
    selectedCategories, 
    toggleCategory, 
    selectedLabs, 
    toggleLab,
    sortBy,
    setSortBy,
    clearFilters
}) => {
    const { testCategories, labs } = useData();

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div className={`fixed inset-0 z-[2000] lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

                {/* Mobile Sidebar Content */}
                <aside className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Filter size={24} className="text-medical-green" /> Filters
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 text-gray-400 hover:text-dark-text rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <FilterContent 
                            categories={testCategories} 
                            labs={labs} 
                            selectedCategories={selectedCategories}
                            toggleCategory={toggleCategory}
                            selectedLabs={selectedLabs}
                            toggleLab={toggleLab}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            clearFilters={clearFilters}
                        />
                    </div>
                </aside>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0 h-fit sticky top-32">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-8 text-medical-green">
                        <Filter size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter Tests</span>
                    </div>
                    <FilterContent 
                        categories={testCategories} 
                        labs={labs} 
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        selectedLabs={selectedLabs}
                        toggleLab={toggleLab}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        clearFilters={clearFilters}
                    />
                </div>
            </aside>
        </>
    );
};

const FilterContent = ({ 
    categories, 
    labs, 
    selectedCategories, 
    toggleCategory, 
    selectedLabs, 
    toggleLab,
    sortBy,
    setSortBy,
    clearFilters
}) => (
    <div className="space-y-10">
        {/* Sort */}
        <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sort By</h4>
            <div className="relative">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green cursor-pointer appearance-none"
                >
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Distance</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Categories */}
        <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                            selectedCategories.includes(cat.filter) 
                            ? 'border-medical-green bg-medical-green/5' 
                            : 'border-gray-100 group-hover:border-medical-green/40'
                        }`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedCategories.includes(cat.filter)}
                                onChange={() => toggleCategory(cat.filter)}
                            />
                            <div className={`w-2.5 h-2.5 bg-medical-green rounded-[3px] transition-all ${
                                selectedCategories.includes(cat.filter) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`} />
                        </div>
                        <span className={`text-sm font-bold transition-colors ${
                            selectedCategories.includes(cat.filter) ? 'text-dark-text' : 'text-gray-400 group-hover:text-dark-text'
                        }`}>{cat.name}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Labs */}
        <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Partner Labs</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                {labs.map((lab) => (
                    <label key={lab.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                            selectedLabs.includes(lab.name) 
                            ? 'border-medical-green bg-medical-green/5' 
                            : 'border-gray-100 group-hover:border-medical-green/40'
                        }`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedLabs.includes(lab.name)}
                                onChange={() => toggleLab(lab.name)}
                            />
                            <div className={`w-2.5 h-2.5 bg-medical-green rounded-[3px] transition-all ${
                                selectedLabs.includes(lab.name) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`} />
                        </div>
                        <span className={`text-sm font-bold transition-colors ${
                            selectedLabs.includes(lab.name) ? 'text-dark-text' : 'text-gray-400 group-hover:text-dark-text'
                        }`}>{lab.name}</span>
                    </label>
                ))}
            </div>
        </div>

        <button 
            onClick={clearFilters}
            className="w-full py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
        >
            Clear All Filters
        </button>
    </div>
);

export default FilterSidebar;
