import { useState, useEffect } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useResults } from '../hooks/useResults';
import { useAuth } from '../../../hooks/useAuth'; // Assuming standard auth hook
import { Award, Percent, ChevronRight, FileText, Download } from 'lucide-react';

const MyResultsPage = () => {
  const { results, loading, fetchResults } = useResults();
  const { user } = useAuth();
  const studentId = user?._id;

  useEffect(() => {
    if (studentId) {
      fetchResults({ studentId, resultStatus: 'Published' });
    }
  }, [studentId, fetchResults]);

  if (loading) return <div className="p-20 text-center text-gray-400 italic">Retreiving your semester performance...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AcademicPageHeader
        title="My Results"
        subtitle="Track your academic progress across each semester"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {results.length > 0 ? results.map((result) => (
          <div key={result._id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all group">
            <div className="p-8 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{result.semesterId?.semesterName}</h3>
                <p className="text-[10px] font-black text-gray-400 mt-0.5">{result.academicYearId?.name}</p>
              </div>
              <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                {result.overallGrade}
              </div>
            </div>
            <div className="p-8 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Percentage</p>
                  <div className="flex items-center gap-1.5 text-xl font-black text-primary-600">
                    <Percent className="w-4 h-4" />
                    {result.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-3xl text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass Status</p>
                  <div className="text-sm font-black text-emerald-600 uppercase tracking-widest mt-1">SUCCESS</div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Breakdown</p>
                {result.subjectResults.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group-hover:border-primary-100 transition-colors">
                    <span className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{sub.subjectId?.subjectName || 'Subject'}</span>
                    <span className="text-xs font-black text-primary-600">{sub.totalMarks}/{sub.maxMarks}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-6 bg-gray-50 group-hover:bg-primary-600 group-hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Download className="w-4 h-4" /> Download Digital Gradecard
            </button>
          </div>
        )) : (
          <div className="col-span-full p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium italic">
            Your results have not been published for the current term yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResultsPage;
