import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import {
    Bell, CheckCheck, Trash2, Clock,
    ChevronRight, Info, AlertCircle, CheckCircle2,
    XCircle, Mail, FileText, Loader2
} from 'lucide-react';

const StaffNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (err) {
            console.error('Error fetching notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const res = await axiosInstance.patch(`/notifications/${id}/read`);
            if (res.data.success) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Error marking read', err);
        }
    };

    const markAllRead = async () => {
        try {
            const res = await axiosInstance.patch('/notifications/read-all');
            if (res.data.success) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error marking all read', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_application': return { icon: FileText, color: 'text-blue-600 bg-blue-50' };
            case 'status_update': return { icon: Info, color: 'text-purple-600 bg-purple-50' };
            case 'reupload_request': return { icon: AlertCircle, color: 'text-amber-600 bg-amber-50' };
            case 'application_approved': return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' };
            case 'application_rejected': return { icon: XCircle, color: 'text-rose-600 bg-rose-50' };
            default: return { icon: Bell, color: 'text-gray-600 bg-gray-50' };
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary-600 text-white rounded-3xl shadow-xl shadow-primary-100">
                        <Bell className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Notifications</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            {unreadCount} UNREAD ALERTS
                        </p>
                    </div>
                </div>

                <button
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm shadow-sm text-gray-700 disabled:opacity-50"
                >
                    <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
                </button>
            </div>

            {/* Notifications Feed */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary-500 mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing with system alerts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Stay Quiet</h3>
                        <p className="text-gray-500 font-medium">You're all caught up! No new notifications here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => {
                            const { icon: Icon, color } = getIcon(notif.type);
                            return (
                                <div
                                    key={notif._id}
                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                    className={`p-6 flex gap-5 transition-all hover:bg-gray-50/50 cursor-pointer relative group ${!notif.isRead ? 'bg-primary-50/20' : ''}`}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600" />
                                    )}

                                    <div className={`p-3 rounded-2xl h-fit ${color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-lg font-bold tracking-tight ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-xs font-bold text-gray-400 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {notif.message}
                                        </p>

                                        {notif.relatedApplication && (
                                            <div className="pt-3">
                                                <Link
                                                    to={localStorage.getItem('userRole') === 'student' ? '/app/student/admission/status' : `/app/staff/admissions/${notif.relatedApplication}`}
                                                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    View Details <ChevronRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffNotificationsPage;
