import { useState, useEffect } from 'react';
import { X, Calendar, Hash, Layers } from 'lucide-react';

const SemesterForm = ({ initialData, academicYearId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    semesterNumber: 1,
    semesterName: 'Semester 1',
    startDate: '',
    endDate: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({ 
        ...prev, 
        semesterName: `Semester ${prev.semesterNumber}` 
      }));
    }
  }, [formData.semesterNumber, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ ...formData, academicYearId });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">{initialData ? 'Edit Semester' : 'New Semester'}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configure Academic Term</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Semester Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Hash className="w-4 h-4" />
              </div>
              <select
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.semesterNumber}
                onChange={(e) => setFormData({ ...formData, semesterNumber: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>Semester {n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Semester Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Layers className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-300"
                value={formData.semesterName}
                onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Start Date</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">End Date</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100 mt-auto flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-4 bg-brand-dark text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? 'Saving...' : initialData ? 'Update Semester' : 'Create Semester'}
        </button>
      </div>
    </form>
  );
};

export default SemesterForm;
