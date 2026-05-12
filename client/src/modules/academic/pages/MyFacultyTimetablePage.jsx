import React from 'react';
import { Calendar, Clock, MapPin, Layers, BookOpen } from 'lucide-react';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { useMyFacultyTimetable } from '../hooks/useMyFacultyTimetable';

const MyFacultyTimetablePage = () => {
  const { entries, loading } = useMyFacultyTimetable();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const GroupedTimetable = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {days.map(day => {
        const dayEntries = entries.filter(e => e.dayOfWeek === day);
        return (
          <div key={day} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                {day}
              </h3>
              <span className="text-[10px] font-black text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">
                {dayEntries.length} Classes
              </span>
            </div>
            <div className="p-4 space-y-3 flex-1">
              {dayEntries.length > 0 ? (
                dayEntries.map(entry => (
                  <div key={entry._id} className="p-4 bg-gray-50 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all rounded-3xl border border-transparent hover:border-primary-100 group">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-primary-600 bg-primary-100/50 px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">
                         {entry.startTime} - {entry.endTime}
                       </span>
                       <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                         <MapPin className="w-3 h-3 text-red-300" />
                         {entry.roomNumber}
                       </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors uppercase">
                      {entry.subjectId?.subjectName}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <Layers className="w-3 h-3" />
                       {entry.sectionId?.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-24 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No Classes Scheduled
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AcademicPageHeader 
        title="My Teaching Schedule" 
        subtitle="Weekly class timeline for academic year 2023-24"
      />

      {loading ? (
        <div className="p-20 text-center text-gray-400 font-medium italic animate-pulse">Syncing your schedule...</div>
      ) : (
        <GroupedTimetable />
      )}
    </div>
  );
};

export default MyFacultyTimetablePage;
