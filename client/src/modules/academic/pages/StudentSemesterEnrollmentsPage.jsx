import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import StudentSemesterEnrollmentTable from '../components/studentSemesterEnrollments/StudentSemesterEnrollmentTable';
import { useStudentSemesterEnrollments } from '../hooks/useStudentSemesterEnrollments';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useSemesters } from '../hooks/useSemesters';
import { useDepartments } from '../hooks/useDepartments';
import { useAuth } from '../../../hooks/useAuth';
import { Search, Filter, Shield, Briefcase, Hash } from 'lucide-react';

const StudentSemesterEnrollmentsPage = () => {
  const { user } = useAuth();
  const { years, currentYear } = useAcademicYears();
  const { departments } = useDepartments();
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Default to current year and HOD department
  useMemo(() => {
    if (currentYear && !selectedYearId) {
      setSelectedYearId(currentYear._id);
    }
    
    // Auto-set department for HODs
    if (user?.role === 'hod' && user?.department && selectedDeptId === 'All') {
      setSelectedDeptId(user.department);
    }
  }, [currentYear, selectedYearId, user, selectedDeptId]);

  const { semesters } = useSemesters(selectedYearId);
  const navigate = useNavigate();

  const { enrollments, loading } = useStudentSemesterEnrollments({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    department: selectedDeptId,
    search: searchTerm
  });

  const handleCreate = () => {
    navigate(`/app/academic/enrollments/new?yearId=${selectedYearId}&semesterId=${selectedSemesterId}`);
  };

  const handleEdit = (enrollment) => {
    navigate(`/app/academic/enrollments/edit/${enrollment._id}`);
  };

  const isHOD = user?.role === 'hod';
  const isAdmin = user?.role === 'academic_admin';

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-in fade-in duration-500 overflow-hidden">
      <div className="shrink-0">
        <AcademicPageHeader 
          title="Academic Placements" 
          subtitle="Enterprise student directory and enrollment lifecycle management" 
          action={{ label: 'New Placement', onClick: handleCreate }}
        />
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 shrink-0 space-y-4">
        {/* Search and Role Context */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search by Student Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             {isHOD && (
               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Department: {user?.department || 'IT'}</span>
               </div>
             )}
             {isAdmin && (
               <div className="flex items-center gap-2 w-full lg:w-48">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select 
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">All Departments</option>
                    {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </select>
               </div>
             )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Briefcase className="w-4 h-4" /></div>
            <div className="flex-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 ml-1">Academic Cycle</p>
              <select 
                value={selectedYearId}
                onChange={(e) => { setSelectedYearId(e.target.value); setSelectedSemesterId(''); }}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-900 focus:ring-0 cursor-pointer"
              >
                <option value="">Full Archive</option>
                {years.map(y => <option key={y._id} value={y._id}>{y.name} {y.isCurrent ? '• Active' : ''}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Hash className="w-4 h-4" /></div>
            <div className="flex-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 ml-1">Target Term</p>
              <select 
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                disabled={!selectedYearId}
                className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-900 focus:ring-0 cursor-pointer disabled:opacity-30"
              >
                <option value="">All Semesters</option>
                {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
              </select>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-end">
             <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Live Registry</p>
                <p className="text-xs font-bold text-emerald-600">{enrollments.length} Active Records</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100">
          <StudentSemesterEnrollmentTable 
            data={enrollments} 
            loading={loading && enrollments.length === 0}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentSemesterEnrollmentsPage;
