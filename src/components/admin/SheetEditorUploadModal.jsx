import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileSpreadsheet } from 'lucide-react';
import BulkUpload from './BulkUpload';
import { useData } from '../../context/DataContext';

const SheetEditorUploadModal = ({ isOpen, onClose, onUpload }) => {
    const { labs } = useData();
    const [selectedLab, setSelectedLab] = useState('');
    // Header map specifically for tests/inventory in SheetEditor
    const testHeaderMap = {
        testName: ['Test Name', 'Name', 'Title', 'Item', 'Test', 'Service Name', 'Service', 'Investigation', 'Investigation Name', 'Procedure', 'Analysis', 'Observation', 'Diagnostic Name', 'Parameters', 'Tests', 'Package Name', 'Product Name', 'Clinical Title', 'Test Detail'],
        lab: ['Lab Partner', 'Lab', 'Partner', 'Center', 'Provider', 'Lab Name', 'Diagnostic Center', 'Pathology', 'Brand', 'Collection Center'],
        category: ['Category', 'Department', 'Dept', 'Group', 'Specialization', 'Type', 'Panel', 'Organ'],
        price: ['Price', 'MRP', 'Rate', 'Cost', 'Selling Price', 'Amount', 'Fee', 'Offer Price', 'Discounted Price'],
        originalPrice: ['Original Price', 'Actual Price', 'Old Price', 'MRP Old', 'Strike Price', 'Market Price', 'Standard Rate'],
        desc: ['Description', 'Summary', 'About', 'Details', 'Info', 'Requirements', 'Preparation'],
        tat: ['TAT', 'Turnaround Time', 'Reporting Time', 'Report Time', 'Delivery Time', 'Time Taken', 'Schedule'],
        fasting: ['Fasting', 'Fasting Required', 'Is Fasting', 'Pre Test Info', 'Fasting Info'],
        sampleType: ['Sample Type', 'Sample', 'Specimen', 'Collection', 'Volume'],
        status: ['Status', 'Availability', 'Active', 'State'],
        testMethod: ['Method', 'Test Method', 'Technique', 'Assay']
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-dark-text/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-dark-text text-xl">Import Inventory</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select CSV or Excel file</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white text-gray-400 hover:text-dark-text rounded-2xl transition-all shadow-sm border border-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 pb-12">
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-dark-text uppercase tracking-widest mb-2">Assign to Lab Partner <span className="text-gray-400 font-medium">(Optional)</span></label>
                                <select 
                                    value={selectedLab}
                                    onChange={(e) => setSelectedLab(e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm font-medium text-dark-text transition-all cursor-pointer"
                                >
                                    <option value="">Auto-detect from file (or Default Lab)</option>
                                    {labs.map(lab => (
                                        <option key={lab.id} value={lab.name}>{lab.name}</option>
                                    ))}
                                </select>
                            </div>

                            <BulkUpload
                                title="Bulk Upload Tests"
                                description="Headers should include: Test Name, Lab, Category, Price, TAT, Fasting"
                                headerMap={testHeaderMap}
                                onUpload={async (mappedData) => {
                                    await onUpload(mappedData, selectedLab);
                                    // Small delay before auto-closing on success
                                    setTimeout(onClose, 1500);
                                }}
                            />
                            
                            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Instructions</h4>
                                <ul className="text-xs text-blue-700 font-medium space-y-1 list-disc pl-4 opacity-80">
                                    <li>Ensure your file has a header row.</li>
                                    <li>Supported formats: .csv, .xlsx, .xls</li>
                                    <li>New fields supported: Description, TAT, Fasting, Sample Type, Method, Original Price.</li>
                                    <li>Smart mapping will try to detect your columns automatically.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SheetEditorUploadModal;
