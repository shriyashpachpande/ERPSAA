import { useState, useMemo } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import SemesterTable from '../components/semesters/SemesterTable';
import SemesterForm from '../components/semesters/SemesterForm';
import { useSemesters } from '../hooks/useSemesters';
import { useAcademicYears } from '../hooks/useAcademicYears';

const SemestersPage = () => {
  const { years, currentYear } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  // Set default year to current year if available
  useMemo(() => {
    if (currentYear && !selectedYearId) {
      setSelectedYearId(currentYear._id);
    }
  }, [currentYear, selectedYearId]);

  const { semesters, loading, error, addSemester, updateSemester } = useSemesters(selectedYearId);

  const handleCreate = () => {
    setEditingSemester(null);
    setIsModalOpen(true);
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingSemester) {
      await updateSemester(editingSemester._id, data);
    } else {
      await addSemester({ ...data, academicYearId: selectedYearId });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Semester Management" 
        subtitle="Manage academic terms and session parameters" 
        action={{ label: 'New Semester', onClick: handleCreate }}
      />

      {/* Year Selector / Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter Year:</span>
          <select 
            value={selectedYearId}
            onChange={(e) => setSelectedYearId(e.target.value)}
            className="text-sm font-bold bg-primary-50 border-none rounded-xl px-4 py-2 text-primary-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
          >
            {years.map(y => (
              <option key={y._id} value={y._id}>{y.name} {y.isCurrent ? '(Current)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {semesters.length} Semesters Total
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SemesterTable 
          data={semesters} 
          loading={loading && semesters.length === 0} 
          onEdit={handleEdit}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <SemesterForm 
              initialData={editingSemester}
              academicYearId={selectedYearId}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SemestersPage;
