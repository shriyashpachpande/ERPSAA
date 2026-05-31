import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, X, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OTPVerificationModal = ({ isOpen, onClose, phone, onVerified, mode = 'registration' }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (isOpen && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setTimer(60);
        }
    }

    // Focus when modal opens
    useEffect(() => {
        let timeoutId;
        if (isOpen) {
            timeoutId = setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 150);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isOpen]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = […otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if filled
        if (value && index < 5) {
            if (inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            toast.error('Please enter 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const endpoint = mode === 'registration' 
                ? '/api/auth/register/verify' 
                : '/api/auth/verify-reset-otp';
                
            const res = await axios.post(endpoint, { phone, otp: otpValue });
            
            if (res.data.success) {
                toast.success('Verification successful!');
                onVerified(res.data);
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-gray-100"
                >
                    <button type="button" 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="p-10 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-500 shadow-inner">
                            <ShieldCheck className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">WhatsApp OTP</h2>
                        <p className="text-gray-500 font-medium mb-8">
                            We've sent a verification code to <span className="font-bold text-gray-900">{phone}</span>. Please enter it below.
                        </p>

                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => inputRefs.current[idx] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    className="w-12 h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-xl font-black text-gray-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
                                />
                            ))}
                        </div>

                        <button type="button"
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Verify OTP <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>

                        <div className="mt-8">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Didn't receive it? {timer > 0 ? (
                                    <span className="text-gray-900 ml-2">{timer}s</span>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            toast.success('New OTP requested!');
                                            setTimer(60);
                                        }} 
                                        className="text-emerald-500 ml-2 hover:underline cursor-pointer"
                                    >
                                        Resend
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OTPVerificationModal;
