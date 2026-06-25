import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

// Image mapping for categories to keep the nice visuals
const categoryImages = {
    'Thyroid': '/assets/categories/thyroid.png',
    'Bone': '/assets/categories/bone_pain.png',
    'Gastro': '/assets/categories/gastro.png',
    'Kidney': '/assets/categories/kidney.png',
    'Liver': '/assets/categories/liver.png',
    'Diabetes': '/assets/categories/diabetes.png',
    'Full Body': '/assets/categories/full_body.png',
    'Heart': '/assets/categories/cardiology.png',
    'Ultrasound': '/assets/categories/ultrasound.png',
    'CT': '/assets/categories/ct_scan.png',
    'X-Ray': '/assets/categories/xray.png',
    'MRI': '/assets/categories/mri.png',
    'Endoscopy': '/assets/categories/endoscopy.png',
    'Cardiology': '/assets/categories/cardiology.png'
};

const CategorySection = ({ title, categories }) => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = React.useState(false);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

                if (scrollWidth > clientWidth) {
                    const itemWidth = scrollRef.current.children[0]?.clientWidth || 200;
                    const gap = 32; 
                    const scrollStep = itemWidth + gap;

                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scrollRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
                    }
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    if (!categories || categories.length === 0) return null;

    return (
        <div
            className="relative group/section"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex flex-col items-center text-center justify-center mb-12 px-4 max-w-7xl mx-auto relative">
                <h2 className="text-2xl md:text-3xl font-display font-black text-dark-text tracking-tight uppercase">
                    {title}
                </h2>
                <div className="w-16 h-1 mt-3 bg-medical-green rounded-full"></div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 hidden lg:flex">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2.5 rounded-full border border-gray-200 hover:bg-medical-green hover:text-white hover:border-medical-green transition-all shadow-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2.5 rounded-full border border-gray-200 hover:bg-medical-green hover:text-white hover:border-medical-green transition-all shadow-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className={`flex overflow-x-auto gap-6 md:gap-10 pb-8 px-4 max-w-[1400px] mx-auto snap-x snap-mandatory scrollbar-hide ${categories.length <= 5 ? 'justify-start md:justify-center' : 'justify-start'}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id || cat.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/book-test?category=${cat.filter}`)}
                        className="group flex flex-col items-center gap-4 cursor-pointer min-w-[130px] md:min-w-[160px] snap-start"
                    >
                        <div className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[3px] border-medical-green/80 shadow-lg group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-2 rounded-full border border-medical-green/10 group-hover:scale-110 transition-all duration-500" />

                            <div className="relative w-[75%] h-[75%] rounded-full overflow-hidden bg-white flex items-center justify-center p-3">
                                <img
                                    src={categoryImages[cat.filter] || '/assets/categories/default.png'}
                                    alt={cat.name}
                                    className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-700 mix-blend-multiply rounded-full"
                                />
                            </div>
                        </div>

                        <span className="text-xs md:text-sm font-black text-dark-text group-hover:text-medical-green transition-colors text-center tracking-tight leading-tight px-2">
                            {cat.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const TestsByCategory = () => {
    const { testCategories } = useData();

    const radiology = useMemo(() => 
        (testCategories || []).filter(cat => cat && cat.type === 'Radiology' && cat.status === 'Active'),
    [testCategories]);

    const pathology = useMemo(() => 
        (testCategories || []).filter(cat => cat && cat.type === 'Pathology' && cat.status === 'Active'),
    [testCategories]);

    return (
        <section id="tests-by-category" className="py-12 md:py-20 bg-[#F0FDF4]/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-16 md:gap-24">
                    {pathology.length > 0 && (
                        <CategorySection title="Pathology by Category" categories={pathology} />
                    )}
                    {radiology.length > 0 && (
                        <CategorySection title="Radiology by Category" categories={radiology} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestsByCategory;
