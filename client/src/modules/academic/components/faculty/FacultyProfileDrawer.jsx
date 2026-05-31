import { X, Mail, Phone, Calendar, Hash, Briefcase, Shield, Clock } from 'lucide-react';
import AcademicStatusBadge from '../shared/AcademicStatusBadge';

const FacultyProfileDrawer = ({ faculty, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
        {/* Header */}
        <div className="relative h-48 bg-primary-600 p-8 flex flex-col justify-end">
          <button type="button" 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white text-primary-600 flex items-center justify-center font-black text-2xl shadow-xl">
              {faculty.user?.fullName?.charAt(0) || 'F'}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-black tracking-tight leading-none mb-1">{faculty.user?.fullName}</h2>
              <p className="text-primary-100 text-sm font-medium opacity-80 uppercase tracking-widest">{faculty.designation}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Current Status</p>
              <AcademicStatusBadge status={faculty.status} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Employee ID</p>
              <p className="text-sm font-bold text-gray-900">{faculty.employeeId}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Institutional Details</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Department</p>
                  <p className="text-sm font-bold text-gray-900">{faculty.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Joining Date</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(faculty.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">ERP Official Email</p>
                  <p className="text-sm font-bold text-primary-600 underline underline-offset-4">{faculty.erpEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Personal Email</p>
                  <p className="text-sm font-bold text-gray-900">{faculty.personalEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                  <p className="text-sm font-bold text-gray-900">{faculty.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Placeholder */}
          <div className="pt-6">
            <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100 text-center">
              <Clock className="w-8 h-8 text-primary-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-primary-900 uppercase tracking-widest">Academic Assignments</p>
              <p className="text-[10px] text-primary-600 mt-1 font-medium italic">Foundation ready • Map in Stage 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfileDrawer;
