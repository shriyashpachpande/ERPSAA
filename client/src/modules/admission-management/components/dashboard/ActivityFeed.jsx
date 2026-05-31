import React, { useEffect, useRef } from 'react';
import { FilePlus, FileEdit, FileCheck, FileX, AlertCircle, Clock, CheckCircle, UserPlus, Bell } from 'lucide-react';
import gsap from 'gsap';

const ActivityIcon = ({ type }) => {
  const map = {
    new_application: { icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    status_update: { icon: FileEdit, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    reupload_request: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    reupload_complete: { icon: FileCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
    application_approved: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    application_rejected: { icon: FileX, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    message: { icon: Bell, color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
  };

  const { icon: Icon, color, bgColor } = map[type?.toLowerCase()] || { icon: Clock, color: 'text-gray-400', bgColor: 'bg-gray-50' };
  return (
    <div className={`p-2.5 rounded-xl ${bgColor} ${color} shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon className="w-4 h-4" />
    </div>
  );
};

const ActivityItem = ({ title, message, createdAt, type, isLast }) => {
  const timeAgo = (date) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Unknown';
    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-start space-x-4 group relative items-container">
      {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-px bg-gray-100 group-hover:bg-primary-100 transition-colors"></div>}
      <ActivityIcon type={type} />
      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-center justify-between mb-1">
           <p className="text-xs font-black text-gray-900 leading-tight group-hover:text-primary-600 transition-colors truncate pr-2">{title}</p>
           <span className="text-[9px] font-bold text-gray-400 uppercase shrink-0">{timeAgo(createdAt)}</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{message}</p>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (activities && activities.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activities]);

  if (!activities || activities.length === 0) return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-gray-400 text-center">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
           <Bell className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-bold text-gray-500">No Recent Activity</p>
        <p className="text-xs mt-1">Live updates will appear here.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Live Activity</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time Stream</p>
        </div>
        <div className="relative">
           <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
           </span>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
        {activities.map((activity, idx) => (
          <ActivityItem 
            key={activity._id || idx} 
            {...activity} 
            isLast={idx === activities.length - 1}
          />
        ))}
      </div>

      <button type="button" className="mt-4 w-full py-3 rounded-xl bg-gray-50 text-[10px] font-black text-gray-500 hover:bg-brand-dark hover:text-white transition-all uppercase tracking-widest shadow-sm hover:shadow-md">
        View Notification Center
      </button>
    </div>
  );
};

export default ActivityFeed;
