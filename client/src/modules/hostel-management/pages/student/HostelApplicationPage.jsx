import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyMasterProfile } from '../../../student-master/services/studentMasterService';
import { applyForHostel, getMyApplication } from '../../services/hostelService';
import { 
  User, MapPin, Phone, Home, CheckCircle2, AlertCircle, 
  ChevronRight, FileText, ShieldCheck, HeartPulse, Info
} from 'lucide-react';
import gsap from 'gsap';

const InfoField = ({ label, value, icon: Icon }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
    {Icon && <Icon className="w-4 h-4 text-indigo-500 mt-1" />}
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

const HostelApplicationPage = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [existingApp, setExistingApp] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    hostelType: '',
    preferredRoomType: '',
    medicalCondition: '',
    localGuardianName: '',
    localGuardianPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    declarationAccepted: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appRes] = await Promise.allSettled([
          getMyMasterProfile(),
          getMyApplication()
        ]);
        
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
          
          // Auto-set hostel type based on gender if available
          const gender = profileRes.value.data?.personalDetails?.gender;
          if (gender === 'Male') {
            setFormData(prev => ({ ...prev, hostelType: 'Boys' }));
          } else if (gender === 'Female') {
            setFormData(prev => ({ ...prev, hostelType: 'Girls' }));
          }
        } else {
          console.error('Profile fetch failed:', profileRes.reason);
          // Only show fatal error if it's not just a "not found" error
          const errorMsg = profileRes.reason?.response?.data?.error;
          if (errorMsg === 'STUDENT_MASTER_NOT_FOUND') {
            setError('ADMISSION_PENDING');
          } else {
            setError('Failed to fetch required data. Please ensure your profile is complete.');
          }
        }

        if (appRes.status === 'fulfilled' && appRes.value.data) {
          setExistingApp(appRes.value.data);
        }

      } catch (err) {
        console.error('Unexpected error in fetchData:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && formRef.current) {
      gsap.fromTo(formRef.current.querySelectorAll('.stagger-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.declarationAccepted) {
      setError('Please accept the declaration before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await applyForHostel(formData);
      setSuccess(true);
      setTimeout(() => navigate('/app/student/hostel'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (error === 'ADMISSION_PENDING') {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="bg-amber-50 border border-amber-100 text-amber-600 p-8 rounded-3xl max-w-xl mx-auto">
          <Info className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-black mb-2 text-amber-900">Admission Record Pending</h2>
          <p className="font-medium mb-6 text-amber-700">Your student master record was not found. Please ensure your admission is approved by the administration before applying for hostel.</p>
          <button type="button" onClick={() => navigate('/app')} className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-8 rounded-3xl max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Profile Error</h2>
          <p className="font-medium mb-6">{error || 'Could not load student profile data. Please ensure your admission record is approved.'}</p>
          <button type="button" onClick={() => window.location.reload()} className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold">Retry</button>
        </div>
      </div>
    );
  }

  if (existingApp) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Application Already Exists</h2>
        <p className="text-gray-500 mb-8">You have an active hostel application with status: <span className="font-bold text-indigo-600 uppercase tracking-wider">{existingApp.status}</span></p>
        <button type="button" 
          onClick={() => navigate('/app/student/hostel')}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          View Status
        </button>
      </div>
    );
  }

  const pd = profile?.personalDetails || {};
  const ap = profile?.academicProfile || {};
  const cd = profile?.contactDetails || {};

  return (
    <div className="max-w-5xl mx-auto pb-20" ref={formRef}>
      <div className="stagger-item mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Hostel Admission Application</h1>
        <p className="text-gray-500">Apply for on-campus accommodation. Your ERP data is pre-filled.</p>
      </div>

      {error && (
        <div className="stagger-item mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="stagger-item mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Application submitted successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Pre-filled Info */}
        <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            Verified Student Information
            <span className="ml-auto text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">Non-Editable</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField label="Full Name" value={pd.fullName} icon={User} />
            <InfoField label="Student ID" value={profile.studentId} icon={User} />
            <InfoField label="Gender" value={pd.gender} icon={User} />
            <InfoField label="Course" value={ap.course} icon={Home} />
            <InfoField label="Department" value={ap.department} icon={Home} />
            <InfoField label="Email" value={cd.email} icon={User} />
            <InfoField label="Mobile" value={cd.mobileNumber} icon={Phone} />
            <InfoField label="Batch" value={ap.batch} icon={Home} />
            <InfoField label="Blood Group" value={pd.bloodGroup} icon={HeartPulse} />
          </div>
        </div>

        {/* Section 2: Hostel Preferences */}
        <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-500" />
            Accommodation Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hostel Type Needed</label>
              <select
                name="hostelType"
                value={formData.hostelType}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              >
                <option value="">Select Type</option>
                <option value="Boys">Boys Hostel</option>
                <option value="Girls">Girls Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preferred Room Type</label>
              <select
                name="preferredRoomType"
                value={formData.preferredRoomType}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              >
                <option value="">Select Room Type</option>
                <option value="Single">Single Seater</option>
                <option value="Double">Double Seater</option>
                <option value="Triple">Triple Seater</option>
                <option value="Four-Seater">Four Seater</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Emergency & Medical */}
        <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-indigo-500" />
            Emergency & Medical Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Medical Conditions / Allergies (If Any)</label>
              <textarea
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleChange}
                rows="2"
                placeholder="Mention any chronic illness, allergies or special medical needs..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Local Guardian Name</label>
              <input
                type="text"
                name="localGuardianName"
                value={formData.localGuardianName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Local Guardian Phone</label>
              <input
                type="tel"
                name="localGuardianPhone"
                value={formData.localGuardianPhone}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold text-gray-800 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Declaration */}
        <div className="stagger-item bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              name="declarationAccepted"
              id="declaration"
              checked={formData.declarationAccepted}
              onChange={handleChange}
              className="w-6 h-6 rounded-lg mt-1 accent-indigo-600"
            />
            <label htmlFor="declaration" className="text-sm font-bold text-indigo-900 leading-relaxed cursor-pointer">
              I hereby declare that all the information provided above is true to the best of my knowledge. I agree to abide by the hostel rules and regulations, and I understand that any violation may lead to disciplinary action or cancellation of my accommodation. I also authorize the accounts department to add hostel fees to my ERP ledger upon approval.
            </label>
          </div>
        </div>

        <div className="stagger-item flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest text-xs"
          >
            {submitting ? 'Submitting...' : 'Submit Hostel Application'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HostelApplicationPage;
