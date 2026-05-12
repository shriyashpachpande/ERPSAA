import { motion } from 'framer-motion';
import { Mail, GraduationCap, ArrowLeft, Users, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const BackgroundSpheres = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                animate={{
                    x: [0, 150, -100, 0],
                    y: [0, 200, 400, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4466FF]/30 to-[#4466FF]/5 blur-[60px]"
            />
            <motion.div
                animate={{
                    x: [0, -200, 150, 0],
                    y: [0, 300, -150, 0],
                    scale: [1, 0.7, 1.2, 1],
                }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#9966FF]/25 to-[#9966FF]/5 blur-[80px]"
            />
            <motion.div
                animate={{
                    x: [0, 200, -150, 0],
                    y: [0, -150, 300, 0],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#00FF99]/25 to-[#00FF99]/5 blur-[50px]"
            />
        </div>
    );
};

const facultyData = [
    { name: 'Dr. Mrs. S. N. Dachawar', role: 'Professor & Head Of The Department', specialization: 'Organic Chemistry', email: 'kapratwar_sb@mgmcen.ac.in', image: '/collegeprofile/Dr. Mrs. S. N. Dachawar.jpg' },
    { name: 'Mr. Dhananjay M. Joshi', role: 'Asst. Professor', specialization: 'Advanced Electronics', email: 'joshi_dm@mgmcen.ac.in', image: '/collegeprofile/Mr. Dhananjay M. Joshi.jpg' },
    { name: 'Adkine Gajanan Uttamrao', role: 'Assistant Professor Senior', specialization: 'Electrical Power System, Electrical Machines, I&C.', email: 'adkine_gu@mgmcen.ac.in', image: '/collegeprofile/Adkine Gajanan Uttamrao.jpg' },
    { name: 'Mr. Pawde M.R.', role: 'Assistant Professor', specialization: 'Complex Analysis', email: 'pawde_mr@mgmcen.ac.in', image: '/collegeprofile/Mr. Pawde M.R..jpg' },
    { name: 'Mohd. Iqbal', role: 'Asst. Professor', specialization: 'Magnetic properties of ferromagnetic substances.', email: 'mohd_iqbal@mgmcen.ac.in', image: '/collegeprofile/Mohd.Iqbal.jpg' },
    { name: 'Satish Sudhakarrao Pawar', role: 'Asst. Professor', specialization: 'Algebraic geometry', email: 'pawar_ss@mgmcen.ac.in', image: '/collegeprofile/Satish Sudhakarrao Pawar.jpg' },
    { name: 'Dr. Chandankumar Jaipal Somwanshi', role: 'Asst. Professor', specialization: 'Communication Skills, Soft Skills, ELT', email: 'somwanshi_cj@mgmcen.ac.in', image: '/collegeprofile/Dr. Chandankumar Jaipal Somwanshi.jpg' },
    { name: 'Mr. Pradip Kamaji Kharbe', role: 'Assistant Professor', specialization: 'Physical Chemistry', email: 'pradipkharbe05@gmail.com', image: '/collegeprofile/Mr.Pradip Kamaji Kharbe.jpg' },
    { name: 'Mr. Gangadhar Raghunath Barse', role: 'Assistant Professor', specialization: 'Electrical Power Systems', email: 'barse_gangadhar@mgmcen.ac.in', image: '/collegeprofile/Mr. Gangadhar Raghunath Barse.jpg' },
    { name: 'Dr. Vivek P Kude', role: 'Assistant Professor', specialization: 'Optical fiber communication, Optical fiber Sensing', email: 'kude_vp@mgmcen.ac.in', image: '/collegeprofile/Dr. Vivek P Kude.jpg' },
    { name: 'DR. Kiran Panjabrao Deshmukh', role: 'Assistant Professor', specialization: 'Language and Literature', email: 'Kavyapihu31@gmail.com', image: '/collegeprofile/DR. Kiran Panjabrao Deshmukh.jpg' },
    { name: 'Dr. Sawale Rajendrakumar Tukaram', role: 'Assistant Professor', specialization: 'Organic Chemistry', email: 'sawale_rajendrakumar@mgmcen.ac.in', image: '/collegeprofile/Dr. Sawale Rajendrakumar Tukaram.jpg' },
    { name: 'Ms. Raichurkar Mayuri Jayant', role: 'Assistant Professor', specialization: 'Differential Equations', email: 'raichurkar_mayuri@mgmcen.c.in', image: '/collegeprofile/Ms. Raichurkar Mayuri Jayant.jpg' },
    { name: 'Mr. Kadam Krishna Bapurao', role: 'Assistant Professor', specialization: 'Linear Algebra', email: 'Kadam_krishna@mgmcen.ac.in', image: '/collegeprofile/Mr. Kadam Krishna Bapurao.jpg' },
];

const AppliedSciencePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-['Inter',sans-serif]">
            <BackgroundSpheres />

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

                {/* Header & Back Link */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <Link to="/collegeprofile" className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        BACK TO DEPARTMENTS
                    </Link>
                    <h1 className="text-[clamp(32px,5vw,64px)] font-black text-slate-900 leading-[0.9] tracking-tighter mb-4">
                        APPLIED SCIENCE <br /> <span className="text-primary-600">& HUMANITIES.</span>
                    </h1>
                </motion.div>

                {/* HOD Profile Card - Professional Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-12 items-center mb-24 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-primary-600/10" />

                    {/* HOD Image */}
                    <div className="relative shrink-0">
                        <div className="w-64 h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-10">
                            <img
                                src="/collegeprofile/Dr. Mrs. S. N. Dachawar.jpg"
                                alt="HOD"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-xl z-20">
                            <UserCheck className="w-10 h-10" />
                        </div>
                    </div>

                    {/* HOD Text Details */}
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-600 text-xs font-black uppercase tracking-widest mb-6">
                            Department Leadership
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">Dr. Mrs. S. N. Dachawar</h2>
                        <p className="text-xl font-bold text-slate-500 mb-8 leading-tight">Head of the Dept. and Admission Incharge</p>

                        <div className="space-y-6 max-w-xl">
                            <p className="text-slate-600 leading-relaxed font-medium">
                                The department is multi-disciplinary in nature with faculty from diverse disciplines such as mathematics, applied physics, applied chemistry and communication skills.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="mailto:kapratwar_sb@mgmcen.ac.in" className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg group">
                                    <Mail className="w-5 h-5" />
                                    <span>kapratwar_sb@mgmcen.ac.in</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stylish Faculty Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h3 className="text-sm font-black text-primary-600 tracking-[0.2em] uppercase mb-4">Faculty Directory</h3>
                            <h4 className="text-4xl font-black text-slate-900 tracking-tight">Academic <span className="text-slate-400">Pillars.</span></h4>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <Users className="w-5 h-5" />
                            <span>{facultyData.length} Members</span>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/50 bg-white/30">
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty Member</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Specialization</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facultyData.map((faculty, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-white transition-all duration-300 border-b border-slate-100 last:border-0"
                                        >
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 group-hover:scale-110 transition-all duration-500 bg-slate-100">
                                                        <img
                                                            src={faculty.image}
                                                            alt={faculty.name}
                                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                            onError={(e) => {
                                                                e.target.src = "https://ui-avatars.com/api/?name=" + faculty.name + "&background=f1f5f9&color=64748b&size=512";
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                                                            {faculty.name}
                                                        </p>
                                                        <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{faculty.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-primary-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors italic">
                                                        {faculty.specialization}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <a
                                                    href={`mailto:${faculty.email}`}
                                                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-primary-600 hover:text-white hover:shadow-lg transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </a>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Decor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 pt-10 gap-6"
                >
                    <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Applied Science & Humanities | MGM COEN</p>
                    <div className="flex gap-2">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <div className="w-20 h-1 bg-slate-200 rounded-full" />
                        <div className="w-5 h-1 bg-slate-100 rounded-full" />
                    </div>
                </motion.div>
            </div>

            <style>{`
                @font-face {
                    font-family: 'Syne';
                    src: url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
                }
            `}</style>
        </div>
    );
};

export default AppliedSciencePage;
