import { Edit, Power, User, Book, Layers } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';

const FacultyAcademicAllocationTable = ({ data, loading, onEdit, onToggleStatus }) => {
  if (loading) return <div className="p-20 text-center text-gray-500 italic">Exploring data...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-400 italic">No allocations found for this filter.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-8 py-6">Faculty Info</th>
            <th className="px-8 py-6">Subject / Course</th>
            <th className="px-8 py-6">Context</th>
            <th className="px-8 py-6">Status</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">
                      {item.faculty?.user?.fullName || 'N/A'} 
                      <span className="ml-2 text-[10px] text-gray-400 font-medium">({item.faculty?.employeeId})</span>
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{item.faculty?.designation}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Book className="w-3 h-3 text-primary-500" />
                    <span className="text-sm font-bold text-gray-900">{item.subjectId?.subjectName}</span>
                  </div>
                  <p className="ml-4.5 text-[10px] font-black text-primary-600 uppercase tracking-widest">{item.course}</p>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="text-xs font-bold text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-gray-400" />
                    <span>{item.sectionId?.name}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.semesterId?.semesterName}</p>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.assignmentStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.assignmentStatus}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="p-3 text-primary-600 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                    title="Edit Allocation"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onToggleStatus(item._id, item.assignmentStatus === 'active' ? 'historical' : 'active')}
                    className="p-3 text-gray-400 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                    title="Toggle Status"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyAcademicAllocationTable;
