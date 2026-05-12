import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, UserCheck, RefreshCw, FileSpreadsheet, PlusCircle } from 'lucide-react';

const ActionButton = ({ icon: Icon, title, count, color, bgColor, path }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(path)}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group w-full"
    >
      <div className={`p-4 rounded-full mb-3 ${bgColor} ${color} group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-sm font-bold text-gray-800">{title}</span>
      {count !== undefined && (
        <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${bgColor} ${color}`}>
          {count} Pending
        </span>
      )}
    </button>
  );
};

const QuickActions = ({ kpis }) => {
  const actions = [
    {
      title: 'Review Queue',
      icon: BookMarked,
      count: kpis?.underReview || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/app/staff/review-queue'
    },
    {
      title: 'Approve',
      icon: UserCheck,
      count: kpis?.underReview || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/app/staff/admissions?status=under_review'
    },
    {
      title: 'Re-uploads',
      icon: RefreshCw,
      count: kpis?.reuploadRequested || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/app/staff/admissions?status=reupload_requested'
    },
    {
      title: 'Reports',
      icon: FileSpreadsheet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/app/staff/reports'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => (
        <ActionButton key={idx} {...action} />
      ))}
    </div>
  );
};

export default QuickActions;
