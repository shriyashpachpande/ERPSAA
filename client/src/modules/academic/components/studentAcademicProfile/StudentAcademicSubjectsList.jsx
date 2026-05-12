import { BookOpen, Layers, CheckCircle, Inbox } from 'lucide-react';

const StudentAcademicSubjectsList = ({ subjects, loading }) => {
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cataloging Curriculum...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-700 delay-200">
      <div className="p-5 md:p-7 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Curriculum Snapshot</h3>
          <p className="text-2xl font-black text-slate-900 leading-none tracking-tight">Enrolled Subjects</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm shadow-indigo-100">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      <div className="p-5 md:p-7 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100">
        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {subjects.map((mapping) => (
              <div key={mapping._id} className="group p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-700 font-black text-[11px] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    {mapping.subjectId?.subjectCode?.substring(0, 2)}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {mapping.subjectId?.credits} Units
                  </span>
                </div>
                <h4 className="text-[15px] font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{mapping.subjectId?.subjectName}</h4>
                <div className="flex items-center justify-between mt-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{mapping.subjectId?.subjectCode}</p>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:border-indigo-100 transition-colors">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    {mapping.subjectId?.subjectType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
            <Inbox className="w-12 h-12 text-slate-300" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-10">No academic mandates mapped for this enrollment cycle.</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 mt-auto flex items-center justify-center gap-2.5 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Ledger Verified Academic Record</span>
      </div>
    </div>
  );
};

export default StudentAcademicSubjectsList;
