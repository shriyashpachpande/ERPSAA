import React, { useEffect, useState } from 'react';
import { Shield, Clock, User, Fingerprint, Search, Filter, ArrowRight, Eye, Info, Database } from 'lucide-react';
import useLibrary from '../hooks/useLibrary';

const AdminAuditLogsPage = () => {
    const { getAuditLogs, loading } = useLibrary();
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        try {
            const res = await getAuditLogs();
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        if (action.includes('WAIVE')) return 'text-emerald-600 bg-emerald-50';
        if (action.includes('LOST') || action.includes('DAMAGED')) return 'text-red-600 bg-red-50';
        if (action.includes('UPDATE')) return 'text-indigo-600 bg-indigo-50';
        return 'text-amber-600 bg-amber-50';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark tracking-tight">Security & Audit Logs</h1>
                    <p className="text-gray-500 font-medium">Traceability for all sensitive administrative actions</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by action or ID..." 
                        className="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm min-w-[300px] focus:border-indigo-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Entity</th>
                                <th className="px-8 py-6 text-right font-medium text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm font-medium">
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log._id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-brand-dark font-black">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{new Date(log.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-black text-[10px]">
                                                {log.performedBy?.fullName?.substring(0, 2)}
                                            </div>
                                            <span className="font-bold text-gray-700">{log.performedBy?.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-3 h-3 text-gray-300" />
                                            <span className="text-gray-500">{log.targetType}</span>
                                            <span className="text-[10px] font-black text-gray-300">({log.targetId.substring(0, 8)}...)</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button type="button" className="p-2 text-gray-300 hover:text-primary-600 transition-colors">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">
                                        {loading ? 'Refreshing secure logs...' : 'No audit entries found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-10 bg-indigo-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Shield className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-4 text-indigo-300">
                            <Fingerprint className="w-8 h-8" />
                            <h3 className="text-2xl font-black">Immutable Compliance</h3>
                        </div>
                        <p className="text-indigo-100/60 font-medium leading-relaxed">
                            These logs are system-generated and cannot be modified or deleted by any user level. 
                            This ensures complete accountability for policy changes, fine waivers, and inventory adjustments.
                        </p>
                    </div>
                    <div className="flex-shrink-0 bg-white/10 p-8 rounded-3xl border border-white/10 text-center min-w-[200px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Total Retention</p>
                        <p className="text-4xl font-black">365 <span className="text-xs opacity-40">DAYS</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogsPage;
