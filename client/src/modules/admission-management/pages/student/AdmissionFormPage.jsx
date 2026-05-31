import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Save, Send, ChevronRight, ChevronLeft, Loader2, CheckCircle,
    AlertCircle, Upload, X, Lock, User, MapPin, GraduationCap,
    BookOpen, Users, FileText, Info, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileUrl } from '../../../../utils/fileUrlResolver';
import { useDepartments } from '../../../academic/hooks/useDepartments';



// ── Resolve stored photoUrl/filePath to a fully-qualified URL ─────────────────
// resolveUrl is now handled by the centralized getFileUrl
const resolveUrl = (urlOrPath) => getFileUrl(urlOrPath);

const Select = ({ label, value, onChange, options, placeholder = 'Select', icon: Icon }) => (
    <div className="group">
        <label className="block text-sm font-bold text-gray-700 mb-2 transition-colors group-focus-within:text-primary-600 flex items-center gap-2">
            {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all font-semibold text-gray-900 appearance-none shadow-sm"
            >
                <option value="">{placeholder}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
        </div>
    </div>
);

// ── Get login email from stored user object (set at login time) ──────────────
// The JWT only stores `id`, so we read from the `user` key written by the auth flow.
const getLoginEmail = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return '';
        return JSON.parse(userStr)?.email || '';
    } catch {
        return '';
    }
};

const DOC_LABELS = {
    tenthMarksheet: '10th Marksheet',
    twelfthMarksheet: '12th Marksheet',
    transferCertificate: 'Transfer Certificate',
    migrationCertificate: 'Migration Certificate',
    casteCertificate: 'Caste Certificate',
    incomeCertificate: 'Income Certificate',
    passportPhoto: 'Passport Photo',
    idProof: 'ID Proof',
    domicileCertificate: 'Domicile Certificate',
    entranceScorecard: 'Entrance Scorecard',
    disabilityCertificate: 'Disability Certificate',
};

// ── Dropdown options ──────────────────────────────────────────────────────────
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const NATIONALITY_OPTIONS = ['Indian', 'Other'];
const CATEGORY_OPTIONS = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const RELIGION_OPTIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];

const TENTH_BOARD_OPTIONS = ['CBSE', 'ICSE', 'State Board', 'NIOS', 'Other'];
const TWELFTH_BOARD_OPTIONS = ['CBSE', 'ICSE', 'State Board', 'NIOS', 'Diploma Board', 'Other'];
const ENTRANCE_EXAM_OPTIONS = ['JEE Main', 'JEE Advanced', 'MHT-CET', 'NEET', 'CUET', 'Polytechnic Entrance', 'Other'];

const PROGRAM_TYPE_OPTIONS = ['Undergraduate', 'Postgraduate', 'Diploma', 'PhD'];
const COURSE_OPTIONS = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA', 'BCom', 'BA', 'Diploma'];
const SPECIALIZATION_OPTIONS = [
    'CSE', 'AI & DS', 'IT', 'ECE', 'EE', 'ME', 'CE',
    'Cyber Security', 'Data Science', 'General'
];
const ADMISSION_TYPE_OPTIONS = ['Regular', 'Management Quota', 'Lateral Entry', 'Transfer', 'Scholarship'];
const CATEGORY_QUOTA_OPTIONS = ['Open', 'OBC', 'SC', 'ST', 'EWS', 'PwD', 'Minority'];

const STEPS = [
    { id: 1, label: 'Personal Details', sec: 'A', icon: User, desc: 'Your identity' },
    { id: 2, label: 'Address Info', sec: 'B', icon: MapPin, desc: 'Where you live' },
    { id: 3, label: 'Academic Record', sec: 'C', icon: GraduationCap, desc: 'Past education' },
    { id: 4, label: 'Course Selection', sec: 'D', icon: BookOpen, desc: 'Future goals' },
    { id: 5, label: 'Guardian Details', sec: 'E', icon: Users, desc: 'Emergency contacts' },
    { id: 6, label: 'Documents', sec: 'F', icon: FileText, desc: 'Verification' }
];

// ── Dynamic year range (2015 → current) ──────────────────────────────────────
const PASSING_YEARS = Array.from(
    { length: new Date().getFullYear() - 2014 },
    (_, i) => String(2015 + i)
);

