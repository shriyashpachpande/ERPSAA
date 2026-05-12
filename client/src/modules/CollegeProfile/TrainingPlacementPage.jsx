import { motion } from 'framer-motion';
import { Mail, GraduationCap, ArrowLeft, Users, UserCheck, X, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

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
    { name: 'Mr. Shivprasad Titare', role: 'Asst. Professor and TPO', specialization: 'Training & Placement Officer', email: 'tpo@mgmcen.ac.in', image: '/collegeprofile/Mr. Shivprasad Titare.jpg' },
];

const TrainingPlacementPage = () => {
    const [selectedFaculty, setSelectedFaculty] = useState(null);

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
                        TRAINING & <br /> <span className="text-primary-600">PLACEMENT CELL.</span>
                    </h1>
                </motion.div>

                {/* TPO Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-12 items-center mb-24 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-primary-600/10" />

                    {/* TPO Image */}
                    <div className="relative shrink-0">
                        <div className="w-64 h-80 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-10">
                            <img
                                src="/collegeprofile/Mr. Shivprasad Titare.jpg"
                                alt="TPO"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-xl z-20">
                            <Briefcase className="w-10 h-10" />
                        </div>
                    </div>

                    {/* TPO Text Details */}
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-600 text-xs font-black uppercase tracking-widest mb-6">
                            Officer In-Charge
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">Mr. Shivprasad Titare</h2>
                        <p className="text-xl font-bold text-slate-500 mb-8 leading-tight">Asst. Professor and TPO</p>

                        <div className="space-y-6 max-w-xl">
                            <p className="text-slate-600 leading-relaxed font-medium">
                                The Training & Placement Cell plays a pivotal role in shaping students' futures by building strong partnerships with industries, alumni, and faculty to ensure desired employment outcomes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="mailto:tpo@mgmcen.ac.in" className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg group">
                                    <Mail className="w-5 h-5" />
                                    <span>tpo@mgmcen.ac.in</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Placement Objectives Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-8 mb-24"
                >
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-600/40 transition-colors" />
                        <h3 className="text-2xl font-black mb-6 italic">Strategic Objectives.</h3>
                        <ul className="space-y-4">
                            {[
                                "Building strong industry-academia partnerships.",
                                "Individual counseling for career growth.",
                                "Organizing group discussions and mock interviews.",
                                "Centralized placement for equal opportunities."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start text-slate-400 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-center">
                        <h3 className="text-2xl font-black text-slate-900 mb-6 italic">Career Excellence.</h3>
                        <p className="text-slate-500 leading-relaxed font-medium mb-8">
                            We follow a centralized placement activity which gives each branch equal opportunity to grow for sustained excellence in career through rigorous training and placement support.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                            </div>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pt-3">
                                Supported by 100+ Alumni
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Faculty/Staff Directory */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h3 className="text-sm font-black text-primary-600 tracking-[0.2em] uppercase mb-4">Core Team</h3>
                            <h4 className="text-4xl font-black text-slate-900 tracking-tight">Placement <span className="text-slate-400">Leadership.</span></h4>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/50 bg-white/30">
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Officer</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Responsibility</th>
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
                                            onClick={() => setSelectedFaculty(faculty)}
                                            className="group hover:bg-white transition-all duration-300 border-b border-slate-100 last:border-0 cursor-pointer"
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
                    <p className="text-xs font-black text-slate-400 tracking-widest uppercase">Training & Placement | MGM COEN</p>
                    <div className="flex gap-2">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <div className="w-20 h-1 bg-slate-200 rounded-full" />
                        <div className="w-5 h-1 bg-slate-100 rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Faculty Detail Modal */}
            <AnimatePresence>
                {selectedFaculty && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
                        onClick={() => setSelectedFaculty(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[3rem] overflow-hidden shadow-3xl max-w-4xl w-full flex flex-col md:flex-row relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedFaculty(null)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 h-96 md:h-auto relative overflow-hidden bg-slate-50">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    src={selectedFaculty.image}
                                    alt={selectedFaculty.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://ui-avatars.com/api/?name=" + selectedFaculty.name + "&background=f1f5f9&color=64748b&size=1024";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent md:hidden" />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-8 self-start">
                                    {selectedFaculty.role}
                                </span>
                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 italic">
                                    {selectedFaculty.name}
                                </h3>
                                <div className="space-y-6 mb-12">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Primary Responsibility</h4>
                                        <p className="text-xl font-bold text-slate-600 leading-relaxed italic">
                                            {selectedFaculty.specialization}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Cell</h4>
                                        <p className="text-lg font-bold text-slate-400">Training and Placement</p>
                                    </div>
                                </div>

                                <a
                                    href={`mailto:${selectedFaculty.email}`}
                                    className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-3xl font-black hover:bg-primary-600 transition-all shadow-2xl group"
                                >
                                    <Mail className="w-6 h-6" />
                                    <span className="tracking-widest uppercase text-sm">Contact Officer</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrainingPlacementPage;
