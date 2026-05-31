import { Edit, Users, Power } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';
import { useDepartments } from '../../hooks/useDepartments';

const SectionTable = ({ data, loading, onEdit, onToggleStatus, highlightMentor }) => {
  const { departments } = useDepartments();

  const getDeptName = (code) => {
    if (!code) return 'N/A';
    const dept = departments.find(d => d.code === code || d.name === code);
    return dept ? dept.name : code;
  };

  if (loading && data.length === 0) return <div className="p-20 text-center text-gray-500 italic">Finding sections...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-500 italic">No sections found for the current selection.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-8 py-6">Section Info</th>
            <th className="px-8 py-6">Year / Sem</th>
            <th className="px-8 py-6">Dept / Course</th>
            <th className="px-8 py-6 transition-all duration-300" style={highlightMentor ? { backgroundColor: 'rgb(240, 244, 255)', color: 'rgb(79, 70, 229)', fontWeight: '900' } : {}}>Mentor</th>
            <th className="px-8 py-6 text-center">Capacity</th>
            <th className="px-8 py-6">Status</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((sec) => (
            <tr key={sec._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-600 font-black">
                    {sec.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sec.name}</p>
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-0.5">Section Unit</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-xs font-bold text-gray-500">
                <div className="space-y-0.5">
                  <p>{sec.academicYearId?.name}</p>
                  <p className="text-primary-600 font-black uppercase text-[9px] tracking-widest">{sec.semesterId?.semesterName}</p>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{getDeptName(sec.department)}</p>
                  <p className="text-xs font-bold text-gray-900">{sec.course}</p>
                </div>
              </td>
              <td className="px-8 py-5 text-xs font-bold transition-all duration-300" style={highlightMentor ? { backgroundColor: 'rgba(240, 244, 255, 0.4)' } : {}}>
                {sec.mentorFacultyId?.user?.fullName ? (
                  <div className="space-y-0.5">
                    <p className="text-gray-900">{sec.mentorFacultyId.user.fullName}</p>
                    <p className="text-[9px] text-primary-600 font-black uppercase tracking-widest">{sec.mentorFacultyId.designation}</p>
                  </div>
                ) : (
                  <span className="text-gray-300 italic font-medium">Unassigned</span>
                )}
              </td>
              <td className="px-8 py-5 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-black text-gray-900">{sec.capacity}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <AcademicStatusBadge status={sec.status} />
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" 
                    onClick={() => onEdit(sec)}
                    className="p-3 text-primary-600 hover:bg-white hover:shadow-sm rounded-2xl transition-all active:scale-95"
                    title="Edit Section"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button type="button" 
                    onClick={() => onToggleStatus(sec._id, sec.status === 'active' ? 'inactive' : 'active')}
                    className={`p-3 rounded-2xl transition-all active:scale-95 hover:shadow-sm ${
                      sec.status === 'active' ? 'text-red-400 hover:bg-red-50' : 'text-emerald-400 hover:bg-emerald-50'
                    }`}
                    title={sec.status === 'active' ? 'Deactivate' : 'Activate'}
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

export default SectionTable;
