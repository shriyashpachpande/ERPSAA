import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';

const committeeData = {
    "academic-cell": {
        title: "Academic Cell",
        icon: "📚",
        description: "Responsible for the overall academic execution, monitoring of time-tables, and ensuring implementation of the academic calendar.",
        objectives: [
            "Monitoring the execution of Department Time-Tables.",
            "Preparation of Institutional Academic Calendar and its strict implementation.",
            "Coordinating academic audits and student feedback systems.",
            "Ensuring quality in teaching-learning processes across all departments."
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 2, dept: "Institutional", name: "Dr. Kotgire S. L.", role: "Member" },
            { sr: 3, dept: "First Year", name: "Prof. Adkine G. U.", role: "Convener & Dept. Coordinator" },
            { sr: 4, dept: "Institutional", name: "Dr. M. G. Harkare", role: "Member" },
            { sr: 5, dept: "Institutional", name: "Dr. Archana M. Rajurkar", role: "Member" },
            { sr: 6, dept: "Institutional", name: "Dr. Mrs. K.C. Jondhale", role: "Member" },
            { sr: 7, dept: "Institutional", name: "Prof. Hashmi S. A.", role: "Member" },
            { sr: 8, dept: "Institutional", name: "Dr. Arshad Hashmi", role: "Member" },
            { sr: 9, dept: "Institutional", name: "Dr. Muttepawar S. M.", role: "Member" },
            { sr: 10, dept: "Civil Engg.", name: "Dr. Md. Zameeruddin", role: "Dept. Coordinator" },
            { sr: 11, dept: "Institutional", name: "Prof. Jadhav V. S.", role: "Member" },
            { sr: 12, dept: "CSE", name: "Dr. Mrs. M.Y. Joshi", role: "Dept. Coordinator" },
            { sr: 13, dept: "E&TC", name: "Prof. Ms. Kanadkhedkar Pranita P.", role: "Dept. Coordinator" },
            { sr: 14, dept: "IT", name: "Prof. Mr. Ravi Shankar Yadav", role: "Dept. Coordinator" },
            { sr: 15, dept: "Mech. Engg.", name: "Prof. Mr. Sawale J. K.", role: "Dept. Coordinator" }
        ]
    },
    "admission-cell": {
        title: "Admission Cell",
        icon: "🎟️",
        description: "Facilitates the entire admission lifecycle from pre-admission registration to final document approval by state authorities.",
        objectives: [
            "Pre-admission counseling and Registration through FC (Facilitation Center).",
            "Conduction of the full Admission Process as per state norms.",
            "Post-admission document verification by DTE and final approval by ARA.",
            "Maintaining transparency and guidance for parents and students."
        ],
        table: [
            { sr: 1, dept: "Director", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 2, dept: "First Year", name: "Dr. Kotgire S. L.", role: "Member" },
            { sr: 3, dept: "Admission", name: "Dr. Mrs. Sulbha N. Dachawar", role: "Admission Incharge" },
            { sr: 4, dept: "Admin", name: "Dr. Mrs. M. R. Banwaskar", role: "Member" },
            { sr: 5, dept: "CSE", name: "Prof. Ms. Jyoti H. Patil", role: "Member" },
            { sr: 6, dept: "First Year", name: "Prof. Mr. G. U. Adkine", role: "Member" },
            { sr: 7, dept: "Civil", name: "Prof. Mr. D. J. Tuptewar", role: "Member" },
            { sr: 8, dept: "IT", name: "Prof. Mr. M. N. Bhandare", role: "Member" },
            { sr: 9, dept: "Cultural", name: "Prof. Mr. Bhore A. A.", role: "Member" },
            { sr: 10, dept: "Tech Support", name: "Mr. Yahya Ali", role: "Member" }
        ]
    },
    "anti-ragging-squad": {
        title: "Anti Ragging Squad",
        icon: "🛡️",
        description: "A proactive field unit that remains alert to ensure zero ragging incidences within the college premises and hostels.",
        objectives: [
            "Surprise raids in hostels and common areas.",
            "Continuous monitoring of student movement.",
            "Immediate intervention in case of suspicious activities.",
            "Maintaining the 'Ragging Free' status of the institution."
        ],
        table: [
            { sr: 1, dept: "CSE", name: "Dr. D. V. Pattewar", role: "Coordinator" },
            { sr: 2, dept: "Institutional", name: "Dr. Mrs. M. Y. Joshi", role: "Member" },
            { sr: 3, dept: "Institutional", name: "Dr. J. S. Siddhu", role: "Member" },
            { sr: 4, dept: "Institutional", name: "Prof. N. A. Kadam", role: "Member" },
            { sr: 5, dept: "Institutional", name: "Prof. V. S. Jadhav", role: "Member" },
            { sr: 6, dept: "Institutional", name: "Dr. Mohd. Zameeruddin", role: "Member" }
        ]
    },
    "anti-ragging-committee": {
        title: "Anti Ragging Committee",
        icon: "⚖️",
        description: "The apex legal body responsible for enforcing Supreme Court directives and taking disciplinary actions regarding ragging.",
        objectives: [
            "Reviewing squad reports and taking final decisions.",
            "Conducting awareness programs for senior students.",
            "Ensuring 100% compliance with UGC Anti-Ragging regulations.",
            "Direct coordination with local police administration."
        ],
        table: [
            { sr: 1, dept: "Director", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 2, dept: "Institutional", name: "Dr. Kotgire S. L.", role: "Member" },
            { sr: 3, dept: "Institutional", name: "Dr. S. M. Muttepwar", role: "Member" },
            { sr: 4, dept: "Institutional", name: "Dr. Arshad Hashmi", role: "Member" },
            { sr: 5, dept: "Institutional", name: "Prof. Pawde M. R.", role: "Coordinator" },
            { sr: 6, dept: "Police", name: "API Vijay Jadhav", role: "Police Representative" },
            { sr: 7, dept: "Media", name: "Dr. G. B. Joshi", role: "Media Representative" }
        ]
    },
    "caserp-cell": {
        title: "CASERP Cell",
        icon: "☁️",
        description: "Manages the digital infrastructure of the institute through advanced cloud-based ERP solutions.",
        objectives: [
            "Digital governance in academics, finance, and administration.",
            "Implementing paperless documentation across departments.",
            "Ensuring data security and real-time accessibility.",
            "Training staff for digital competency."
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Prof. Mrs. Patil Jyoti H.", role: "Incharge" },
            { sr: 2, dept: "Institutional", name: "Dr. Md. Zameeruddin", role: "Dept. Coordinator" },
            { sr: 3, dept: "Institutional", name: "Dr. Mrs. M. Y. Joshi", role: "Dept. Coordinator" },
            { sr: 4, dept: "Institutional", name: "Prof. S. A. Hashmi", role: "Dept. Coordinator" }
        ]
    },
    "cdc": {
        title: "College Development Committee",
        icon: "🏛️",
        description: "The strategic planning body for institutional growth and infrastructure development.",
        objectives: [
            "Strategic roadmap for institutional growth.",
            "Reviewing academic and financial performance.",
            "Planning for infrastructure and resource expansion.",
            "Deciding the intake and courses for the academic year."
        ],
        table: [
            { sr: 1, dept: "Trust", name: "Shri. Kamalkishor N. Kadam", role: "Chairman" },
            { sr: 2, dept: "Trust", name: "Shri. Ankushrao N. Kadam", role: "Member" },
            { sr: 3, dept: "Director", name: "Dr. Geeta S. Lathkar", role: "Member Secretary" },
            { sr: 4, dept: "External", name: "Dr. Y. V. Joshi", role: "External Member" },
            { sr: 5, dept: "External", name: "Dr. Mahesh Kokare", role: "External Member" },
            { sr: 6, dept: "External", name: "Mr. Mukesh Jain", role: "External Member" }
        ]
    },
    "cultural": {
        title: "Cultural Committee",
        icon: "🎨",
        description: "Responsible for organizing 'JHAANKAR' and managing student clubs like Music (Aarohan), Dance (Synergy), and Drama (Udaan).",
        objectives: [
            "Organizing JHAANKAR - Annual Social Gathering.",
            "Nurturing student talent through Music, Dance, and Drama clubs.",
            "Participating in Inter-Collegiate and University Cultural events.",
            "Promoting ethical and cultural values among students."
        ],
        clubs: [
            { name: "Aarohan", focus: "Music & Singing", description: "Dedicated to nurturing vocal and instrumental talent." },
            { name: "Synergy", focus: "Dance & Choreography", description: "Focuses on both classical and contemporary dance forms." },
            { name: "Udaan", focus: "Drama & Theater", description: "Promotes acting, script-writing, and stage management." }
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Prof. Mr. Pankaj P. Pawar", role: "Coordinator" },
            { sr: 2, dept: "Institutional", name: "Prof. Mr. A. A. Bhore", role: "Member" },
            { sr: 3, dept: "Institutional", name: "Prof. Mrs. S. S. Patil", role: "Member" },
            { sr: 4, dept: "Institutional", name: "Prof. Ms. V. K. Deshmukh", role: "Member" },
            { sr: 5, dept: "Student", name: "Sakshi Udgirkar", role: "Cultural Secretary" },
            { sr: 6, dept: "Student", name: "Abhishek Jondhale", role: "Sports Secretary" }
        ]
    },
    "exam-cell": {
        title: "Examination Cell",
        icon: "📝",
        description: "Manages both University and Internal Examinations with a focus on secrecy and efficiency.",
        objectives: [
            "Conduction of University End Semester Exams (ESE).",
            "Conduction of Continuous Assessment (CA) and Mid-Sem Exams.",
            "Maintaining 100% secrecy in paper printing and valuation.",
            "Coordination with SRTMUN for results and revaluation."
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Prof. V. S. Jadhav", role: "Central Coordinator" },
            { sr: 2, dept: "Institutional", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 3, dept: "CSE", name: "Prof. J. K. Sawale", role: "Dept. Coordinator" },
            { sr: 4, dept: "ECT", name: "Prof. Savita Wagre", role: "Dept. Coordinator" },
            { sr: 5, dept: "IT", name: "Prof. Ritesh Bais", role: "Dept. Coordinator" },
            { sr: 6, dept: "Civil", name: "Prof. A. A. Bhore", role: "Dept. Coordinator" },
            { sr: 7, dept: "Mech", name: "Prof. D. J. Tuptewar", role: "Dept. Coordinator" }
        ]
    },
    "icc": {
        title: "Internal Complaint Committee - ICC",
        icon: "👩‍💼",
        description: "Ensures a safe working and learning environment for female staff and students, addressing issues related to harassment.",
        objectives: [
            "Addressing gender-based grievances.",
            "Gender sensitization and development of female students.",
            "Compliance with Vishakha Guidelines and POSH Act.",
            "Maintaining a respectful institutional climate."
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Dr. Mrs. Sulbha N. Dachawar", role: "Presiding Officer" },
            { sr: 2, dept: "External", name: "Dr. Mrs. Shobha Waghmare", role: "External Member (NGO)" },
            { sr: 3, dept: "Institutional", name: "Prof. Dr. Mrs. V. M. Deshmukh", role: "Member" },
            { sr: 4, dept: "Institutional", name: "Prof. Mrs. S. B. Mundra", role: "Member" },
            { sr: 5, dept: "Student", name: "Ms. Neha Patil", role: "Student Representative" },
            { sr: 6, dept: "Student", name: "Ms. Gauri Kulkarni", role: "Student Representative" }
        ]
    },
    "sc-st-cell": {
        title: "SC/ST Cell",
        icon: "✊",
        description: "Monitors the welfare and effective implementation of government policies for SC/ST students.",
        objectives: [
            "Resolving grievances of SC/ST students and staff.",
            "Providing guidance for government scholarships.",
            "Ensuring effective implementation of reservation policies.",
            "Conducting personality development programs."
        ],
        table: [
            { sr: 1, dept: "Director", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 2, dept: "Institutional", name: "Dr. Mrs. K. C. Jondhale", role: "Coordinator" },
            { sr: 3, dept: "Admin", name: "Mr. Salve Suhas G.", role: "Member" },
            { sr: 4, dept: "Admin", name: "Ms. Manjramkar Manisha A.", role: "Member" }
        ]
    },
    "sgrc": {
        title: "Student Grievance Redressal Committee",
        icon: "📢",
        description: "Addresses the academic and non-academic concerns of the students through a fair and transparent system.",
        objectives: [
            "Resolving academic and examination-related grievances.",
            "Addressing issues related to amenities and infrastructure.",
            "Maintaining institutional transparency.",
            "Ensuring timely feedback to students on their concerns."
        ],
        table: [
            { sr: 1, dept: "Director", name: "Dr. Geeta S. Lathkar", role: "Chairperson" },
            { sr: 2, dept: "Institutional", name: "Dr. Mohd. Zameeruddin", role: "Coordinator" },
            { sr: 3, dept: "HOD CSE", name: "Dr. D. V. Pattewar", role: "Member" },
            { sr: 4, dept: "HOD ECT", name: "Dr. S. M. Muttepwar", role: "Member" },
            { sr: 5, dept: "HOD IT", name: "Dr. Arshad Hashmi", role: "Member" },
            { sr: 6, dept: "Student Council", name: "Harshad Bhalerao", role: "Member" }
        ]
    },
    "placement-cell": {
        title: "Training & Placement Cell",
        icon: "💼",
        description: "Centralized cell for employability skills and corporate placements across all engineering branches.",
        objectives: [
            "Organizing campus recruitment drives.",
            "Providing Soft Skills and Technical training.",
            "Career counseling and higher education guidance.",
            "Maintaining 100% placement record."
        ],
        table: [
            { sr: 1, dept: "Institutional", name: "Prof. Shivprasad Titare", role: "TPO" },
            { sr: 2, dept: "CSE", name: "Prof. Mohd Aijaz Ahmed", role: "Dept. Coordinator" },
            { sr: 3, dept: "ECT", name: "Dr. V. P. Kude", role: "Dept. Coordinator" },
            { sr: 4, dept: "IT", name: "Prof. R. S. Yadav", role: "Dept. Coordinator" },
            { sr: 5, dept: "Civil", name: "Prof. D. J. Tuptewar", role: "Dept. Coordinator" },
            { sr: 6, dept: "Mech", name: "Prof. M. N. Bhandare", role: "Dept. Coordinator" }
        ]
    }
};

