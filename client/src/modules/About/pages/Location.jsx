import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Location = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const travelModes = [
        {
            mode: "By Air",
            info: "Nanded has its own airport (Shri Guru Gobind Singh Ji Airport). The campus is just 5 km away, with easy taxi and auto-rickshaw availability.",
            icon: "✈️"
        },
        {
            mode: "By Rail",
            info: "Nanded is a major railway station on the South Central Railway. The college is conveniently located 3 km from the Nanded Railway Station.",
            icon: "🚂"
        },
        {
            mode: "By Road",
            info: "Situated on the Nanded-Nagpur Highway. It is well-connected to major cities like Mumbai, Pune, and Hyderabad by state and private buses.",
            icon: "🚌"
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

            gsap.from(".info-card", {
                scrollTrigger: {
                    trigger: ".info-grid",
                    start: "top 80%",
                },
                duration: 0.8,
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
                {/* Header - CINEMATIC GRADIENT */}
                <div ref={headerRef} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient mb-6 tracking-tight">
                        Locate Us
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        Find your way to the scenic 20-acre hilltop campus of MGM Nanded.
                    </p>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-8" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Side: Address & Map */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Map Embed - CORRECTED PB PARAMETER */}
                        <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-[450px] relative group">
                            <iframe 
                                title="MGM Nanded Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.3546736633635!2d77.32167797520779!3d19.17972724838638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd1d6fbe138ad81%3A0x9e88bbe86ec52250!2sMGM's%20College%20Of%20Engineering!5e0!3m2!1sen!2sin!4v1715448375631!5m2!1sen!2sin"
                                className="w-full h-full rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-700"
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">📍</div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800">Campus Address</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-sm mt-1">
                                        MGM’s College of Engineering, Hingoli Road, Nanded - 431605 (M.S.) India.
                                    </p>
                                </div>
                            </div>
                            <a 
                                href="https://maps.app.goo.gl/hG9NqZ4Y2Z6p8x8Y6" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-6 md:mt-0 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Right Side: How to Reach */}
                    <div className="info-grid space-y-6">
                        <h3 className="text-xl font-black text-slate-800 px-2 flex items-center">
                            <span className="w-8 h-1 bg-blue-600 rounded-full mr-3"></span>
                            How to Reach
                        </h3>
                        {travelModes.map((mode, i) => (
                            <div key={i} className="info-card bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group">
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{mode.icon}</span>
                                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{mode.mode}</h4>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {mode.info}
                                </p>
                            </div>
                        ))}

                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">📞</div>
                            <h4 className="text-lg font-black mb-2 relative z-10">Need Assistance?</h4>
                            <p className="text-slate-400 text-xs font-medium mb-4 relative z-10">Contact our administrative office for directions.</p>
                            <span className="text-blue-400 font-black text-sm relative z-10">+91 2462 222999</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;
