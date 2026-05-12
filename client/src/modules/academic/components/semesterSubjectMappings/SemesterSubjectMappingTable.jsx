import { useEffect, useRef } from 'react';
import { Trash2, BookOpen, Layers, ArrowRight, BookMarked, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

const SemesterSubjectMappingTable = ({ data, loading, onDelete }) => {
  const rowsRef = useRef([]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      gsap.fromTo(rowsRef.current,
        { x: -30, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'expo.out' }
      );
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="p-32 flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin shadow-2xl shadow-primary-500/20"></div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Syncing Registry...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="p-10 bg-slate-50/50 rounded-[3rem] text-slate-200 border border-slate-100/50 relative overflow-hidden group">
           <Layers className="w-20 h-20 group-hover:scale-110 transition-transform duration-700" />
           <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Matrix Initialization Required</h3>
           <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">Select context to activate subject mapping</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes silentGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .silent-glow {
          background: linear-gradient(-45deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95), rgba(238, 242, 255, 0.95), rgba(240, 253, 244, 0.95));
          background-size: 400% 400%;
          animation: silentGradient 12s ease infinite;
        }
        .luxury-row {
          position: relative;
          z-index: 1;
        }
        .luxury-row::after {
          content: "";
          position: absolute;
          inset: -1px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 200%;
          animation: silentGradient 5s linear infinite;
          z-index: -1;
          border-radius: 2rem;
          opacity: 0.1;
          transition: opacity 0.5s;
        }
        .luxury-row:hover::after {
          opacity: 0.4;
        }
        .luxury-row:hover {
          box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4 px-4 pb-8 min-w-[800px]">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <th className="px-8 py-4 font-black">Subject Intelligence</th>
              <th className="px-8 py-4 font-black">Departmental Unit</th>
              <th className="px-8 py-4 text-center font-black">Credit Units</th>
              <th className="px-8 py-4 text-right font-black">Operations</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m, idx) => (
              <tr 
                key={m._id} 
                ref={el => rowsRef.current[idx] = el}
                className="group luxury-row transition-all duration-500 hover:-translate-y-1"
              >
                <td className="px-8 py-6 bg-white/80 rounded-l-[2rem] border-y border-l border-transparent silent-glow transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${idx % 3 === 0 ? 'bg-primary-600 text-white shadow-primary-200' : idx % 3 === 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-emerald-600 text-white shadow-emerald-200'}`}>
                      {m.subjectId?.subjectCode?.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{m.subjectId?.subjectName}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{m.subjectId?.subjectCode}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Mapping</span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-8 py-6 bg-white/80 border-y border-transparent silent-glow transition-all">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{m.subjectId?.department}</p>
                    <div className="flex items-center gap-2">
                       <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest group-hover:bg-primary-600 transition-colors">
                          {m.subjectId?.subjectType}
                       </span>
                       <span className="text-[9px] font-bold text-slate-300 uppercase">Track</span>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-white/80 border-y border-transparent text-center silent-glow transition-all">
                  <div className="flex flex-col items-center">
                     <span className="text-xl font-black text-slate-900 group-hover:scale-110 transition-transform">{m.subjectId?.credits}</span>
                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Weightage</span>
                  </div>
                </td>

                <td className="px-8 py-6 bg-white/80 rounded-r-[2rem] border-y border-r border-transparent text-right silent-glow transition-all">
                  <button 
                    onClick={() => onDelete(m._id)}
                    className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90 group/btn"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SemesterSubjectMappingTable;
