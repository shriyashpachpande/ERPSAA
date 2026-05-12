import { useState, useMemo } from 'react';
import { GraduationCap, Inbox, Tag, Building2, Calendar } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';

const StudentAcademicProfileDetails = ({ student, enrollment }) => {
  const { departments } = useDepartments();

  const getDeptName = (code) => {
    if (!code) return 'N/A';
    const dept = departments.find(d => d.code === code || d.name === code);
    return dept ? dept.name : code;
  };

  const items = [
    { label: 'Academic Department', value: getDeptName(student?.academicProfile?.department), icon: Building2 },
    { label: 'Degree Program', value: student?.academicProfile?.course, icon: GraduationCap },
    { label: 'Academic Year', value: enrollment?.academicYearId?.name || 'Not Enrolled', icon: Calendar },
    { label: 'Current Term', value: enrollment?.semesterId ? `${enrollment.semesterId.semesterName} (Sem ${enrollment.semesterId.semesterNumber})` : `Sem ${student?.academicProfile?.currentSemester || 1}`, icon: Inbox },
    { label: 'Section / Class', value: enrollment?.sectionId?.name || 'Not Assigned', icon: Building2 },
    { label: 'Enrollment Status', value: enrollment?.enrollmentStatus || 'Pending', icon: Tag },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-100">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Credentials</h3>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-100">
        {items.map((item, idx) => (
          <div key={idx} className="group p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 group-hover:text-indigo-400 transition-colors">{item.label}</p>
                <p className="text-[13px] font-bold text-slate-800 line-clamp-1 group-hover:text-slate-900">{item.value || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100/80">
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center group hover:bg-white hover:border-indigo-100 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1.5 group-hover:text-indigo-400 transition-colors">Registration Ledger</p>
          <p className="text-xs font-black text-slate-500 font-mono tracking-tighter">{student?.admissionId?.applicationId || 'ERPSAA-VAL-SEC'}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicProfileDetails;
