import { useState, useEffect, useMemo } from 'react';
import { X, User, Book, Layers, ShieldCheck, Tag } from 'lucide-react';
import { useSemesters } from '../../hooks/useSemesters';
import { useSections } from '../../hooks/useSections';
import { useSemesterSubjectMappings } from '../../hooks/useSemesterSubjectMappings';
import { useFacultyManagement } from '../../hooks/useFacultyManagement';
import { useDepartments } from '../../hooks/useDepartments';
import { useSubjects } from '../../hooks/useSubjects';

const FacultyAcademicAllocationForm = ({ initialData, onClose, onSubmit, academicYears }) => {
  const [formData, setFormData] = useState(initialData || {
    faculty: '',
    academicYearId: '',
    semesterId: '',
    sectionId: '',
    subjectId: '',
    department: 'FE',
    course: 'B.Tech - FY',
    assignmentStatus: 'active',
    remarks: ''
  });
  
  const [loadingItems, setLoadingItems] = useState(false);
  const { departments } = useDepartments();
  const { faculty } = useFacultyManagement(); // ALL Faculty

  // Normalization logic for redundant department names
  const deptVariants = useMemo(() => {
    if (!formData.department) return [];
    const variants = [formData.department];
    const map = {
      'Common Engineering': 'FE',
      'FE': 'Common Engineering',
      'Information Technology': 'IT',
      'IT': 'Information Technology',
      'Computer Science': 'CS',
      'CS': 'Computer Science',
      'Electronics & Communication Engineering': 'ECT',
      'ECT': 'Electronics & Communication Engineering',
      'Mechanical Engineering': 'ME',
      'ME': 'Mechanical Engineering'
    };
    if (map[formData.department]) variants.push(map[formData.department]);
    return variants;
  }, [formData.department]);

  const { semesters } = useSemesters(formData.academicYearId);
  const { sections } = useSections({ 
    academicYearId: formData.academicYearId, 
    semesterId: formData.semesterId,
    department: formData.department // Standardized code context (e.g. IT, FE)
  });
  
  const { mappings: subjectMappings, loading: mappingsLoading } = useSemesterSubjectMappings(
    formData.academicYearId, 
    deptVariants, // Array for resilient lookup
    formData.semesterId
  );
  
  const { subjects: allSubjectsMaster, loading: subjectsLoading } = useSubjects(
    formData.department ? { department: deptVariants } : {}
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        faculty: initialData.faculty?._id || initialData.faculty,
        academicYearId: initialData.academicYearId?._id || initialData.academicYearId,
        semesterId: initialData.semesterId?._id || initialData.semesterId,
        sectionId: initialData.sectionId?._id || initialData.sectionId,
        subjectId: initialData.subjectId?._id || initialData.subjectId,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingItems(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{initialData ? 'Edit Allocation' : 'Assign Faculty'}</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Academic Context Assignment</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl shadow-sm transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
        
        {/* 1. Department Context */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 ml-1">1. Department Context</label>
          <select
            required
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value, semesterId: '', sectionId: '', subjectId: '' })}
          >
            <option value="">Select Department</option>
            {departments?.map(dept => (
              <option key={dept._id} value={dept.code}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* 2. & 3. Year and Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">2. Academic Year</label>
            <select
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
              value={formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value, semesterId: '', sectionId: '' })}
            >
              <option value="">Select Year</option>
              {academicYears?.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">3. Semester</label>
            <select
              required
              disabled={!formData.academicYearId}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50"
              value={formData.semesterId}
              onChange={(e) => setFormData({ ...formData, semesterId: e.target.value, sectionId: '' })}
            >
              <option value="">Select Semester</option>
              {semesters?.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
            </select>
          </div>
        </div>

        {/* 4. Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">4. Section</label>
          <select
            required
            disabled={!formData.semesterId}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50"
            value={formData.sectionId}
            onChange={(e) => {
              const secId = e.target.value;
              const sec = sections.find(s => s._id === secId);
              setFormData({ 
                ...formData, 
                sectionId: secId,
                department: sec?.department || formData.department 
              });
            }}
          >
            <option value="">Select Section</option>
            {sections?.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
          </select>
        </div>

        {/* 5. Subject */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center justify-between">
            <span>5. Select Subject</span>
            { (mappingsLoading || subjectsLoading) && <span className="animate-pulse text-primary-500">Resolving...</span> }
          </label>
          <select
            required
            disabled={!formData.semesterId || (mappingsLoading && subjectsLoading)}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50 shadow-sm"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
          >
            <option value="">{ (mappingsLoading || subjectsLoading) ? 'Fetching Academic Subjects...' : 'Choose Subject'}</option>
            
            {/* Priority 1: Mapped Subjects */}
            {subjectMappings && subjectMappings.length > 0 ? (
              <optgroup label="Direct Semester Mappings">
                {subjectMappings.map(m => (
                  <option key={m.subjectId?._id} value={m.subjectId?._id}>
                    ({m.subjectId?.subjectCode}) {m.subjectId?.subjectName}
                  </option>
                ))}
              </optgroup>
            ) : null}

            {/* Priority 2 Fallback: All Subjects for Department */}
            {(!subjectMappings || subjectMappings.length === 0) && allSubjectsMaster && allSubjectsMaster.length > 0 ? (
              <optgroup label={`Master List (${formData.department})`}>
                {allSubjectsMaster.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    ({sub.subjectCode}) {sub.subjectName}
                  </option>
                ))}
              </optgroup>
            ) : null}

            {(!mappingsLoading && !subjectsLoading && (!subjectMappings?.length) && (!allSubjectsMaster?.length)) && (
                <option disabled>No subjects found for this context</option>
            )}
          </select>
        </div>

        {/* 6. Faculty */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 block flex items-center gap-2">
            <User className="w-3 h-3" /> 6. Select Faculty Member
          </label>
          <select
            required
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none appearance-none"
            value={formData.faculty}
            onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
          >
            <option value="">Search Faculty</option>
            {faculty?.map(f => (
                <option key={f._id} value={f._id}>
                  {f.user?.fullName || 'Unknown'} ({f.employeeId}) - {f.designation}
                </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Remarks (Optional)</label>
          <textarea 
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none resize-none h-24"
            placeholder="Notes regarding this assignment..."
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loadingItems}
          className="flex-[2] py-4 bg-brand-dark text-white text-xs font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loadingItems ? 'Allocating...' : initialData ? 'Update Assignment' : 'Assign Faculty'}
        </button>
      </div>
    </form>
  );
};

export default FacultyAcademicAllocationForm;
