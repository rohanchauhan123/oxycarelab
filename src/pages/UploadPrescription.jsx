import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadPrescription = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const { addBooking } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf')) {
            setFile(droppedFile);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleContinue = async () => {
        if (!file) return;

        setIsUploading(true);

        // Convert file to Data URL for persistence
        const reader = new FileReader();
        const fileContent = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add to our context (actual persistence in localStorage via context)
        addBooking({
            userId: user?.id,
            test: "Prescription Upload",
            lab: "Processing Expert Review",
            user: user?.name || 'Guest Patient',
            phone: user?.phone || 'N/A',
            amount: 'TBD upon Review',
            status: 'Pending',
            prescriptionName: file.name,
            prescriptionFile: fileContent, // Actual file content
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });

        setIsUploading(false);
        setIsSuccess(true);

        // Auto redirect after success message
        setTimeout(() => {
            navigate('/dashboard/bookings');
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="pt-40 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 text-center max-w-lg mx-4"
                >
                    <div className="w-24 h-24 bg-medical-green/10 rounded-full flex items-center justify-center text-medical-green mx-auto mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-dark-text mb-4">Upload Successful!</h2>
                    <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                        Your prescription has been received. Our health experts will review it and contact you within 15 minutes to confirm your tests.
                    </p>
                    <div className="animate-pulse text-sm font-black text-medical-green uppercase tracking-widest">
                        Redirecting to dashboard...
                    </div>
                </motion.div>
            </div>
        );
    }

    const steps = [
        {
            icon: Upload,
            title: "Upload Prescription",
            description: "Upload a clear picture or PDF of your doctor's prescription."
        },
        {
            icon: ShieldCheck,
            title: "Expert Review",
            description: "Our certified pharmacists will review your prescription within 15 minutes."
        },
        {
            icon: CheckCircle2,
            title: "Confirmation",
            description: "Receive a call or message to confirm your tests and schedule collection."
        }
    ];

    return (
        <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-display font-black text-dark-text mb-4"
                    >
                        Upload Prescription
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto font-medium"
                    >
                        Don't know which tests to book? Just upload your prescription and we'll handle the rest for you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Upload Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-[32px] shadow-xl shadow-medical-green/5 border border-gray-100"
                    >
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-[24px] p-12 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-medical-green bg-medical-green/5' : 'border-gray-200 hover:border-medical-green/50'
                                }`}
                        >
                            <div className="w-20 h-20 bg-medical-green/10 rounded-full flex items-center justify-center text-medical-green mb-6">
                                <Upload size={36} />
                            </div>

                            <h3 className="text-xl font-bold text-dark-text mb-2">
                                {file ? file.name : "Select or Drag & Drop"}
                            </h3>
                            <p className="text-gray-400 text-sm font-medium mb-8">
                                Supports JPG, PNG, PDF (Max 5MB)
                            </p>

                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-medical-green text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-medical-green-dark transition-colors shadow-lg shadow-medical-green/20"
                            >
                                Choose File
                            </label>
                        </div>

                        {file && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-green-900">{file.name}</p>
                                    <p className="text-xs text-green-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button size="sm" onClick={() => setFile(null)} variant="ghost" className="text-red-500 hover:bg-red-50">Remove</Button>
                            </motion.div>
                        )}

                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Your prescription will be handled with 100% confidentiality. We only use it to identify the required diagnostic tests.
                                </p>
                            </div>
                            <Button
                                onClick={handleContinue}
                                disabled={!file || isUploading}
                                className="w-full py-4 rounded-xl text-lg font-black shadow-xl disabled:opacity-50 gap-3"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Continue to Selection"
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right: How it works */}
                    <div className="flex flex-col gap-8">
                        <h2 className="text-3xl font-bold text-dark-text mb-2">How it works?</h2>
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-medical-green shadow-lg shadow-medical-green/5 border border-gray-100 group-hover:bg-medical-green group-hover:text-white transition-all duration-300">
                                        <step.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-dark-text mb-1">{step.title}</h4>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-10 p-8 bg-medical-green/5 border border-medical-green/10 rounded-[32px]">
                            <h4 className="text-xl font-bold text-medical-green mb-4 flex items-center gap-2">
                                <ShieldCheck size={24} />
                                NABL Accredited Care
                            </h4>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                OxyCare Labs ensures all tests identified from your prescription are performed in NABL accredited facilities with extreme precision.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPrescription;
