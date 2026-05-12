import { useState } from 'react';
import { X, Book, Cpu, FileText, Settings, Layers } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';
import { useAuth } from '../../../../hooks/useAuth';

const SubjectForm = ({ initialData, onClose, onSubmit }) => {
  const { user } = useAuth();
  const isHOD = user?.isHOD;
  const { departments, loading: deptLoading } = useDepartments();
  const [formData, setFormData] = useState(initialData || {
    subjectName: '',
    subjectCode: '',
    department: isHOD ? user.department : 'IT',
    credits: 3,
    subjectType: 'Theory',
    description: '',
    status: 'active'
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
          <h2 className="text-2xl font-black tracking-tight text-gray-900">{initialData ? 'Edit Subject' : 'New Subject Master'}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Catalog Academic Discipline</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
              <Book className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-300"
              placeholder="e.g. Data Structures"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject Code</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Settings className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-400 uppercase"
                placeholder="CS101"
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Department</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Cpu className="w-4 h-4" />
              </div>
              {isHOD ? (
                <div className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-primary-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                  {departments.find(d => d.code === formData.department)?.name || formData.department}
                </div>
              ) : (
                <select
                  required
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {deptLoading ? (
                    <option value="">Loading...</option>
                  ) : (
                    departments.map(dept => (
                      <option key={dept.code} value={dept.code}>{dept.name}</option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Credits</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="number"
                required
                min="1"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject Type</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600">
                <Layers className="w-4 h-4" /> {/* Use Layers from another import if needed, or stick to simple icon */}
              </div>
              <select
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.subjectType}
                onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Lab">Lab</option>
                <option value="Elective">Elective</option>
              </select>
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
          {loading ? 'Saving...' : initialData ? 'Update Subject' : 'Register Subject'}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
