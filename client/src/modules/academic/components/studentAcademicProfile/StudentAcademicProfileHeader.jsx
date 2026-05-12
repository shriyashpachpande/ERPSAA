import { useState, useMemo } from 'react';
import { User, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';

const StudentAcademicProfileHeader = ({ student, enrollment }) => {
  const { departments } = useDepartments();

  const getDeptName = (code) => {
    if (!code) return 'Academic Division';
    const dept = departments.find(d => d.code === code || d.name === code);
    return dept ? dept.name : code;
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-5 md:p-8 border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] animate-in fade-in zoom-in-95 duration-700">
      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 p-1 overflow-hidden shadow-inner">
            {student?.personalDetails?.profilePhotoUrl ? (
              <img src={student.personalDetails.profilePhotoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <User size={48} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg border-4 border-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{student?.personalDetails?.fullName}</h1>
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{student?.studentId}</span>
               <span className="h-4 w-[1px] bg-slate-200" />
               <span className="text-xs font-medium text-slate-500">{getDeptName(student?.academicProfile?.department)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500">
            <div className="flex items-center gap-2">
               <Mail className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-xs font-semibold">{student?.contactDetails?.email}</span>
            </div>
            <div className="flex items-center gap-2">
               <Phone className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-xs font-semibold">{student?.contactDetails?.mobileNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3">
          <div className="px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[120px]">
             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Registration</p>
             <p className="text-lg font-bold text-slate-900 uppercase">{enrollment?.sectionId?.name || 'N/A'}</p>
          </div>
          <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-center flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{enrollment?.enrollmentStatus || 'Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicProfileHeader;
