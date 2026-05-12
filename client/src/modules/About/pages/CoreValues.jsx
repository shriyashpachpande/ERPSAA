import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CoreValues = () => {
    const cardsRef = useRef([]);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                duration: 1.2,
                y: -30,
                opacity: 0,
                ease: 'power3.out'
            });

            gsap.from(cardsRef.current, {
                duration: 0.8,
                y: 60,
                opacity: 0,
                stagger: 0.15,
                ease: 'power4.out',
                clearProps: 'all' // Ensure all styles are cleared after animation
            });
        });
        return () => ctx.revert();
    }, []);

    const values = [
        { title: 'Integrity', desc: 'Consistency of actions, values, methods, measures and principles.', icon: '🛡️', color: 'blue' },
        { title: 'Excellence', desc: 'Striving for highest standards in academics and research.', icon: '🏆', color: 'amber' },
        { title: 'Ethics', desc: 'Maintaining professional standards and moral values.', icon: '⚖️', color: 'emerald' },
        { title: 'Accountability', desc: 'Taking responsibility for actions and outcomes.', icon: '📋', color: 'purple' },
        { title: 'Transparency', desc: 'Openness in communication and decision making.', icon: '🔍', color: 'cyan' },
        { title: 'Social Responsibility', desc: 'Contributing positively to the society and environment.', icon: '🌍', color: 'rose' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
                    <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient mb-6 tracking-tighter">
                        Core Values & Ethics
                    </h1>
                    <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg shadow-blue-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {values.map((v, i) => (
                        <div 
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">{v.icon}</div>
                            
                            <div className="w-24 h-24 flex items-center justify-center rounded-[2rem] bg-slate-50 border border-slate-100 mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
                                <span className="text-5xl">{v.icon}</span>
                            </div>

                            <h3 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                                {v.title}
                            </h3>
                            
                            <p className="text-slate-500 font-medium leading-relaxed text-lg text-justify [text-justify:inter-word]">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Code of Conduct Section */}
                <div className="mt-24 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Code of Conduct</h2>
                        <div className="h-1 w-24 bg-blue-100 rounded-full mt-4 md:mt-0" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { text: 'Students are expected to maintain discipline and decorum at all times.', icon: '📝' },
                            { text: 'Mandatory attendance of 75% for all academic sessions.', icon: '📅' },
                            { text: 'Respect towards faculty, staff and fellow students is paramount.', icon: '🤝' },
                            { text: 'Adherence to the anti-ragging policies of the institution.', icon: '🚫' }
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center space-x-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform">
                                    {rule.icon}
                                </div>
                                <p className="text-slate-700 font-bold text-lg leading-snug">{rule.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoreValues;
