import { Edit, User, Layout, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentSemesterEnrollmentTable = ({ data, loading, onEdit }) => {
  const navigate = useNavigate();

  const getYearLevelLabel = (semesterNumber) => {
    if (semesterNumber <= 2) return '1st Year';
    if (semesterNumber <= 4) return '2nd Year';
    if (semesterNumber <= 6) return '3rd Year';
    return 'Final Year';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Records...</p>
    </div>
  );
  
  if (!loading && data.length === 0) return (
    <div className="p-20 text-center space-y-4 opacity-50">
      <div className="flex justify-center"><Layout className="w-12 h-12 text-slate-300" /></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No student placements found matching your criteria.</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4">Student Identification</th>
              <th className="px-6 py-4 text-center">Department</th>
              <th className="px-6 py-4 text-center">Placement</th>
              <th className="px-6 py-4 text-center">Year / Term</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((enroll) => {
              const semNum = enroll.semesterId?.semesterNumber || 1;
              return (
                <tr key={enroll._id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        {enroll.studentMasterId?.personalDetails?.profilePhotoUrl ? (
                          <img src={enroll.studentMasterId.personalDetails.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{enroll.studentMasterId?.personalDetails?.fullName}</p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{enroll.studentMasterId?.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {enroll.studentMasterId?.academicProfile?.department || 'CORE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700">{enroll.sectionId?.name || 'Unassigned'}</p>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">{getYearLevelLabel(semNum)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">{enroll.academicYearId?.name}</p>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase">{enroll.semesterId?.semesterName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                      enroll.enrollmentStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      enroll.enrollmentStatus === 'Inactive' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full mr-1.5 ${enroll.enrollmentStatus === 'Active' ? 'bg-emerald-500' : 'bg-current'}`} />
                      {enroll.enrollmentStatus || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/app/academic/student-academic-profile/${enroll.studentMasterId?._id}`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm"
                        title="View Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(enroll)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100 shadow-sm"
                        title="Edit Placement"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100">
        {data.map((enroll) => {
          const semNum = enroll.semesterId?.semesterNumber || 1;
          return (
            <div key={enroll._id} className="p-5 space-y-4 active:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {enroll.studentMasterId?.personalDetails?.profilePhotoUrl ? (
                      <img src={enroll.studentMasterId.personalDetails.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{enroll.studentMasterId?.personalDetails?.fullName}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{enroll.studentMasterId?.studentId}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                  enroll.enrollmentStatus === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {enroll.enrollmentStatus || 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                  <p className="text-indigo-400 uppercase mb-0.5">Academic Track</p>
                  <p className="text-indigo-700">{enroll.studentMasterId?.academicProfile?.department}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                  <p className="text-slate-400 uppercase mb-0.5">Placement</p>
                  <p className="text-slate-700 truncate">{enroll.sectionId?.name} • {getYearLevelLabel(semNum)}</p>
                </div>
                <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 uppercase">Term:</p>
                    <p className="text-slate-700 uppercase">{enroll.academicYearId?.name} • <span className="text-indigo-600 font-black">{enroll.semesterId?.semesterName}</span></p>
                  </div>
                  <button 
                    onClick={() => navigate(`/app/academic/student-academic-profile/${enroll.studentMasterId?._id}`)}
                    className="text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    Profile <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentSemesterEnrollmentTable;
