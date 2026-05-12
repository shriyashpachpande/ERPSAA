import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const History = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const milestones = [
        {
            year: "1984",
            title: "Foundation Stone",
            description: "M.G.M.’s College of Engineering was established as the second institute under the Mahatma Gandhi Mission trust, marking the beginning of a new era in technical education in Nanded.",
            icon: "🏛️",
            align: "left"
        },
        {
            year: "Expansion Phase",
            title: "Campus Development",
            description: "The campus grew to cover 20 acres on a scenic hilltop along the Nanded-Nagpur Highway. The infrastructure expanded to over 1.5 lakh sq.ft of modern built-up area.",
            icon: "🌳",
            align: "right"
        },
        {
            year: "Today",
            title: "40+ Years of Excellence",
            description: "Now recognized as a premier engineering destination in the region, known for its lush greenery, serene learning environment, and commitment to student success.",
            icon: "🎓",
            align: "left"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                duration: 1.2,
                y: -30,
                opacity: 0,
                ease: 'power3.out',
                clearProps: 'all'
            });

            const items = gsap.utils.toArray('.timeline-item');
            items.forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    duration: 1,
                    x: i % 2 === 0 ? -50 : 50,
                    opacity: 0,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            });

            gsap.from('.timeline-line', {
                scrollTrigger: {
                    trigger: '.timeline-container',
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: true
                },
                scaleY: 0,
                transformOrigin: "top center",
                ease: "none"
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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

            <div className="max-w-5xl mx-auto">
                {/* Header - RESTORED GRADIENT */}
                <div ref={headerRef} className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient mb-6 tracking-tight">
                        Our Legacy
                    </h1>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
                </div>

                {/* Timeline Container */}
                <div className="timeline-container relative">
                    <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-200 hidden md:block" />

                    <div className="space-y-20 relative">
                        {milestones.map((item, index) => (
                            <div key={index} className={`timeline-item flex flex-col md:flex-row items-center ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                <div className="w-full md:w-1/2 px-4 md:px-12 text-center md:text-left">
                                    <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 relative group ${item.align === 'right' ? 'md:text-right' : ''}`}>
                                        <div className={`absolute top-0 ${item.align === 'right' ? 'right-0' : 'left-0'} w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity`} />
                                        
                                        <span className="text-4xl mb-4 block">{item.icon}</span>
                                        <h3 className="text-blue-600 font-black text-2xl mb-1 tracking-tighter">{item.year}</h3>
                                        <h4 className="text-slate-800 font-black text-xl mb-4">{item.title}</h4>
                                        <p className="text-slate-500 text-lg leading-relaxed font-medium text-justify [text-justify:inter-word]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-blue-500 items-center justify-center z-10 shadow-lg">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" />
                                </div>

                                <div className="hidden md:block w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
