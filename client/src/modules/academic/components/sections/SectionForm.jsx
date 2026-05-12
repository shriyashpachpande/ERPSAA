import { useState, useEffect } from 'react';
import { X, Layers, Users, ShieldCheck, Tag } from 'lucide-react';
import { useSemesters } from '../../hooks/useSemesters';
import { useDepartments } from '../../hooks/useDepartments';

const SectionForm = ({ initialData, onClose, onSubmit, academicYears }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    academicYearId: '',
    semesterId: '',
    department: 'IT',
    course: 'B.Tech - IT',
    capacity: 60,
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { semesters } = useSemesters(formData.academicYearId);
  const { departments } = useDepartments();

  // Logic to handle auto-defaulting department based on semester
  useEffect(() => {
    if (!formData.semesterId || initialData) return;

    const selectedSem = semesters.find(s => 
      s._id === (formData.semesterId._id || formData.semesterId)
    );

    if (selectedSem) {
      if (selectedSem.semesterNumber <= 2) {
        setFormData(prev => ({
          ...prev,
          department: 'Common Engineering',
          course: 'B.Tech - First Year'
        }));
      } else {
        // Only update if it was FE or empty to avoid overwriting user manual choice unnecessarily
        if (formData.department === 'Common Engineering' || !formData.department) {
          setFormData(prev => ({
            ...prev,
            department: 'Information Technology',
            course: 'B.Tech - IT'
          }));
        }
      }
    }
  }, [formData.semesterId, semesters, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
          <h2 className="text-2xl font-black tracking-tight text-gray-900">{initialData ? 'Edit Section' : 'New Section'}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configure Academic Unit</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Section Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
              <Tag className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none placeholder:text-gray-300"
              placeholder="e.g. IT-A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Academic Year</label>
            <select
              required
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
              value={formData.academicYearId._id || formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value, semesterId: '' })}
            >
              <option value="">Select Year</option>
              {academicYears.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Semester</label>
            <select
              required
              disabled={!formData.academicYearId}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none disabled:opacity-50"
              value={formData.semesterId._id || formData.semesterId}
              onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
            >
              <option value="">Select Term</option>
              {semesters.map(s => <option key={s._id} value={s._id}>{s.semesterName}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Department</label>
            <select
              required
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
              value={formData.department}
              onChange={(e) => {
                const deptName = e.target.value;
                setFormData({ 
                  ...formData, 
                  department: deptName,
                  course: deptName === 'Common Engineering' ? 'B.Tech - First Year' : `B.Tech - ${deptName}`
                });
              }}
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Max Capacity</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <input
                type="number"
                required
                min="1"
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
          {loading ? 'Saving...' : initialData ? 'Update Section' : 'Create Section'}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;