const CellsCommittees = () => {
    const { id } = useParams();
    const contentRef = useRef(null);
    const headerRef = useRef(null);
    const activeData = committeeData[id] || committeeData["academic-cell"];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current, 
                { opacity: 0, y: -30 }, 
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
            gsap.fromTo(contentRef.current, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
            );
        });
        return () => ctx.revert();
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <style>
                {`
                @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .animate-gradient { background-size: 200% 200%; animation: gradientFlow 6s ease infinite; }
                `}
            </style>

            <div className="max-w-7xl mx-auto">
                {/* EXACT ABOUT HEADER */}
                <div ref={headerRef} className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient mb-8 tracking-tighter">
                        {activeData.title}
                    </h1>
                    <div className="h-2 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full shadow-lg shadow-blue-200" />
                </div>

                <div ref={contentRef} className="space-y-12">
                    
                    {/* Objectives Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight flex items-center gap-3">
                            <span className="text-4xl">{activeData.icon}</span>
                            Objectives & Mandate
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeData.objectives.map((obj, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                        {obj}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CLUBS SECTION (If exists - for Cultural) */}
                    {activeData.clubs && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {activeData.clubs.map((club, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <div className="text-4xl font-black">MGM</div>
                                    </div>
                                    <h3 className="text-2xl font-black text-blue-600 mb-2">{club.name} Club</h3>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{club.focus}</p>
                                    <p className="text-slate-600 font-medium leading-relaxed">{club.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* OFFICIAL TABLE */}
                    {activeData.table && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden">
                            <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">Institutional Committee Members</h2>
                            <div className="overflow-x-auto rounded-3xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Sr No</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Department</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Name of Faculty</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Designation/Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {activeData.table.map((row) => (
                                            <tr key={row.sr} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-4 text-slate-400 font-bold text-sm">{row.sr}</td>
                                                <td className="px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">{row.dept}</td>
                                                <td className="px-6 py-4 text-slate-800 font-black text-sm">{row.name}</td>
                                                <td className="px-6 py-4 text-blue-600 font-black text-[11px] uppercase tracking-widest">{row.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.04)] italic text-center">
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">
                            "{activeData.description}"
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CellsCommittees;
