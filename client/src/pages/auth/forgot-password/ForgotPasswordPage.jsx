import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = useState(false);

    // 3D Tilt Logic
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    // Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            ref={cardRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-[460px] relative z-20"
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-brand-accent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative glass-panel bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12 rounded-[2.5rem] overflow-hidden">
                    
                    {!submitted ? (
                        <>
                            <motion.div variants={itemVariants} className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-brand-accent shadow-lg mb-6">
                                    <KeyRound className="text-white w-8 h-8" />
                                </div>
                                <h1 className="text-3xl font-black text-[#07090F] mb-3 font-['Syne',sans-serif]">Reset Access</h1>
                                <p className="text-gray-500 font-medium text-sm px-4">
                                    Lost your key? No worries. Enter your email and we'll bridge the gap.
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                                            placeholder="name@erpsaa.edu"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <button type="submit" className="w-full group relative flex items-center justify-center py-4 px-6 bg-[#07090F] text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:bg-primary-600 active:scale-[0.98]">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Recover Account <Sparkles className="w-4 h-4" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </button>
                                </motion.div>
                            </form>
                        </>
                    ) : (
                        <motion.div variants={itemVariants} className="text-center py-10">
                            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 border border-emerald-100 ring-4 ring-emerald-50/50">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Transmission Sent</h2>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                We've dispatched recovery instructions to your institutional email. Please check your inbox.
                            </p>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="mt-8 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Secure Login
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordPage;
