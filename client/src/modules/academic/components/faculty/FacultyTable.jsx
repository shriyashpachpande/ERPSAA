import { useState } from 'react';
import { Search, Filter, MoreVertical, User, Mail, Shield, ToggleRight, ToggleLeft, Trash2 } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';

const FacultyTable = ({ data, loading, onViewDetails, onToggleStatus, onDelete, canManage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(f => 
    f.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.erpEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && data.length === 0) {
    return <div className="p-20 text-center text-gray-500">Loading faculty directory...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table Actions/Search */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, ID or email..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-500 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4">ID & Dept</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.map((faculty) => (
              <tr key={faculty._id} className="hover:bg-primary-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {faculty.user?.fullName?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{faculty.user?.fullName}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{faculty.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-700">{faculty.employeeId}</p>
                  <p className="text-xs text-gray-400">{faculty.department}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail className="w-3 h-3" />
                    <span className="text-xs font-medium">{faculty.erpEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Shield className="w-3 h-3" />
                    <span className="text-[10px]">{faculty.personalEmail}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AcademicStatusBadge status={faculty.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" 
                      onClick={() => onViewDetails(faculty)}
                      className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    {canManage && (
                      <>
                        <button type="button" 
                          onClick={() => onToggleStatus(faculty._id, faculty.status === 'active' ? 'inactive' : 'active')}
                          className={`p-2 rounded-lg transition-colors ${faculty.status === 'active' ? 'text-emerald-600 hover:bg-emerald-100' : 'text-gray-400 hover:bg-gray-200'}`}
                          title={faculty.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {faculty.status === 'active' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button type="button" 
                          onClick={() => onDelete(faculty)}
                          className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete Faculty"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic text-sm">
            No faculty members found matching your criteria.
          </div>
        )}
      </div>

      {/* Mobile Selection Placeholder / Pagination */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Total: {filteredData.length} records</p>
      </div>
    </div>
  );
};

export default FacultyTable;
