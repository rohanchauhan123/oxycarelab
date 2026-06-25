import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Receipt,
    Calendar,
    Eye,
    CheckCircle2,
    X,
    Search,
    CreditCard,
    User
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const Invoices = () => {
    const { bookings } = useData();
    const { user } = useAuth();

    // Filter for bookings with payment info
    const invoices = bookings
        .filter(b => (b.userId === user?.id || (b.phone && b.phone === user?.phone)))
        .map(b => ({
            id: b.id,
            test: b.test,
            date: b.date,
            amount: b.amount || (b.total ? `₹${b.total}` : '₹0'),
            status: b.paymentStatus || (b.paymentMethod === 'cod' ? 'Pending' : 'Success'),
            billUrl: b.billUrl,
            patientName: b.patientName || b.userName || user?.name
        }));

    const handleDownloadInvoice = (invoice) => {
        if (invoice.billUrl) {
            const link = document.createElement('a');
            link.href = invoice.billUrl;
            link.download = `Invoice_${invoice.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }
        
        // Simulated Invoice Download
        const content = `
OXYCARE LABS - INVOICE
-----------------------
Invoice ID: INV-${invoice.id}
Booking ID: ${invoice.id}
Date: ${invoice.date}
Customer: ${user?.name}
Phone: ${user?.phone}

TEST DETAILS:
${invoice.test}

TOTAL AMOUNT: ${invoice.amount}
STATUS: ${invoice.status}

Thank you for choosing OxyCare Labs!
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.id}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-dark-text tracking-tight mb-2">My Invoices</h1>
                    <p className="text-gray-400 font-bold">Manage your payments and download billing statements.</p>
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto">
                        <Receipt size={40} />
                    </div>
                    <h3 className="text-xl font-black text-dark-text tracking-tight">No invoices found</h3>
                    <p className="text-gray-400 font-bold max-w-sm mx-auto">Your payment history and invoices will appear here once you make a booking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invoices.map((invoice) => (
                        <div key={invoice.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[60px] -mr-8 -mt-8" />
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                                    <Receipt size={28} />
                                </div>

                                <h3 className="text-xl font-black text-dark-text mb-1 tracking-tight">Invoice #{invoice.id}</h3>
                                <div className="flex flex-col gap-2 mb-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">{invoice.test}</p>
                                    <div className="flex items-center gap-2 py-1.5 px-3 bg-indigo-50 border border-indigo-100/50 rounded-xl w-fit">
                                        <div className="w-5 h-5 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                                            <User size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.1em]">{invoice.patientName}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Calendar size={14} /> {invoice.date}
                                    </div>
                                    <div className="text-xl font-black text-dark-text">
                                        {invoice.amount}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                        invoice.status === 'Success' || invoice.status === 'Paid' ? 'text-medical-green' : 'text-amber-500'
                                    }`}>
                                        <CreditCard size={12} /> {invoice.status}
                                    </span>
                                    <button
                                        onClick={() => handleDownloadInvoice(invoice)}
                                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        title="Download Invoice"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Invoices;
