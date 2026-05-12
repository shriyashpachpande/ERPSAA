import { useState, useMemo } from 'react';
import { X, Check, Search, BookOpen, Plus } from 'lucide-react';
import { useSubjects } from '../../hooks/useSubjects';

const SemesterSubjectMappingForm = ({ academicYearId, department, semesterId, existingMappings, onClose, onSubmit }) => {
  const { subjects, loading: subjectsLoading } = useSubjects(department ? { department } : {});
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter subjects: active, matching search, and NOT already mapped
  const availableSubjects = useMemo(() => {
    if (!subjects) return [];
    
    const existingSubjectIds = existingMappings?.map(m => m.subjectId?._id) || [];
    
    return subjects.filter(s => {
      // Basic checks: match department, match search, and is active
      // Basic checks: match department and is active
      const matchesDept = !department || s.department === department;
      
      // If status is missing, we assume it's active for existing records
      const isActive = !s.status || s.status.toLowerCase() === 'active';
      
      const isNotMapped = !existingSubjectIds.includes(s._id);
      
      const matchesSearch = !search || 
        s.subjectName.toLowerCase().includes(search.toLowerCase()) || 
        s.subjectCode.toLowerCase().includes(search.toLowerCase());

      return matchesDept && isActive && isNotMapped && matchesSearch;
    });
  }, [subjects, existingMappings, search, department]);

  const toggleSubject = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === availableSubjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(availableSubjects.map(s => s._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    
    setLoading(true);
    try {
      await onSubmit(selectedIds);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Assign Subjects</h2>
          <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">
            {department ? `Department Context: ${department}` : 'Bulk Mapping for Semester'}
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-400"
            placeholder="Search subjects by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Available Subjects ({availableSubjects.length})
          </h3>
          <button 
            onClick={handleSelectAll}
            className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline"
          >
            {selectedIds.length === availableSubjects.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Subjects List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {availableSubjects.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic text-sm">
              No available subjects found.
            </div>
          ) : (
            availableSubjects.map((sub) => (
              <div 
                key={sub._id}
                onClick={() => toggleSubject(sub._id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  selectedIds.includes(sub._id) 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${
                    selectedIds.includes(sub._id) ? 'bg-primary-600 text-white' : 'bg-white text-gray-400 border border-gray-100'
                  }`}>
                    {selectedIds.includes(sub._id) ? <Check className="w-5 h-5" /> : sub.subjectCode.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sub.subjectName}</p>
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{sub.subjectCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 py-1 bg-white rounded-lg border border-gray-50">
                    {sub.credits} Credits
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto flex items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected</p>
          <p className="text-xl font-black text-gray-900">{selectedIds.length} <span className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-1">Subjects</span></p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedIds.length === 0}
          className="flex-1 py-5 bg-primary-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (
            <>
              <Plus className="w-4 h-4" />
              Confirm Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SemesterSubjectMappingForm;
