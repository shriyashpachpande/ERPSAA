import { useState, useEffect } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useInternalMarks } from '../hooks/useInternalMarks';
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen, Award, CheckCircle, HelpCircle } from 'lucide-react';

const MyInternalMarksPage = () => {
   const { marks, loading, fetchMarks } = useInternalMarks();
   const { user } = useAuth();
   const studentId = user?._id;

   useEffect(() => {
      if (studentId) {
         // Custom endpoint for student self marks
         const load = async () => {
            try {
               const res = await fetchMarks({ studentId, marksStatus: 'Submitted' });
            } catch (e) { }
         };
         load();
      }
   }, [studentId, fetchMarks]);

   if (loading) return <div className="p-20 text-center text-gray-400 italic">Aligning your semester assessments...</div>;

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <AcademicPageHeader
            title="My Internal Marks"
            subtitle="Detailed breakdown of your continuous assessments and practicals"
         />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marks.length > 0 ? marks.map((m) => (
               <div key={m._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                     </div>
                     <div className="overflow-hidden">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest truncate">{m.subjectId?.subjectName}</h3>
                        <p className="text-[10px] font-black text-gray-400 mt-0.5">{m.subjectId?.subjectCode} | {m.semesterId?.semesterName}</p>
                     </div>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Tests</span>
                        <span className="text-xs font-black text-gray-900">{m.unitTestMarks}/20</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignments</span>
                        <span className="text-xs font-black text-gray-900">{m.assignmentMarks}/20</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Practicals</span>
                        <span className="text-xs font-black text-gray-900">{m.practicalMarks}/40</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Viva</span>
                        <span className="text-xs font-black text-gray-900">{m.vivaMarks}/20</span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="text-[10px] font-black text-emerald-600 flex items-center gap-1.5 uppercase tracking-widest">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                     </div>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary-600">{m.totalInternalMarks}</span>
                        <span className="text-[10px] font-black text-gray-300">/ {m.maxInternalMarks}</span>
                     </div>
                  </div>
               </div>
            )) : (
               <div className="col-span-full p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium italic">
                  Detailed marks for submittted assessments will appear here.
               </div>
            )}
         </div>
      </div>
   );
};

export default MyInternalMarksPage;
