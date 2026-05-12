import { useState } from 'react';
import { X, User, Briefcase, Mail, Phone, Calendar, Hash, ShieldCheck, Loader2 } from 'lucide-react';
import { useDepartments } from '../../hooks/useDepartments';

const FacultyCreateForm = ({ onClose, onSubmit, onSuccess }) => {
  const { departments, loading: deptLoading } = useDepartments();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    department: 'IT',
    designation: 'Assistant Professor',
    phone: '',
    personalEmail: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      onSuccess(result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-600/5 to-transparent">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Register Faculty</h2>
          <p className="text-gray-500 text-sm font-medium">New account will be generated with @erpsaa.com address</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="fullName" value={formData.fullName} onChange={handleChange} required
                type="text" placeholder="Dr. John Doe"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Employee ID */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Employee ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="employeeId" value={formData.employeeId} onChange={handleChange} required
                type="text" placeholder="FAC-10023"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Department</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                name="department" value={formData.department} onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              >
                {deptLoading ? (
                  <option value="">Loading...</option>
                ) : (
                  departments.map(dept => (
                    <option key={dept.code} value={dept.code}>{dept.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Designation</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                name="designation" value={formData.designation} onChange={handleChange} required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              >
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
                <option value="Head of Department">Head of Department</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="phone" value={formData.phone} onChange={handleChange} required
                type="tel" placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Personal Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Personal Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="personalEmail" value={formData.personalEmail} onChange={handleChange} required
                type="email" placeholder="john.doe@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Joining Date */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Joining Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="joiningDate" value={formData.joiningDate} onChange={handleChange} required
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button 
            type="button" onClick={onClose}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={loading}
            className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-600/30 hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Faculty'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyCreateForm;
