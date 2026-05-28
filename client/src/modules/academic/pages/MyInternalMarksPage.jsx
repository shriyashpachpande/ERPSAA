import { useEffect } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useInternalMarks } from '../hooks/useInternalMarks';
import { BookOpen, Award, CheckCircle, Flame, Calendar, Sparkles } from 'lucide-react';

const MyInternalMarksPage = () => {
   const { marks, loading, fetchMyMarks } = useInternalMarks();

   useEffect(() => {
      fetchMyMarks();
   }, [fetchMyMarks]);

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Aligning your academic records...</p>
         </div>
      );
   }

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <AcademicPageHeader
            title="My Internal Marks"
            subtitle="Real-time performance details across PT1, MSE, PT2, and SEM assessments"
         />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marks.length > 0 ? marks.map((m) => {
               // Total score and percentage
               const total = m.totalInternalMarks || 0;
               const maxTotal = m.maxInternalMarks || 120;
               const percentage = (total / maxTotal) * 100;

               return (
                  <div key={m._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between min-h-[460px]">
                     <div>
                        {/* Card Header */}
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center border border-primary-100 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                              <BookOpen className="w-6 h-6" />
                           </div>
                           <div className="overflow-hidden">
                              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider truncate group-hover:text-primary-600 transition-colors">{m.subjectId?.subjectName || 'Academic Subject'}</h3>
                              <p className="text-[10px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">{m.subjectId?.subjectCode || 'SUB101'} | {m.semesterId?.semesterName || 'Term'}</p>
                           </div>
                        </div>

                        {/* Breakdown Grid */}
                        <div className="space-y-3.5 mb-6">
                           {/* PT1 Exam */}
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                              <div className="flex items-center justify-between mb-1.5">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Periodic Test 1 (PT1)</span>
                                 <span className="text-xs font-black text-gray-800">{m.pt1Marks || 0} <span className="text-[9px] font-bold text-gray-400">/ 20</span></span>
                              </div>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                    className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, ((m.pt1Marks || 0) / 20) * 100)}%` }}
                                 ></div>
                              </div>
                           </div>

                           {/* MSE Exam */}
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                              <div className="flex items-center justify-between mb-1.5">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mid Sem Exam (MSE)</span>
                                 <span className="text-xs font-black text-gray-800">{m.mseMarks || 0} <span className="text-[9px] font-bold text-gray-400">/ 20</span></span>
                              </div>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                    className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, ((m.mseMarks || 0) / 20) * 100)}%` }}
                                 ></div>
                              </div>
                           </div>

                           {/* PT2 Exam */}
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                              <div className="flex items-center justify-between mb-1.5">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Periodic Test 2 (PT2)</span>
                                 <span className="text-xs font-black text-gray-800">{m.pt2Marks || 0} <span className="text-[9px] font-bold text-gray-400">/ 20</span></span>
                              </div>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                    className="bg-violet-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, ((m.pt2Marks || 0) / 20) * 100)}%` }}
                                 ></div>
                              </div>
                           </div>

                           {/* SEM Exam */}
                           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                              <div className="flex items-center justify-between mb-1.5">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semester Exam (SEM)</span>
                                 <span className="text-xs font-black text-gray-800">{m.semMarks || 0} <span className="text-[9px] font-bold text-gray-400">/ 60</span></span>
                              </div>
                              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                    className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, ((m.semMarks || 0) / 60) * 100)}%` }}
                                 ></div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Card Footer */}
                     <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                           <CheckCircle className="w-3.5 h-3.5" /> Verified
                        </div>
                        <div className="flex items-baseline gap-1 bg-primary-50/50 border border-primary-100 px-4 py-2 rounded-2xl">
                           <span className="text-xl font-black text-primary-600">{total}</span>
                           <span className="text-[10px] font-black text-gray-400">/ {maxTotal}</span>
                        </div>
                     </div>
                  </div>
               );
            }) : (
               <div className="col-span-full p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-gray-400 text-sm font-black uppercase tracking-wider animate-pulse flex flex-col items-center justify-center gap-3">
                  <Flame className="w-8 h-8 text-gray-300" />
                  No submitted exam records found for this term yet.
               </div>
            )}
         </div>
      </div>
   );
};

export default MyInternalMarksPage;
