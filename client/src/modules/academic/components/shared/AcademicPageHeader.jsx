import { Layout, Plus, Search } from 'lucide-react';

const AcademicPageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
        <Layout className="w-7 h-7" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm font-medium tracking-wide">{subtitle}</p>
      </div>
    </div>
    {action && (
      <button 
        onClick={action.onClick} 
        disabled={action.disabled} 
        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 font-bold text-sm disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        {action.label}
      </button>
    )}
  </div>
);

export default AcademicPageHeader;
