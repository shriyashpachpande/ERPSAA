import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Accreditations = () => {
    const headerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                duration: 1,
                y: -30,
                opacity: 0,
                ease: 'power2.out',
                clearProps: 'all'
            });

            gsap.from(cardsRef.current, {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all'
            });
        });
        return () => ctx.revert();
    }, []);

    const data = [
        { title: 'NAAC Accreditation', body: 'Accredited with "A" Grade by NAAC (National Assessment and Accreditation Council).', icon: '💎' },
        { title: 'AICTE Approval', body: 'All programs are approved by the All India Council for Technical Education, New Delhi.', icon: '🏛️' },
        { title: 'University Affiliation', body: 'Affiliated to Swami Ramanand Teerth Marathwada University (SRTMUN), Nanded.', icon: '🎓' },
        { title: 'ISO Certification', body: 'Certified with ISO 9001:2015 for quality management systems.', icon: '📜' }
    ];

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
                        Accreditations
                    </h1>
                    <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg shadow-blue-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {data.map((item, i) => (
                        <div 
                            key={i} 
                            ref={el => cardsRef.current[i] = el}
                            className="p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.1)] transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:w-4 transition-all" />
                            <div className="text-5xl mb-6 bg-slate-50 w-20 h-20 flex items-center justify-center rounded-2xl border border-slate-100">{item.icon}</div>
                            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium text-justify [text-justify:inter-word]">{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Accreditations;
