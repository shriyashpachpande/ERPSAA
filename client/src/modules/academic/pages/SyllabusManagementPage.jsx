import { useState, useEffect, useRef } from 'react';
import { useTeachingSubjects } from '../hooks/useTeachingSubjects';
import { useSyllabusManagement } from '../hooks/useSyllabusManagement';
import { useAuth } from '../../../hooks/useAuth';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { BookOpen, CheckCircle2, Award, Clock, Sparkles, Sliders, Save, Loader2, Layers } from 'lucide-react';
import gsap from 'gsap';

const SyllabusManagementPage = () => {
  const { user } = useAuth();
  const { subjects, loading, refresh } = useTeachingSubjects();
  const { updateProgress, updating } = useSyllabusManagement();
  const [localProgress, setLocalProgress] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (subjects.length > 0) {
      const initialProgress = {};
      subjects.forEach(sub => {
        initialProgress[sub._id] = sub.syllabusProgress || 0;
      });
      setLocalProgress(initialProgress);

      gsap.fromTo(
        '.syllabus-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [subjects]);

  const handleSliderChange = (id, val) => {
    setLocalProgress(prev => ({ ...prev, [id]: parseInt(val) }));
  };

  const handleSave = async (id) => {
    const success = await updateProgress(id, localProgress[id]);
    if (success) {
      alert('Syllabus progress updated successfully!');
      refresh(); // Refresh to get synced data
    } else {
      alert('Failed to update progress. The backend might not support this field yet.');
    }
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12" ref={containerRef}>
      <AcademicPageHeader
        title="Syllabus Management"
        subtitle="Track and update the completion progress of your assigned subjects"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {subjects.length === 0 ? (
          <div className="lg:col-span-2 glass-panel p-20 text-center space-y-4 rounded-[3rem] bg-white/40 border-white/60 shadow-xl">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
               <BookOpen className="w-10 h-10" />
             </div>
             <div className="space-y-1">
               <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Subjects Allocated</h3>
               <p className="text-sm text-slate-400 max-w-xs mx-auto">Please contact your HOD to assign subjects to your profile.</p>
             </div>
          </div>
        ) : (
          subjects.map((item) => (
            <div key={item._id} className="syllabus-card glass-panel p-8 rounded-[3rem] bg-white border-white/60 shadow-lg hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
              
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-primary-100">{item.subjectId?.subjectCode}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.course}</span>
                   </div>
                   <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors leading-tight">{item.subjectId?.subjectName}</h3>
                </div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-primary-400" />
                </div>
              </div>

              <div className="relative z-10 space-y-8">
                {/* Progress Visualizer */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <Sliders className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Completion Progress</span>
                      </div>
                      <span className="text-2xl font-black text-primary-600 tracking-tighter">{localProgress[item._id] || 0}%</span>
                   </div>

                   <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-1000 ease-out"
                        style={{ width: `${localProgress[item._id] || 0}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                   </div>

                   {/* Quick Select Buttons */}
                   <div className="flex flex-wrap gap-2 pt-2">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(pct => (
                        <button
                          key={pct}
                          onClick={() => handleSliderChange(item._id, pct)}
                          className={`flex-1 min-w-[45px] py-2 rounded-xl text-[10px] font-black transition-all border ${
                            localProgress[item._id] === pct 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-110' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-primary-200 hover:text-primary-600'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                   </div>

                   <div className="flex items-center gap-4 pt-2">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={localProgress[item._id] || 0}
                        onChange={(e) => handleSliderChange(item._id, e.target.value)}
                        className="flex-grow h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600"
                      />
                      <span className="text-[10px] font-black text-slate-400 uppercase w-12 text-right">Manual</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Section</p>
                        <p className="text-xs font-black text-slate-900">{item.sectionId?.name}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Semester</p>
                        <p className="text-xs font-black text-slate-900">{item.semesterId?.semesterName}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                   </div>
                   <button 
                     onClick={() => handleSave(item._id)}
                     disabled={updating || localProgress[item._id] === item.syllabusProgress}
                     className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group/btn"
                   >
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
                      Sync Progress
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SyllabusManagementPage;
