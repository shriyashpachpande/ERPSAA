import { useState } from 'react';
import { X, Calendar, Type, CheckCircle2 } from 'lucide-react';

const AcademicYearForm = ({ initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    startDate: '',
    endDate: '',
    status: 'active',
    isCurrent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
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
          <h2 className="text-2xl font-black tracking-tight text-gray-900">{initialData ? 'Edit Academic Year' : 'New Academic Year'}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configure Academic Cycle</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Academic Year Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-gray-400">
              <Type className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-300"
              placeholder="e.g. 2026-2027"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
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

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
          <select
            className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-primary-900 uppercase tracking-widest">Mark as Current</p>
              <p className="text-[10px] text-primary-600 font-bold opacity-80 uppercase tracking-widest">Sets as primary year</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isCurrent: !formData.isCurrent })}
            className={`w-12 h-6 rounded-full transition-colors relative ${formData.isCurrent ? 'bg-primary-600' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isCurrent ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
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
          {loading ? 'Saving...' : initialData ? 'Update Academic Year' : 'Create Academic Year'}
        </button>
      </div>
    </form>
  );
};

export default AcademicYearForm;
