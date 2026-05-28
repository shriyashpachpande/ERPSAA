import { useEffect, useRef, useState } from 'react';
import { useAcademicDashboard } from '../hooks/useAcademicDashboard';
import { useAuth } from '../../../hooks/useAuth';
import { useTeachingSubjects } from '../hooks/useTeachingSubjects';
import { getMyMentoredSections } from '../services/sectionsApi';
import AttendanceAnalyticsGraph from '../components/dashboard/AttendanceAnalyticsGraph';
import SyllabusProgressChart from '../components/dashboard/SyllabusProgressChart';
import AcademicAdminDashboard from '../components/dashboard/AcademicAdminDashboard';
import {
  Users, BookOpen, Clock, FileText,
  LayoutGrid, ArrowRight, Zap, ShieldCheck,
  TrendingUp, Award, Settings, Activity, PieChart,
  BarChart3, Layers
} from 'lucide-react';
import { gsap } from 'gsap';

const AcademicDashboardPage = () => {
  const { user } = useAuth();
  const { subjects: teachingSubjects, loading: subjectsLoading } = useTeachingSubjects();
  const { stats, actions, loading } = useAcademicDashboard();

  const [mentoredSections, setMentoredSections] = useState([]);
  const [mentoredLoading, setMentoredLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'faculty' || user?.role === 'hod') {
      const fetchMentored = async () => {
        setMentoredLoading(true);
        try {
          const res = await getMyMentoredSections();
          setMentoredSections(res.data.data);
        } catch (err) {
          console.error('Failed to fetch mentored sections', err);
        } finally {
          setMentoredLoading(false);
        }
      };
      fetchMentored();
    }
  }, [user]);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);
  const promoRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    if (!loading && stats) {
      const tl = gsap.timeline();

      // Orchestrated Entrance
      tl.fromTo(meshRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 0.15, duration: 2, ease: 'sine.out' }
      )
        .fromTo(headerRef.current,
          { y: -30, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' },
          '-=1.5'
        )
        .fromTo(statsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.8'
        )
        .fromTo(gridRef.current?.children,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
          '-=0.4'
        )
        .fromTo(promoRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.8'
        );

      // Subtle floating animation for mesh
      gsap.to(meshRef.current, {
        x: '+=20',
        y: '+=20',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 border-[6px] border-slate-100 border-t-primary-600 rounded-full animate-spin shadow-xl"></div>
          <div className="absolute inset-0 blur-2xl bg-primary-600/30 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Command Center</p>
          <p className="text-lg font-black text-slate-800 animate-pulse tracking-tight">Initializing Intelligence Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-full space-y-8 pb-12 relative">
      {/* Advanced Mesh Background */}
      <div
        ref={meshRef}
        className="absolute inset-0 -z-20 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500 rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] opacity-10"></div>
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-emerald-400 rounded-full blur-[100px] opacity-5"></div>
      </div>

      {/* Floating Glass Header */}
      <header
        ref={headerRef}
        className="glass-panel p-6 lg:p-8 rounded-[2.5rem] border-white/40 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group"
      >
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-600 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-600/40 rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <Activity className="w-8 h-8 lg:w-10 lg:h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tighter">Academic Command Center</h1>
            <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Authorized Institutional Access • v2.0
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">System Status</p>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Nominal</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
          </div>
          <button className="p-4 lg:p-5 bg-slate-900 text-white rounded-[1.5rem] lg:rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
            <Settings className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
          </button>
        </div>

        {/* Decorative Glint */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>
      </header>

      {stats && (
        <div className="space-y-10">
          {user?.role === 'academic_admin' ? (
            <AcademicAdminDashboard stats={stats} loading={loading} />
          ) : (
            <div className="space-y-10">
              <div ref={statsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                <AttendanceAnalyticsGraph />
                <SyllabusProgressChart data={teachingSubjects} />
              </div>

              {/* MY MENTORED CLASSES PANEL */}
              {(user?.role === 'faculty' || user?.role === 'hod') && (
                mentoredSections.length > 0 ? (
                  <div className="glass-panel p-8 rounded-[2.5rem] border-white/40 shadow-xl shadow-slate-200/50 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                           My Mentee Class Assignments <Layers className="w-5 h-5 text-indigo-500 animate-pulse" />
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Sections allocated to you for student mentorship</p>
                      </div>
                      <span className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-black uppercase tracking-wider">
                        {mentoredSections.length} {mentoredSections.length === 1 ? 'Class' : 'Classes'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mentoredSections.map((sec) => (
                        <div key={sec._id} className="p-6 bg-white/70 hover:bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/class flex flex-col justify-between min-h-[160px] text-left">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center border border-indigo-100/50">
                                {sec.name.charAt(0)}
                              </span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                {sec.academicYearId?.name}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{sec.name}</h4>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{sec.course}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">{sec.semesterId?.semesterName}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Capacity: {sec.capacity} Std</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-8 rounded-[2.5rem] border-white/40 shadow-xl shadow-slate-200/50 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                         My Mentee Class Assignments <Layers className="w-5 h-5 text-slate-400" />
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Sections allocated to you for student mentorship</p>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 text-center py-10 space-y-2">
                      <p className="text-sm font-bold text-slate-500">No Mentee Class Allocated</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">You are not currently assigned as a personal mentor for any academic class section this semester.</p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-10 items-start">
            {/* Quick Operations Tile Grid */}
            <div
              className="xl:col-span-3 space-y-8"
            >
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  Operations Matrix <Layers className="w-5 h-5 text-primary-600" />
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200"></div>)}
                </div>
              </div>

              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {actions.map((action, idx) => (
                  <button
                    key={action.id || idx}
                    onClick={() => window.location.href = action.path}
                    className="p-8 glass-panel bg-white/40 hover:bg-white border-white/60 hover:border-primary-200 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left group/tile relative overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                      <div className="flex items-start justify-between">
                        <div className={`p-5 rounded-2xl ${idx % 2 === 0 ? 'bg-primary-50 text-primary-600' : 'bg-indigo-50 text-indigo-600'} group-hover/tile:scale-110 group-hover/tile:rotate-3 transition-transform duration-500`}>
                          {idx % 4 === 0 && <Users className="w-7 h-7" />}
                          {idx % 4 === 1 && <LayoutGrid className="w-7 h-7" />}
                          {idx % 4 === 2 && <BookOpen className="w-7 h-7" />}
                          {idx % 4 === 3 && <PieChart className="w-7 h-7" />}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500">
                          <ArrowRight className="w-4 h-4 text-primary-600" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{idx % 2 === 0 ? 'Core Management' : 'Analytics Engine'}</p>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover/tile:text-primary-600 transition-colors">{action.label}</h4>
                      </div>
                    </div>

                    {/* Subtle Background Pattern */}
                    <div className="absolute bottom-0 right-0 p-4 opacity-5 translate-x-4 translate-y-4 group-hover/tile:translate-x-0 group-hover/tile:translate-y-0 transition-transform duration-700">
                      {idx % 2 === 0 ? <BarChart3 className="w-32 h-32" /> : <PieChart className="w-32 h-32" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Departmental Intelligence Sidebar */}
            <div
              ref={promoRef}
              className="xl:col-span-2 bg-slate-900 rounded-[3.5rem] p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 group/sidebar"
            >
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Intelligence Feed</h3>
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">Institutional KPIs</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Academic Performance', value: '94.2%', color: 'bg-emerald-500' },
                    { label: 'Resource Allocation', value: '88.5%', color: 'bg-primary-500' },
                    { label: 'Data Integrity', value: '100%', color: 'bg-indigo-500' }
                  ].map((kpi, i) => (
                    <div key={i} className="space-y-2 group/kpi">
                      <div className="flex justify-between items-end px-1">
                        <p className="text-[11px] font-bold text-slate-400">{kpi.label}</p>
                        <p className="text-sm font-black text-white">{kpi.value}</p>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${kpi.color} rounded-full transition-all duration-1000 w-0 group-hover/sidebar:w-full`} style={{ transitionDelay: `${i * 200}ms` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-6 group/box hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm tracking-tight uppercase tracking-widest text-amber-500 transition-all">Registry Protocol</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Departmental performance for the 2023-24 cycle is being audited. Ensure all <span className="text-white">Internal Marks</span> are finalized by EOM.
                  </p>
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-primary-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                    Request Full Audit <FileText className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Decorative Mesh Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover/sidebar:bg-primary-600/20 transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicDashboardPage;
