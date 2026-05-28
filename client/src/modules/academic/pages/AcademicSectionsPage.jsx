import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import SectionTable from '../components/sections/SectionTable';
import SectionForm from '../components/sections/SectionForm';
import { useSections } from '../hooks/useSections';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useSemesters } from '../hooks/useSemesters';
import { Filter } from 'lucide-react';

const AcademicSectionsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isMentorMode = queryParams.get('focus') === 'mentor';

  const { years } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const { semesters } = useSemesters(selectedYearId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const { sections, loading, addSection, updateSection, toggleSectionStatus } = useSections({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId
  });

  const handleCreate = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingSection) {
      await updateSection(editingSection._id, data);
    } else {
      await addSection(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title={isMentorMode ? "Mentor Allocation" : "Section Management"} 
        subtitle={isMentorMode ? "Assign class mentors and advisors to sections" : "Organize students into manageable class units"} 
        action={{ label: 'New Section', onClick: handleCreate }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filter Academic Year</label>
          <select 
            value={selectedYearId}
            onChange={(e) => { setSelectedYearId(e.target.value); setSelectedSemesterId(''); }}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filter Semester</label>
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
        <SectionTable 
          data={sections} 
          loading={loading} 
          onEdit={handleEdit}
          onToggleStatus={toggleSectionStatus}
          highlightMentor={isMentorMode}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <SectionForm 
              initialData={editingSection}
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

export default AcademicSectionsPage;
