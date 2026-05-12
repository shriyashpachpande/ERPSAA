import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const VisionMission = () => {
    const sectionRefs = useRef([]);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                duration: 1,
                y: -30,
                opacity: 0,
                ease: 'power2.out',
                clearProps: 'all'
            });

            gsap.from(sectionRefs.current, {
                duration: 1,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out',
                clearProps: 'all'
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

            <div className="max-w-7xl mx-auto">
                <div ref={headerRef} className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient mb-8 tracking-tighter">
                        Vision & Mission
                    </h1>
                    <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg shadow-blue-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Vision */}
                    <div 
                        ref={el => sectionRefs.current[0] = el}
                        className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                        <div className="text-6xl mb-8">👁️‍🗨️</div>
                        <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">Vision</h2>
                        <p className="text-slate-600 text-2xl italic leading-relaxed text-justify font-medium [text-justify:inter-word]">
                            "To be a premier institution of engineering education and research, 
                            producing technically competent and ethically strong professionals 
                            capable of contributing to the global society."
                        </p>
                    </div>

                    {/* Mission */}
                    <div 
                        ref={el => sectionRefs.current[1] = el}
                        className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
                        <div className="text-6xl mb-8">🚀</div>
                        <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">Mission</h2>
                        <ul className="space-y-6">
                            {[
                                "To provide state-of-the-art infrastructure and a conducive environment for academic excellence.",
                                "To foster research and innovation through industry-institute interaction.",
                                "To nurture leadership qualities and social responsibility among students."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-purple-600 font-black text-2xl mr-4">✦</span>
                                    <p className="text-slate-600 text-lg font-semibold leading-snug text-justify [text-justify:inter-word]">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Objectives */}
                <div 
                    ref={el => sectionRefs.current[2] = el}
                    className="mt-16 bg-white p-12 rounded-[3rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
                >
                    <h2 className="text-3xl font-black text-slate-800 mb-10 text-center tracking-tight">Quality Objectives</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            '100% Student Satisfaction',
                            'Modern Teaching Aids',
                            'Skill Enhancement',
                            'Global Placement'
                        ].map((obj, i) => (
                            <div key={i} className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-blue-600 transition-all duration-300">
                                <p className="text-slate-700 font-bold group-hover:text-white transition-colors">{obj}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionMission;
