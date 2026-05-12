import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AboutUs = () => {
    const headerRef = useRef(null);
    const contentRef = useRef(null);
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

            gsap.from(contentRef.current, {
                duration: 1,
                x: -30,
                opacity: 0,
                delay: 0.2,
                ease: 'power2.out',
                clearProps: 'all'
            });

            gsap.from(cardsRef.current, {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                delay: 0.4,
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
                {/* Header Section */}
                <div ref={headerRef} className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient mb-8 tracking-tighter">
                        About MGM College
                    </h1>
                    <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg shadow-blue-200" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Main Content */}
                    <div ref={contentRef} className="space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                            <h2 className="text-4xl font-bold text-slate-800 mb-6 tracking-tight">Our Legacy</h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium text-justify [text-justify:inter-word]">
                                Mahatma Gandhi Mission (MGM) Trust has been a beacon of educational excellence since its inception in 1982. 
                                Founded with the noble objective of providing social services and quality education, the Trust has grown into 
                                one of India's premier educational institutions.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-xl mt-6 font-medium text-justify [text-justify:inter-word]">
                                The MGM College of Engineering, Nanded, established in 1984, stands as a testament to this legacy, 
                                fostering innovation and academic rigor in the heart of Maharashtra.
                            </p>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[3rem] blur-2xl" />
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white group">
                            <img 
                                src="/assets/about/banner1.jpg" 
                                alt="MGM Campus" 
                                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24">
                    {[
                        { title: 'Established', value: '1984', icon: '🏛️' },
                        { title: 'Accreditation', value: 'NAAC A Grade', icon: '⭐' },
                        { title: 'Affiliation', value: 'SRTMU Nanded', icon: '🎓' }
                    ].map((item, idx) => (
                        <div 
                            key={idx}
                            ref={el => cardsRef.current[idx] = el}
                            className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="text-5xl mb-6">{item.icon}</div>
                            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-3xl font-black text-slate-800 mt-2">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
