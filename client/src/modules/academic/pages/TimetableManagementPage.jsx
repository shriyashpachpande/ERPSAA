import { useState } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import TimetableTable from '../components/timetable/TimetableTable';
import TimetableEntryForm from '../components/timetable/TimetableEntryForm';
import TimetableFilters from '../components/timetable/TimetableFilters';
import { useTimetableManagement } from '../hooks/useTimetableManagement';
import { useAcademicYears } from '../hooks/useAcademicYears';

const TimetableManagementPage = () => {
  const { years } = useAcademicYears();
  const [filters, setFilters] = useState({
    academicYearId: '',
    semesterId: '',
    sectionId: '',
    dayOfWeek: ''
  });

  const { entries, loading, addEntry, updateEntry, removeEntry } = useTimetableManagement(filters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleCreate = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingEntry) {
      await updateEntry(editingEntry._id, data);
    } else {
      await addEntry(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Timetable Management" 
        subtitle="Design and optimize the weekly academic schedule" 
        action={{ label: 'Add Class', onClick: handleCreate }}
      />

      <TimetableFilters 
        filters={filters} 
        setFilters={setFilters} 
        years={years} 
      />

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <TimetableTable 
          data={entries} 
          loading={loading && entries.length === 0}
          onEdit={handleEdit}
          onDelete={removeEntry}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20">
            <TimetableEntryForm 
              initialData={editingEntry}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFormSubmit}
              academicYears={years}
              currentFilters={filters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagementPage;
