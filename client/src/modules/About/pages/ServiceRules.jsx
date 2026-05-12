import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServiceRules = () => {
    const headerRef = useRef(null);
    const containerRef = useRef(null);

    const sections = [
        {
            id: "intro",
            title: "1. Introduction",
            content: [
                "The Service Rules document is prepared to make aware all the staff members working at MGM’s College of Engineering, Nanded about the rules and regulations that govern their work/duties in the Institute.",
                "The following rules shall apply to all regular employees i.e. teaching and non-teaching, provided that nothing in these rules and regulations shall apply to persons employed temporarily or on daily wages.",
                "The Rules shall come into force with effect from 01‐07‐2017.",
                "The Governing Council of MGM’s College of Engineering Nanded is the final authority relating to the appointments, service conditions, fixing or adoption of pay scales of all employees of the College."
            ]
        },
        {
            id: "definitions",
            title: "2. Definitions",
            list: [
                "“Governing Council” means the Governing Council of MGM’s College of Engineering, Nanded constituted as per norms of the Statutory Authority.",
                "“Bye-Laws” mean the Bye-Laws of the MGM Trust.",
                "“Institute” means the MGM’s College of Engineering, Nanded.",
                "“Trust” means the trust by the name of MGM Trust (Mahatma Gandhi Mission Trust).",
                "“Director” means the Director of the Institute who is Secretary for the Governing Council.",
                "“Employee” means a person employed by the Institute to discharge the duties for teaching and non-teaching purposes on salary/remuneration/honorarium basis.",
                "“Regular Employee” means a qualified person employed in a regular post after completion of probation period specified.",
                "“Probationer” means an employee who is appointed against a regular post and kept on probation for a prescribed period of time pending confirmation for regular post."
            ]
        },
        {
            id: "appointments",
            title: "3. Appointments",
            content: [
                "The employees of the Institute will be classified as: i. Teaching staff (faculty), ii. Administrative staff, iii. Technical Supporting staff.",
                "The Governing Council fixes the number of posts in each department, prescribes qualifications, mode of recruitment and the scales of pay etc.",
                "All posts shall normally be filled by advertisements but the Trust shall have the power to decide that a particular post may be filled by promotion.",
                "Service of the employee is transferable to anywhere in India in other engineering colleges or polytechnic run by the Mahatma Gandhi Mission Trust whenever required."
            ]
        },
        {
            id: "probation",
            title: "4. Probation",
            list: [
                "Employees appointed to regular posts shall be required to be on probation for a period of not less than one year.",
                "In case of employees on promotion/transfer appointed to higher posts, probation shall be for a period of not less than six months.",
                "The probation period may be extended by the Governing Council if service is found not satisfactory.",
                "If confirmation is not declared within three months from the date of completion of the prescribed period, the probation is deemed to have been completed satisfactorily.",
                "The services of an employee on probation may be terminable by either party giving one month notice or paying one month's salary."
            ]
        },
        {
            id: "termination",
            title: "5. Termination of Service",
            list: [
                "After probation, an employee shall give one month's notice in writing or pay one month's salary to resign. Similarly, the Governing Council can terminate service with one month's notice.",
                "The Governing Council is competent to terminate services in case of abolition of posts, closure of Institution/department, or reduction in sanctioned intake.",
                "Termination can also occur if an employee is incapacitated or for misconduct in discharging official duties."
            ]
        },
        {
            id: "retirement",
            title: "6. Retirement",
            list: [
                "The age of superannuation of a Teaching Staff and Class IV employees is 60 years and Non-teaching staff is 58 years.",
                "The Governing Council may extend the period of service depending on the mental and physical condition of the employee.",
                "Age of superannuation for Librarian and Director of Physical Education is 60 years.",
                "Teaching Staff can be reappointed up to the age of 70 years on contract basis depending on the need."
            ]
        },
        {
            id: "welfare",
            title: "7. Faculty Welfare Schemes",
            list: [
                "Employee Provident Fund (EPF): All faculty enrolled other than those joined after 58 years of age.",
                "Gratuity: Paid after minimum 5 years of continuous service as per Indian Gratuity Rules.",
                "Insurance Scheme: All staff members are covered by a group insurance policy.",
                "Interest Free Advance: Eligible for staff completing two years of service, recoverable in equal installments."
            ]
        },
        {
            id: "conduct",
            title: "8. Conduct and Discipline",
            list: [
                "Whole time of an employee shall be at the disposal of the Governing Council.",
                "No employee shall apply for other employment without prior written permission (allowed once in a year).",
                "Employees shall not undertake part-time jobs or engage in tuition classes.",
                "Employees shall maintain secrecy regarding the affairs of the institution.",
                "Absent from duty without permission for 10 days or more leads to deemed desertion of post.",
                "Employees are not allowed to contest elections or involve in political activities."
            ]
        },
        {
            id: "leave",
            title: "9. Leave Rules",
            content: [
                "Leave cannot be claimed as a matter of right. The sanctioning authority has full discretion to refuse or revoke leave.",
                "Unauthorized absence may be treated as misbehavior involving disciplinary action.",
                "Teaching staff is entitled to 60 days of vacation during a 12-month period."
            ],
            table: [
                { type: "Casual Leave", abv: "CL" },
                { type: "Earned Leave", abv: "EL" },
                { type: "Medical Leave", abv: "ML" },
                { type: "Maternity Leave", abv: "--" },
                { type: "Extraordinary Leave", abv: "EOL" },
                { type: "On Duty Leave", abv: "OD" },
                { type: "Study Leave", abv: "SL" }
            ]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, { duration: 1, y: -30, opacity: 0, ease: 'power3.out' });
            gsap.utils.toArray('.policy-section').forEach(section => {
                gsap.from(section, {
                    scrollTrigger: { trigger: section, start: "top 90%" },
                    duration: 0.8, y: 20, opacity: 0, ease: 'power2.out'
                });
            });
        });
        return () => ctx.revert();
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <style>
                {`
                @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .animate-gradient { background-size: 200% 200%; animation: gradientFlow 6s ease infinite; }
                `}
            </style>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                {/* Fixed Index Sidebar */}
                <div className="lg:w-1/4">
                    <div className="lg:sticky lg:top-32 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Handbook Navigation</h3>
                        <div className="space-y-1">
                            {sections.map(s => (
                                <button key={s.id} onClick={() => scrollToSection(s.id)} className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:w-3/4">
                    <header ref={headerRef} className="mb-20">
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient mb-6 tracking-tight">
                            Service Rules
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">Complete and un-abridged official service conditions for MGM College of Engineering.</p>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full mt-8" />
                    </header>

                    <div className="space-y-20">
                        {sections.map(section => (
                            <div key={section.id} id={section.id} className="policy-section">
                                <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
                                    <span className="w-2 h-10 bg-blue-600 rounded-full mr-4"></span>
                                    {section.title}
                                </h2>

                                {section.content && section.content.map((p, i) => (
                                    <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6 text-justify [text-justify:inter-word] font-medium">
                                        {p}
                                    </p>
                                ))}

                                {section.list && (
                                    <ul className="space-y-4 mb-10">
                                        {section.list.map((li, i) => (
                                            <li key={i} className="flex items-start bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                <span className="text-blue-500 mr-4 font-black mt-1">•</span>
                                                <span className="text-slate-600 font-medium leading-relaxed">{li}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {section.table && (
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 mt-6">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Type of Leave</th>
                                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Abbreviation</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {section.table.map((row, i) => (
                                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="px-6 py-4 text-slate-700 font-bold">{row.type}</td>
                                                        <td className="px-6 py-4 text-blue-600 font-black">{row.abv}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white">
                        <h3 className="text-2xl font-black mb-4">Official Disclaimer</h3>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            This document is provided for information purposes. The Governing Council reserves the right to amend, alter or repeal any rules contained herein at its sole discretion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRules;