const AdmissionFormPage = () => {
    const { departments } = useDepartments();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [appStatus, setAppStatus] = useState('draft');

    const [savedDocs, setSavedDocs] = useState({});
    const [savedProfilePhotoUrl, setSavedProfilePhotoUrl] = useState('');
    const [pendingFiles, setPendingFiles] = useState({});
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

    // Derive locked email from login-time user record in localStorage
    const lockedEmail = getLoginEmail();

    const [formData, setFormData] = useState({
        personalDetails: {
            fullName: '', fatherName: '', motherName: '',
            gender: '', dateOfBirth: '', bloodGroup: '',
            nationality: '', category: '', religion: '',
            mobileNumber: '', alternateMobile: '',
            email: lockedEmail,  // Pre-fill from JWT
            aadhaarId: ''
        },
        addressDetails: {
            current: { addressLine1: '', addressLine2: '', city: '', district: '', state: '', pincode: '' },
            permanentSameAsCurrent: false,
            permanent: { addressLine1: '', addressLine2: '', city: '', district: '', state: '', pincode: '' }
        },
        academicDetails: {
            tenthBoard: '', tenthSchool: '', tenthPassingYear: '', tenthScore: '',
            twelfthBoard: '', twelfthCollege: '', twelfthPassingYear: '', twelfthScore: '',
            entranceExamName: '', entranceScore: '', rank: '',
            previousCollege: '', transferCertificateNumber: ''
        },
        courseSelection: {
            programType: '', department: '', course: '', specialization: '',
            admissionType: '', categoryQuota: '', preferredHostel: false, scholarshipApplied: false
        },
        guardianDetails: {
            guardianName: '', guardianRelation: '', guardianPhone: '', guardianOccupation: '',
            emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: ''
        },
    });

    const token = localStorage.getItem('token');

    useEffect(() => { fetchDraft(); }, []);

    const fetchDraft = async () => {
        try {
            const res = await axios.get('/api/admissions/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                const app = res.data.data;
                const { profilePhotoUrl: _photoUrl, ...personalDetailsForForm } = app.personalDetails || {};

                // Always override email from JWT — never from stored draft — to keep it locked
                setFormData(prev => ({
                    ...prev,
                    personalDetails: {
                        ...prev.personalDetails,
                        ...personalDetailsForForm,
                        dateOfBirth: personalDetailsForForm?.dateOfBirth?.split('T')[0] || '',
                        email: lockedEmail || personalDetailsForForm?.email || prev.personalDetails.email,
                    },
                    addressDetails: {
                        ...prev.addressDetails,
                        ...(app.addressDetails || {}),
                        current: { ...prev.addressDetails.current, ...(app.addressDetails?.current || {}) },
                        permanent: { ...prev.addressDetails.permanent, ...(app.addressDetails?.permanent || {}) }
                    },
                    academicDetails: { ...prev.academicDetails, ...(app.academicDetails || {}) },
                    courseSelection: { ...prev.courseSelection, ...(app.courseSelection || {}) },
                    guardianDetails: { ...prev.guardianDetails, ...(app.guardianDetails || {}) },
                }));
                setSavedDocs(app.uploadedDocuments || {});
                setSavedProfilePhotoUrl(app.personalDetails?.profilePhotoUrl || '');
                setAppStatus(app.applicationStatus);
            }
        } catch (err) {
            console.log('No draft found or error fetching:', err.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const buildFormData = () => {
        const fd = new FormData();
        // Ensure email in personalDetails is always the locked login email
        const personalToSend = { ...formData.personalDetails, email: lockedEmail || formData.personalDetails.email };
        fd.append('personalDetails', JSON.stringify(personalToSend));
        fd.append('addressDetails', JSON.stringify(formData.addressDetails));
        fd.append('academicDetails', JSON.stringify(formData.academicDetails));
        fd.append('courseSelection', JSON.stringify(formData.courseSelection));
        fd.append('guardianDetails', JSON.stringify(formData.guardianDetails));
        if (profilePhotoFile) fd.append('profilePhoto', profilePhotoFile);
        Object.entries(pendingFiles).forEach(([fieldName, file]) => fd.append(fieldName, file));
        return fd;
    };

    const handleSaveDraft = async () => {
        setSaving(true); setError(null); setSuccessMsg('');
        try {
            const fd = buildFormData();
            const res = await axios.post('/api/admissions', fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setSavedDocs(res.data.data.uploadedDocuments || {});
                setSavedProfilePhotoUrl(res.data.data.personalDetails?.profilePhotoUrl || '');
                setPendingFiles({});
                setProfilePhotoFile(null);
                setSuccessMsg('Draft saved successfully at ' + new Date().toLocaleTimeString());
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save draft');
        } finally { setSaving(false); }
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit? You won't be able to edit the application after submission unless requested by the staff.")) return;
        setSubmitting(true); setError(null);
        try {
            const fd = buildFormData();
            // 1. First save latest data as draft
            await axios.post('/api/admissions', fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            // 2. Then trigger final submission
            const res = await axios.post('/api/admissions/submit', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setAppStatus('submitted');
                setSuccessMsg('Application submitted successfully!');
                setPendingFiles({});
                setProfilePhotoFile(null);
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error('Submission Error:', err);
            setError(err.response?.data?.error || 'Failed to submit application. Please ensure all required fields are filled.');
        } finally { setSubmitting(false); }
    };

    const handleNestedChange = (section, field, value, subSection = null) => {
        setFormData(prev => {
            let newData = { ...prev };
            if (subSection) {
                newData[section] = { ...newData[section], [subSection]: { ...newData[section][subSection], [field]: value } };
            } else {
                newData[section] = { ...newData[section], [field]: value };
            }
            if (section === 'addressDetails') {
                if (field === 'permanentSameAsCurrent' && value === true) {
                    newData.addressDetails.permanent = { ...newData.addressDetails.current };
                } else if (newData.addressDetails.permanentSameAsCurrent && subSection === 'current') {
                    newData.addressDetails.permanent = { ...newData.addressDetails.current };
                }
            }
            return newData;
        });
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfilePhotoFile(file);
        setProfilePhotoPreview(URL.createObjectURL(file));
    };

    const handleDocFileChange = (docKey, e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingFiles(prev => ({ ...prev, [docKey]: file }));
    };

    const clearPendingDoc = (docKey) => {
        setPendingFiles(prev => { const n = { ...prev }; delete n[docKey]; return n; });
    };

    // Calculate progress (crude estimation)
    const calculateProgress = () => {
        let totalFields = 20; // roughly
        let filledFields = 0;
        if (formData.personalDetails.fullName) filledFields++;
        if (formData.personalDetails.dateOfBirth) filledFields++;
        if (formData.personalDetails.mobileNumber) filledFields++;
        if (formData.addressDetails.current.addressLine1) filledFields++;
        if (formData.academicDetails.tenthScore) filledFields++;
        if (formData.courseSelection.course) filledFields++;
        // ... more checks if needed
        const uploadedCount = Object.keys(savedDocs).length;
        filledFields += uploadedCount;
        totalFields += 11; // docs count
        return Math.min(Math.round((filledFields / totalFields) * 100), 100);
    };

    const progress = calculateProgress();

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[500px]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

    const isReadOnly = !['draft', 'reupload_requested'].includes(appStatus);
    const displayProfilePhoto = profilePhotoPreview || resolveUrl(savedProfilePhotoUrl);


    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admission Form</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Academic Session 2024-25 • Portal Active
                        </p>
                    </div>

                    <div className="flex-1 max-w-sm hidden lg:block px-8">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            <span>Form Completion</span>
                            <span className="text-primary-600">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-primary-600 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isReadOnly && (
                            <>
                                <button type="button" onClick={handleSaveDraft} disabled={saving} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold transition-all shadow-sm flex items-center gap-2">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Draft
                                </button>
                                <button type="button" onClick={handleSubmit} disabled={submitting || saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Final Submit
                                </button>
                            </>
                        )}
                        <div className="px-4 py-2.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-900/10">
                            {appStatus.replace(/_/g, ' ')}
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                    </motion.div>
                )}

                {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-bold text-sm flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0" /> {successMsg}
                    </motion.div>
                )}

                {isReadOnly && (
                    <div className="p-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl font-bold text-sm flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-amber-600">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <p>Application Locked</p>
                            <p className="text-xs font-medium text-amber-600/70">Your application is currently "{appStatus.replace(/_/g, ' ')}" and cannot be modified.</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                    {/* Sidebar Stepper */}
                    <div className="w-full md:w-80 bg-gray-50/50 border-r border-gray-100 p-8 space-y-3">
                        {STEPS.map(s => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = progress > (s.id * 15); // Simple visual feedback

                            return (
                                <button type="button"
                                    key={s.id}
                                    onClick={() => setStep(s.id)}
                                    className={`w-full text-left p-4 rounded-3xl transition-all flex items-start gap-4 group relative ${isActive ? 'bg-white shadow-xl shadow-primary-600/10 border border-primary-100' : 'border border-transparent'}`}
                                >
                                    <div className={`p-3 rounded-2xl transition-all shrink-0 ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'bg-white text-gray-400 group-hover:text-gray-600 shadow-sm'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="pt-0.5 pr-6">
                                        <p className={`text-sm font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{s.label}</p>
                                        <p className="text-[10px] font-medium text-gray-400 mt-0.5 line-clamp-1">{s.desc}</p>
                                    </div>
                                    {isCompleted && !isActive && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex-1">
                                    <fieldset disabled={isReadOnly} className={`space-y-8 ${isReadOnly ? 'opacity-70 pointer-events-none' : ''}`}>

                                        {/* Step 1: Personal Details */}
                                        {step === 1 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Personal Details</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section A • Basic Information</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <Input label="Full Name" value={formData.personalDetails.fullName} onChange={(val) => handleNestedChange('personalDetails', 'fullName', val)} note="As per 10th Certificate" />
                                                    <Input label="Father's Name" value={formData.personalDetails.fatherName} onChange={(val) => handleNestedChange('personalDetails', 'fatherName', val)} />
                                                    <Input label="Mother's Name" value={formData.personalDetails.motherName} onChange={(val) => handleNestedChange('personalDetails', 'motherName', val)} />

                                                    <Select
                                                        label="Gender"
                                                        value={formData.personalDetails.gender}
                                                        onChange={(val) => handleNestedChange('personalDetails', 'gender', val)}
                                                        options={GENDER_OPTIONS}
                                                        placeholder="Select Gender"
                                                    />

                                                    <Input label="Date of Birth" type="date" value={formData.personalDetails.dateOfBirth?.split('T')[0] || ''} onChange={(val) => handleNestedChange('personalDetails', 'dateOfBirth', val)} />

                                                    <Select
                                                        label="Blood Group"
                                                        value={formData.personalDetails.bloodGroup}
                                                        onChange={(val) => handleNestedChange('personalDetails', 'bloodGroup', val)}
                                                        options={BLOOD_GROUP_OPTIONS}
                                                        placeholder="Select Blood Group"
                                                    />

                                                    <Select
                                                        label="Nationality"
                                                        value={formData.personalDetails.nationality}
                                                        onChange={(val) => handleNestedChange('personalDetails', 'nationality', val)}
                                                        options={NATIONALITY_OPTIONS}
                                                        placeholder="Select Nationality"
                                                    />

                                                    <Select
                                                        label="Category"
                                                        value={formData.personalDetails.category}
                                                        onChange={(val) => handleNestedChange('personalDetails', 'category', val)}
                                                        options={CATEGORY_OPTIONS}
                                                        placeholder="Select Category"
                                                    />

                                                    <Input label="Mobile Number" type="tel" inputMode="numeric" value={formData.personalDetails.mobileNumber} onChange={(val) => handleNestedChange('personalDetails', 'mobileNumber', val)} />

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                            Email Address
                                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                                <Lock className="w-2 h-2" /> Locked
                                                            </span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="email"
                                                                readOnly
                                                                disabled
                                                                value={lockedEmail || formData.personalDetails.email || ''}
                                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-gray-400 cursor-not-allowed outline-none shadow-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <Input label="Aadhaar ID" value={formData.personalDetails.aadhaarId} onChange={(val) => handleNestedChange('personalDetails', 'aadhaarId', val)} note="12-digit number" />

                                                    {/* Profile Photo Upload */}
                                                    <div className="md:col-span-2 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6">
                                                        {displayProfilePhoto ? (
                                                            <img src={displayProfilePhoto} alt="Profile" className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl" />
                                                        ) : (
                                                            <div className="w-24 h-24 rounded-3xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs font-black uppercase tracking-widest text-center px-4">No Photo</div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 mb-1">Profile Photograph</p>
                                                            <p className="text-xs text-gray-400 mb-4 font-medium">JPEG or PNG, max 2MB. Ensure clear face visibility.</p>
                                                            <label className={`inline-flex items-center px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all ${isReadOnly ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-white border border-gray-200 text-gray-700 hover:shadow-md hover:border-primary-200 hover:text-primary-600 shadow-sm'}`}>
                                                                <Upload className="w-3 h-3 mr-2" />
                                                                {displayProfilePhoto ? 'Change Photo' : 'Select Photo'}
                                                                <input type="file" accept="image/*" disabled={isReadOnly} className="hidden" onChange={handleProfilePhotoChange} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Address Details */}
                                        {step === 2 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                                        <MapPin className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Address Details</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section B • Residential Information</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <Input label="Address Line 1" value={formData.addressDetails.current.addressLine1} onChange={(val) => handleNestedChange('addressDetails', 'addressLine1', val, 'current')} />
                                                    <Input label="Address Line 2" value={formData.addressDetails.current.addressLine2} onChange={(val) => handleNestedChange('addressDetails', 'addressLine2', val, 'current')} />
                                                    <Input label="City" value={formData.addressDetails.current.city} onChange={(val) => handleNestedChange('addressDetails', 'city', val, 'current')} />
                                                    <Input label="District" value={formData.addressDetails.current.district} onChange={(val) => handleNestedChange('addressDetails', 'district', val, 'current')} />
                                                    <Input label="State" value={formData.addressDetails.current.state} onChange={(val) => handleNestedChange('addressDetails', 'state', val, 'current')} />
                                                    <Input label="Pincode" type="number" value={formData.addressDetails.current.pincode} onChange={(val) => handleNestedChange('addressDetails', 'pincode', val, 'current')} />
                                                </div>

                                                <div className="pt-4">
                                                    <label className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 cursor-pointer group transition-all hover:bg-gray-50">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="peer w-6 h-6 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                                                checked={formData.addressDetails.permanentSameAsCurrent}
                                                                onChange={(e) => handleNestedChange('addressDetails', 'permanentSameAsCurrent', e.target.checked)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Permanent address same as current</p>
                                                            <p className="text-xs text-gray-400 font-medium">Toggle this to quickly sync both address sections.</p>
                                                        </div>
                                                    </label>
                                                </div>

                                                {!formData.addressDetails.permanentSameAsCurrent && (
                                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                                        <Input label="Permanent Line 1" value={formData.addressDetails.permanent.addressLine1} onChange={(val) => handleNestedChange('addressDetails', 'addressLine1', val, 'permanent')} />
                                                        <Input label="Permanent Line 2" value={formData.addressDetails.permanent.addressLine2} onChange={(val) => handleNestedChange('addressDetails', 'addressLine2', val, 'permanent')} />
                                                        <Input label="Permanent City" value={formData.addressDetails.permanent.city} onChange={(val) => handleNestedChange('addressDetails', 'city', val, 'permanent')} />
                                                        <Input label="Permanent State" value={formData.addressDetails.permanent.state} onChange={(val) => handleNestedChange('addressDetails', 'state', val, 'permanent')} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        {/* Step 3: Academic Record */}
                                        {step === 3 && (
                                            <div className="space-y-12">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                                        <GraduationCap className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Academic Record</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section C • Past Education</p>
                                                    </div>
                                                </div>

                                                {/* 10th Details */}
                                                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
                                                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Primary Secondary (10th)</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        <Select label="Board" options={TENTH_BOARD_OPTIONS} value={formData.academicDetails.tenthBoard} onChange={(val) => handleNestedChange('academicDetails', 'tenthBoard', val)} />
                                                        <Input label="School Name" value={formData.academicDetails.tenthSchool} onChange={(val) => handleNestedChange('academicDetails', 'tenthSchool', val)} />
                                                        <Select label="Year" options={PASSING_YEARS} value={formData.academicDetails.tenthPassingYear} onChange={(val) => handleNestedChange('academicDetails', 'tenthPassingYear', val)} />
                                                        <Input label="Score (%)" type="number" value={formData.academicDetails.tenthScore} onChange={(val) => handleNestedChange('academicDetails', 'tenthScore', val)} />
                                                    </div>
                                                </div>

                                                {/* 12th Details */}
                                                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
                                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Higher Secondary (12th / Diploma)</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        <Select label="Board" options={TWELFTH_BOARD_OPTIONS} value={formData.academicDetails.twelfthBoard} onChange={(val) => handleNestedChange('academicDetails', 'twelfthBoard', val)} />
                                                        <Input label="College Name" value={formData.academicDetails.twelfthCollege} onChange={(val) => handleNestedChange('academicDetails', 'twelfthCollege', val)} />
                                                        <Select label="Year" options={PASSING_YEARS} value={formData.academicDetails.twelfthPassingYear} onChange={(val) => handleNestedChange('academicDetails', 'twelfthPassingYear', val)} />
                                                        <Input label="Score (%)" type="number" value={formData.academicDetails.twelfthScore} onChange={(val) => handleNestedChange('academicDetails', 'twelfthScore', val)} />
                                                    </div>
                                                </div>

                                                {/* Entrance Exam */}
                                                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
                                                    <h3 className="text-xs font-black text-primary-600 uppercase tracking-[0.2em]">Entrance Examination</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <Select label="Exam Name" options={ENTRANCE_EXAM_OPTIONS} value={formData.academicDetails.entranceExamName} onChange={(val) => handleNestedChange('academicDetails', 'entranceExamName', val)} />
                                                        <Input label="Score" type="number" value={formData.academicDetails.entranceScore} onChange={(val) => handleNestedChange('academicDetails', 'entranceScore', val)} />
                                                        <Input label="AIR / State Rank" type="number" value={formData.academicDetails.rank} onChange={(val) => handleNestedChange('academicDetails', 'rank', val)} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 4: Course Selection */}
                                        {step === 4 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                                        <BookOpen className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Course Selection</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section D • Preferred Program</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <Select label="Program Type" options={PROGRAM_TYPE_OPTIONS} value={formData.courseSelection.programType} onChange={(val) => handleNestedChange('courseSelection', 'programType', val)} />
                                                    <Select label="Department" options={departments.map(d => d.name)} value={formData.courseSelection.department} onChange={(val) => handleNestedChange('courseSelection', 'department', val)} />
                                                    <Select label="Course Name" options={COURSE_OPTIONS} value={formData.courseSelection.course} onChange={(val) => handleNestedChange('courseSelection', 'course', val)} />
                                                    <Select label="Specialization" options={SPECIALIZATION_OPTIONS} value={formData.courseSelection.specialization} onChange={(val) => handleNestedChange('courseSelection', 'specialization', val)} />
                                                    <Select label="Admission Quota" options={CATEGORY_QUOTA_OPTIONS} value={formData.courseSelection.categoryQuota} onChange={(val) => handleNestedChange('courseSelection', 'categoryQuota', val)} />
                                                    <Select label="Admission Type" options={ADMISSION_TYPE_OPTIONS} value={formData.courseSelection.admissionType} onChange={(val) => handleNestedChange('courseSelection', 'admissionType', val)} />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                                    <label className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 cursor-pointer group transition-all hover:bg-gray-50">
                                                        <input type="checkbox" className="w-6 h-6 rounded-lg text-primary-600" checked={formData.courseSelection.preferredHostel} onChange={(e) => handleNestedChange('courseSelection', 'preferredHostel', e.target.checked)} />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Hostel Accommodation</p>
                                                            <p className="text-xs text-gray-400 font-medium">Opt-in for campus housing facilities.</p>
                                                        </div>
                                                    </label>
                                                    <label className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 cursor-pointer group transition-all hover:bg-gray-50">
                                                        <input type="checkbox" className="w-6 h-6 rounded-lg text-emerald-600" checked={formData.courseSelection.scholarshipApplied} onChange={(e) => handleNestedChange('courseSelection', 'scholarshipApplied', e.target.checked)} />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Merit Scholarship</p>
                                                            <p className="text-xs text-gray-400 font-medium">Applying for institutional financial aid.</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 5: Guardian Details */}
                                        {step === 5 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                                        <Users className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Guardian Details</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section E • Family & Emergency</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <Input label="Guardian Name" value={formData.guardianDetails.guardianName} onChange={(val) => handleNestedChange('guardianDetails', 'guardianName', val)} />
                                                    <Input label="Relation" value={formData.guardianDetails.guardianRelation} onChange={(val) => handleNestedChange('guardianDetails', 'guardianRelation', val)} />
                                                    <Input label="Guardian Phone" type="tel" inputMode="numeric" value={formData.guardianDetails.guardianPhone} onChange={(val) => handleNestedChange('guardianDetails', 'guardianPhone', val)} />
                                                    <Input label="Occupation" value={formData.guardianDetails.guardianOccupation} onChange={(val) => handleNestedChange('guardianDetails', 'guardianOccupation', val)} />

                                                    <div className="md:col-span-2 pt-8 border-t border-gray-100">
                                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Emergency Contact</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <Input label="Contact Person Name" value={formData.guardianDetails.emergencyContactName} onChange={(val) => handleNestedChange('guardianDetails', 'emergencyContactName', val)} />
                                                            <Input label="Contact Number" type="tel" inputMode="numeric" value={formData.guardianDetails.emergencyContactPhone} onChange={(val) => handleNestedChange('guardianDetails', 'emergencyContactPhone', val)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 6: Documents */}
                                        {step === 6 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-black text-gray-900">Documents</h2>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section F • Verification Files</p>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-primary-50 rounded-[2rem] border border-primary-100 flex items-start gap-4 mb-8">
                                                    <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                    <p className="text-xs font-bold text-primary-700/80 leading-relaxed">
                                                        Please upload clear scans of original documents. Supported formats: PDF, JPG, PNG (Max 10MB per file).
                                                        Selected files are uploaded when you click <span className="text-primary-900 font-black">Save Draft</span>.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(DOC_LABELS).map(([docKey, docLabel]) => {
                                                        const savedMeta = savedDocs?.[docKey];
                                                        const pendingFile = pendingFiles[docKey];
                                                        const isUploaded = !!savedMeta?.filePath;
                                                        const hasNewFile = !!pendingFile;

                                                        return (
                                                            <div key={docKey} className={`group bg-white border-2 rounded-[2rem] p-6 transition-all shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] ${isUploaded ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-100'}`}>
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 text-sm mb-1">{docLabel}</p>
                                                                        {isUploaded && !hasNewFile ? (
                                                                            <p className="text-[10px] font-black uppercase text-emerald-600">Verified • Saved</p>
                                                                        ) : hasNewFile ? (
                                                                            <p className="text-[10px] font-black uppercase text-blue-600">Ready to Upload</p>
                                                                        ) : (
                                                                            <p className="text-[10px] font-black uppercase text-gray-300">Awaiting File</p>
                                                                        )}
                                                                    </div>
                                                                    <div className={`p-2 rounded-xl ${isUploaded ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
                                                                        {isUploaded ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                                                    </div>
                                                                </div>

                                                                {(hasNewFile || isUploaded) && (
                                                                    <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6 flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                                                            <FileText className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-xs font-bold text-gray-700 truncate">{hasNewFile ? pendingFile.name : savedMeta.originalName}</p>
                                                                            <p className="text-[9px] font-medium text-gray-400">{hasNewFile ? 'Pending' : new Date(savedMeta.uploadedAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                        {hasNewFile && (
                                                                            <button type="button" onClick={() => clearPendingDoc(docKey)} className="p-2 hover:bg-rose-50 text-gray-300 hover:text-rose-500 rounded-lg transition-all">
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-2">
                                                                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${isReadOnly ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
                                                                        <Upload className="w-3 h-3" />
                                                                        {isUploaded ? 'Replace' : 'Upload'}
                                                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={isReadOnly} className="hidden" onChange={(e) => handleDocFileChange(docKey, e)} />
                                                                    </label>
                                                                    {isUploaded && !hasNewFile && (
                                                                        <a href={getFileUrl(savedMeta.filePath)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-900 text-white rounded-2xl hover:bg-black shadow-lg shadow-gray-200">
                                                                            <ChevronRight className="w-4 h-4" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                    </fieldset>
                                </div>

                                {/* Footer Navigation */}
                                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        type="button"
                                        disabled={step === 1}
                                        onClick={() => {
                                            setStep(step - 1);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-900 disabled:opacity-10 transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Previous Section
                                    </button>

                                    {step < 6 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep(step + 1);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="flex items-center gap-2 px-10 py-3 bg-gray-900 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-gray-200"
                                        >
                                            Next Step <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
};

// ── Extracted UI Input Component ──────────────────────────────────────────────
const Input = ({ label, type = 'text', value, onChange, inputMode, placeholder, icon: Icon, note }) => (
    <div className="group">
        <label className="block text-sm font-bold text-gray-700 mb-2 transition-colors group-focus-within:text-primary-600 flex items-center gap-2">
            {label}
            {note && <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">{note}</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                inputMode={inputMode}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white outline-none transition-all placeholder-gray-300 font-semibold text-gray-900 shadow-sm"
                placeholder={placeholder || `Enter ${label}`}
            />
            {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors" />}
        </div>
    </div>
);

export default AdmissionFormPage;
