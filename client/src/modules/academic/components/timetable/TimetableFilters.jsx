import { useState, useEffect } from 'react';
import { useSemesters } from '../../hooks/useSemesters';
import { useSections } from '../../hooks/useSections';
import { Filter, Calendar, Layout } from 'lucide-react';

const TimetableFilters = ({ filters, setFilters, years }) => {
  const { semesters } = useSemesters(filters.academicYearId);
  const { sections } = useSections({ academicYearId: filters.academicYearId, semesterId: filters.semesterId });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
      <div className="space-y-1.5 flex-[1.5] min-w-[200px]">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 flex items-center gap-1.5">
           <Calendar className="w-3 h-3" /> Term Cycle
        </label>
        <div className="grid grid-cols-2 gap-3">
          <select 
            value={filters.academicYearId}
            onChange={(e) => setFilters({ ...filters, academicYearId: e.target.value, semesterId: '', sectionId: '' })}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">Year</option>
            {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
          </select>
          <select 
            value={filters.semesterId}
            onChange={(e) => setFilters({ ...filters, semesterId: e.target.value, sectionId: '' })}
            disabled={!filters.academicYearId}
            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
          >
            <option value="">Semester</option>
            {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[150px]">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 flex items-center gap-1.5">
           <Layout className="w-3 h-3" /> Section
        </label>
        <select 
          value={filters.sectionId}
          onChange={(e) => setFilters({ ...filters, sectionId: e.target.value })}
          disabled={!filters.semesterId}
          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
        >
          <option value="">All Sections</option>
          {sections.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
        </select>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[150px]">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Day</label>
        <select 
          value={filters.dayOfWeek}
          onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value })}
          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
          <option value="">All Days</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <button 
        onClick={() => setFilters({ academicYearId: '', semesterId: '', sectionId: '', dayOfWeek: '' })}
        className="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-2xl transition-all"
      >
        Clear
      </button>
    </div>
  );
};

export default TimetableFilters;
