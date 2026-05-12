import { useEffect, useRef } from 'react';
import { Calendar, BookOpen, FileCheck, GraduationCap, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';

const AcademicStatsCards = ({ stats }) => {
  const cardsRef = useRef([]);

  const cards = [
    { label: 'Active Students', value: stats.totalEnrollments || 0, icon: GraduationCap, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100/50', accent: 'group-hover:bg-primary-600' },
    { label: 'Current Semesters', value: stats.semesters || 0, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100/50', accent: 'group-hover:bg-indigo-600' },
    { label: 'Subjects Mapping', value: stats.subjects || 0, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100/50', accent: 'group-hover:bg-emerald-600' },
    { label: 'Draft Marks', value: stats.pendingMarks || 0, icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100/50', accent: 'group-hover:bg-amber-600' }
  ];

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { y: 30, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, [stats]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {cards.map((card, i) => (
        <div 
          key={i} 
          ref={el => cardsRef.current[i] = el}
          className={`group glass-panel p-8 rounded-[2.5rem] border ${card.border} hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 relative overflow-hidden active:scale-[0.98] outline-none`}
        >
          <div className="relative z-10 space-y-6">
            <div className={`w-16 h-16 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${card.accent} group-hover:text-white`}>
              <card.icon className="w-8 h-8 transition-transform duration-500" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-600 transition-colors">{card.label}</p>
              <div className="flex items-end justify-between">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-primary-700 transition-colors">{card.value}</h2>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                   <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background glass layers */}
          <div className={`absolute -top-10 -right-10 w-32 h-32 ${card.bg} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`}></div>
          <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${card.bg} opacity-5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700`}></div>
          
          {/* Subtle icon background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-[0.03] scale-150 transition-all duration-1000 pointer-events-none">
             <card.icon className="w-32 h-32" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcademicStatsCards;
