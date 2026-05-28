import { useState, useEffect } from 'react';
import { X, UserCheck, ShieldCheck, Layout, Info } from 'lucide-react';
import { useEligibleStudents } from '../../hooks/useEligibleStudents';
import { useSections } from '../../hooks/useSections';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import { useSemesters } from '../../hooks/useSemesters';
import EligibleStudentSelector from './EligibleStudentSelector';

const StudentSemesterEnrollmentForm = ({ initialData, academicYearId, semesterId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    studentMasterId: '',
    academicYearId: academicYearId || '',
    semesterId: semesterId || '',
    sectionId: '',
    enrollmentStatus: 'Active',
    remarks: ''
  });

  const { years } = useAcademicYears();
  const { semesters } = useSemesters(formData.academicYearId);

  // Maintain selected students as an array to support bulk selection
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  const { students, loading: studentsLoading, fetchEligibleStudents } = useEligibleStudents();
  const { sections, loading: sectionsLoading } = useSections({
    academicYearId: formData.academicYearId,
    semesterId: formData.semesterId
  });

  // Load initial data if editing a single enrollment
  useEffect(() => {
    if (initialData && students.length > 0) {
      const match = students.find(s => s._id === initialData.studentMasterId);
      if (match) {
        setSelectedStudents([match]);
      }
    }
  }, [initialData, students]);

  useEffect(() => {
    if (!initialData) {
      // Fetch all active students without a strict department filter initially
      // to ensure newly approved students from all departments (Common Eng, IT, etc.) appear.
      fetchEligibleStudents({});
    }
  }, [initialData, fetchEligibleStudents]);

  const handleStudentToggleSelect = (student) => {
    if (initialData) {
      // If editing, only single select is allowed
      setSelectedStudents([student]);
      setFormData(prev => ({ ...prev, studentMasterId: student._id }));
      return;
    }

    setSelectedStudents(prev => {
      const exists = prev.find(s => s._id === student._id);
      if (exists) {
        return prev.filter(s => s._id !== student._id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleSelectAll = (studentsToSelect) => {
    setSelectedStudents(prev => {
      const unique = [...prev];
      studentsToSelect.forEach(s => {
        if (!unique.some(u => u._id === s._id)) {
          unique.push(s);
        }
      });
      return unique;
    });
  };

  const handleClearAll = (idsToClear) => {
    setSelectedStudents(prev => prev.filter(s => !idsToClear.includes(s._id)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.academicYearId || !formData.semesterId || !formData.sectionId) {
      alert('Please select academic cycle, semester and section');
      return;
    }
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    try {
      setIsBulkSubmitting(true);
      
      const payload = {
        students: selectedStudents.map(s => ({ id: s._id, name: s.personalDetails?.fullName })),
        academicYearId: formData.academicYearId,
        semesterId: formData.semesterId,
        sectionId: formData.sectionId,
        enrollmentStatus: formData.enrollmentStatus,
        remarks: formData.remarks
      };

      await onSubmit(payload);
    } catch (err) {
      // With skipped names handled gracefully in NewEnrollmentPage, critical errors will still be caught here.
      console.error(err);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const hasSelected = selectedStudents.length > 0;

  return (
    <div className="flex flex-col md:flex-row bg-white h-full overflow-hidden min-h-0 flex-1 relative">
      
      {/* BULK LOADING OVERLAY */}
      {isBulkSubmitting && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
          <div className="p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 border border-slate-100 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Initializing Boarding</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                Bulk enrolling {selectedStudents.length} candidates sequentially... Please do not close or refresh this tab.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar: Student Selection */}
      <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden min-h-0">
        <div className="p-5 flex-1 flex flex-col overflow-hidden min-h-0">
          {!initialData ? (
            <EligibleStudentSelector
              students={students}
              loading={studentsLoading}
              onToggleSelect={handleStudentToggleSelect}
              selectedStudentIds={selectedStudents.map(s => s._id)}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          ) : (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-2 duration-500">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">Active Context</h3>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedStudents[0]?.personalDetails?.fullName || 'Loading...'}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {selectedStudents[0]?.studentId}
                  </p>
                </div>
              </div>
              <div className="mt-auto px-4 py-3 bg-slate-100/50 rounded-xl border border-slate-100 text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">
                Index Verification OK
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              {initialData ? 'Update Enrollment' : 'New Enrollment Boarding'}
            </h2>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
              Academic matrix initialization workflow
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 group">
            <X className="w-5 h-5 group-hover:text-slate-900" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-8 md:px-12 space-y-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Status Message */}
          {hasSelected && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm shrink-0">
                <Info className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="space-y-1 w-full min-w-0">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  {initialData ? 'Ready for Boarding' : 'Ready for Bulk Boarding'}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {initialData ? (
                    <>
                      Student currently mapped to <span className="font-bold text-indigo-700">{selectedStudents[0]?.academicProfile?.department}</span>.
                      Proceed to select section for semester {selectedStudents[0]?.academicProfile?.currentSemester}.
                    </>
                  ) : (
                    <>
                      Selected <span className="font-bold text-indigo-700">{selectedStudents.length} candidates</span> for enrollment.
                      Proceed to select target academic cycle, semester, and section to initialize boarding in bulk.
                    </>
                  )}
                </p>
                {!initialData && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-h-24 overflow-y-auto p-1.5 border border-indigo-100/50 rounded-xl bg-white/80 scrollbar-thin">
                    {selectedStudents.map(s => (
                      <span key={s._id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-bold text-indigo-700">
                        {s.personalDetails?.fullName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
            {/* Academic Context Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Academic Cycle</label>
              <select
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none appearance-none hover:border-slate-300"
                value={formData.academicYearId}
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value, semesterId: '', sectionId: '' })}
              >
                <option value="">Select Year</option>
                {years.map(y => (
                  <option key={y._id} value={y._id}>{y.name} {y.isCurrent ? '(Active)' : ''}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Semester</label>
              <select
                required
                disabled={!formData.academicYearId}
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none appearance-none hover:border-slate-300 disabled:opacity-50"
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value, sectionId: '' })}
              >
                <option value="">Select Semester</option>
                {semesters.map(s => (
                  <option key={s._id} value={s._id}>{s.semesterName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 col-span-1 md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Learning Group (Section)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Layout className="w-4 h-4" />
                </div>
                <select
                  required
                  className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none appearance-none hover:border-slate-300"
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                >
                  <option value="">Select Section Allocation</option>
                  {sections.map(sec => (
                    <option key={sec._id} value={sec._id}>{sec.name} &mdash; Available: {sec.capacity} Seats</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <div className="w-4 h-4 border-r-2 border-b-2 border-current rotate-45 -translate-y-1" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Record Lifecycle</label>
              <select
                className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none appearance-none hover:border-slate-300"
                value={formData.enrollmentStatus}
                onChange={(e) => setFormData({ ...formData, enrollmentStatus: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Security Clearance</label>
              <div className="px-5 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" />
                System-Verified Entry
              </div>
            </div>

            <div className="space-y-3 col-span-1 md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Boarding Remarks</label>
              <textarea
                className="w-full px-5 py-4 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none resize-none h-32 placeholder:text-slate-300 hover:border-slate-300"
                placeholder="Enter any administrative notes for this enrollment cycle..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4 shrink-0 mt-auto">
          <p className="text-[10px] font-medium text-slate-400 italic hidden sm:block mr-auto">
            Note: Action logged for audit compliance.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors active:scale-95 shadow-sm"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={!hasSelected || !formData.sectionId}
            className="px-8 py-2.5 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {initialData ? 'Save Changes' : `Initialize Boarding (${selectedStudents.length})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentSemesterEnrollmentForm;
