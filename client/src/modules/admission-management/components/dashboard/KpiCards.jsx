import React, { useEffect, useRef } from 'react';
import { Users, FileCheck, Search, AlertCircle, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

const KpiCard = ({ title, value, icon: Icon, trend, color, bgColor }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${bgColor} group-hover:scale-110 transition-transform`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{(value || 0).toLocaleString()}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
            {trend} <span className="text-gray-400 font-normal ml-1">since last period</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bgColor} ${color} shadow-sm group-hover:rotate-6 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const KpiCards = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [data]);

  if (!data) return null;

  const cards = [
    {
      title: 'Total Applications',
      value: data.total || 0,
      icon: Users,
      trend: `+${data.submittedToday || 0} today`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Submitted Today',
      value: data.submittedToday || 0,
      icon: FileCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Under Review',
      value: data.underReview || 0,
      icon: Search,
      trend: `${((data.underReview / (data.total || 1)) * 100).toFixed(1)}% of total`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Re-upload Requests',
      value: data.reuploadRequested || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Approved',
      value: data.approved || 0,
      icon: CheckCircle,
      trend: `${((data.approved / (data.total || 1)) * 100).toFixed(1)}% success`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rejected',
      value: data.rejected || 0,
      icon: AlertCircle,
      trend: `${((data.rejected / (data.total || 1)) * 100).toFixed(1)}% rate`,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    }
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <KpiCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KpiCards;
