import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, GraduationCap, Inbox, BookOpen } from 'lucide-react';
import { useStudentAcademicProfile } from '../hooks/useStudentAcademicProfile';
import { useSemesterSubjectMappings } from '../hooks/useSemesterSubjectMappings';
import StudentAcademicProfileHeader from '../components/studentAcademicProfile/StudentAcademicProfileHeader';
import StudentAcademicProfileDetails from '../components/studentAcademicProfile/StudentAcademicProfileDetails';
import StudentAcademicSubjectsList from '../components/studentAcademicProfile/StudentAcademicSubjectsList';

const StudentAcademicProfilePage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { profile, loading, error } = useStudentAcademicProfile(studentId);
  
  // Use mappings hook - Section is the absolute source of truth
  const section = profile?.currentEnrollment?.sectionId;
  const academicYearId = section?.academicYearId;
  const semesterId = section?.semesterId;
  const department = section?.department;
  
  const { mappings, loading: mappingsLoading } = useSemesterSubjectMappings(academicYearId, department, semesterId);

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold italic">Loading full academic portfolio...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">{error}</div>;
  if (!profile) return <div className="p-20 text-center text-gray-400">Profile data unavailable.</div>;

  const { studentMaster, currentEnrollment } = profile;

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col space-y-4 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {studentId && (
        <div className="flex items-center justify-between shrink-0 px-1">
          <button type="button" 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-6 py-2.5 bg-white rounded-2xl shadow-[0px_0px_15px_rgba(59,130,246,0.08)] border border-slate-200 transition-all active:scale-95 hover:border-indigo-200 hover:shadow-indigo-500/10"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Back to Records</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Sync Active</span>
          </div>
        </div>
      )}

      {/* For students, show a cleaner header without back button if they came from sidebar */}
      {!studentId && (
        <div className="shrink-0 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <GraduationCap size={18} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Overview</h2>
          </div>
          <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Connected</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col space-y-6 p-2">
        <StudentAcademicProfileHeader student={studentMaster} enrollment={currentEnrollment} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 lg:h-full">
             <StudentAcademicProfileDetails student={studentMaster} enrollment={currentEnrollment} />
          </div>
          <div className="lg:col-span-2 lg:h-full">
             <StudentAcademicSubjectsList subjects={mappings} loading={mappingsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicProfilePage;
