import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import FacultyTable from '../components/faculty/FacultyTable';
import FacultyCreateForm from '../components/faculty/FacultyCreateForm';
import FacultyProfileDrawer from '../components/faculty/FacultyProfileDrawer';
import { useFacultyManagement } from '../hooks/useFacultyManagement';
import { canManageFaculty } from '../utils/academicPermissionHelpers';

const FacultyManagementPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { faculty, loading, error, addFaculty, updateStatus, deleteFaculty } = useFacultyManagement();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { role: 'student' };

  const handleCreateSuccess = (data) => {
    setIsCreateOpen(false);
    alert(`Faculty Created!\nEmail: ${data.erpEmail}\nTemp Password: ${data.tempPassword}\n\nPlease copy this password as it won't be shown again.`);
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteFaculty(facultyToDelete._id);
      alert(response.message); // Native dialog matches current notification styling 
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
      setFacultyToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Faculty Management" 
        subtitle="Maintain faculty directory, accounts, and departmental profiles" 
        action={canManageFaculty(user.role) ? { label: 'Register New Faculty', onClick: () => setIsCreateOpen(true) } : null}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <FacultyTable 
          data={faculty} 
          loading={loading} 
          onViewDetails={setSelectedFaculty}
          onToggleStatus={updateStatus}
          onDelete={setFacultyToDelete}
          canManage={canManageFaculty(user.role)}
        />
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-hide border border-white/20">
            <FacultyCreateForm 
              onClose={() => setIsCreateOpen(false)} 
              onSubmit={addFaculty}
              onSuccess={handleCreateSuccess}
            />
          </div>
        </div>
      )}

      {selectedFaculty && (
        <FacultyProfileDrawer 
          faculty={selectedFaculty} 
          onClose={() => setSelectedFaculty(null)} 
        />
      )}

      {facultyToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md border border-white/20 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Delete Faculty</h3>
              <p className="text-sm font-medium text-gray-500 mb-6 max-w-sm">
                Are you sure you want to permanently strip <span className="text-gray-900 font-bold">{facultyToDelete.user?.fullName}</span>? This action evaluates structural data links.
              </p>
              
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button 
                  onClick={() => setFacultyToDelete(null)}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 w-full"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagementPage;
