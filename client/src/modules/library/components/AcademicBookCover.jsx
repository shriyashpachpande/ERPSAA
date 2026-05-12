import React from 'react';

const AcademicBookCover = ({ 
    title = "Academic Publication", 
    author = "Unknown Author", 
    department = "General", 
    edition = "Academic Edition", 
    size = "medium" 
}) => {
    // Department Gradient Map
    const getGradient = (dept) => {
        const gradients = {
            'Computer Science': 'from-[#1e3a8a] to-[#1e40af]', // Navy → Deep Blue
            'Electronics & Communication': 'from-[#312e81] to-[#3730a3]', // Indigo → Dark Blue
            'Mechanical Engineering': 'from-[#1f2937] to-[#111827]', // Graphite → Dark Grey
            'Civil Engineering': 'from-[#64748b] to-[#475569]', // Concrete Grey → Blue-Grey
            'Mathematics': 'from-[#172554] to-[#020617]', // Deep Blue → Midnight
            'Physics': 'from-[#4c1d95] to-[#1e1b4b]', // Violet → Dark Blue
            'Chemistry': 'from-[#0d9488] to-[#065f46]', // Teal → Emerald
            'Business Management': 'from-[#7f1d1d] to-[#450a0a]', // Maroon → Wine
            'General': 'from-[#475569] to-[#334155]' // Slate
        };
        return gradients[dept] || gradients['General'];
    };

    const gradientClass = getGradient(department);

    // Responsive Size Config
    const sizeConfig = {
        small: {
            container: 'h-full w-full p-4',
            badge: 'text-[7px] px-2 py-0.5',
            title: 'text-sm mb-1',
            author: 'text-[9px]',
            edition: 'text-[7px]'
        },
        medium: {
            container: 'h-full w-full p-6',
            badge: 'text-[9px] px-3 py-1',
            title: 'text-xl mb-2',
            author: 'text-xs',
            edition: 'text-[9px]'
        },
        large: {
            container: 'h-full w-full p-10',
            badge: 'text-[11px] px-4 py-1.5',
            title: 'text-4xl mb-4 leading-tight',
            author: 'text-lg',
            edition: 'text-xs'
        }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    return (
        <div className={`relative flex flex-col items-center justify-between text-center overflow-hidden bg-gradient-to-br ${gradientClass} ${config.container} shadow-lg rounded-xl`}>
            {/* Subtle Overlay for Realism */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
            
            {/* TOP SECTION: Department Badge */}
            <div className="relative z-10 w-full flex justify-center pt-2">
                <span className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-black uppercase tracking-[0.2em] text-white/90 ${config.badge}`}>
                    {department}
                </span>
            </div>

            {/* CENTER: Title & Author */}
            <div className="relative z-10 w-full px-2 space-y-4">
                <h1 className={`font-black text-white uppercase tracking-tight drop-shadow-lg line-clamp-4 ${config.title}`}>
                    {title}
                </h1>
                <p className={`font-bold text-white/60 italic tracking-wide line-clamp-2 ${config.author}`}>
                    {author}
                </p>
            </div>

            {/* BOTTOM: Edition Section */}
            <div className="relative z-10 w-full flex flex-col items-center gap-1 pb-2">
                <div className="w-12 h-[2px] bg-white/20 rounded-full mb-3"></div>
                <span className={`font-black uppercase tracking-[0.4em] text-white/40 ${config.edition}`}>
                    {edition.includes('Edition') ? edition : `${edition} Edition`}
                </span>
            </div>

            {/* Subtle Reflection Detail */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default AcademicBookCover;
