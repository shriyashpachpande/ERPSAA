import React, { useState, useEffect, useRef } from 'react';
import { getMyMasterProfile } from '../../services/studentMasterService';
import {
  User, BookOpen, Home, CreditCard, LayoutDashboard, AlertCircle, FileText,
  CheckCircle2, ChevronRight, Activity, MapPin, GraduationCap, BookMarked,
  ShieldAlert, Phone, Paperclip, XCircle, Sparkles, Zap, ShieldCheck, Globe, Database, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFileUrl } from '../../../../utils/fileUrlResolver';

// ─── Helper: display a single field row ──────────────────────────────────────
const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 py-4 px-2 hover:bg-indigo-50/30 rounded-2xl transition-all duration-300 group">
    <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all">
       {icon || <Database className="w-3.5 h-3.5" />}
    </div>
    <div className="flex-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
      <p className="text-[13px] font-black text-slate-800 tracking-tight">{value || <span className="text-slate-300 font-medium italic">Pending</span>}</p>
    </div>
  </div>
);

// ─── Helper: section card wrapper ────────────────────────────────────────────
const SectionCard = ({ icon, title, children, className = '', style = {}, gradient = "from-indigo-500 to-blue-500" }) => (
  <div 
    style={style}
    className={`bg-white rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] p-8 md:p-10 hover:shadow-[0px_0px_20px_5px_rgba(59,130,246,0.15)] transition-all duration-700 relative overflow-hidden group ${className}`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full -mr-10 -mt-10 blur-2xl group-hover:opacity-10 transition-opacity duration-700`} />
    
    <div className="flex items-center gap-4 mb-10 relative z-10">
       <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all duration-500`}>
          {icon}
       </div>
       <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{title}</h2>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Academic Entry</p>
          </div>
       </div>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// ─── Document badge ───────────────────────────────────────────────────────────
const DocBadge = ({ label, doc }) => {
  const exists = doc && (doc.filePath || doc.storedName);
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${exists ? 'bg-indigo-50 border-white text-indigo-500 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
          <FileText className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{label}</p>
           <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${exists ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{exists ? 'Document Verified' : 'Action Required'}</p>
           </div>
        </div>
      </div>
      {exists && (
        <a
          href={getFileUrl(doc.filePath)}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-lg shadow-indigo-600/20 active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </a>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MyMasterProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyMasterProfile();
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch your unified profile. Ensure your admission is fully approved.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-8">
         <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-2xl" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 animate-pulse" />
         </div>
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Designing your Master Identity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 mt-10 bg-white rounded-[3rem] border border-rose-100 shadow-[0px_0px_30px_rgba(244,63,94,0.15)] flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 shadow-inner">
           <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-3 uppercase">Profile Locked</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">{error}</p>
        </div>
        <button onClick={() => navigate(-1)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
           Go Back Home
        </button>
      </div>
    );
  }

  const {
    personalDetails: cached,
    academicProfile,
    modules,
    studentId,
    enrollmentStatus,
    contactDetails,
    admissionId: adm,
    history,
    currentEnrollment
  } = profile;

  const rawPhoto =
    adm?.uploadedDocuments?.passportPhoto?.filePath ||
    adm?.personalDetails?.profilePhotoUrl ||
    cached?.profilePhotoUrl ||
    null;
  const resolvedPhoto = getFileUrl(rawPhoto);

  const pd = adm?.personalDetails || cached || {};
  const adr = adm?.addressDetails || {};
  const acad = adm?.academicDetails || {};
  const cs = adm?.courseSelection || {};
  const gd = adm?.guardianDetails || {};
  const docs = adm?.uploadedDocuments || {};

  const enrollmentColor = (s) => ({
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    graduated: 'bg-indigo-50  text-indigo-600  border-indigo-100',
    suspended: 'bg-rose-50     text-rose-600     border-rose-100',
  })[s] || 'bg-slate-50 text-slate-600 border-slate-100';

  const moduleCards = [
    { title: 'Fees Ledger', status: modules.fees?.status || 'unpaid', icon: <CreditCard className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", link: '/app/student/fees' },
    { title: 'Hostel Unit', status: modules.hostel?.status || 'not_allocated', icon: <Home className="w-5 h-5" />, color: "from-purple-500 to-indigo-600", link: '/app/student/hostel' },
    { title: 'Library Hub', status: modules.library?.status || 'no_dues', icon: <BookOpen className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", link: '/app/student/library' },
    { title: 'Attendance', status: modules.attendance?.status || 'active', icon: <Activity className="w-5 h-5" />, color: "from-amber-500 to-orange-600", link: '/app/student/my-attendance' },
    { title: 'Complaints', status: modules.complaints?.status || 'clear', icon: <ShieldAlert className="w-5 h-5" />, color: "from-rose-500 to-red-600", link: '/app/student/complaints' },
  ];

  const docList = [
    { label: '10th Marksheet', doc: docs.tenthMarksheet },
    { label: '12th Marksheet', doc: docs.twelfthMarksheet },
    { label: 'Transfer Cert.', doc: docs.transferCertificate },
    { label: 'Migration Cert.', doc: docs.migrationCertificate },
    { label: 'Caste Cert.', doc: docs.casteCertificate },
    { label: 'Passport Photo', doc: docs.passportPhoto },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-2 lg:p-4" ref={containerRef}>

      {/* AURORA HERO HEADER */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-12 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-100/20 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-100/20 rounded-full blur-[60px] pointer-events-none" />

        {/* Avatar with Aurora Ring */}
        <div className="relative group animate-in fade-in zoom-in-95 delay-100 duration-700 fill-mode-both">
           <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-700 animate-spin-slow"></div>
           <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative z-10 flex items-center justify-center">
            {resolvedPhoto
                ? <img src={resolvedPhoto} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                : <div className="w-full h-full flex items-center justify-center bg-indigo-50"><User className="w-28 h-28 text-indigo-200" /></div>}
           </div>
        </div>

        {/* Identity with Modern Typography */}
        <div className="flex-1 text-center md:text-left relative z-10 w-full animate-in fade-in slide-in-from-right-4 delay-200 duration-700 fill-mode-both">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              {pd.fullName || cached?.fullName}
            </h1>
            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black border uppercase tracking-[0.2em] self-center md:self-auto shadow-sm ${enrollmentColor(enrollmentStatus)}`}>
              {enrollmentStatus}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10">
             <p className="text-indigo-600 font-black text-lg tracking-[0.25em] uppercase">{studentId}</p>
             <div className="w-2 h-2 rounded-full bg-slate-200 hidden md:block" />
             <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">Verified Student Identity</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Course', value: cs.course || academicProfile?.course, color: "text-indigo-500" },
              { label: 'Department', value: cs.department || academicProfile?.department, color: "text-blue-500" },
              { label: 'Semester', value: currentEnrollment?.semesterId?.semesterName || `Sem ${academicProfile?.currentSemester || 1}`, color: "text-purple-500" },
              {
                label: 'Batch',
                value: (() => {
                  const intakeYear = adm?.admissionYear || studentId?.split('-')?.[1];
                  return intakeYear && /^\d{4}$/.test(intakeYear) ? `${intakeYear}-${Number(intakeYear) + 4}` : (academicProfile?.batch || '—');
                })(),
                color: "text-rose-500"
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/60 p-5 rounded-3xl border border-white hover:border-indigo-200 hover:bg-white transition-all duration-500 group shadow-sm">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${color} opacity-70 group-hover:opacity-100 transition-opacity`}>{label}</p>
                <p className="font-black text-slate-800 leading-tight text-sm uppercase tracking-tight">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIBRANT MODULE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {moduleCards.map((mod, idx) => (
            <button
              key={idx}
              onClick={() => navigate(mod.link)}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] hover:shadow-[0px_0px_20px_5px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-3 cursor-pointer animate-in fade-in zoom-in-95 fill-mode-both"
            >
               <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white transition-all duration-500 mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6`}>
                  {mod.icon}
               </div>
               <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.1em] mb-2 group-hover:text-indigo-600 transition-colors">{mod.title}</h3>
               <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mod.status.replace(/_/g, ' ')}</p>
               </div>
            </button>
          ))}
      </div>

      {/* FLOATING DATA PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         <SectionCard style={{ animationDelay: '400ms' }} icon={<User className="w-5 h-5" />} title="Personal Registry" gradient="from-blue-500 to-indigo-600" className="animate-in fade-in slide-in-from-left-4 fill-mode-both duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <InfoRow label="Full Name" value={pd.fullName} icon={<User className="w-3.5 h-3.5"/>} />
              <InfoRow label="Father Name" value={pd.fatherName} icon={<Zap className="w-3.5 h-3.5"/>} />
              <InfoRow label="Mother Name" value={pd.motherName} icon={<Zap className="w-3.5 h-3.5"/>} />
              <InfoRow label="Gender" value={pd.gender} icon={<Sparkles className="w-3.5 h-3.5"/>} />
              <InfoRow label="Date of Birth" value={pd.dateOfBirth ? new Date(pd.dateOfBirth).toLocaleDateString('en-IN') : null} icon={<Globe className="w-3.5 h-3.5"/>} />
              <InfoRow label="Blood Group" value={pd.bloodGroup} icon={<ShieldCheck className="w-3.5 h-3.5"/>} />
              <InfoRow label="Mobile" value={pd.mobileNumber || contactDetails?.mobileNumber} icon={<Phone className="w-3.5 h-3.5"/>} />
              <InfoRow label="Email" value={pd.email || contactDetails?.email} icon={<Sparkles className="w-3.5 h-3.5"/>} />
            </div>
         </SectionCard>

         <SectionCard style={{ animationDelay: '500ms' }} icon={<MapPin className="w-5 h-5" />} title="Location Blueprint" gradient="from-rose-500 to-orange-500" className="animate-in fade-in slide-in-from-right-4 fill-mode-both duration-700">
            <div className="space-y-10">
               <div>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-6 border-b border-rose-50 pb-2">Active Residence</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                     <InfoRow label="Street Axis" value={adr.current?.addressLine1} icon={<MapPin className="w-3.5 h-3.5"/>} />
                     <InfoRow label="City" value={adr.current?.city} icon={<Globe className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Pincode" value={adr.current?.pincode} icon={<Database className="w-3.5 h-3.5"/>} />
                     <InfoRow label="State" value={adr.current?.state} icon={<Globe className="w-3.5 h-3.5"/>} />
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-50 pb-2">Permanent Domicile</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 opacity-70">
                     <InfoRow label="Street Axis" value={adr.permanent?.addressLine1} icon={<MapPin className="w-3.5 h-3.5"/>} />
                     <InfoRow label="City" value={adr.permanent?.city} icon={<Globe className="w-3.5 h-3.5"/>} />
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard style={{ animationDelay: '600ms' }} icon={<GraduationCap className="w-5 h-5" />} title="Academic Lineage" gradient="from-indigo-500 to-purple-600" className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.25em] mb-8 bg-indigo-50 px-4 py-2 rounded-xl inline-block">High School (X)</p>
                  <div className="grid grid-cols-1 gap-2">
                     <InfoRow label="Board" value={acad.tenthBoard} icon={<ShieldCheck className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Institution" value={acad.tenthSchool} icon={<Home className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Score / %" value={acad.tenthScore} icon={<Sparkles className="w-3.5 h-3.5"/>} />
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.25em] mb-8 bg-purple-50 px-4 py-2 rounded-xl inline-block">Senior School (XII)</p>
                  <div className="grid grid-cols-1 gap-2">
                     <InfoRow label="Board" value={acad.twelfthBoard} icon={<ShieldCheck className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Institution" value={acad.twelfthCollege} icon={<Home className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Score / %" value={acad.twelfthScore} icon={<Sparkles className="w-3.5 h-3.5"/>} />
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard style={{ animationDelay: '700ms' }} icon={<Phone className="w-5 h-5" />} title="Guardian Protocol" gradient="from-emerald-500 to-teal-600" className="animate-in fade-in slide-in-from-left-4 fill-mode-both duration-700">
            <div className="grid grid-cols-1 gap-2">
               <InfoRow label="Guardian Name" value={gd.guardianName} icon={<User className="w-3.5 h-3.5"/>} />
               <InfoRow label="Secure Contact" value={gd.guardianPhone} icon={<Phone className="w-3.5 h-3.5"/>} />
               <div className="mt-8 pt-8 border-t border-slate-50">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Emergency Override</p>
                  <div className="grid grid-cols-1 gap-2">
                     <InfoRow label="Contact Name" value={gd.emergencyContactName} icon={<User className="w-3.5 h-3.5"/>} />
                     <InfoRow label="Secure Line" value={gd.emergencyContactPhone} icon={<Phone className="w-3.5 h-3.5"/>} />
                  </div>
               </div>
            </div>
         </SectionCard>

         <SectionCard style={{ animationDelay: '800ms' }} icon={<Activity className="w-5 h-5" />} title="Activity Ledger" gradient="from-amber-500 to-orange-500" className="animate-in fade-in slide-in-from-right-4 fill-mode-both duration-700">
            <div className="space-y-8">
               {history.slice(0, 4).map((event, idx) => (
                  <div key={idx} className="flex gap-6 group">
                     <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                           <Clock className="w-5 h-5" />
                        </div>
                        <div className="w-[2px] h-full bg-slate-50 mt-2" />
                     </div>
                     <div className="flex-1 pb-8">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">{new Date(event.timestamp).toLocaleString('en-IN')}</p>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{event.action.replace(/_/g, ' ')}</p>
                        {event.details?.note && (
                           <p className="text-xs font-medium text-slate-500 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">{event.details.note}</p>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </SectionCard>

         {/* PERSONAL MENTOR CARD */}
         <SectionCard style={{ animationDelay: '850ms' }} icon={<User className="w-5 h-5" />} title="Personal Mentor Allocation" gradient="from-purple-500 to-indigo-600" className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 lg:col-span-2">
            {currentEnrollment?.sectionId?.mentorFacultyId ? (
               <div className="flex flex-col md:flex-row items-center gap-8 text-left">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 text-3xl font-black shrink-0">
                     {currentEnrollment.sectionId.mentorFacultyId.user?.fullName?.split(' ').map(n => n[0]).join('') || 'M'}
                  </div>
                  <div className="flex-1 space-y-2">
                     <h3 className="text-xl font-black text-slate-800 tracking-tight">{currentEnrollment.sectionId.mentorFacultyId.user?.fullName}</h3>
                     <p className="text-xs text-primary-600 font-black uppercase tracking-widest leading-none">
                        {currentEnrollment.sectionId.mentorFacultyId.designation} &bull; {currentEnrollment.sectionId.department} Department
                     </p>
                     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                           <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ERP Mailbox</p>
                              <p className="text-xs font-bold text-slate-800 break-all">{currentEnrollment.sectionId.mentorFacultyId.erpEmail || currentEnrollment.sectionId.mentorFacultyId.user?.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                           <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Line</p>
                              <p className="text-xs font-bold text-slate-800">{currentEnrollment.sectionId.mentorFacultyId.phone}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Personal Mentor Allocated</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Your department HOD will allocate a class mentor shortly.</p>
               </div>
            )}
         </SectionCard>

         <SectionCard style={{ animationDelay: '900ms' }} icon={<Sparkles className="w-5 h-5" />} title="Verified Documentation" gradient="from-blue-500 to-indigo-600" className="animate-in fade-in zoom-in-95 fill-mode-both duration-700 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {docList.map(({ label, doc }) => (
                  <DocBadge key={label} label={label} doc={doc} />
               ))}
            </div>
            <div className="mt-16 flex justify-center">
               <button 
                  onClick={() => navigate('/app/student/admission/documents')}
                  className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-indigo-600/20 group"
               >
                  Enter Document Vault <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
         </SectionCard>
      </div>

    </div>
  );
};

export default MyMasterProfilePage;
