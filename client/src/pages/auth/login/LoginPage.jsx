import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../utils/axiosInstance';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate(['academic_admin', 'hod', 'faculty'].includes(res.data.user.role) ? '/app/academic/dashboard' : '/app');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication Failed.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="login-container" style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F0F2F5',
            padding: '20px',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="main-card"
                style={{
                    width: '100%',
                    maxWidth: '1000px',
                    minHeight: '550px',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'glowCycle 10s infinite linear'
                }}
            >
                {/* Diagonal Black Section */}
                <div className="diagonal-bg" style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    background: '#110752ff',
                    clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 45% 100%)',
                    zIndex: 1
                }} />

                {/* Left Side: Form Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="left-section"
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px',
                        position: 'relative',
                        zIndex: 2,
                        background: 'white',
                        maxWidth: '55%'
                    }}
                >
                    <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            <motion.h1
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    fontSize: '48px',
                                    fontWeight: '900',
                                    color: '#000000',
                                    margin: '0',
                                    letterSpacing: '-2px',
                                    cursor: 'pointer'
                                }}
                            >
                                ERPSAA
                            </motion.h1>
                        </Link>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '50px' }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            style={{ height: '6px', background: '#000000', marginTop: '4px' }}
                        />
                    </motion.div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <motion.div variants={itemVariants} className="input-group">
                            <label style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px' }}>Username</label>
                            <div className="input-wrapper" style={{ position: 'relative', borderBottom: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '16px',
                                        color: '#000000',
                                        background: 'transparent'
                                    }}
                                />
                                <User size={18} color="#94A3B8" />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="input-group">
                            <label style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px' }}>Password</label>
                            <div className="input-wrapper" style={{ position: 'relative', borderBottom: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '16px',
                                        color: '#000000',
                                        background: 'transparent'
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
                                    >
                                        {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                                    </button>
                                    <Lock size={18} color="#94A3B8" />
                                </div>
                            </div>
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ color: '#EF4444', fontSize: '12px', fontWeight: '600', margin: '0' }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#000000',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '16px',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background-color 0.2s, transform 0.2s'
                            }}
                        >
                            {loading ? <Loader2 size={18} className="spinner" /> : <>Login <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants}>
                        <Link
                            to="/forgot-password"
                            style={{
                                marginTop: '30px',
                                fontSize: '11px',
                                fontWeight: '700',
                                color: '#94A3B8',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                textDecoration: 'none',
                                display: 'block',
                                width: 'fit-content'
                            }}
                        >
                            <motion.span whileHover={{ color: '#000000' }}>
                                Lost Access? <span style={{ color: '#000000', borderBottom: '1px solid #000' }}>Reset Protocol</span>
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Side: Welcome Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="right-section"
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        padding: '80px',
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'right'
                    }}
                >
                    {/* Ambient Glow Background */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                            background: [
                                'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                                'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
                                'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
                                'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                                'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)'
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '0',
                            transform: 'translate(20%, -50%)',
                            width: '500px',
                            height: '500px',
                            filter: 'blur(80px)',
                            zIndex: -1,
                            borderRadius: '50%'
                        }}
                    />

                    <motion.h2
                        variants={itemVariants}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                        style={{
                            fontSize: '60px',
                            fontWeight: '900',
                            lineHeight: '0.9',
                            margin: '0',
                            letterSpacing: '-3px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            {"WELCOME".split("").map((letter, i) => (
                                <motion.span
                                    key={i}
                                    animate={{
                                        color: ['#FFFFFF', '#60A5FA', '#F472B6', '#8B5CF6', '#FFFFFF'],
                                        textShadow: [
                                            '0 0 20px rgba(255,255,255,0.2)',
                                            '0 0 30px rgba(96, 165, 250, 0.4)',
                                            '0 0 30px rgba(244, 114, 182, 0.4)',
                                            '0 0 30px rgba(139, 92, 246, 0.4)',
                                            '0 0 20px rgba(255,255,255,0.2)'
                                        ]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "linear"
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>
                        <div style={{ display: 'flex' }}>
                            {"BACK!".split("").map((letter, i) => (
                                <motion.span
                                    key={i}
                                    animate={{
                                        color: ['#FFFFFF', '#60A5FA', '#F472B6', '#8B5CF6', '#FFFFFF'],
                                        textShadow: [
                                            '0 0 20px rgba(255,255,255,0.2)',
                                            '0 0 30px rgba(96, 165, 250, 0.4)',
                                            '0 0 30px rgba(244, 114, 182, 0.4)',
                                            '0 0 30px rgba(139, 92, 246, 0.4)',
                                            '0 0 20px rgba(255,255,255,0.2)'
                                        ]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: (i + 7) * 0.1,
                                        ease: "linear"
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        style={{
                            marginTop: '20px',
                            fontSize: '14px',
                            color: '#94A3B8',
                            maxWidth: '280px',
                            lineHeight: '1.6'
                        }}
                    >
                        Access the most advanced campus management ecosystem. Built for MGM's COEN.
                    </motion.p>
                    <motion.div variants={itemVariants} style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '40px' }}
                            transition={{ delay: 1, duration: 0.8 }}
                            style={{ height: '6px', background: 'rgba(228, 9, 9, 1)', borderRadius: '10px' }}
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '80px' }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            style={{ height: '6px', background: '#FFFFFF', borderRadius: '10px' }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            <style>{`
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes glowCycle {
                    0%   { box-shadow: 0 0 40px 0px rgba(59, 130, 246, 0.3); }
                    20%  { box-shadow: 0 0 40px 0px rgba(239, 68, 68, 0.3); }
                    40%  { box-shadow: 0 0 40px 0px rgba(16, 185, 129, 0.3); }
                    60%  { box-shadow: 0 0 40px 0px rgba(139, 92, 246, 0.3); }
                    80%  { box-shadow: 0 0 40px 0px rgba(245, 158, 11, 0.3); }
                    100% { box-shadow: 0 0 40px 0px rgba(59, 130, 246, 0.3); }
                }

                .input-wrapper:focus-within {
                    border-bottom-color: #000000 !important;
                }
                
                .input-wrapper:hover {
                    border-bottom-color: #94A3B8;
                }

                /* Responsiveness */
                @media (max-width: 900px) {
                    .main-card {
                        flex-direction: column !important;
                        height: auto !important;
                        max-width: 500px !important;
                    }
                    .left-section {
                        max-width: 100% !important;
                        padding: 40px !important;
                    }
                    .right-section {
                        padding: 40px !important;
                        align-items: center !important;
                        text-align: center !important;
                        background: #110752ff !important;
                    }
                    .diagonal-bg {
                        display: none;
                    }
                    .right-section h2 {
                        font-size: 40px !important;
                    }
                    .right-section p {
                        max-width: 100% !important;
                    }
                    .right-section div {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .left-section {
                        padding: 30px 20px !important;
                    }
                    .left-section h1 {
                        font-size: 36px !important;
                    }
                }

                /* Autofill Fix */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px white inset !important;
                    -webkit-text-fill-color: #000000 !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
