import { ShieldCheck, UserCog, UserCircle, Briefcase, Glasses, BookCopy, Users, Building } from 'lucide-react';

const roles = [
  { role: 'Super Admin', icon: ShieldCheck, desc: 'Full infrastructure control and global audit access.', color: 'text-purple-600', bg: 'bg-purple-100/50' },
  { role: 'Principal', icon: Building, desc: 'Executive dashboard with high-level institutional metrics.', color: 'text-blue-600', bg: 'bg-blue-100/50' },
  { role: 'Admission Staff', icon: UserCog, desc: 'Process applications, verify documents, map cohorts.', color: 'text-sky-600', bg: 'bg-sky-100/50' },
  { role: 'Accounts', icon: Briefcase, desc: 'Manage strict financial streams and reconciliation.', color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
  { role: 'Hostel Warden', icon: Glasses, desc: 'Monitor occupancy, approve hostel leaves instantly.', color: 'text-rose-600', bg: 'bg-rose-100/50' },
  { role: 'Librarian', icon: BookCopy, desc: 'Control inventory, late fees, and digital reserves.', color: 'text-amber-600', bg: 'bg-amber-100/50' },
  { role: 'Faculty', icon: Users, desc: 'Grade cohorts, track attendance, manage syllabus.', color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
  { role: 'Student', icon: UserCircle, desc: 'Secure self-portal for grades, payments, and requests.', color: 'text-gray-600', bg: 'bg-gray-100/50' },
];

const RoleBasedAccessSection = () => {
  return (
    <section className="py-12 bg-transparent border-b border-gray-100 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary-600/5 to-brand-accent/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Precision Access Control.
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              Data isolation by design. ERPSAA ensures every user interacts only with the modules and records explicitly authorized for their role profile.
            </p>
          </div>
          <div className="flex-shrink-0 hidden lg:flex items-center justify-center p-8 bg-gray-50 rounded-full border border-gray-200">
             <ShieldCheck className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <style>{`
            .role-card {
              position: relative;
              transition: all 0.4s ease;
            }
            .role-card:hover {
              box-shadow: 0 0 20px 0px var(--glow-color);
              background: white;
              transform: translateY(-5px);
            }
          `}</style>
          {roles.map((item, i) => {
            const glowPalette = [
              'rgba(59, 130, 246, 0.5)',
              'rgba(239, 68, 68, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(139, 92, 246, 0.5)',
              'rgba(245, 158, 11, 0.5)',
            ];
            const glowColor = glowPalette[i % glowPalette.length];

            return (
              <div 
                key={i} 
                style={{ '--glow-color': glowColor }}
                className="role-card flex flex-col p-6 rounded-2xl bg-[#FAFAFA] border border-gray-100 group"
              >
                 <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-4 border border-white`}>
                   <item.icon className={`w-6 h-6 ${item.color}`} />
                 </div>
                 <h4 className="font-bold text-gray-900 mb-2">{item.role}</h4>
                 <p className="text-sm font-medium text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleBasedAccessSection;
