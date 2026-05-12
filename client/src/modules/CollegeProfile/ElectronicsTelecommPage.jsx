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
    { name: 'Dr. Mr. S. L. Kotgire', role: 'Professor', specialization: 'Communication', email: 'kotgire_sl@mgmcen.ac.in', image: '/collegeprofile/Dr.Mr. S. L. Kotgire.jpg' },
    { name: 'Dr. Mrs. Kalpana C. Jondhale Paithane', role: 'Professor & Head', specialization: 'Image processing, Computer Vision and Pattern Recognition', email: 'jondhale_kc@mgmcen.ac.in', image: '/collegeprofile/Dr. Mrs. Kalpana C. Jondhale Paithane.jpg' },
    { name: 'Dr. Mrs. M. R. Banwaskar', role: 'Professor', specialization: 'Electronics Design Technology', email: 'banwaskar_mr@mgmcen.ac.in', image: '/collegeprofile/Dr. Mrs. M. R. Banwaskar.jpg' },
    { name: 'Mr. V. S. Jadhav', role: 'Assistant Professor', specialization: 'Digital Signal Processing', email: 'jadhav_vs@mgmcen.ac.in', image: '/collegeprofile/Mr. V. S. Jadhav.jpg' },
    { name: 'Ms. P. P. Kanadkhedkar', role: 'Assistant Professor Senior', specialization: 'Electronics & Telecommunication', email: 'kanadkhedkar_pp@mgmcen.ac.in', image: '/collegeprofile/Ms. P. P. Kanadkhedkar.jpg' },
    { name: 'Mr. Sayed Shoaib Anwar', role: 'Assistant Professor Senior', specialization: 'Wireless communication, Multicarrier communication', email: 'sayed_shoaib@mgmcen.ac.in', image: '/collegeprofile/Mr. Sayed Shoaib Anwar.jpg' },
    { name: 'Ms. A. K. Salve', role: 'Assistant Professor', specialization: 'Computer Science and Engineering', email: 'salve_ak@mgmcen.ac.in', image: '/collegeprofile/Ms. A. K. Salve.jpg' },
    { name: 'Ms. M. V. Mangalagiri', role: 'Assistant Professor', specialization: 'Embedded System Design, Wireless Communication', email: 'mangalagiri_mv@mgmcen.ac.in', image: '/collegeprofile/Ms. M. V. Mangalagiri.jpg' },
    { name: 'Mr. D. J. Tuptewar', role: 'Assistant Professor', specialization: 'Signal and Image Processing, Embedded System Design, VLSI', email: 'tuptewar_dj@mgmcen.ac.in', image: '/collegeprofile/Mr. D. J. Tuptewar.jpg' },
    { name: 'Ms. Aparna B. Dalvi', role: 'Asst. Professor', specialization: 'Digital Image Processing', email: 'dalvi_ab@mgmcen.ac.in', image: '/collegeprofile/Ms. Aparna B. Dalvi.jpg' },
];

const ElectronicsTelecommPage = () => {
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
                    <h1 className="text-[clamp(32px,5vw,64px)] font-black text-slate-900 leading-[0.9] tracking-tighter mb-4 uppercase">
                        ELECTRONICS & <br /> <span className="text-primary-600">TELECOMMUNICATION.</span>
                    </h1>
                </motion.div>

                {/* HOD Profile Card */}
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
                                src="/collegeprofile/Dr. Mrs. Kalpana C. Jondhale Paithane.jpg" 
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
                            Head of Department
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">Dr. Mrs. Kalpana P. Paithane</h2>
                        <p className="text-xl font-bold text-slate-500 mb-8 leading-tight">Head, Dept. of ECT</p>
                        
                        <div className="space-y-6 max-w-xl">
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Successfully functioning since 1988, the department offers B.Tech and M.Tech programs with excellent infrastructure and modern equipped laboratories focused on telecommunication, IT industries, and healthcare equipments.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="mailto:jondhale_kc@mgmcen.ac.in" className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg group">
                                    <Mail className="w-5 h-5" />
                                    <span>jondhale_kc@mgmcen.ac.in</span>
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
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors italic leading-relaxed">
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
                    <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Electronics & Telecommunication | MGM COEN</p>
                    <div className="flex gap-2">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <div className="w-20 h-1 bg-slate-200 rounded-full" />
                        <div className="w-5 h-1 bg-slate-100 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ElectronicsTelecommPage;
