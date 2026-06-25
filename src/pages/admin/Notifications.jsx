import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Bell, Info, AlertTriangle, CheckCircle, Package, FlaskConical, Filter, MoreVertical, Search, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

const SYSTEM_ALERTS = [
    { id: 'SYS-1', type: 'System', title: 'Backup Successful', message: 'Daily system backup completed successfully at 03:00 AM.', time: '10 hours ago', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-50', unread: false },
    { id: 'PRT-1', type: 'Partner', title: 'New Lab Partner Joined', message: 'Hitech Diagnostics is now live on the platform.', time: '1 day ago', icon: FlaskConical, color: 'text-brand-teal bg-teal-50', unread: false },
];

const Notifications = () => {
    const { bookings = [] } = useData();

    const [dismissedIds, setDismissedIds] = useState([]);
    const [readIds, setReadIds] = useState([]);

    const allNotifications = React.useMemo(() => {
        const dynamicNotifications = bookings.slice(-5).reverse().map(b => ({
            id: `BOOK-${b.id}`,
            type: 'Order',
            title: 'New Lab Booking',
            message: `Patient ${b.userName || 'Customer'} has scheduled ${b.test}. Status: ${b.status}`,
            time: b.date || 'Recent',
            icon: Package,
            color: 'text-medical-green bg-soft-green',
            unread: b.status === 'Pending'
        }));

        return [...dynamicNotifications, ...SYSTEM_ALERTS].filter(n => !dismissedIds.includes(n.id)).map(n => ({
            ...n,
            unread: readIds.includes(n.id) ? false : n.unread
        }));
    }, [bookings, dismissedIds, readIds]);

    const markAllRead = () => {
        const unreadIds = allNotifications.filter(n => n.unread).map(n => n.id);
        setReadIds(prev => [...new Set([...prev, ...unreadIds])]);
    };
    const dismiss = (id) => setDismissedIds(prev => [...prev, id]);
    const markRead = (id) => setReadIds(prev => [...prev, id]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl flex items-center justify-center text-medical-green border border-gray-100 relative">
                        <Bell size={28} />
                        <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-dark-text">Notification Center</h1>
                        <p className="text-grey-text font-medium uppercase tracking-[0.2em] text-[10px] mt-1">System-wide Alerts & Logs</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={markAllRead}
                        className="h-12 gap-2 text-xs border-gray-100"
                    >
                        <CheckCircle2 size={16} /> Mark All Read
                    </Button>
                    <Button variant="outline" className="h-12 w-12 p-0 border-gray-100">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {allNotifications.length > 0 ? (
                    allNotifications.map((n) => (
                        <div key={n.id} className={`bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl group flex items-start gap-8 relative overflow-hidden ${n.unread ? 'ring-1 ring-medical-green/20' : ''}`}>
                            {n.unread && <div className="absolute top-0 left-0 w-2 h-full bg-medical-green" />}

                            <div className={`p-5 rounded-3xl ${n.color} shrink-0 group-hover:scale-110 transition-transform shadow-inner`}>
                                <n.icon size={32} />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{n.type}</span>
                                    <span className="text-xs font-bold text-gray-400">{n.time}</span>
                                </div>
                                <h3 className={`text-xl font-black tracking-tight ${n.unread ? 'text-dark-text' : 'text-gray-500'}`}>{n.title}</h3>
                                <p className="text-base text-grey-text font-medium leading-relaxed max-w-2xl">{n.message}</p>

                                <div className="pt-4 flex items-center gap-6">
                                    <button
                                        onClick={() => markRead(n.id)}
                                        className="text-xs font-bold text-medical-green hover:underline"
                                    >
                                        View Action
                                    </button>
                                    <button
                                        onClick={() => dismiss(n.id)}
                                        className="text-xs font-bold text-gray-400 hover:text-dark-text"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
                        <Bell size={48} className="text-gray-100 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">All Caught Up!</h3>
                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mt-1">No new notifications to show.</p>
                    </div>
                )}
            </div>

            <div className="text-center py-10 opacity-40">
                <p className="text-xs font-bold uppercase tracking-widest">End of recent notifications</p>
                <div className="mt-4 h-1 w-12 bg-gray-200 mx-auto rounded-full" />
            </div>
        </div>
    );
};

export default Notifications;
