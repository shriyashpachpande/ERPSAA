import { useState, useEffect, useRef, useMemo } from 'react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import SubjectTable from '../components/subjects/SubjectTable';
import SubjectForm from '../components/subjects/SubjectForm';
import { useSubjects } from '../hooks/useSubjects';
import { useDepartments } from '../hooks/useDepartments';
import { useAuth } from '../../../hooks/useAuth';
import { Search, Filter, Layers, Briefcase, Plus, Settings, Sparkles, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';

const SubjectsPage = () => {
  const { user } = useAuth();
  const isHOD = user?.isHOD;
  const { departments, loading: deptLoading } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [filters, setFilters] = useState({
    department: isHOD ? user.department : '',
    subjectType: '',
    search: ''
  });

  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const contentRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(meshRef.current, { opacity: 0, scale: 1.2 }, { opacity: 0.15, scale: 1, duration: 2 })
      .fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=1.5')
      .fromTo(filterRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(contentRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }, '-=0.4');
  }, []);

  const { subjects, loading, error, addSubject, updateSubject, fetchSubjects } = useSubjects(filters);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingSubject) {
      await updateSubject(editingSubject._id, data);
    } else {
      await addSubject(data);
    }
    setIsModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchSubjects(newFilters);
  };

  return (
    <div className="min-h-full space-y-8 pb-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div ref={meshRef} className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-100 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px]"></div>
      </div>

      {/* Premium Header */}
      <header ref={headerRef} className="glass-panel p-6 lg:p-8 rounded-[2.5rem] border-white/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 group">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-600/30 rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Subject Master</h1>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Universal Academic Registry • Active
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-[0.15em]"
          >
            <Plus className="w-4 h-4 text-primary-400" /> New Subject
          </button>
          <button className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 shadow-sm active:scale-95">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Filter Matrix */}
      <div ref={filterRef} className="glass-panel p-4 lg:p-6 rounded-[2.5rem] bg-white/60 border-white/80 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Registry</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Code or Name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Department Unit</label>
          {isHOD ? (
            <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-primary-600 flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary-400" />
              {departments.find(d => d.code === user.department)?.name || user.department}
            </div>
          ) : (
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.code} value={dept.code}>{dept.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Type</label>
          <select
            name="subjectType"
            value={filters.subjectType}
            onChange={handleFilterChange}
            className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
            <option value="Lab">Lab</option>
            <option value="Elective">Elective</option>
          </select>
        </div>

        <div className="flex items-center justify-end h-full">
          <div className="bg-primary-50 px-4 py-3.5 rounded-2xl border border-primary-100 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{subjects.length} Records</span>
          </div>
        </div>
      </div>

      {/* Main Registry */}
      <div ref={contentRef} className="glass-panel overflow-hidden rounded-[2.5rem] bg-white/40 border-white shadow-2xl shadow-slate-200/50">
        <SubjectTable
          data={subjects}
          loading={loading && subjects.length === 0}
          onEdit={handleEdit}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <SubjectForm
              initialData={editingSubject}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
