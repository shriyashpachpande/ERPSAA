import { Calendar, CheckCircle, MoreVertical, Edit, Star, ShieldAlert } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';

const AcademicYearTable = ({ data, loading, onEdit, onSetCurrent }) => {
  if (loading && data.length === 0) return <div className="p-20 text-center text-gray-500">Loading academic years...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-6 py-4">Academic Year</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((year) => (
            <tr key={year._id} className={`hover:bg-primary-50/30 transition-colors group ${year.isCurrent ? 'bg-primary-50/20' : ''}`}>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  {year.name}
                  {year.isCurrent && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                      <Star className="w-2.5 h-2.5 fill-current" /> Current
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-medium text-gray-500">
                {new Date(year.startDate).toLocaleDateString()} — {new Date(year.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <AcademicStatusBadge status={year.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(year)}
                    className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                    title="Edit Year"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!year.isCurrent && (
                    <button 
                      onClick={() => onSetCurrent(year._id)}
                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Set as Current"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearTable;
