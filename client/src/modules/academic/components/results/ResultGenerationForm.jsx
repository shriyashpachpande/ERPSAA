import { useState } from 'react';
import { useSemesters } from '../../hooks/useSemesters';
import { useSections } from '../../hooks/useSections';
import { Settings, Play, ShieldAlert } from 'lucide-react';

const ResultGenerationForm = ({ years, onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    academicYearId: '',
    semesterId: '',
    sectionId: ''
  });

  const { semesters } = useSemesters(formData.academicYearId);
  const { sections } = useSections({ academicYearId: formData.academicYearId, semesterId: formData.semesterId });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
       <div className="flex items-center gap-3 mb-2">
         <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
           <Settings className="w-5 h-5" />
         </div>
         <div>
           <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.15em]">Control Panel</h4>
           <p className="text-[10px] font-bold text-gray-400">Configure result parameters</p>
         </div>
       </div>

       <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Academic Year</label>
            <select 
              required
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value, semesterId: '', sectionId: '' })}
            >
              <option value="">Select Year</option>
              {years.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Semester</label>
            <select 
              required
              disabled={!formData.academicYearId}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
              value={formData.semesterId}
              onChange={(e) => setFormData({ ...formData, semesterId: e.target.value, sectionId: '' })}
            >
              <option value="">Select Semester</option>
              {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Section</label>
            <select 
              required
              disabled={!formData.semesterId}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
            >
              <option value="">Select Section</option>
              {sections.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
            </select>
          </div>

          <div className="pt-4 p-5 bg-red-50 rounded-3xl border border-red-100 flex gap-3">
             <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
             <p className="text-[10px] font-bold text-red-600 leading-relaxed uppercase tracking-wide">
               Generation will overwrite existing results for this term. Proceed with caution.
             </p>
          </div>

          <button 
            type="submit"
            disabled={loading || !formData.sectionId}
            className="w-full py-5 bg-brand-dark text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? 'Processing...' : (
              <>
                <Play className="w-4 h-4" /> Run Generation
              </>
            )}
          </button>
       </form>
    </div>
  );
};

export default ResultGenerationForm;
