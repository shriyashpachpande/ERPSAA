import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Clock, Search, ShieldAlert, FileText, Send, User, Activity } from 'lucide-react';
import gsap from 'gsap';
import toast from 'react-hot-toast';

const HealthIncidentPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [resolveModal, setResolveModal] = useState({ open: false, incidentId: null, notes: '', severity: '' });
    const listRef = useRef(null);

    const [formData, setFormData] = useState({
        studentId: '', // Ideally we'd have a student search/select dropdown, using basic input for now
        incidentType: 'Medical',
        severity: 'Low',
        description: ''
    });

    const fetchIncidents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/health', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setIncidents(data.data);
            } else {
                toast.error(data.error || 'Failed to fetch incidents.');
            }
        } catch (err) {
            toast.error('Network Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    useEffect(() => {
        if (!loading && listRef.current && incidents.length > 0) {
            gsap.fromTo(
                listRef.current.children,
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [loading, incidents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
             const token = localStorage.getItem('token');
             const res = await fetch('/api/health/report', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                 },
                 body: JSON.stringify(formData)
             });
             const data = await res.json();
             if (data.success) {
                 toast.success('Incident Reported successfully');
                 setFormData({ studentId: '', incidentType: 'Medical', severity: 'Low', description: '' });
                 fetchIncidents();
             } else {
                 toast.error(data.error || 'Failed to report incident.');
             }
        } catch (err) {
             toast.error('Network Error');
        } finally {
             setFormLoading(false);
        }
    };

    const handleResolveSubmit = async () => {
        setFormLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/health/${resolveModal.incidentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    status: 'Closed', 
                    resolutionNotes: resolveModal.notes,
                    severity: resolveModal.severity
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Incident resolved successfully');
                setResolveModal({ open: false, incidentId: null, notes: '', severity: '' });
                fetchIncidents();
            } else {
                toast.error(data.error || 'Failed to update incident.');
            }
        } catch (err) {
            toast.error('Network Error');
        } finally {
            setFormLoading(false);
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'High': return 'bg-red-500/20 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-10 text-white relative">
            <header className="mb-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Health & Safety Center</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Incidents Command</h1>
                <p className="text-gray-400 text-lg">Report and track student health and safety incidents</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                     <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl sticky top-8">
                         <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                             <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center border border-primary-500/30">
                                 <AlertCircle className="w-5 h-5 text-primary-400" />
                             </div>
                             <h2 className="text-xl font-bold tracking-tight">Report Incident</h2>
                         </div>

                         <form onSubmit={handleSubmit} className="space-y-5">
                             <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Student Object ID</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Paste StudentMaster _id" 
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Incident Type</label>
                                    <select 
                                        value={formData.incidentType}
                                        onChange={(e) => setFormData({...formData, incidentType: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-primary-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="Medical" className="bg-slate-900">Medical</option>
                                        <option value="Injury" className="bg-slate-900">Injury</option>
                                        <option value="Emergency" className="bg-slate-900">Emergency</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Severity</label>
                                    <select 
                                        value={formData.severity}
                                        onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-primary-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="Low" className="bg-slate-900">Low</option>
                                        <option value="Medium" className="bg-slate-900">Medium</option>
                                        <option value="High" className="bg-slate-900">High</option>
                                    </select>
                                 </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                <textarea 
                                    required 
                                    placeholder="Detailed incident report..." 
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none transition-all resize-none"
                                ></textarea>
                             </div>

                             <button 
                                type="submit" 
                                disabled={formLoading}
                                className="w-full py-4 mt-2 bg-white text-black hover:bg-gray-200 font-bold rounded-2xl transition-colors shadow-lg flex justify-center items-center gap-2 active:scale-95"
                             >
                                 {formLoading ? 'Submitting...' : <><Send className="w-4 h-4"/> Submit Report</>}
                             </button>
                         </form>
                     </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold tracking-tight">Recent Incidents</h2>
                            <div className="flex bg-black/50 border border-white/10 rounded-xl overflow-hidden text-xs font-bold uppercase tracking-wider">
                                <button className="px-4 py-2 hover:bg-white/10 transition-colors">All</button>
                                <button className="px-4 py-2 bg-white/10 border-l border-white/10 text-primary-400">Open</button>
                            </div>
                        </div>

                        {loading ? (
                             <div className="flex justify-center py-20">
                                 <Activity className="w-8 h-8 animate-spin text-primary-500" />
                             </div>
                        ) : incidents.length === 0 ? (
                             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                 <FileText className="w-12 h-12 mb-4 opacity-50" />
                                 <p className="font-medium">No incidents reported yet.</p>
                             </div>
                        ) : (
                             <div className="space-y-3" ref={listRef}>
                                 {incidents.map((incident) => (
                                     <div key={incident._id} className="group bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-colors relative overflow-hidden">
                                         
                                         {incident.severity === 'High' && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                         )}

                                         <div className="flex justify-between items-start mb-3 pl-2">
                                              <div className="flex gap-2">
                                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getSeverityStyle(incident.severity)}`}>
                                                     {incident.severity}
                                                  </span>
                                                  <span className="px-2 py-0.5 bg-white/5 text-gray-300 border border-white/10 rounded text-[10px] font-black uppercase tracking-wider">
                                                     {incident.incidentType}
                                                  </span>
                                              </div>
                                              <div className="flex items-center text-xs text-gray-500 font-mono">
                                                  <Clock className="w-3 h-3 mr-1" />
                                                  {new Date(incident.dateTime).toLocaleString()}
                                              </div>
                                         </div>

                                         <div className="pl-2">
                                             <h3 className="text-lg font-bold mb-1">
                                                 {incident.studentId?.personalDetails?.fullName || "Student Record"}
                                             </h3>
                                             <p className="text-sm text-gray-400 mb-3">{incident.description}</p>
                                             
                                             {incident.status === 'Closed' && incident.resolutionNotes && (
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">Resolution</span>
                                                    <p className="text-xs text-gray-300">{incident.resolutionNotes}</p>
                                                </div>
                                             )}

                                             <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4 pt-4 border-t border-white/5">
                                                 <div className="flex flex-col gap-1">
                                                     <div className="flex items-center gap-2"><User className="w-3 h-3" /><span>Reported by: {incident.reportedBy ? `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}` : 'System'}</span></div>
                                                     {incident.status === 'Closed' && incident.closedAt && (
                                                         <div className="text-emerald-500/70">Closed on: {new Date(incident.closedAt).toLocaleDateString()}</div>
                                                     )}
                                                 </div>
                                                 {incident.status === 'Open' ? (
                                                     <button 
                                                        onClick={() => setResolveModal({ open: true, incidentId: incident._id, notes: '', severity: incident.severity })}
                                                        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                                                     >
                                                         Mark Resolved
                                                     </button>
                                                 ) : (
                                                     <span className="px-3 py-1.5 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-lg">Closed</span>
                                                 )}
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        )}
                    </div>
                </div>
            </div>
            {resolveModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                    <div className="bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black mb-2">Resolve Incident</h3>
                        <p className="text-gray-400 text-sm mb-6">Update the severity (if escalated) and provide resolution notes to close this record.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Final Severity</label>
                                <select 
                                    value={resolveModal.severity}
                                    onChange={(e) => setResolveModal({...resolveModal, severity: e.target.value})}
                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-primary-500 outline-none transition-all appearance-none text-white"
                                >
                                    <option value="Low" className="bg-slate-900">Low</option>
                                    <option value="Medium" className="bg-slate-900">Medium</option>
                                    <option value="High" className="bg-slate-900">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Resolution Notes</label>
                                <textarea
                                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary-500 outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="Steps taken to resolve..."
                                    value={resolveModal.notes}
                                    onChange={(e) => setResolveModal({ ...resolveModal, notes: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setResolveModal({ open: false, incidentId: null, notes: '', severity: '' })}
                                className="flex-1 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResolveSubmit}
                                disabled={formLoading}
                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {formLoading ? 'Saving...' : 'Resolve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthIncidentPage;
