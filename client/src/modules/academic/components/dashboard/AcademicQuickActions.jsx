import { Zap, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcademicQuickActions = () => {
  const actions = [
    { label: 'New Academic Year', path: '/app/academic/years', icon: PlusCircle },
    { label: 'New Semester', path: '/app/academic/semesters', icon: PlusCircle },
    { label: 'Add Subjects', path: '/app/academic/subjects', icon: PlusCircle },
    { label: 'Faculty Assignment', path: '/app/academic/faculty', icon: PlusCircle },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link 
            key={action.label} 
            to={action.path}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 text-gray-600 hover:text-primary-600 border border-transparent hover:border-primary-100 transition-all group"
          >
            <span className="text-sm font-semibold">{action.label}</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AcademicQuickActions;
