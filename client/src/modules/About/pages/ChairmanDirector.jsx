import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ChairmanDirector = () => {
    const headerRef = useRef(null);
    const chairmanRef = useRef(null);
    const directorRef = useRef(null);
    const chairmanImgRef = useRef(null);
    const directorImgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Entry
            gsap.from(headerRef.current, {
                duration: 1.2,
                y: -50,
                opacity: 0,
                ease: 'power3.out'
            });

            // Chairman Section Scroll Animation
            gsap.from(chairmanRef.current, {
                scrollTrigger: {
                    trigger: chairmanRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                duration: 1,
                x: -50,
                opacity: 0,
                ease: 'power2.out'
            });

            // Director Section Scroll Animation
            gsap.from(directorRef.current, {
                scrollTrigger: {
                    trigger: directorRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                duration: 1,
                x: 50,
                opacity: 0,
                ease: 'power2.out'
            });

            // Floating Animation for Images
            gsap.to([chairmanImgRef.current, directorImgRef.current], {
                y: 15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        return () => ctx.revert();
    }, []);

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
                .hover-glow:hover {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
                    border-color: rgba(59, 130, 246, 0.4);
                }
                `}
            </style>

            <div className="max-w-6xl mx-auto">
                <div ref={headerRef} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient mb-6 tracking-tight">
                        Our Leadership
                    </h1>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
                </div>

                {/* Chairman Section */}
                <div ref={chairmanRef} className="mb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <div ref={chairmanImgRef} className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white transition-transform duration-500 group-hover:scale-105">
                                    <img 
                                        src="/assets/about/chairman.jpg" 
                                        alt="Shri Kamalkishor N. Kadam" 
                                        className="w-full h-[380px] object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h3 className="text-white text-xl font-black">Shri Kamalkishor N. Kadam</h3>
                                        <p className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Honorable Chairman, MGM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative hover-glow transition-all duration-500">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-[2.5rem]" />
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                                <span className="bg-amber-100 text-amber-600 w-10 h-10 flex items-center justify-center rounded-lg mr-3 text-xl">✍️</span>
                                Chairman's Desk
                            </h2>
                            <div className="space-y-5 text-slate-600 text-[17px] font-medium leading-relaxed text-justify [text-justify:inter-word]">
                                <p>We recognize that choosing your institution is one of the most important decision you make in your life. Mahatma Gandhi Mission aims for providing you with a distinctive combination of academic excellence with professional relevance laying foundation for total personality development.</p>
                                <p>Today, MGM is one of the leading educational institution in Maharashtra. In Dec. 2015, MGM completed her 32 years of existence offering her contribution in the field of education and health services to the society. Providing health care services is MGM’S prime activity widely spread over with medical, dental, nursing colleges & multispeciality hospitals. MGM’S University of Health Sciences is the new milestone of achievement.</p>
                                <p>In all MGM Institutions students are our top priority and their educational and social needs are at the heart of the MGM plannings. A dynamic academic environment promises you exciting & fulfilling student life.</p>
                                <p>We believe in continuous upgradation of infrastructural facilities along with quality improvement program for faculty and enhancement of work environment in all respects. Our teaching standards are consistently rated amongst the best. qualified & dedicated faculty is our strength. Our high educational standards are reflected in the excellent response we receive from the achievements of our alumni having well received in organizations of repute worldwide.</p>
                                <p className="bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500 italic text-slate-500 text-[16px]">
                                    "We are aware that success is no destination, it is a continuous journey. I am thankfull to all those parents who put in their valuable trust with us giving opportunity to contribute for the career development of their children."
                                </p>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xl font-black text-slate-800">- Shri Kamalkishor N. Kadam</p>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chairman, MGM Trust</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Director Section */}
                <div ref={directorRef}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-8 space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative hover-glow transition-all duration-500 order-2 lg:order-1">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-[2.5rem]" />
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                                <span className="bg-blue-100 text-blue-600 w-10 h-10 flex items-center justify-center rounded-lg mr-3 text-xl">🎓</span>
                                Director's Desk
                            </h2>
                            <div className="space-y-5 text-slate-600 text-[17px] font-medium leading-relaxed text-justify [text-justify:inter-word]">
                                <p>Being associated with this Institute since last 35 years and being the Principal, this institute carries a very special place in my heart. Recognized as one of the best options to go for engineering education, Mahatma Gandhi Missions College of Engineering, Nanded has its own status in the institutions of Engineering in this region.</p>
                                <p>We not only cater for engineering education but the purpose is to bring out the best in the students in the interest of their total personality development to contribute to their profession and society at large. The Institute caters for Under Graduate education for Civil, Computer, Mechanical, Electronics & Telecommunication & Information Technology with six post graduate courses.</p>
                                <p>The Research Centre in Mechanical & Computer Engineering provides the reinforcement for building the career of the engineers. Our alumni having placed in the top organizations world over speaks itself about the quality of education here. Various alumni meets organized in India and USA gave us immense satisfaction to be the part of the career development of these top performers.</p>
                                <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-600 text-blue-900 text-[16px]">
                                    <p className="font-black mb-2 italic">Exploring New Dimensions...</p>
                                    <p className="italic">"Journey is unending. Everywhere an ‘edge over’ element is to be introduced giving competitive advantage to the students and we always keep exploring new ideas improving teaching-learning process."</p>
                                </div>
                                <p>And the journey goes on…. and…. on. I am always happy to welcome the new expecting faces joining the Institute, taking care of the budding engineers and still more happier for sending the trained engineers from the Institute to the outside world over with flying colours.</p>
                                <div className="flex flex-col items-center py-6 px-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-center">
                                    <p className="text-xl font-black text-slate-800 mb-1">“Ships are safer in harbour - but they are not meant for it”</p>
                                    <p className="text-slate-500 text-sm">And the students going out as engineers prove this attaining new horizons of success.</p>
                                </div>
                                <p className="text-2xl font-black text-center text-blue-600 py-2">“To bring out the best in you”</p>
                                
                                <div className="pt-4 border-t border-slate-100 lg:text-right">
                                    <p className="text-xl font-black text-slate-800">- Dr. Mrs. Geeta Lathkar</p>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Director, MGMCEN Nanded</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-2">
                            <div ref={directorImgRef} className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white transition-transform duration-500 group-hover:scale-105">
                                    <img 
                                        src="/assets/about/director.jpg" 
                                        alt="Dr. Geeta S. Lathkar" 
                                        className="w-full h-[380px] object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h3 className="text-white text-xl font-black">Dr. Geeta S. Lathkar</h3>
                                        <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Director, MGMCEN Nanded</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChairmanDirector;
