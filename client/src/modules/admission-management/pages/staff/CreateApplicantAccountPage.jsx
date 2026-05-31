import { useState, useMemo } from 'react';
import axios from 'axios';
import {
    UserPlus, Phone, Lock, Hash, Loader2, CheckCircle, Copy, RotateCcw,
    Mail, AtSign, Calendar, User
} from 'lucide-react';

// ── Mirrors the server-side sanitiser ────────────────────────────────────────
const sanitisePart = (str = '') => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => (CURRENT_YEAR - 5) + i);

const CreateApplicantAccountPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        year: String(CURRENT_YEAR),
        username: '',
        password: '',
        mobileNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);
    const [copied, setCopied] = useState(false);

    // ── Real-time email preview (matches backend generation logic) ────────────
    const generatedEmailPreview = useMemo(() => {
        const first = sanitisePart(formData.firstName);
        const last = sanitisePart(formData.lastName);
        const year = formData.year;
        if (!first && !last) return '';
        return `${first}${last}${year}@erpsaa.com`;
    }, [formData.firstName, formData.lastName, formData.year]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError(null);
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            year: String(CURRENT_YEAR),
            username: '',
            password: '',
            mobileNumber: ''
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                '/api/admissions/create-applicant',
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    year: formData.year,
                    username: formData.username || undefined,
                    password: formData.password,
                    mobileNumber: formData.mobileNumber || undefined,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSuccessData({
                    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                    loginId: formData.username || res.data.data.generatedEmail,
                    generatedEmail: res.data.data.generatedEmail,
                    password: formData.password
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const text = [
            'Welcome to ERPSAA!\n',
            `Name: ${successData.fullName}`,
            `Login Email: ${successData.generatedEmail}`,
            `Temporary Password: ${successData.password}`,
            '\nPlease log in to complete your admission application.'
        ].join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (successData) {
        return (
            <div className="p-6 md:p-10 max-w-3xl mx-auto mt-10">
                <div className="bg-white p-10 rounded-3xl shadow-lg border-2 border-green-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Account Created Successfully</h2>
                    <p className="text-gray-500 text-lg">
                        The student applicant credentials have been generated and the account is ready.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left max-w-md mx-auto space-y-4">
                        <div>
                            <p className="text-sm font-bold tracking-wider text-gray-400 uppercase">Applicant Name</p>
                            <p className="font-semibold text-gray-900 text-lg">{successData.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-wider text-gray-400 uppercase">Login Email (@erpsaa.com)</p>
                            <p className="font-semibold text-primary-600 text-lg break-all">{successData.generatedEmail}</p>
                        </div>
                        {successData.loginId !== successData.generatedEmail && (
                            <div>
                                <p className="text-sm font-bold tracking-wider text-gray-400 uppercase">Custom Login ID</p>
                                <p className="font-semibold text-gray-900 text-lg">{successData.loginId}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-bold tracking-wider text-gray-400 uppercase">Temp Password</p>
                            <p className="font-mono font-bold text-brand-dark text-lg bg-white px-3 py-1 rounded-lg border border-gray-200 inline-block mt-1">
                                {successData.password}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button type="button"
                            onClick={handleCopy}
                            className={`flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all shadow-md ${copied ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-gray-900 text-white hover:bg-black'}`}
                        >
                            {copied ? <CheckCircle className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                            {copied ? 'Copied to Clipboard!' : 'Copy Credentials'}
                        </button>
                        <button type="button"
                            onClick={() => { setSuccessData(null); handleReset(); }}
                            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <UserPlus className="w-5 h-5 mr-2 text-gray-500" />
                            Create Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main form ─────────────────────────────────────────────────────────────
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <UserPlus className="w-8 h-8 mr-3 text-primary-600" />
                    New Admission Applicant
                </h1>
                <p className="text-gray-500 font-medium mt-1">
                    Enter the student's name and year — the <span className="font-bold text-primary-600">@erpsaa.com</span> login email is generated automatically.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* First Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="e.g. Shriyash"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Pachpande"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Admission Year */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Admission Year <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <select
                                name="year"
                                required
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all appearance-none"
                            >
                                {YEAR_OPTIONS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Generated Email Preview — READ-ONLY */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <AtSign className="w-4 h-4 text-primary-500" />
                            Generated Login Email
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700">Auto</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={generatedEmailPreview || 'Enter name fields above to preview…'}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border font-mono text-sm transition-all outline-none ${generatedEmailPreview
                                    ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                                    : 'bg-gray-50 border-gray-200 text-gray-400 italic'
                                    }`}
                            />
                        </div>
                        <p className="text-xs text-gray-400">Domain is locked to <strong>@erpsaa.com</strong> — cannot be changed.</p>
                    </div>

                    {/* Username (Optional) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Custom Login ID / Username <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Hash className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Leave blank to use generated email"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Temporary Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Temporary Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="password"
                                required
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                            Mobile Number <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                name="mobileNumber"
                                inputMode="numeric"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none font-medium transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Info banner */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 font-medium flex items-start gap-3">
                    <AtSign className="w-5 h-5 mt-0.5 shrink-0 text-blue-500" />
                    <span>
                        The system auto-generates a unique <strong>@erpsaa.com</strong> email from the student's first name, last name, and admission year.
                        Share this email along with the temporary password so the student can log in and fill the admission form.
                    </span>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !generatedEmailPreview}
                        className="px-8 py-3 flex items-center bg-brand-dark text-white text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        {loading ? 'Creating...' : 'Create Applicant'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateApplicantAccountPage;
