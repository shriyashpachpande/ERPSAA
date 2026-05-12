import React from 'react';
import { MessageSquare, Shield, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ComplaintTimeline = ({ timeline }) => {
    const { messages = [], audits = [] } = timeline;

    // Merge and sort by time
    const events = [
        ...messages.map(m => ({ ...m, type: 'message' })),
        ...audits.map(a => ({ ...a, type: 'audit' }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (events.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 text-sm">
                No activity yet
            </div>
        );
    }

    return (
        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:via-blue-400/30 before:to-transparent">
            {events.map((event, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Pulsing Dot / Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white bg-slate-50 group-[.is-active]:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all group-hover:scale-110 group-hover:rotate-6">
                        {event.type === 'message' ? (
                            <MessageSquare size={18} className="text-indigo-600" />
                        ) : (
                            <div className="relative">
                                <Clock size={18} className="text-blue-500" />
                                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-40 animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all transform hover:-translate-y-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {event.performedBy?.fullName?.[0] || event.sender?.fullName?.[0] || 'S'}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-xs tracking-tight uppercase">
                                        {event.performedBy?.fullName || event.sender?.fullName || 'System Dispatcher'} 
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                        {event.performedByRole || event.senderRole || 'Automated Service'}
                                    </div>
                                </div>
                            </div>
                            <time className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                                {new Date(event.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                            </time>
                        </div>

                        {event.type === 'audit' ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">
                                        {event.action.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4 py-1">
                                    {event.remarks}
                                </p>
                                {event.newStatus && (
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                        <CheckCircle size={14} /> 
                                        State Transition: <span className="uppercase tracking-[0.05em]">{event.newStatus.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-slate-700 text-sm leading-relaxed font-semibold bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                                {event.message}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComplaintTimeline;
