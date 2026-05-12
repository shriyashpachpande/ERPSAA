import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CoursesOffered = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const ugCourses = [
        { name: "Civil Engineering", duration: "4 Years", seats: "60", icon: "🏗️", color: "bg-orange-50 text-orange-600 border-orange-100" },
        { name: "Computer Science & Engineering", duration: "4 Years", seats: "120", icon: "💻", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { name: "Electronics & Telecommunication", duration: "4 Years", seats: "60", icon: "📡", color: "bg-purple-50 text-purple-600 border-purple-100" },
        { name: "Information Technology", duration: "4 Years", seats: "60", icon: "🌐", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { name: "Mechanical Engineering", duration: "4 Years", seats: "60", icon: "⚙️", color: "bg-slate-50 text-slate-600 border-slate-100" }
    ];

    const pgCourses = [
        { name: "Structural Engineering (Civil)", duration: "2 Years", seats: "18", icon: "🏢" },
        { name: "Computer Science & Engineering", duration: "2 Years", seats: "18", icon: "🖥️" },
        { name: "Digital Electronics (E&TC)", duration: "2 Years", seats: "18", icon: "🔌" },
        { name: "Manufacturing Processes (Mechanical)", duration: "2 Years", seats: "18", icon: "🏭" }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(headerRef.current, {
                duration: 1,
                y: -30,
                opacity: 0,
                ease: 'power3.out',
                clearProps: 'all'
            });

            // Card Reveal Animation - Each card has its own trigger now for safety
            const cards = gsap.utils.toArray('.course-card');
            cards.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%", // Starts earlier
                        toggleActions: "play none none none"
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    ease: 'power2.out',
                    clearProps: 'all', // ENSURES VISIBILITY after animation
                    onComplete: () => {
                        // Start subtle float ONLY after entry
                        gsap.to(card, {
                            y: -8,
                            duration: 2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            delay: i * 0.1
                        });
                    }
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <style>
                {`
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradientFlow 6s ease infinite;
                }
                `}
            </style>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient mb-6 tracking-tight">
                        Academic Programs
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        Explore our wide range of engineering programs designed to shape the innovators of tomorrow.
                    </p>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-8" />
                </div>

                {/* UG Section */}
                <div className="mb-24">
                    <div className="flex items-center mb-10">
                        <div className="h-10 w-1.5 bg-blue-600 rounded-full mr-4" />
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Undergraduate (B.Tech)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ugCourses.map((course, index) => (
                            <div 
                                key={index}
                                className="course-card group relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 cursor-default overflow-hidden"
                            >
                                <div className={`w-14 h-14 ${course.color.split(' ')[0]} ${course.color.split(' ')[1]} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm relative z-10`}>
                                    {course.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors relative z-10">
                                    {course.name}
                                </h3>
                                <div className="space-y-3 pt-4 border-t border-slate-50 relative z-10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                                        <span className="text-slate-700 font-black">{course.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Intake Seats</span>
                                        <span className="text-slate-700 font-black">{course.seats}</span>
                                    </div>
                                </div>
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* PG Section */}
                <div>
                    <div className="flex items-center mb-10">
                        <div className="h-10 w-1.5 bg-indigo-600 rounded-full mr-4" />
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Postgraduate (M.Tech)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pgCourses.map((course, index) => (
                            <div 
                                key={index}
                                className="course-card group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:translate-y-[-5px] transition-all duration-300"
                            >
                                <div className="text-3xl mb-4 opacity-80">{course.icon}</div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                                    {course.name}
                                </h3>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                                    {course.duration} | {course.seats} Seats
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Research Note */}
                <div className="mt-24 p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4 flex items-center">
                            <span className="mr-3">🔬</span>
                            Research & PhD Programs
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-[17px] max-w-3xl">
                            The Institute also offers Ph.D. programs in Mechanical Engineering and Computer Science & Engineering. Our research centers are equipped with state-of-the-art laboratories and are recognized for their contribution to technological advancements.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesOffered;
