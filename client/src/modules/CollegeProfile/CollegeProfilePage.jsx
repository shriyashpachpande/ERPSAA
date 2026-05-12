import { motion } from 'framer-motion';
import { BookOpen, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BackgroundSpheres = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                animate={{
                    x: [0, 150, -100, 0],
                    y: [0, 200, 400, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#4466FF]/30 to-[#4466FF]/5 blur-[60px]"
            />
            <motion.div
                animate={{
                    x: [0, -200, 150, 0],
                    y: [0, 300, -150, 0],
                    scale: [1, 0.7, 1.2, 1],
                }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#9966FF]/25 to-[#9966FF]/5 blur-[80px]"
            />
            <motion.div
                animate={{
                    x: [0, 200, -150, 0],
                    y: [0, -150, 300, 0],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] left-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#00FF99]/25 to-[#00FF99]/5 blur-[50px]"
            />
        </div>
    );
};

const departments = [
    { id: '01', name: 'Applied Science & Humanities', faculty: '24 Members', strength: '600+ Students', icon: BookOpen },
    { id: '02', name: 'Civil Engineering', faculty: '32 Members', strength: '450+ Students', icon: GraduationCap },
    { id: '03', name: 'Computer Science & Engineering', faculty: '45 Members', strength: '1200+ Students', icon: Users },
    { id: '04', name: 'Electronics & Telecommunication Engineering', faculty: '38 Members', strength: '800+ Students', icon: GraduationCap },
    { id: '05', name: 'Information Technology', faculty: '40 Members', strength: '900+ Students', icon: BookOpen },
    { id: '06', name: 'Mechanical Engineering', faculty: '35 Members', strength: '750+ Students', icon: GraduationCap },
    { id: '07', name: 'Training and Placement Cell', faculty: '12 Members', strength: 'Corporate Relations', icon: Users },
];

const CollegeProfilePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-['Inter',sans-serif]">
            <BackgroundSpheres />

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        BACK TO HOME
                    </Link>
                    <h1 className="text-[clamp(32px,5vw,64px)] font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
                        ACADEMIC <br /> <span className="text-primary-600">ARCHITECTURE.</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                        Explore our world-class departments and faculty infrastructure. Built for MGM's College of Engineering (COEN).
                    </p>
                </motion.div>

                {/* Stylish Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/50">
                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">ID</th>
                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Department Name</th>
                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Faculty Base</th>
                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Strength</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept, index) => {
                                    const isAppliedScience = dept.name === 'Applied Science & Humanities';
                                    const isCivil = dept.name === 'Civil Engineering';
                                    return (
                                        <motion.tr
                                            key={dept.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                                            className={`group hover:bg-white transition-all duration-300 cursor-pointer ${isAppliedScience || isCivil || dept.name === 'Computer Science & Engineering' ? 'relative' : ''}`}
                                            onClick={() => {
                                                if (isAppliedScience) {
                                                    navigate('/collegeprofile/applied-science');
                                                } else if (isCivil) {
                                                    navigate('/collegeprofile/civil');
                                                } else if (dept.name === 'Computer Science & Engineering') {
                                                    navigate('/collegeprofile/cse');
                                                } else if (dept.name === 'Electronics & Telecommunication Engineering') {
                                                    navigate('/collegeprofile/ect');
                                                } else if (dept.name === 'Information Technology') {
                                                    navigate('/collegeprofile/it');
                                                } else if (dept.name === 'Mechanical Engineering') {
                                                    navigate('/collegeprofile/mechanical');
                                                } else if (dept.name === 'Training and Placement Cell') {
                                                    navigate('/collegeprofile/training-placement');
                                                }
                                            }}
                                        >
                                            <td className="px-10 py-8 text-sm font-black text-slate-300 group-hover:text-primary-600 transition-colors">
                                                {dept.id}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-500">
                                                        <dept.icon className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors duration-500" />
                                                    </div>
                                                    <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                                                        {dept.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-[11px] font-black text-slate-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                                    {dept.faculty}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                                                        {dept.strength}
                                                    </span>
                                                    {isAppliedScience && (
                                                        <ArrowLeft className="w-4 h-4 text-primary-600 opacity-0 group-hover:opacity-100 rotate-180 transition-all" />
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Footer Decor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-20 flex justify-between items-center border-t border-slate-200 pt-10"
                >
                    <p className="text-xs font-black text-slate-400 tracking-widest uppercase">MGM COEN | Academic Directory 2026</p>
                    <div className="flex gap-2">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <div className="w-20 h-1 bg-slate-200 rounded-full" />
                    </div>
                </motion.div>
            </div>

            <style>{`
                table tr:last-child { border-bottom: none; }
                @font-face {
                    font-family: 'Syne';
                    src: url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
                }
            `}</style>
        </div>
    );
};

export default CollegeProfilePage;
