import { useState, useEffect } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import InternalMarksFilters from '../components/internalMarks/InternalMarksFilters';
import InternalMarksTable from '../components/internalMarks/InternalMarksTable';
import InternalMarksEntryForm from '../components/internalMarks/InternalMarksEntryForm';
import { useInternalMarks } from '../hooks/useInternalMarks';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { Plus } from 'lucide-react';

const InternalMarksManagementPage = () => {
  const { years } = useAcademicYears();
  const [filters, setFilters] = useState({
    academicYearId: '',
    semesterId: '',
    sectionId: '',
    subjectId: ''
  });

  const { marks, loading, fetchMarks, saveMarks } = useInternalMarks();
  const [isEntryMode, setIsEntryMode] = useState(false);

  useEffect(() => {
    if (filters.subjectId && !isEntryMode) {
      fetchMarks(filters);
    }
  }, [filters, isEntryMode, fetchMarks]);

  const handleSave = async (data) => {
    await saveMarks({ marks: data });
    setIsEntryMode(false);
    fetchMarks(filters);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="Internal Marks" 
        subtitle="Manage student assessments and academic performance" 
        action={!isEntryMode && filters.subjectId ? { label: 'Enter Marks', onClick: () => setIsEntryMode(true), icon: Plus } : null}
      />

      {!isEntryMode && (
        <>
          <InternalMarksFilters 
            filters={filters} 
            setFilters={setFilters} 
            years={years} 
          />

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
            <InternalMarksTable 
              data={marks} 
              loading={loading} 
            />
          </div>
        </>
      )}

      {isEntryMode && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Batch Marks Entry</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Section: {filters.sectionId} | Subject: {filters.subjectId}</p>
            </div>
            <button 
              onClick={() => setIsEntryMode(false)}
              className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>
          <InternalMarksEntryForm 
            filters={filters}
            onSave={handleSave}
            existingMarks={marks}
          />
        </div>
      )}
    </div>
  );
};

export default InternalMarksManagementPage;
