import { Award, User, Percent } from 'lucide-react';

const ResultsTable = ({ data, loading }) => {
  if (loading) return <div className="p-20 text-center text-gray-400 font-medium italic">Generating results database...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-400 font-medium italic">No results generated for the current selection.</div>;

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-8 py-6">Student</th>
            <th className="px-8 py-6 text-center">Score</th>
            <th className="px-8 py-6 text-center">Percentage</th>
            <th className="px-8 py-6 text-center">Grade</th>
            <th className="px-8 py-6 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((result) => (
            <tr key={result._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 line-clamp-1">{result.studentId?.fullName}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{result.studentId?.rollNumber}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="text-xs font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg inline-block border border-gray-100">
                  {result.grandTotal} / {result.maxTotal}
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-primary-600">
                   <Percent className="w-3 h-3" />
                   {result.percentage.toFixed(1)}%
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                 <span className="w-10 h-10 flex items-center justify-center bg-brand-dark text-white rounded-full text-xs font-black mx-auto shadow-lg shadow-brand-dark/20">
                   {result.overallGrade}
                 </span>
              </td>
              <td className="px-8 py-5 text-right">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                  result.resultStatus === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {result.resultStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
