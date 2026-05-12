import { useState, useMemo, useEffect, useRef } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import SemesterSubjectMappingTable from '../components/semesterSubjectMappings/SemesterSubjectMappingTable';
import SemesterSubjectMappingForm from '../components/semesterSubjectMappings/SemesterSubjectMappingForm';
import { useSemesterSubjectMappings } from '../hooks/useSemesterSubjectMappings';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useSemesters } from '../hooks/useSemesters';
import { useDepartments } from '../hooks/useDepartments';
import { Filter, Layers, Briefcase, Zap, ShieldCheck, Activity, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { gsap } from 'gsap';

const SemesterSubjectMappingPage = () => {
  const { departments, loading: deptLoading } = useDepartments();
  const { user } = useAuth();
  const canManage = user && ['super_admin', 'academic_admin'].includes(user.role);

  const { years, currentYear } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const selectorRef = useRef(null);
  const tableRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(meshRef.current, 
      { scale: 1.2, opacity: 0 }, 
      { scale: 1, opacity: 0.15, duration: 2, ease: 'sine.out' }
    )
    .fromTo(headerRef.current, 
      { y: -30, opacity: 0, filter: 'blur(10px)' }, 
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
      '-=1.5'
    )
    .fromTo(selectorRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    )
    .fromTo(tableRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
      '-=0.4'
    );
  }, []);

  // Default to current year
  useMemo(() => {
    if (currentYear && !selectedYearId) {
      setSelectedYearId(currentYear._id);
    }
  }, [currentYear, selectedYearId]);

  const { semesters } = useSemesters(selectedYearId);

  // Default to first semester of the year if available
  useMemo(() => {
    if (semesters.length > 0 && !selectedSemesterId) {
      setSelectedSemesterId(semesters[0]._id);
    }
  }, [semesters, selectedSemesterId]);

  const { mappings, loading, removeMapping, addBulkMappings } = useSemesterSubjectMappings(selectedYearId, selectedDepartment, selectedSemesterId);

  const handleBulkSubmit = async (subjectIds) => {
    await addBulkMappings(selectedYearId, selectedDepartment, selectedSemesterId, subjectIds);
    setIsModalOpen(false);
  };

  return (
    <div ref={containerRef} className="min-h-full space-y-8 pb-12 relative">
      {/* Dynamic Background */}
      <div ref={meshRef} className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-primary-100/50 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px]"></div>
      </div>

      {/* Modern Header Section */}
      <header ref={headerRef} className="glass-panel p-6 lg:p-8 rounded-[2.5rem] border-white/50 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group bg-white/40">
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-600/30 rotate-3 group-hover:rotate-0 transition-transform duration-700">
              <Layers className="w-8 h-8" />
           </div>
           <div className="space-y-1">
             <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Semester Subject Matrix</h1>
             <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-emerald-500" /> Authorized Institutional Protocol • v2.1
             </p>
           </div>
        </div>
        
        <div className="relative z-10 flex gap-4">
           {canManage && (
             <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-[0.15em]"
             >
                <Sparkles className="w-4 h-4 text-primary-400" /> Assign Subjects
             </button>
           )}
           <button className="p-4 bg-white text-slate-400 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 shadow-sm active:scale-95">
              <Settings className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
           </button>
        </div>
      </header>

      {/* High-Density Selector Console */}
      <div ref={selectorRef} className="glass-panel p-4 lg:p-6 rounded-[2.5rem] bg-white/60 border-white/80 shadow-lg shadow-slate-100/50 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Filter className="w-3 h-3 text-primary-600" /> Academic Context
           </label>
           <select 
              value={selectedYearId}
              onChange={(e) => {
                setSelectedYearId(e.target.value);
                setSelectedDepartment('');
                setSelectedSemesterId('');
              }}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none shadow-sm hover:border-primary-200"
           >
              <option value="">Select Year</option>
              {years.map(y => (
                <option key={y._id} value={y._id}>{y.name} {y.isCurrent ? '(Active)' : ''}</option>
              ))}
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Briefcase className="w-3 h-3 text-indigo-600" /> Department Unit
           </label>
           <select 
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedSemesterId('');
              }}
              disabled={!selectedYearId}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none disabled:opacity-50 shadow-sm"
           >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.code} value={dept.code}>{dept.name}</option>
              ))}
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Zap className="w-3 h-3 text-emerald-600" /> Target Term
           </label>
           <select 
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              disabled={!selectedDepartment}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none disabled:opacity-50 shadow-sm"
           >
              <option value="">Select Semester</option>
              {semesters.map(s => (
                <option key={s._id} value={s._id}>{s.semesterName}</option>
              ))}
           </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div ref={tableRef} className="space-y-6 px-1">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                 <Activity className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Assigned Subjects Matrix</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live registry of term mappings</p>
              </div>
           </div>
           <div className="flex gap-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
              <div className="w-4 h-1 bg-primary-500 rounded-full"></div>
           </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-[2.5rem] bg-white/40 border-white shadow-2xl shadow-slate-200/50">
           <SemesterSubjectMappingTable 
            data={mappings}
            loading={loading}
            onDelete={removeMapping}
           />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 relative">
             <SemesterSubjectMappingForm 
              academicYearId={selectedYearId}
              department={selectedDepartment}
              semesterId={selectedSemesterId}
              existingMappings={mappings}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleBulkSubmit}
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterSubjectMappingPage;
