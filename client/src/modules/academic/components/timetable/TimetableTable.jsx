import { Edit, Trash2, Clock, MapPin, User, Book } from 'lucide-react';

const TimetableTable = ({ data, loading, onEdit, onDelete }) => {
  if (loading) return <div className="p-20 text-center text-gray-400 italic font-medium">Drafting weekly schedule...</div>;
  if (!loading && data.length === 0) return <div className="p-20 text-center text-gray-400 italic font-medium">No classes scheduled for the selected view.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
            <th className="px-8 py-6">Time / Day</th>
            <th className="px-8 py-6">Subject & Room</th>
            <th className="px-8 py-6">Faculty</th>
            <th className="px-8 py-6">Section</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((entry) => (
            <tr key={entry._id} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{entry.startTime} - {entry.endTime}</p>
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-0.5">{entry.dayOfWeek}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <Book className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                     <p className="text-sm font-bold text-gray-900 line-clamp-1">{entry.subjectId?.subjectName}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <MapPin className="w-3 h-3" />
                     {entry.roomNumber}
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <User className="w-3.5 h-3.5 text-primary-500" />
                    {entry.facultyId?.user?.fullName || 'Not Assigned'}
                  </div>
                  {entry.facultyId?.employeeId && (
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-5">
                      ID: {entry.facultyId?.employeeId}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-widest font-mono">
                  {entry.sectionId?.name}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button type="button" 
                    onClick={() => onEdit(entry)}
                    className="p-3 text-primary-600 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button type="button" 
                    onClick={() => { if(window.confirm('Delete this entry?')) onDelete(entry._id) }}
                    className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default TimetableTable;
