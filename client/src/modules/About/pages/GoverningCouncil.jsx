import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GoverningCouncil = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const members = [
        { name: "Shri Kamal Kishor Kadam", designation: "Chairman", role: "leadership" },
        { name: "Dr. Geeta S. Lathkar", designation: "Director / Member-Secretary", role: "leadership" },
        { name: "Shri Ankushrao Kadam", designation: "Member", role: "member" },
        { name: "Shri Ujwalrao Kadam", designation: "Member", role: "member" },
        { name: "Dr. Amardeep Kadam", designation: "Member", role: "member" },
        { name: "Dr. Sudhirchandra Kadam", designation: "Member", role: "member" },
        { name: "Regional Officer", designation: "Nominee of AICTE (Ex-officio)", role: "member" },
        { name: "Dr. K. G. Narayankhedkar", designation: "Educationist / Nominee of the Council", role: "member" },
        { name: "Dr. N. V. Kadam", designation: "Scientist", role: "member" },
        { name: "Dr. Brijesh Iyer", designation: "Nominee of the affiliation body/University (Ex-officio)", role: "member" },
        { name: "C. P. Tripathi", designation: "Industrialist / Nominee of the State Govt.", role: "member" },
        { name: "Dr. Archana M. Rajurkar", designation: "Faculty Member (Prof. Dept. of CSE)", role: "member" },
        { name: "Dr. Shirish L. Kotgire", designation: "Faculty Member (Prof. Dept. of ETC)", role: "member" }
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

            gsap.from(".member-row", {
                scrollTrigger: {
                    trigger: ".members-container",
                    start: "top 80%",
                },
                duration: 0.8,
                x: -30,
                opacity: 0,
                stagger: 0.05,
                ease: 'power2.out',
                clearProps: 'all'
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header - SOLID STYLE */}
                <div ref={headerRef} className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
                        Governing Council
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        The Governing Council oversees the strategic direction and academic excellence of the institution.
                    </p>
                    <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mt-8" />
                </div>

                {/* Leadership Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {members.filter(m => m.role === 'leadership').map((member, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 rounded-t-[2rem]" />
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                                    {i === 0 ? "🏛️" : "🎓"}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{member.name}</h3>
                                    <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mt-1">{member.designation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Members List */}
                <div className="members-container bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-black text-slate-700 uppercase tracking-widest text-xs">Council Member List</h3>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">{members.length} Members</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {members.filter(m => m.role === 'member').map((member, i) => (
                            <div key={i} className="member-row group flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-5 hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        {i + 3}
                                    </div>
                                    <h4 className="text-slate-700 font-bold text-[17px] group-hover:text-slate-900">{member.name}</h4>
                                </div>
                                <div className="mt-1 sm:mt-0 sm:text-right">
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-tight group-hover:text-blue-500 transition-colors">{member.designation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-slate-400 text-sm font-medium italic">
                    * The Governing Council meets regularly to ensure adherence to AICTE and University norms.
                </div>
            </div>
        </div>
    );
};

export default GoverningCouncil;
