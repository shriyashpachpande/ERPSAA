import { Edit, Hash, Calendar, Layers } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';

const SemesterTable = ({ data, loading, onEdit }) => {
  if (loading) return <div className="p-20 text-center text-gray-500">Loading semesters...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-500 italic">No semesters found for the selected year.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-6 py-4">Semester</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((sem) => (
            <tr key={sem._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    {sem.semesterNumber}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sem.semesterName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Term {sem.semesterNumber}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-medium text-gray-500">
                {new Date(sem.startDate).toLocaleDateString()} — {new Date(sem.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <AcademicStatusBadge status={sem.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button type="button" 
                  onClick={() => onEdit(sem)}
                  className="p-3 text-primary-600 hover:bg-primary-100 rounded-2xl transition-all shadow-sm hover:shadow-primary-600/10 active:scale-95"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterTable;
