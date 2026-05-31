import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Users, Mail, Phone, Calendar, Shield, 
  ChevronRight, BadgeCheck, Loader2, Info, MapPin,
  ExternalLink, MessageSquare, Globe, Award,
  ArrowLeft
} from 'lucide-react';
import { gsap } from 'gsap';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useFacultyManagement } from '../hooks/useFacultyManagement';
import { useAuth } from '../../../hooks/useAuth';
import AcademicStatusBadge from '../components/shared/AcademicStatusBadge';

const HODFacultyDetailsPage = () => {
  const { user } = useAuth();
  const { faculty, loading, error } = useFacultyManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const listItemsRef = useRef([]);

  // Check if screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setShowMobileDetails(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter faculty based on search term
  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => 
      f.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.erpEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [faculty, searchTerm]);

  // Handle Faculty Selection
  const handleSelectFaculty = (f) => {
    setSelectedFaculty(f);
    if (isMobile) {
      setShowMobileDetails(true);
    }
  };

  // Initial animations
  useEffect(() => {
    if (!loading && containerRef.current) {
      const tl = gsap.timeline();
      
      if (!isMobile || !showMobileDetails) {
        tl.fromTo(sidebarRef.current, 
          { x: -50, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }
      
      if (!isMobile || showMobileDetails) {
        tl.fromTo(contentRef.current, 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 
          '-=0.5'
        );
      }

      if (listItemsRef.current.length > 0 && (!isMobile || !showMobileDetails)) {
        gsap.fromTo(listItemsRef.current, 
          { x: -20, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.3 }
        );
      }
    }
  }, [loading, isMobile, showMobileDetails]);

  // Animation on selection change (Desktop or Mobile Detail Mode)
  useEffect(() => {
    if (selectedFaculty && contentRef.current && (!isMobile || showMobileDetails)) {
      gsap.fromTo(contentRef.current.children, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [selectedFaculty?._id, isMobile, showMobileDetails]);

  // Lock parent scroll for this page to enable true internal scrolling
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const originalOverflow = mainEl.style.overflowY;
      mainEl.style.overflowY = 'hidden';
      return () => {
        mainEl.style.overflowY = originalOverflow;
      };
    }
  }, []);

  // Set initial selection on desktop
  useEffect(() => {
    if (filteredFaculty.length > 0 && !selectedFaculty && !isMobile) {
      setSelectedFaculty(filteredFaculty[0]);
    }
  }, [filteredFaculty, selectedFaculty, isMobile]);

  if (loading && faculty.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 bg-slate-50/50 backdrop-blur-sm">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary-600/20 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-slate-800 tracking-tight">Synchronizing Directory</p>
          <p className="text-sm text-slate-500 font-medium">Brewing the latest departmental insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full max-h-full flex flex-col overflow-hidden relative">
      <div className={`shrink-0 mb-6 px-2 ${isMobile && showMobileDetails ? 'hidden lg:block' : ''}`}>
        <AcademicPageHeader 
          title="Faculty Directory" 
          subtitle={`Department of ${user?.department || 'Academic Excellence'}`} 
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden pb-4">
        {/* Faculty List Sidebar - Hidden on mobile if showing details */}
        <aside 
          ref={sidebarRef}
          className={`${showMobileDetails ? 'hidden lg:flex' : 'flex'} w-full lg:w-[400px] flex-col glass-panel overflow-hidden shrink-0 h-full border-slate-200/60 shadow-2xl shadow-slate-200/50 group`}
        >
          <div className="p-6 border-b border-slate-100/50 space-y-5 bg-white/40 sticky top-0 z-10 backdrop-blur-md">
            <div className="relative group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary-600 transition-all duration-300" />
              <input 
                type="text"
                placeholder="Search by name, ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/50 border border-slate-200 hover:border-slate-300 rounded-[1.25rem] pl-11 pr-4 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                  {filteredFaculty.length} Peers Registered
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-100/50 border border-primary-100/50 rounded-full">
                <Shield className="w-3 h-3 text-primary-700" />
                <span className="text-[10px] font-bold text-primary-800 uppercase tracking-tight">{user?.department}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-hide p-4 space-y-3">
            {filteredFaculty.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                   <p className="text-base font-black text-slate-700">No match found</p>
                   <p className="text-xs font-bold text-slate-400">Try refining your search criteria</p>
                </div>
              </div>
            ) : (
              filteredFaculty.map((f, index) => (
                <button type="button"
                  key={f._id}
                  ref={el => listItemsRef.current[index] = el}
                  onClick={() => handleSelectFaculty(f)}
                  className={`w-full flex items-center p-4 rounded-[1.5rem] transition-all duration-300 group/item relative overflow-hidden ${
                    selectedFaculty?._id === f._id 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 translate-x-2' 
                    : 'hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 text-slate-600 border border-transparent hover:border-slate-100 active:scale-[0.98]'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black text-xl uppercase shrink-0 transition-all duration-500 ${
                    selectedFaculty?._id === f._id 
                    ? 'bg-white/20 rotate-3' 
                    : 'bg-primary-50 text-primary-600 group-hover/item:bg-primary-100'
                  }`}>
                    {f.user?.fullName?.charAt(0)}
                  </div>
                  <div className="ml-5 text-left overflow-hidden flex-1 space-y-1">
                    <p className={`font-black text-[0.95rem] tracking-tight truncate ${selectedFaculty?._id === f._id ? 'text-white' : 'text-slate-900'}`}>
                      {f.user?.fullName}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${selectedFaculty?._id === f._id ? 'text-white/80' : 'text-slate-400 group-hover/item:text-slate-500'}`}>
                      {f.employeeId} • {f.designation}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 shrink-0 transition-all duration-500 ${selectedFaculty?._id === f._id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0'}`} />
                  
                  {/* Subtle hover background glint */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right Side: Faculty Intelligence View - Full screen on mobile if selected */}
        <main 
          ref={contentRef}
          className={`${isMobile && !showMobileDetails ? 'hidden' : 'flex'} flex-1 glass-panel overflow-hidden flex-col min-w-0 h-full border-slate-200/60 shadow-2xl relative`}
        >
          {selectedFaculty ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar-hide flex flex-col">
              {/* Premium Profile Header */}
              <div className="h-48 lg:h-64 bg-slate-900 relative overflow-hidden shrink-0">
                {/* Dynamic Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-indigo-900 to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-20 z-0 mix-blend-overlay" 
                     style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
                </div>
                
                {/* Back Button (Mobile only) */}
                <button type="button" 
                  onClick={() => setShowMobileDetails(false)}
                  className="lg:hidden absolute top-6 left-6 z-30 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 text-white transition-all active:scale-95"
                >
                   <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Profile Visuals */}
                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-10 z-10 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent text-center md:text-left">
                  <div className="relative group/avatar shrink-0">
                    <div className="w-28 h-28 lg:w-40 lg:h-40 rounded-[2rem] lg:rounded-[2.5rem] bg-white p-2 lg:p-2.5 shadow-2xl transition-transform duration-700 hover:rotate-2">
                       <div className="w-full h-full rounded-[1.5rem] lg:rounded-[2rem] bg-brand-dark flex items-center justify-center text-3xl lg:text-5xl font-black text-white relative overflow-hidden">
                          <span className="z-10">{selectedFaculty.user?.fullName?.charAt(0)}</span>
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-transparent opacity-50"></div>
                       </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-emerald-500 border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                       <BadgeCheck className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>

                  <div className="pb-4 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 lg:gap-4">
                       <h2 className="text-2xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-2xl truncate max-w-full">
                        {selectedFaculty.user?.fullName}
                      </h2>
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-[9px] lg:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                        <Award className="w-3 h-3 text-amber-400" />
                        Top Performer
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <p className="text-primary-300 font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[10px] lg:text-sm">
                        {selectedFaculty.designation}
                      </p>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block"></div>
                      <p className="text-white/60 font-bold text-[9px] lg:text-xs uppercase tracking-widest hidden md:block">
                        ESTD. {new Date(selectedFaculty.joiningDate).getFullYear() || '2023'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Header Actions */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-10 flex gap-3 lg:gap-4 z-20">
                   <button type="button" className="p-2.5 lg:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/10 text-white transition-all hover:scale-110 active:scale-90">
                      <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                   </button>
                   <button type="button" className="p-2.5 lg:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/10 text-white transition-all hover:scale-110 active:scale-90">
                      <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
                   </button>
                </div>
              </div>

              {/* Enhanced Detailed Content */}
              <div className="flex-1 p-6 lg:p-12 space-y-10 lg:space-y-12 bg-white shrink-0">
                
                {/* Metrics Layer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Employee Identifier', value: selectedFaculty.employeeId, icon: Shield, color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Primary Department', value: selectedFaculty.department || 'Not Assigned', icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Current Authentication', value: 'Verified Active', icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 lg:p-7 rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-slate-100 shadow-lg lg:shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 group/card relative overflow-hidden">
                       <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-5 lg:mb-6 group-hover/card:scale-110 transition-transform duration-500`}>
                          <stat.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                       </div>
                       <div>
                          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                          <p className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                       </div>
                       <div className={`absolute bottom-0 right-0 w-24 h-24 ${stat.bg} opacity-10 rounded-tl-full -mr-12 -mb-12 transition-all duration-700 group-hover/card:scale-150`}></div>
                    </div>
                  ))}
                </div>

                {/* Information Architecture */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-12">
                  
                  {/* Left Column: Contact Channels */}
                  <div className="space-y-6 lg:space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Contact Channels</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Institutional Ecosystem Email', value: selectedFaculty.erpEmail, icon: Mail, highlight: true },
                        { label: 'Personal Correspondence', value: selectedFaculty.personalEmail || 'Not Registered', icon: Globe },
                        { label: 'Mobile Interconnect', value: selectedFaculty.phone || '+91 91234 56789', icon: Phone }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 lg:gap-5 p-4 lg:p-5 bg-white border border-slate-100 rounded-[1.5rem] lg:rounded-[1.8rem] hover:border-primary-200 hover:shadow-lg transition-all group/info">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/info:text-primary-600 group-hover/info:bg-primary-50 transition-all shrink-0">
                            <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                            <p className={`text-xs lg:text-sm font-bold truncate ${item.highlight ? 'text-primary-700 underline decoration-primary-200 underline-offset-4' : 'text-slate-900'}`}>{item.value}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover/info:opacity-100 transition-all cursor-pointer hover:text-primary-600 hidden md:block" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Career Overview */}
                  <div className="space-y-6 lg:space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Career Synopsis</h3>
                    </div>

                    <div className="space-y-5 lg:space-y-6">
                      <div className="flex items-center gap-4 lg:gap-5 p-4 lg:p-5 bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50 rounded-[1.5rem] lg:rounded-[1.8rem]">
                         <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                            <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                         </div>
                         <div>
                            <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hiring Anniversary</p>
                            <p className="text-sm lg:text-base font-black text-indigo-900">
                              {selectedFaculty.joiningDate ? new Date(selectedFaculty.joiningDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              }) : 'August 14, 2023'}
                            </p>
                         </div>
                      </div>

                      {/* Professional Note */}
                      <div className="p-6 lg:p-8 bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] text-white relative overflow-hidden group/note">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/30 blur-[80px] group-hover/note:bg-primary-400/40 transition-all duration-1000"></div>
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg lg:rounded-xl bg-white/10 flex items-center justify-center">
                              <Info className="w-3 h-3 lg:w-4 lg:h-4 text-primary-400" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em]">Registry Compliance</h4>
                          </div>
                          <p className="text-[10px] lg:text-xs text-white/60 font-semibold leading-relaxed">
                            Authorized personnel only for profile modification. Detailed academic records are governed by the <span className="text-primary-400">Departmental Quality Assurance</span> protocol.
                          </p>
                          <div className="pt-2 flex gap-4 items-center">
                             <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-primary-500 rounded-full"></div>
                             </div>
                             <span className="text-[8px] lg:text-[10px] font-black text-primary-400 truncate uppercase shrink-0">Clearance: High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 lg:p-20 text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[3rem] lg:rounded-[3.5rem] bg-slate-100 flex items-center justify-center border-4 border-white shadow-2xl relative z-10">
                  <Users className="w-12 h-12 lg:w-16 lg:h-16 text-slate-300" />
                </div>
                <div className="absolute inset-0 scale-125 border-2 border-slate-100 rounded-[3rem] lg:rounded-[3.5rem] animate-[ping_3s_infinite] opacity-20"></div>
              </div>
              <div className="space-y-3 max-w-sm">
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Initialize Intelligence</h3>
                <p className="text-xs lg:text-sm font-bold text-slate-400 leading-relaxed">
                  Select a faculty cohort member to analyze their deep institutional footprint and departmental metrics.
                </p>
              </div>
              <div className="pt-4 flex gap-3">
                 {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200"></div>)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HODFacultyDetailsPage;
