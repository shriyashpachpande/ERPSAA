import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, CheckCircle, Activity, LayoutDashboard, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFacilityMasterPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/eventsFacilities/admin/facilities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFacilities(data.data);
      } else {
        toast.error("Failed to load facilities.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    setActionId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/eventsFacilities/admin/facilities/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Facility marked as ${status}`);
        setFacilities(facilities.map(f => f._id === id ? data.data : f));
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch(err) {
       toast.error('Network Error');
    } finally {
       setActionId(null);
    }
  };

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-300/20 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>

      <div className="max-w-7xl w-full relative z-10 space-y-8">
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
              <Database className="w-3.5 h-3.5" />
              <span>ERP Master Data</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2 text-slate-900">Facility Master</h1>
            <p className="text-slate-500 text-lg font-medium">Global control panel for campus facility availability states.</p>
          </div>
        </header>

        {loading ? (
             <div className="flex justify-center p-20">
               <Activity className="w-10 h-10 animate-spin text-slate-500" />
             </div>
        ) : (
             <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {facilities.map(fac => (
                      <div key={fac._id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all group bg-slate-50/50">
                         <div className="flex justify-between items-start mb-4">
                           <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{fac.name}</h3>
                           <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
                         </div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 truncate">{fac.categoryId?.name}</p>
                         
                         <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                               backgroundColor: fac.status === 'available' ? '#10b981' : fac.status === 'maintenance' ? '#f59e0b' : '#ef4444'
                            }}></span>
                            <span className="text-sm font-semibold capitalize text-slate-700">{fac.status.replace('_', ' ')}</span>
                         </div>

                         <select 
                            disabled={actionId === fac._id}
                            value={fac.status} 
                            onChange={(e) => changeStatus(fac._id, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 disabled:opacity-50"
                         >
                            <option value="available">Available to Book</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="out_of_service">Out of Service</option>
                         </select>
                      </div>
                   ))}
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default AdminFacilityMasterPage;
