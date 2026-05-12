import { useState } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import FacultyAcademicAllocationTable from '../components/facultyAcademicAllocations/FacultyAcademicAllocationTable';
import FacultyAcademicAllocationForm from '../components/facultyAcademicAllocations/FacultyAcademicAllocationForm';
import { useFacultyAcademicAllocations } from '../hooks/useFacultyAcademicAllocations';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useSemesters } from '../hooks/useSemesters';
import { useSections } from '../hooks/useSections';

const FacultyAcademicAllocationsPage = () => {
  const { years, currentYear } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  
  const { semesters } = useSemesters(selectedYearId);
  const { sections } = useSections({ academicYearId: selectedYearId, semesterId: selectedSemesterId });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);

  const { allocations, loading, addAllocation, updateAllocation, toggleStatus } = useFacultyAcademicAllocations({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId
  });

  const handleCreate = () => {
    setEditingAllocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingAllocation) {
      await updateAllocation(editingAllocation._id, data);
    } else {
      await addAllocation(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Faculty Allocation" 
        subtitle="Manage faculty assignments to subjects and sections" 
        action={{ label: 'New Allocation', onClick: handleCreate }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Academic Year</label>
          <select 
            value={selectedYearId}
            onChange={(e) => { setSelectedYearId(e.target.value); setSelectedSemesterId(''); }}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Semester</label>
          <select 
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            disabled={!selectedYearId}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <FacultyAcademicAllocationTable 
          data={allocations} 
          loading={loading && allocations.length === 0}
          onEdit={handleEdit}
          onToggleStatus={toggleStatus}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20">
            <FacultyAcademicAllocationForm 
              initialData={editingAllocation}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFormSubmit}
              academicYears={years}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAcademicAllocationsPage;
