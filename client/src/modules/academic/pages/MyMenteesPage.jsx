import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getMyMentoredSections } from '../services/sectionsApi';
import { getEnrollments } from '../services/studentSemesterEnrollmentsApi';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { 
  Users, Mail, Phone, BookOpen, Award, Search, 
  ArrowUpRight, FileText, CheckCircle, GraduationCap, 
  MapPin, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyMenteesPage = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [mentees, setMentees] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingMentees, setLoadingMentees] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sections the current user mentors
  useEffect(() => {
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const res = await getMyMentoredSections();
        const data = res.data?.data || [];
        setSections(data);
        if (data.length > 0) {
          setSelectedSectionId(data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching mentored sections:', err);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, []);

  // Fetch mentees in the selected section
  useEffect(() => {
    if (!selectedSectionId) {
      setMentees([]);
      return;
    }

    const fetchMentees = async () => {
      setLoadingMentees(true);
      try {
        const res = await getEnrollments({ sectionId: selectedSectionId });
        setMentees(res.data?.data || res.data || []);
      } catch (err) {
        console.error('Error fetching mentees:', err);
      } finally {
        setLoadingMentees(false);
      }
    };
    fetchMentees();
  }, [selectedSectionId]);

  const activeSection = sections.find(s => s._id === selectedSectionId);

  // Filter mentees by search query
  const filteredMentees = mentees.filter(m => {
    const student = m.studentMasterId;
    if (!student) return false;
    
    const fullName = student.userId?.fullName || '';
    const email = student.personalDetails?.email || '';
    const studentId = student.studentId || '';
    
    const query = searchQuery.toLowerCase();
    return (
      fullName.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      studentId.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Decorative Premium Glow Orbs */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <AcademicPageHeader
        title="My Mentees Directory"
        subtitle="Manage, support, and track class sections assigned to you for mentorship"
      />

      {/* Roster & Sections Panel */}
      {loadingSections ? (
        <div className="p-20 text-center text-slate-500 italic">Loading your mentor assignments...</div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-gray-100">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">No Mentee Class Assigned</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You are currently not registered as the mentor for any active sections. Once the department Head (HOD) assigns you to a class section, your mentee list will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Selection Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">My Mentored Sections</label>
                <p className="text-xs text-slate-500 mt-0.5">Select a section to view its mentee roster</p>
              </div>

              <div className="space-y-2.5">
                {sections.map((sec) => {
                  const isSelected = sec._id === selectedSectionId;
                  return (
                    <button type="button"
                      key={sec._id}
                      onClick={() => setSelectedSectionId(sec._id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20' 
                          : 'bg-slate-50/50 hover:bg-slate-50 border-gray-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <p className={`font-black text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>{sec.name}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {sec.semesterId?.semesterName} • {sec.course}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-slate-400 group-hover:translate-x-1'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
            
            {activeSection && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Section</p>
                    <p className="font-extrabold text-sm text-white">{activeSection.name}</p>
                  </div>
                </div>
                
                <div className="pt-2 space-y-2 text-xs border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Department:</span>
                    <span className="font-bold text-white text-right">{activeSection.department || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Semester:</span>
                    <span className="font-bold text-white">{activeSection.semesterId?.semesterName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Total Mentees:</span>
                    <span className="font-bold text-white">{mentees.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mentee List Directory */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentees by name, email, or Student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider shrink-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-gray-100/50">
                Displaying {filteredMentees.length} Mentees
              </div>
            </div>

            {/* Mentees Grid */}
            {loadingMentees ? (
              <div className="p-20 text-center text-slate-500 italic">Fetching student roster...</div>
            ) : filteredMentees.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 border border-gray-100 shadow-sm text-center py-20">
                <p className="text-slate-400 font-bold">No matching mentees found</p>
                <p className="text-xs text-slate-400 mt-1">Try refining your search text or keyword.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMentees.map((m) => {
                  const student = m.studentMasterId;
                  if (!student) return null;
                  
                  const fullName = student.userId?.fullName || 'Anonymous Student';
                  const email = student.personalDetails?.email || 'N/A';
                  const phone = student.personalDetails?.phoneNumber || 'N/A';
                  const studentId = student.studentId || 'N/A';
                  const course = student.academicProfile?.course || 'B.Tech';
                  const branch = student.academicProfile?.branch || 'N/A';

                  return (
                    <div 
                      key={m._id}
                      className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Decorative border highlight */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="space-y-4">
                        {/* Header card info */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 font-black flex items-center justify-center shadow-inner uppercase">
                              {fullName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors text-sm leading-tight">{fullName}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{studentId}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100/50">
                            Enrolled
                          </span>
                        </div>

                        {/* Contacts */}
                        <div className="space-y-2 border-y border-slate-50 py-3 text-xs">
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${email}`} className="hover:text-primary-600 font-medium truncate">{email}</a>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`tel:${phone}`} className="hover:text-primary-600 font-semibold">{phone}</a>
                          </div>
                        </div>

                        {/* Academics snapshot */}
                        <div className="flex gap-2">
                          <div className="flex-1 bg-slate-50/50 p-2.5 rounded-xl border border-gray-50 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Course</p>
                            <p className="text-[11px] font-bold text-slate-700 mt-1 truncate">{course}</p>
                          </div>
                          <div className="flex-1 bg-slate-50/50 p-2.5 rounded-xl border border-gray-50 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Branch</p>
                            <p className="text-[11px] font-bold text-slate-700 mt-1 truncate">{branch}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <Link 
                          to={`/app/academic/student-academic-profile/${student._id}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Academic Profile
                        </Link>
                        
                        <Link 
                          to={`/app/student/master-profile?studentId=${student._id}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary-600 transition-colors"
                        >
                          Master Profile <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMenteesPage;
