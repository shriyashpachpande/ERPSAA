import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User, Mail, Lock, ShieldCheck, 
    Save, Key, Loader2, UserCircle, 
    Camera, CheckCircle, AlertCircle
} from 'lucide-react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingDetails, setSavingDetails] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [details, setDetails] = useState({ fullName: '', email: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const API_BASE = '/api/auth';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_BASE}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setUser(res.data.data);
                setDetails({
                    fullName: res.data.data.fullName,
                    email: res.data.data.email
                });
            }
        } catch (err) {
            console.error('Error fetching profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setSavingDetails(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await axios.put(`${API_BASE}/details`, details, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profile details updated successfully!' });
                setUser(res.data.data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' });
        } finally {
            setSavingDetails(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }
        setSavingPassword(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await axios.put(`${API_BASE}/updatepassword`, passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                if (res.data.token) localStorage.setItem('token', res.data.token);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Password update failed' });
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying Identity...</p>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50" />
                
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-200">
                        {user?.fullName?.[0].toUpperCase()}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-1">{user?.fullName}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest border border-primary-100">
                            {user?.designation ? (user.designation === 'Head of Department' ? 'HOD' : user.designation) : user?.role?.replace('_', ' ')}
                        </span>
                        <span className="flex items-center text-gray-500 text-sm font-medium">
                            <Mail className="w-4 h-4 mr-2" /> {user?.email}
                        </span>
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm animate-in zoom-in-95 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                    </div>

                    <form onSubmit={handleUpdateDetails} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text"
                                    value={details.fullName}
                                    onChange={(e) => setDetails({...details, fullName: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email"
                                    value={details.email}
                                    onChange={(e) => setDetails({...details, email: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={savingDetails}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center disabled:opacity-50"
                        >
                            {savingDetails ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                        </button>
                    </form>
                </div>

                {/* Password Security */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Security</h3>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 border-t border-gray-50 pt-4 mt-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="password"
                                    placeholder="Re-type new password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={savingPassword}
                            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center disabled:opacity-50"
                        >
                            {savingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-4 h-4 mr-2" /> Update Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
