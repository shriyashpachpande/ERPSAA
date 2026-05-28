import { useState } from 'react';
import { Search, User, Check } from 'lucide-react';

const EligibleStudentSelector = ({ 
  students, 
  loading, 
  onToggleSelect, 
  selectedStudentIds = [], 
  onSelectAll, 
  onClearAll 
}) => {
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => 
    s.personalDetails?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.contactDetails?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selectedStudentIds.includes(s._id));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      onClearAll(filtered.map(s => s._id));
    } else {
      onSelectAll(filtered);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden flex-1 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="p-5 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Candidates</h3>
            <span className="text-[9px] font-bold text-indigo-600 mt-0.5">
              {selectedStudentIds.length} Selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleSelectAllToggle}
              className="text-[9px] font-bold px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all rounded uppercase"
            >
              {allFilteredSelected ? 'Clear All' : 'Select All'}
            </button>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500">
              {filtered.length} Results
            </span>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm transition-all outline-none placeholder:text-slate-300"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Student List - SCROLLABLE AREA */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3 opacity-50">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <p className="text-xs text-slate-400 italic">No candidates found.</p>
          </div>
        ) : (
          filtered.map((s) => {
            const isSelected = selectedStudentIds.includes(s._id);
            return (
              <button 
                key={s._id}
                type="button"
                onClick={() => onToggleSelect(s)}
                className={`w-full p-4 rounded-xl border transition-all text-left flex items-start gap-3 active:scale-[0.98] relative overflow-hidden ${
                  isSelected 
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-sm shadow-indigo-50' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                {/* Profile Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isSelected 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-400'
                }`}>
                  {isSelected ? <Check className="w-5 h-5 animate-in zoom-in duration-200" /> : <User className="w-5 h-5" />}
                </div>

                {/* Identity Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                    {s.personalDetails?.fullName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium text-slate-500">{s.studentId}</span>
                  </div>
                  
                  {/* Meta Badges */}
                  <div className="flex items-center gap-2 mt-2">
                     <span className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-600 rounded uppercase">
                       {s.academicProfile?.department}
                     </span>
                     <span className="px-1.5 py-0.5 bg-indigo-100 text-[9px] font-bold text-indigo-700 rounded uppercase">
                        Sem {s.academicProfile?.currentSemester}
                     </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EligibleStudentSelector;
