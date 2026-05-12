import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, X, Info, Check, ChevronDown, Sparkles, Zap, ShieldAlert, Target, BookOpen, User, Building, Heart, Laptop, Shield, Book as BookIcon, MessageSquarePlus, LayoutGrid } from 'lucide-react';
import { COMPLAINT_CATEGORY_UI } from '../../../constants/complaint-management/complaintCategoryUiConstants';
import gsap from 'gsap';

// 3D NEXT-LEVEL CUSTOM SELECT COMPONENT
const EliteSelect = ({ label, options, value, onChange, icon: MainIcon, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(dropdownRef.current, 
                { 
                    opacity: 0, 
                    y: -20, 
                    rotateX: -45, 
                    scale: 0.8,
                    transformOrigin: "top center"
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    scale: 1, 
                    duration: 0.6, 
                    ease: "elastic.out(1, 0.75)" 
                }
            );
        }
    }, [isOpen]);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative space-y-3 group/select">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 group-hover/select:text-blue-500 transition-colors">
                {label}
            </label>
            
            {/* Trigger */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-6 py-5 rounded-[2rem] border-2 cursor-pointer flex items-center justify-between transition-all duration-500 group shadow-[0px_0px_10px_2px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.4)] ${
                    isOpen ? 'bg-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]' : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                }`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-500 ${isOpen ? 'bg-blue-500 text-white rotate-12 scale-110' : 'bg-white text-slate-400 shadow-sm'}`}>
                        {MainIcon ? <MainIcon size={20} /> : <Target size={20} />}
                    </div>
                    <span className={`font-black tracking-tight ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                        {selectedOption.label}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:translate-y-1'}`} />
            </div>

            {/* Elite 3D Dropdown */}
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute z-[100] top-full left-0 w-full mt-4 bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-[0_30px_100px_rgba(0,0,0,0.15),0_0_40px_rgba(59,130,246,0.1)] p-4 overflow-hidden perspective-1000"
                >
                    <div className="grid grid-cols-1 gap-2">
                        {options.map((opt, idx) => (
                            <div 
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 group/opt ${
                                    value === opt.value 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-200 translate-x-2' 
                                        : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600 hover:translate-x-2'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    {opt.icon && <opt.icon className={`w-5 h-5 transition-transform duration-500 group-hover/opt:rotate-12 ${value === opt.value ? 'text-white' : 'text-slate-400'}`} />}
                                    <span className="font-black text-sm tracking-tight uppercase">{opt.label}</span>
                                </div>
                                {value === opt.value && <Check size={18} className="text-white" strokeWidth={3} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ComplaintForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'academic',
        priority: 'medium',
        isAnonymous: false
    });
    const [evidence, setEvidence] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEvidence(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeFile = () => {
        setEvidence(null);
        setPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (evidence) data.append('evidence', evidence);
        onSubmit(data);
    };

    const inputClasses = "w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:bg-white focus:border-blue-500 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.1)] focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all outline-none font-black text-slate-800 placeholder:text-slate-400/50 tracking-tight";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 ml-2";

    const categoryOptions = Object.entries(COMPLAINT_CATEGORY_UI).map(([key, { label }]) => ({
        value: key,
        label: label,
        icon: key === 'academic' ? BookOpen : 
              key === 'hostel' ? Building : 
              key === 'fees' ? IndianRupee : 
              key === 'library' ? BookIcon :
              key === 'facilities' ? Zap : Laptop
    }));

    const priorityOptions = [
        { value: 'low', label: 'Standard / Routine', icon: Shield },
        { value: 'medium', label: 'Elevated Attention', icon: Target },
        { value: 'high', label: 'Strict / High Priority', icon: ShieldAlert },
        { value: 'urgent', label: 'Critical / Emergency', icon: Zap }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Subject Section */}
            <div className="space-y-2 stagger-item">
                <label className={labelClasses}>Primary Subject Assessment</label>
                <div className="relative group">
                    <input
                        type="text"
                        name="title"
                        required
                        className={inputClasses}
                        placeholder="Define the critical concern..."
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        <MessageSquarePlus size={22} />
                    </div>
                </div>
            </div>

            {/* Elite 3D Selects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 stagger-item">
                <EliteSelect 
                    label="Resource Category"
                    name="category"
                    value={formData.category}
                    options={categoryOptions}
                    onChange={handleChange}
                    icon={LayoutGrid}
                />
                <EliteSelect 
                    label="Priority Classification"
                    name="priority"
                    value={formData.priority}
                    options={priorityOptions}
                    onChange={handleChange}
                    icon={Zap}
                />
            </div>

            {/* Description Section */}
            <div className="space-y-2 stagger-item">
                <label className={labelClasses}>Operational Narrative</label>
                <textarea
                    name="description"
                    required
                    rows="6"
                    className={`${inputClasses} resize-none pt-6 leading-relaxed`}
                    placeholder="Elaborate on the specific details and desired resolution..."
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            {/* Evidence & Identity Grid */}
            <div className="pt-10 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-12 stagger-item">
                <div className="space-y-4">
                    <label className={labelClasses}>Visual Verification</label>
                    <div className="relative min-h-[200px] rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all group overflow-hidden bg-slate-50/50 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.1)]">
                        {preview ? (
                            <div className="absolute inset-0 p-4 flex items-center justify-center bg-white">
                                <img src={preview} alt="Evidence preview" className="h-full object-contain rounded-[2rem] shadow-2xl shadow-blue-100" />
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="absolute top-6 right-6 p-4 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 shadow-xl shadow-rose-200 transform hover:scale-110 active:scale-90 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center p-8 text-center">
                                <div className="p-5 bg-white rounded-2xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-all mb-4 text-blue-500">
                                    <Upload size={32} />
                                </div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Append Media</p>
                                <p className="text-[10px] text-slate-400 mt-2 font-black tracking-widest">DRAG OR INTERACT TO BROWSE</p>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className={labelClasses}>Privacy Protocol</label>
                    <div 
                        onClick={() => handleChange({ target: { name: 'isAnonymous', type: 'checkbox', checked: !formData.isAnonymous } })}
                        className={`p-8 rounded-[3rem] border-2 cursor-pointer transition-all duration-500 flex items-center gap-6 group/toggle shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] ${
                            formData.isAnonymous 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:shadow-[0_0_20px_0px_rgba(139,92,246,0.4)]'
                        }`}
                    >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                            formData.isAnonymous 
                                ? 'bg-blue-600 border-blue-500 text-white rotate-[360deg]' 
                                : 'bg-slate-50 border-slate-200'
                        }`}>
                            {formData.isAnonymous ? <Shield size={24} /> : <User size={24} className="text-slate-300" />}
                        </div>
                        <div className="flex-1">
                            <span className="text-lg font-black block mb-1 tracking-tight">Encryption Mode</span>
                            <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                formData.isAnonymous ? 'text-blue-400' : 'text-slate-400'
                            }`}>
                                {formData.isAnonymous ? 'Identity Redacted' : 'Standard Submission'}
                            </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.isAnonymous ? 'bg-blue-500 border-blue-500' : 'border-slate-200'}`}>
                            {formData.isAnonymous && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                         <p className="text-xs text-blue-600 font-bold leading-relaxed">
                            <Info className="w-4 h-4 inline-block mr-2 mb-1" />
                            Anonymous tickets are routed through our secure encryption layer to ensure complete student confidentiality.
                         </p>
                    </div>
                </div>
            </div>

            {/* Ultimate Action Button */}
            <div className="pt-12 stagger-item">
                <button
                    type="submit"
                    disabled={loading}
                    className="group w-full py-7 bg-slate-900 text-white font-black text-xl rounded-[2.5rem] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-6 transition-all duration-500 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_0px_rgba(139,92,246,0.5)] active:scale-[0.97] relative overflow-hidden"
                >
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <span className="relative z-10 flex items-center gap-4">
                                <Zap size={24} className="group-hover:rotate-12 transition-transform duration-500" />
                                EXECUTE RESOLUTION TICKET
                            </span>
                        </>
                    )}
                </button>
                <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="h-px w-8 bg-slate-200" />
                    <p className="text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black">
                        SECURE NODE CONNECTION VERIFIED
                    </p>
                    <div className="h-px w-8 bg-slate-200" />
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </form>
    );
};

// Re-defining icons used inside select
const IndianRupee = ({ size, className }) => (
    <span className={className} style={{ fontSize: size }}>₹</span>
);

export default ComplaintForm;
