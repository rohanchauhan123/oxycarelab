import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    FileText,
    Calendar,
    Eye,
    CheckCircle2,
    ArrowRight,
    X,
    ChevronRight,
    Activity,
    Search,
    Filter,
    User
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const ViewReports = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const { bookings } = useData();
    const { user } = useAuth();

    // Filter for completed bookings to show as reports
    const reports = (bookings || [])
        .filter(b => b && (b.userId === user?.id || (b.phone && b.phone === user?.phone)) && (b.status === 'Completed' || b.status === 'Report completed'))
        .map(b => ({
            id: b.id,
            name: `${b.test || 'Diagnostic'} Report`,
            date: b.date || 'N/A',
            size: b.reportSize || '1.8 MB',
            status: 'Ready',
            reportUrl: b.reportUrl,
            patientName: b.patientName || b.userName || user?.name || 'Patient'
        }));

    const handleDownloadReport = (report) => {
        if (report.reportUrl) {
            const link = document.createElement('a');
            link.href = report.reportUrl;
            link.download = report.name.replace(/\s+/g, '_') + (report.reportUrl.includes('application/pdf') ? '.pdf' : '.png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }
        // Simulated Report Download
        const content = `OxyCare Labs - Diagnostic Report\n\nReport ID: ${report.id}\nTest: ${report.name}\nDate: ${report.date}\nStatus: Completed\n\nVerified Digital Signature\nOxyCare Labs Team`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.name.replace(/\s+/g, '_')}_${report.id}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">My Health Reports</h1>
                    <p className="text-gray-400 font-bold">Access and download your digital diagnostic reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => reports.forEach(r => handleDownloadReport(r))}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm text-gray-600 shadow-sm hover:border-medical-green transition-all"
                    >
                        <Download size={18} /> Download All
                    </button>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-xl font-black text-dark-text tracking-tight">No reports available yet</h3>
                    <p className="text-gray-400 font-bold max-w-sm mx-auto">Once your samples are processed and results are ready, you can view and download them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(reports || []).map((report) => (
                        <div key={report?.id || Math.random()} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-medical-green/5 rounded-bl-[60px] -mr-8 -mt-8 group-hover:bg-medical-green/10 transition-colors" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-medical-green mb-6 shadow-inner">
                                    <FileText size={28} />
                                </div>

                                <h3 className="text-xl font-black text-dark-text mb-1 tracking-tight group-hover:text-medical-green transition-colors">{report?.name || 'Diagnostic Report'}</h3>
                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center gap-2 py-1.5 px-3 bg-indigo-50 border border-indigo-100/50 rounded-xl w-fit">
                                        <div className="w-5 h-5 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                            <User size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.1em]">{report?.patientName}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <Calendar size={14} /> {report?.date || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 lowercase tracking-widest">
                                            {report?.size || '0.0 MB'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black text-medical-green uppercase tracking-widest">
                                        <CheckCircle2 size={12} /> {report?.status || 'Ready'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="p-3 bg-gray-50 text-dark-text rounded-xl hover:bg-gray-100 transition-all shadow-sm"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadReport(report)}
                                            className="p-3 bg-medical-green/10 text-medical-green rounded-xl hover:bg-medical-green hover:text-white transition-all shadow-sm"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Report Viewer Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark-text/80 backdrop-blur-sm"
                            onClick={() => setSelectedReport(null)}
                        />
                        <motion.div
                            initial={{ opacity: 20, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-soft-green rounded-2xl flex items-center justify-center text-medical-green">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-dark-text text-xl">{selectedReport.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedReport.date} • {selectedReport.size}</p>
                                            <div className="flex items-center gap-1.5 py-0.5 px-2 bg-indigo-50 rounded-md">
                                                <User size={10} className="text-indigo-500" />
                                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">{selectedReport.patientName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="p-3 bg-gray-50 text-gray-400 hover:text-dark-text rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                                {selectedReport.reportUrl ? (
                                    <div className="w-full h-full min-h-[500px] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
                                        {selectedReport.reportUrl.includes('application/pdf') ? (
                                            <embed
                                                src={selectedReport.reportUrl}
                                                type="application/pdf"
                                                className="w-full h-full min-h-[600px]"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center p-4 h-full">
                                                <img 
                                                    src={selectedReport.reportUrl} 
                                                    alt="Report" 
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Digital Report Mockup */
                                    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-sm space-y-10 border border-gray-100">
                                        <div className="flex justify-between items-start pb-8 border-b border-gray-100">
                                            <div>
                                                <h4 className="text-2xl font-black text-dark-text mb-1">Health Report</h4>
                                                <p className="text-medical-green font-bold text-sm">OxyCare Labs Verified</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Name</p>
                                                <p className="font-black text-dark-text">{selectedReport.patientName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            {[
                                                { test: 'Blood Glucose (Fast)', result: '98 mg/dL', range: '70 - 100', status: 'Normal' },
                                                { test: 'HbA1c', result: '5.4 %', range: '4.0 - 5.6', status: 'Normal' },
                                                { test: 'Vitamin D', result: '32 ng/mL', range: '30 - 100', status: 'Normal' },
                                                { test: 'Total Cholesterol', result: '210 mg/dL', range: '< 200', status: 'High' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-dark-text">{item.test}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Normal Range: {item.range}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-black ${item.status === 'High' ? 'text-red-500' : 'text-medical-green'}`}>{item.result}</p>
                                                        <span className={`text-[8px] font-black uppercase tracking-[2px] px-2 py-1 rounded ${item.status === 'High' ? 'bg-red-50 text-red-500' : 'bg-medical-green/10 text-medical-green'
                                                            }`}>{item.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="pt-10 opacity-50 text-center">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Verified Digital Signature</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-gray-100 flex items-center justify-center gap-4">
                                <Button
                                    onClick={() => handleDownloadReport(selectedReport)}
                                    className="h-12 px-8 rounded-2xl gap-2"
                                >
                                    <Download size={18} /> Download PDF
                                </Button>
                                <Button variant="outline" className="h-12 px-8 rounded-2xl">
                                    Share with Doctor
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Empty State / Shared Reports Section */}
            <div className="bg-gray-900 rounded-[40px] p-12 text-white overflow-hidden relative group cursor-pointer">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-3xl font-black tracking-tight leading-tight">Need to share reports with your doctor?</h2>
                        <p className="text-gray-400 font-bold leading-relaxed">
                            Upload external reports or share your OxyCare history directly with healthcare professionals in one click.
                        </p>
                        <div className="pt-4">
                            <Button className="bg-medical-green hover:bg-medical-green-hover text-white gap-2 h-14 px-8 group/btn">
                                Share Health Records <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center relative shadow-2xl">
                        <FileText size={80} className="text-medical-green/40 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-medical-green/10 rounded-full animate-pulse" />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-medical-green/5 rounded-full blur-[100px] -mt-32 -mr-32 group-hover:bg-medical-green/10 transition-colors" />
            </div>
        </div>
    );
};

export default ViewReports;
