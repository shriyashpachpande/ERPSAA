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

  const [selectedStudent, setSelectedStudent] = useState(initialData?.studentMasterId || null);
  const { students, loading: studentsLoading, fetchEligibleStudents } = useEligibleStudents();
  const { sections, loading: sectionsLoading } = useSections({ 
    academicYearId: formData.academicYearId, 
    semesterId: formData.semesterId 
  });

  useEffect(() => {
    if (!initialData) {
      // Fetch all active students without a strict department filter initially
      // to ensure newly approved students from all departments (Common Eng, IT, etc.) appear.
      fetchEligibleStudents({});
    }
  }, [initialData, fetchEligibleStudents]);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setFormData({ ...formData, studentMasterId: student._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.academicYearId || !formData.semesterId || !formData.studentMasterId || !formData.sectionId) {
      alert('Please select academic cycle, semester, student and section');
      return;
    }
    try {
      await onSubmit(formData);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white h-full overflow-hidden">
      {/* Sidebar: Student Selection */}
      <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden">
        <div className="p-5 flex-1 flex flex-col overflow-hidden">
          {!initialData ? (
            <EligibleStudentSelector 
              students={students} 
              loading={studentsLoading} 
              onSelect={handleStudentSelect}
              selectedStudentId={selectedStudent?._id}
            />
          ) : (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-2 duration-500">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">Active Context</h3>
               <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedStudent?.personalDetails?.fullName}</h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{selectedStudent?.studentId}</p>
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
        <div className="flex-1 overflow-y-auto p-8 md:px-12 space-y-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Status Message */}
          {selectedStudent && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
               <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm">
                 <Info className="w-4 h-4 text-indigo-600" />
               </div>
               <div className="space-y-1">
                 <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Ready for Boarding</p>
                 <p className="text-xs text-slate-600 leading-relaxed font-medium">
                   Student currently mapped to <span className="font-bold text-indigo-700">{selectedStudent.academicProfile?.department}</span>. 
                   Proceed to select section for semester {selectedStudent.academicProfile?.currentSemester}.
                 </p>
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
            disabled={!formData.studentMasterId || !formData.sectionId}
            className="px-8 py-2.5 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {initialData ? 'Save Changes' : 'Initialize Boarding'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentSemesterEnrollmentForm;
