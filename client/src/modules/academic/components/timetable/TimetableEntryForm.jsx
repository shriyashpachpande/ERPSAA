import { useState, useEffect, useMemo } from 'react';
import { X, Clock, Calendar, MapPin, User, Book, Layers, AlertCircle, Info } from 'lucide-react';
import { useSemesters } from '../../hooks/useSemesters';
import { useSections } from '../../hooks/useSections';
import { useSubjects } from '../../hooks/useSubjects';
import { useFacultyAcademicAllocations } from '../../hooks/useFacultyAcademicAllocations';

const TimetableEntryForm = ({ initialData, onClose, onSubmit, academicYears, currentFilters }) => {
  const [formData, setFormData] = useState(initialData || {
    academicYearId: currentFilters?.academicYearId || '',
    semesterId: currentFilters?.semesterId || '',
    sectionId: currentFilters?.sectionId || '',
    subjectId: '',
    facultyId: '',
    dayOfWeek: currentFilters?.dayOfWeek || 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    roomNumber: '',
    timetableStatus: 'active',
    remarks: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { semesters } = useSemesters(formData.academicYearId);
  const { sections } = useSections({ academicYearId: formData.academicYearId, semesterId: formData.semesterId });
  const { subjects } = useSubjects({});
  
  // Resolve faculty from Faculty Allocation
  const allocationFilters = useMemo(() => ({
    academicYearId: formData.academicYearId,
    semesterId: formData.semesterId,
    sectionId: formData.sectionId,
    subjectId: formData.subjectId,
    assignmentStatus: 'active'
  }), [formData.academicYearId, formData.semesterId, formData.sectionId, formData.subjectId]);

  const { allocations: facultyAllocations, loading: allocationsLoading } = useFacultyAcademicAllocations(
    (formData.academicYearId && formData.semesterId && formData.sectionId && formData.subjectId) ? allocationFilters : null
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        academicYearId: initialData.academicYearId?._id || initialData.academicYearId,
        semesterId: initialData.semesterId?._id || initialData.semesterId,
        sectionId: initialData.sectionId?._id || initialData.sectionId,
        subjectId: initialData.subjectId?._id || initialData.subjectId,
        facultyId: initialData.facultyId?._id || initialData.facultyId || initialData.facultyProfileId?._id || initialData.facultyProfileId,
        roomNumber: initialData.roomNumber || initialData.roomOrLab || ''
      });
    }
  }, [initialData]);

  // Auto-fill faculty if exactly one allocation exists
  useEffect(() => {
    // Only auto-fill if we are creating a new entry (not editing existing)
    if (!initialData && facultyAllocations && facultyAllocations.length === 1) {
      const allocatedFaculty = facultyAllocations[0].faculty;
      // Extract ID correctly (it might be an object or a string)
      const fId = typeof allocatedFaculty === 'object' ? allocatedFaculty._id : allocatedFaculty;
      
      if (fId && formData.facultyId !== fId) {
        console.log('Auto-detecting faculty for context:', fId);
        setFormData(prev => ({ ...prev, facultyId: fId }));
      }
    } else if (facultyAllocations && facultyAllocations.length === 0) {
      // Clear faculty selection if context changes and no allocations exist
      if (formData.facultyId) {
        setFormData(prev => ({ ...prev, facultyId: '' }));
      }
    }
  }, [facultyAllocations, formData.facultyId, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const isContextComplete = formData.academicYearId && formData.semesterId && formData.sectionId && formData.subjectId;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-white h-full max-h-[90vh]">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{initialData ? 'Edit Class' : 'Schedule New Class'}</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configure Time Slot & Allocation</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold leading-tight uppercase tracking-wide">{error}</span>
          </div>
        )}

        {/* Academic Context Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-primary-600">
             <label className="text-[10px] font-black uppercase tracking-widest ml-1">Context Year</label>
             <select
               required
               className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
               value={formData.academicYearId}
               onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value, semesterId: '', sectionId: '', subjectId: '', facultyId: '' })}
             >
               <option value="">Select Year</option>
               {academicYears.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Context Semester</label>
             <select
               required
               disabled={!formData.academicYearId}
               className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50"
               value={formData.semesterId}
               onChange={(e) => setFormData({ ...formData, semesterId: e.target.value, sectionId: '', subjectId: '', facultyId: '' })}
             >
               <option value="">Select Semester</option>
               {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 ml-1">Target Section</label>
             <select
               required
               disabled={!formData.semesterId}
               className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50"
               value={formData.sectionId}
               onChange={(e) => setFormData({ ...formData, sectionId: e.target.value, subjectId: '', facultyId: '' })}
             >
               <option value="">Select Section</option>
               {sections.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
             <select
               required
               disabled={!formData.sectionId}
               className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none disabled:opacity-50"
               value={formData.subjectId}
               onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, facultyId: '' })}
             >
               <option value="">Select Subject</option>
               {subjects.map(s => <option key={s._id} value={s._id}>({s.subjectCode}) {s.subjectName}</option>)}
             </select>
          </div>
        </div>

        {/* Resolved Faculty selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 ml-1 flex items-center justify-between">
              <span>Assigned Faculty</span>
              {allocationsLoading && <span className="animate-pulse text-xs text-primary-400">Verifying Allocations...</span>}
            </label>
            <select
              required
              disabled={!isContextComplete || allocationsLoading}
              className={`w-full px-5 py-4 border-2 rounded-3xl text-sm font-bold transition-all outline-none appearance-none ${
                !isContextComplete ? 'bg-gray-50 border-transparent opacity-50' : 
                facultyAllocations?.length === 0 ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-gray-50 border-transparent focus:border-primary-600 focus:bg-white'
              }`}
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            >
              {!isContextComplete ? (
                <option value="">Please complete above selection</option>
              ) : allocationsLoading ? (
                <option value="">Searching Faculty Allocation...</option>
              ) : facultyAllocations?.length > 0 ? (
                <>
                  <option value="">Select Faculty</option>
                  {facultyAllocations.map(alloc => {
                    const f = alloc.faculty;
                    const fId = f?._id || f;
                    return (
                      <option key={alloc._id} value={fId}>
                        {f?.user?.fullName || 'Unknown'} ({f?.employeeId || 'N/A'})
                      </option>
                    );
                  })}
                </>
              ) : (
                <option value="">No faculty assigned for this subject yet</option>
              )}
            </select>
            {isContextComplete && (!facultyAllocations || facultyAllocations.length === 0) && !allocationsLoading && (
                <p className="text-[9px] font-bold text-red-500 mt-1 ml-2 uppercase tracking-tight flex items-center gap-1">
                    <AlertCircle className="w-2 h-2" /> Pre-requisite: Allocate Faculty first in the Allocation Module
                </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Day of Week</label>
            <select
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
            >
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Start Time</label>
            <input 
              type="time"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">End Time</label>
            <input 
              type="time"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 ml-1">Room / Lab</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <MapPin className="w-4 h-4" />
              </div>
              <input 
                type="text"
                required
                placeholder="e.g. LAB-1 or R-102"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-3xl text-sm font-bold transition-all outline-none placeholder:text-gray-300"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || (isContextComplete && (!facultyAllocations || facultyAllocations.length === 0))}
          className="flex-[2] py-4 bg-brand-dark text-white text-xs font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {saving ? 'Scheduling...' : initialData ? 'Update Slot' : 'Commit Schedule'}
        </button>
      </div>
    </form>
  );
};

export default TimetableEntryForm;
