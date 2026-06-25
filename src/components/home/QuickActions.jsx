import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const fileInputRef = useRef(null);
    const { addBooking } = useData();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleUploadClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a pending booking for the uploaded prescription
            addBooking({
                userId: user?.id,
                user: user?.name,
                test: 'Prescription Upload',
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                prescriptionName: file.name,
                amount: 'TBD upon Review'
            });
            alert(`Prescription "${file.name}" uploaded successfully! You can track it in your dashboard.`);
        }
    };

    const actions = [
        {
            title: 'Book a Test',
            description: 'Browse 1000+ diagnostic tests and book instantly',
            icon: FileText,
            color: 'bg-medical-green/10',
            borderColor: 'border-medical-green/30',
            link: '/book-test',
        },
        {
            title: 'Upload Prescription',
            description: 'Upload your prescription and place your order instantly',
            icon: Upload,
            color: 'bg-medical-green/10',
            borderColor: 'border-medical-green/30',
            actionType: 'upload',
        },
        {
            title: 'Download Reports',
            description: 'Download your medical reports and view order history',
            icon: FileText,
            color: 'bg-medical-green/10',
            borderColor: 'border-medical-green/30',
            link: '/dashboard/reports',
        },
    ];

    return (
        <section className="pb-8 md:pb-12 bg-white relative z-20 -mt-16 md:-mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {actions.map((action, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                                if (action.actionType === 'upload') {
                                    handleUploadClick();
                                } else if (action.link) {
                                    navigate(action.link);
                                }
                            }}
                            className={`flex items-center gap-4 md:gap-6 p-6 rounded-[2rem] border border-dashed border-medical-green/40 bg-white shadow-xl shadow-medical-green/5 cursor-pointer hover:border-solid hover:border-medical-green hover:shadow-2xl hover:shadow-medical-green/10 transition-all duration-500 group min-h-[8rem] md:min-h-[9rem] h-auto`}
                        >
                            <div className="w-16 h-16 bg-medical-green/10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-medical-green group-hover:text-white">
                                <action.icon className="transition-colors duration-300" size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-black text-dark-text mb-1 tracking-tight">{action.title}</h3>
                                <p className="text-gray-500 text-sm font-bold leading-tight opacity-80">{action.description}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-medical-green group-hover:text-white transition-all duration-300">
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                />
            </div>
        </section>
    );
};

export default QuickActions;
