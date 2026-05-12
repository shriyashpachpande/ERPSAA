import React from 'react';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useMyStudentTimetable } from '../hooks/useMyStudentTimetable';

const GroupedTimetable = ({ entries, days }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-2">
    {days.map((day, idx) => {
      const dayEntries = entries.filter(e => e.dayOfWeek === day);
      return (
        <div 
          key={day} 
          style={{ animationDelay: `${idx * 100}ms` }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0px_0px_15px_3px_rgba(59,130,246,0.15),0px_0px_30px_10px_rgba(59,130,246,0.08)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 fill-mode-both duration-700 hover:shadow-[0px_0px_20px_5px_rgba(59,130,246,0.15)] transition-shadow"
        >
          <div className="p-7 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.25em] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                 <Calendar className="w-4 h-4" />
              </div>
              {day}
            </h3>
            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100">
              {dayEntries.length} Sessions
            </span>
          </div>
          
          <div className="p-5 space-y-4 flex-1 bg-slate-50/30 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {dayEntries.length > 0 ? (
              dayEntries.map((entry, eIdx) => (
                <div 
                  key={entry._id} 
                  style={{ animationDelay: `${(idx * 100) + (eIdx * 50)}ms` }}
                  className="p-5 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 rounded-[1.75rem] border border-slate-100 group animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.startTime} - {entry.endTime}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-tight">
                      <MapPin className="w-3.5 h-3.5" />
                      {entry.roomNumber}
                    </div>
                  </div>
                  <p className="text-[15px] font-black text-slate-800 line-clamp-1 mb-3 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {entry.subjectId?.subjectName}
                  </p>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                       <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="group-hover:text-slate-600 transition-colors">Prof. {entry.facultyId?.user?.fullName || 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-center space-y-3 opacity-30 grayscale">
                <BookOpen className="w-8 h-8 text-slate-300" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  Rest Day
                </p>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

const MyStudentTimetablePage = () => {
  const { entries, loading } = useMyStudentTimetable();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-1">
      <AcademicPageHeader
        title="My Weekly Schedule"
        subtitle="Manage your academic journey with precision and clarity"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 space-y-6">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-600/20" />
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Academic Ledger...</p>
        </div>
      ) : (
        <GroupedTimetable entries={entries} days={days} />
      )}
    </div>
  );
};

export default MyStudentTimetablePage;
