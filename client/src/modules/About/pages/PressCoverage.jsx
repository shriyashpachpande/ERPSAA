import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PressCoverage = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const newsArticles = [
        {
            headline: "एमजीएम मध्ये विश्वेश्वरैया जयंती उत्साहात",
            subheadline: "Visvesvaraya Jayanti Celebrated with Enthusiasm at MGM",
            date: "September 23, 2024",
            source: "Punya Nagari (Nanded Edition)",
            category: "Event",
            description: "Institutional celebration of Engineers' Day honoring Bharat Ratna Sir M. Visvesvaraya with faculty and staff.",
            icon: "📐"
        },
        {
            headline: "अभियांत्रिकीच्या विद्यार्थ्यांकडून निर्मल्य संकलन",
            subheadline: "Nirmalya Collection by Engineering Students",
            date: "September 2024",
            source: "Lokmat News Network",
            category: "Social Initiative",
            description: "Environmental initiative by MGM students to protect the Godavari river during Ganpati Visarjan.",
            icon: "🌱"
        },
        {
            headline: "एमजीएममध्ये गांधी aur शास्त्री जयंती साजरी",
            subheadline: "Gandhi & Shastri Jayanti Celebrated",
            date: "October 02, 2024",
            source: "Marathwada / Hello Nanded",
            category: "National Day",
            description: "Celebrating the birth anniversaries of Mahatma Gandhi and Lal Bahadur Shastri with social awareness programs.",
            icon: "🇮🇳"
        },
        {
            headline: "MGM College achieves 100% Placements",
            subheadline: "Major IT giants recruit from Nanded Campus",
            date: "August 2024",
            source: "Institutional Press Release",
            category: "Achievement",
            description: "A milestone achievement with top-tier companies recruiting talented engineers from MGM Nanded.",
            icon: "🚀"
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

            const cards = gsap.utils.toArray('.news-card');
            cards.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        toggleActions: "play none none none"
                    },
                    duration: 0.8,
                    y: 40,
                    opacity: 0,
                    ease: 'power2.out',
                    clearProps: 'all'
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
                {/* Header - BACK TO GRADIENT ANIMATION */}
                <div ref={headerRef} className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient mb-6 tracking-tight">
                        Media & Press
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Recent highlights and news coverage of MGM College of Engineering in leading publications.
                    </p>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-8" />
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsArticles.map((news, index) => (
                        <div key={index} className="news-card group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-32 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{news.icon}</div>
                                <div className="h-px w-8 bg-slate-200 my-2" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-tight">
                                    {news.date.split(' ')[0]} <br/> {news.date.split(' ')[1]}
                                </span>
                            </div>

                            <div className="flex-1 p-8 relative">
                                <div className="absolute top-8 right-8">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {news.category}
                                    </span>
                                </div>
                                
                                <h4 className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{news.source}</h4>
                                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {news.headline}
                                </h3>
                                <p className="text-slate-400 font-medium text-sm italic mb-4">
                                    "{news.subheadline}"
                                </p>
                                <p className="text-slate-500 text-base leading-relaxed [text-justify:inter-word] text-justify">
                                    {news.description}
                                </p>

                                <div className="mt-6 flex items-center text-blue-500 font-black text-xs uppercase tracking-widest cursor-pointer group/link">
                                    View Full Clipping 
                                    <span className="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PressCoverage;
