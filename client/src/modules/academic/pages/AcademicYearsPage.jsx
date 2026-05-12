import { useState } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import AcademicYearTable from '../components/academicYears/AcademicYearTable';
import AcademicYearForm from '../components/academicYears/AcademicYearForm';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useAuth } from '../../../hooks/useAuth';

const AcademicYearsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const { years, loading, error, addYear, updateYear, markCurrent } = useAcademicYears();
  const { user } = useAuth();
  
  const canManage = user && ['super_admin', 'academic_admin'].includes(user.role);

  const handleCreate = () => {
    setEditingYear(null);
    setIsModalOpen(true);
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingYear) {
      await updateYear(editingYear._id, data);
    } else {
      await addYear(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Academic Year Management" 
        subtitle="Configure and manage organizational academic cycles" 
        action={canManage ? { label: 'New Academic Year', onClick: handleCreate } : undefined}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <AcademicYearTable 
          data={years} 
          loading={loading} 
          onEdit={handleEdit} 
          onSetCurrent={markCurrent}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <AcademicYearForm 
              initialData={editingYear}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearsPage;
