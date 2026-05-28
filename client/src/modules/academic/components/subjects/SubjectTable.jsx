import { useEffect, useRef } from 'react';
import { Edit, Trash2, BookOpen, Layers, Activity, Sparkles, Box } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';
import { useDepartments } from '../../hooks/useDepartments';
import { gsap } from 'gsap';

const SubjectTable = ({ data, loading, onEdit }) => {
  const { departments } = useDepartments();
  const rowsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && data.length > 0) {
      // "Card Throw" Physics-based Entrance Animation
      gsap.fromTo(rowsRef.current,
        {
          y: 300,
          rotationX: -45,
          rotationY: 15,
          opacity: 0,
          scale: 0.8,
          filter: 'blur(20px)',
          z: -500
        },
        {
          y: 0,
          rotationX: 0,
          rotationY: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          z: 0,
          duration: 1.2,
          stagger: {
            amount: 0.8,
            from: "start"
          },
          ease: 'elastic.out(1, 0.75)',
          clearProps: 'all'
        }
      );
    }
  }, [loading, data]);

  const getDeptName = (code) => {
    if (!code) return 'N/A';
    const dept = departments.find(d => d.code === code || d.name === code);
    return dept ? dept.name : code;
  };

  if (loading) {
    return (
      <div className="p-32 flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin shadow-2xl shadow-primary-500/20"></div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] animate-pulse">Scanning Master Matrix...</p>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="p-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="p-10 bg-slate-50 rounded-[3rem] text-slate-200">
          <Box className="w-20 h-20" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registry Unpopulated</h3>
          <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">No subjects found matching your current parameters.</p>
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
        .silent-glow-row {
          background: linear-gradient(-45deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95), rgba(238, 242, 255, 0.95), rgba(240, 253, 244, 0.95));
          background-size: 400% 400%;
          animation: silentGradient 12s ease infinite;
          position: relative;
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
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.15);
          transform: translateY(-4px) scale(1.005);
          z-index: 10;
        }
      `}</style>

      <div ref={containerRef} className="overflow-x-auto custom-scrollbar" style={{ perspective: '1000px' }}>
        <table className="w-full text-left border-separate border-spacing-y-4 px-6 pb-8 min-w-[900px]">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <th className="px-8 py-4">Course Intelligence</th>
              <th className="px-8 py-4">Administrative Context</th>
              <th className="px-8 py-4 text-center">Unit Weight</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Operations</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sub, idx) => (
              <tr
                key={sub._id}
                ref={el => rowsRef.current[idx] = el}
                className="group luxury-row transition-all duration-500"
              >
                <td className="px-8 py-6 bg-white/90 rounded-l-[2rem] border-y border-l border-transparent silent-glow-row transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${sub.subjectType === 'Theory' ? 'bg-primary-600 text-white shadow-primary-200' :
                      sub.subjectType === 'Practical' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                        'bg-emerald-600 text-white shadow-emerald-200'
                      }`}>
                      {sub.subjectCode.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 group-hover:text-primary-700 transition-colors uppercase tracking-tight">{sub.subjectName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">{sub.subjectCode}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub.subjectType}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-white/90 border-y border-transparent silent-glow-row transition-all">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest line-clamp-1 leading-none">{getDeptName(sub.department)}</p>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Activity className="w-3 h-3 text-primary-500" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Active Curriculum</span>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-white/90 border-y border-transparent text-center silent-glow-row transition-all">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-slate-900 group-hover:scale-110 transition-transform">{sub.credits}</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Credits</span>
                  </div>
                </td>

                <td className="px-8 py-6 bg-white/90 border-y border-transparent silent-glow-row transition-all">
                  <AcademicStatusBadge status={sub.status} />
                </td>

                <td className="px-8 py-6 bg-white/90 rounded-r-[2rem] border-y border-r border-transparent text-right silent-glow-row transition-all">
                  <button
                    onClick={() => onEdit(sub)}
                    className="p-4 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-white rounded-2xl transition-all shadow-sm active:scale-90 border border-slate-100/50"
                  >
                    <Edit className="w-5 h-5 transition-transform group-hover:rotate-12" />
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

export default SubjectTable;
