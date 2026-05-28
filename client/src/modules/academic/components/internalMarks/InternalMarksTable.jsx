import { Activity, User, ChevronRight } from 'lucide-react';

const InternalMarksTable = ({ data, loading }) => {
  if (loading) return <div className="p-20 text-center text-gray-400 font-medium italic">Scanning academic records...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-400 font-medium italic">Apply filters to view student marks.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-6 py-6 text-center w-12">S.No.</th>
            <th className="px-8 py-6">Student Info</th>
            <th className="px-8 py-6 text-center">PT1 (20)</th>
            <th className="px-8 py-6 text-center">MSE (20)</th>
            <th className="px-8 py-6 text-center">PT2 (20)</th>
            <th className="px-8 py-6 text-center">SEM (60)</th>
            <th className="px-8 py-6 text-center">Total</th>
            <th className="px-8 py-6 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((record, index) => (
            <tr key={record._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-6 py-5 text-center text-xs font-bold text-gray-400">
                {index + 1}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-600 font-black text-xs">
                    {record.studentMasterId?.studentId ? record.studentMasterId.studentId.slice(-2) : 'ST'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 line-clamp-1">{record.studentMasterId?.personalDetails?.fullName || 'N/A'}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{record.studentMasterId?.studentId || 'N/A'}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center text-xs font-bold text-gray-600">{record.pt1Marks}</td>
              <td className="px-8 py-5 text-center text-xs font-bold text-gray-600">{record.mseMarks}</td>
              <td className="px-8 py-5 text-center text-xs font-bold text-gray-600">{record.pt2Marks}</td>
              <td className="px-8 py-5 text-center text-xs font-bold text-gray-600">{record.semMarks}</td>
              <td className="px-8 py-5 text-center">
                <span className="text-sm font-black text-primary-700 bg-primary-100 px-3 py-1 rounded-lg">
                  {record.totalInternalMarks}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  record.marksStatus === 'Locked' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  record.marksStatus === 'Submitted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                  'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                  {record.marksStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InternalMarksTable;
