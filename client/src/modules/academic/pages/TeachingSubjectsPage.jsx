import { useRef, useEffect, useState, useMemo } from 'react';
import { useTeachingSubjects } from '../hooks/useTeachingSubjects';
import { useAuth } from '../../../hooks/useAuth';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useSemesters } from '../hooks/useSemesters';
import { useFacultyManagement } from '../hooks/useFacultyManagement';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { BookOpen, User, Layers, Calendar, Clock, Sparkles, Filter, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const TeachingSubjectsPage = () => {
  const { user } = useAuth();
  const isHOD = user?.role === 'hod';
  
  // Filter States
  const [filters, setFilters] = useState({
    academicYearId: '',
    semesterId: '',
    faculty: ''
  });

  const { subjects, loading, error } = useTeachingSubjects(filters);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (loading) setIsRefreshing(true);
    else {
      const timer = setTimeout(() => setIsRefreshing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const { years } = useAcademicYears();
  const { semesters } = useSemesters(filters.academicYearId);
  const { faculty: deptFaculty } = useFacultyManagement(isHOD ? { department: user.department } : null);

  const containerRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!loading && subjects.length > 0) {
      gsap.fromTo(
        '.subject-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, subjects.length]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'academicYearId' ? { semesterId: '' } : {})
    }));
  };

  const groupedSubjects = useMemo(() => {
    return subjects.reduce((acc, item) => {
      const year = item.academicYearId?.name || 'Unknown Year';
      const semester = item.semesterId?.semesterName || 'Unknown Semester';
      const key = `${year} - ${semester}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [subjects]);

  if (loading && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12" ref={containerRef}>
      <AcademicPageHeader
        title={isHOD ? "Departmental Portfolio" : "My Teaching Portfolio"}
        subtitle={isHOD ? `Subject allocations for ${user?.department} Department` : "Subjects and sections assigned to you"}
      />

      {/* Filter Matrix */}
      <div ref={filterRef} className="glass-panel p-6 lg:p-8 rounded-[3rem] bg-white/60 border-white/80 shadow-lg grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
        
        <div className="space-y-2 relative z-10">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Academic Year
          </label>
          <div className="relative">
            <select 
              name="academicYearId"
              value={filters.academicYearId}
              onChange={handleFilterChange}
              className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Years</option>
              {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
            <Layers className="w-3 h-3" /> Semester
          </label>
          <div className="relative">
            <select 
              name="semesterId"
              value={filters.semesterId}
              onChange={handleFilterChange}
              disabled={!filters.academicYearId}
              className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Semesters</option>
              {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {isHOD && (
          <div className="space-y-2 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> Faculty Member
            </label>
            <div className="relative">
              <select 
                name="faculty"
                value={filters.faculty}
                onChange={handleFilterChange}
                className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Faculty</option>
                {deptFaculty.map(f => (
                  <option key={f._id} value={f._id}>{f.user?.fullName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end h-full relative z-10">
           <div className="bg-primary-50 px-5 py-3.5 rounded-2xl border border-primary-100 flex items-center gap-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{subjects.length} Subjects Found</span>
           </div>
        </div>
      </div>

      {/* Main Content Area with Loading Overlay */}
      <div className={`relative min-h-[400px] transition-all duration-500 ${isRefreshing ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}>
        {isRefreshing && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin shadow-lg"></div>
          </div>
        )}

        {subjects.length === 0 && !isRefreshing ? (
          <div className="glass-panel p-20 text-center space-y-4 rounded-[3rem] bg-white/40">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Subjects Match Filters</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">Try adjusting your filters to find the allocations you're looking for.</p>
              <button 
                onClick={() => setFilters({ academicYearId: '', semesterId: '', faculty: '' })}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {isHOD ? (
              // HOD View: All faculty subjects
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((item) => (
                  <div key={item._id} className="subject-card glass-panel p-6 rounded-[2.5rem] bg-white/60 hover:bg-white transition-all duration-500 border border-white/80 shadow-sm hover:shadow-xl group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform duration-500">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                        {item.assignmentStatus}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-primary-600 transition-colors">{item.subjectId?.subjectName}</h3>
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mt-1">{item.subjectId?.subjectCode} • {item.course}</p>
                      </div>

                      <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                             <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 line-clamp-1">{item.faculty?.user?.fullName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.faculty?.designation}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                           <div className="flex items-center gap-2">
                              <Layers className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{item.sectionId?.name}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{item.semesterId?.semesterName}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Faculty View: Grouped by Semester/Year
              Object.keys(groupedSubjects).map((groupKey) => (
                <div key={groupKey} className="space-y-6">
                  <div className="flex items-center gap-4 ml-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-100"></div>
                    <div className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full">
                      <Calendar className="w-3 h-3 text-primary-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{groupKey}</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-100"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSubjects[groupKey].map((item) => (
                      <div key={item._id} className="subject-card glass-panel p-8 rounded-[3rem] bg-white border-white/60 shadow-sm hover:shadow-2xl transition-all duration-700 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors"></div>
                        
                        <div className="relative z-10 flex items-center justify-between mb-8">
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform duration-500">
                            <BookOpen className="w-8 h-8 text-primary-400" />
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Assigned Section</span>
                             <span className="text-lg font-black text-slate-900 tracking-tighter">{item.sectionId?.name}</span>
                          </div>
                        </div>

                        <div className="relative z-10 space-y-6">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors leading-tight">{item.subjectId?.subjectName}</h3>
                            <div className="flex items-center gap-2 mt-2">
                               <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-primary-100">{item.subjectId?.subjectCode}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.course}</span>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-bold text-slate-600">Active Curriculum</span>
                             </div>
                             <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-200 transition-all cursor-pointer">
                                <Filter className="w-4 h-4" />
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingSubjectsPage;
