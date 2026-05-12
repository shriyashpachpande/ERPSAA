import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Calendar, AlertTriangle, BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';
import { getMyMasterProfile } from '../../student-master/services/studentMasterService';

const LibraryNotificationsView = () => {
    const { getNotifications, markNotificationRead, loading } = useLibrary();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const student = await getMyMasterProfile();
            const res = await getNotifications(student.data._id);
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'READ' } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'DUE_REMINDER': return <Calendar className="w-5 h-5 text-indigo-500" />;
            case 'OVERDUE_ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'RESERVATION_READY': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'FINE_ALERT': return <ArrowRight className="w-5 h-5 text-amber-500" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading && notifications.length === 0) return <div className="p-8 text-center animate-pulse">Loading notifications...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-brand-dark tracking-tight">Library Alerts</h1>
                    <p className="text-gray-500 font-medium">Due reminders and reservation updates</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-full">
                    {notifications.some(n => n.status === 'PENDING') ? (
                        <Bell className="w-6 h-6 text-primary-600 animate-bounce" />
                    ) : (
                        <BellOff className="w-6 h-6 text-gray-400" />
                    )}
                </div>
            </header>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div 
                            key={notif._id} 
                            className={`p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-6 ${
                                notif.status === 'PENDING' 
                                ? 'bg-white border-primary-100 shadow-xl shadow-primary-500/5' 
                                : 'bg-gray-50 border-gray-100 opacity-60'
                            }`}
                        >
                            <div className={`p-4 rounded-2xl ${
                                notif.status === 'PENDING' ? 'bg-primary-50' : 'bg-gray-200'
                            }`}>
                                {getIcon(notif.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <h3 className={`font-black text-lg ${notif.status === 'PENDING' ? 'text-brand-dark' : 'text-gray-500'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-4">
                                    {notif.message}
                                </p>
                                
                                {notif.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleMarkAsRead(notif._id)}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-2"
                                    >
                                        Mark as read
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-400">All caught up!</h3>
                        <p className="text-gray-400 text-sm mt-1">No new notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryNotificationsView;
