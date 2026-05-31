import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
    Search, Loader2, Eye, Filter, CheckCircle, 
    ShieldAlert, FileText, Clock, AlertCircle, 
    ChevronLeft, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import gsap from 'gsap';

const StatusBadge = ({ status }) => {
    const styles = {
        draft: 'bg-gray-100 text-gray-600 border-gray-200',
        submitted: 'bg-blue-50 text-blue-700 border-blue-200',
        under_review: 'bg-purple-50 text-purple-700 border-purple-200',
        pending_clarification: 'bg-orange-50 text-orange-700 border-orange-200',
        reupload_requested: 'bg-amber-50 text-amber-700 border-amber-200',
        approved: 'bg-green-50 text-green-700 border-green-200',
        rejected: 'bg-red-50 text-red-700 border-red-200'
    };
    const style = styles[status] || styles.draft;
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </div>
);

const ReviewQueuePage = () => {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        totalSubmitted: 0,
        underReview: 0,
        reuploadRequested: 0,
        pendingClarification: 0
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const tbodyRef = useRef(null);

    const API_BASE = '/api/admissions';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter, page]);

    useEffect(() => {
        if (!loading && applications.length > 0 && tbodyRef.current) {
            gsap.fromTo(
                tbodyRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [applications, loading]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/queue-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setStats(res.data.data);
        } catch (err) {
            console.error('Error fetching stats', err);
        }
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}?status=${statusFilter}&page=${page}&limit=10&search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setApplications(res.data.data);
                setTotalPages(res.data.pages);
            }
        } catch (err) {
            console.error('Error fetching applications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchApplications();
    };


    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Review Queue</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manage and process all student admission applications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={fetchApplications} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600 shadow-sm">
                        <Clock className="w-5 h-5" />
                    </button>
                    <Link to="/app/staff/new-admission" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold text-sm shadow-lg shadow-primary-200 flex items-center">
                        Add New Applicant
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Submitted" value={stats.totalSubmitted} icon={FileText} color="bg-blue-50 text-blue-600" />
                <StatCard title="Under Review" value={stats.underReview} icon={Clock} color="bg-purple-50 text-purple-600" />
                <StatCard title="Re-upload Req." value={stats.reuploadRequested} icon={AlertCircle} color="bg-amber-50 text-amber-600" />
                <StatCard title="Clarification" value={stats.pendingClarification} icon={ShieldAlert} color="bg-orange-50 text-orange-600" />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by Application ID, Name, or Email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm font-medium"
                    />
                </form>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm">
                        <button type="button" 
                            onClick={() => setStatusFilter('')} 
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === '' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button type="button" 
                            onClick={() => setStatusFilter('submitted')} 
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'submitted' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            New
                        </button>
                        <button type="button" 
                            onClick={() => setStatusFilter('under_review')} 
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'under_review' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            In Review
                        </button>
                        <button type="button" 
                            onClick={() => setStatusFilter('reupload_requested')} 
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'reupload_requested' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Correction
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <th className="p-5 pl-8">Applicant</th>
                                <th className="p-5">Application Info</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Submitted</th>
                                <th className="p-5 pr-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody ref={tbodyRef} className="divide-y divide-gray-50 text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary-500 mb-4" />
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Secure Records...</p>
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <FileText className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">Queue is Empty</h3>
                                        <p className="text-gray-500 font-medium">No applications found matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : applications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm border border-primary-100">
                                                {(app.personalDetails?.fullName?.[0] || app.linkedUserId?.fullName?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 tracking-tight leading-tight">{app.personalDetails?.fullName || app.linkedUserId?.fullName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{app.personalDetails?.email || app.linkedUserId?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">{app.applicationId}</p>
                                            <p className="text-sm font-bold text-gray-700">{app.courseSelection?.department} / {app.courseSelection?.course}</p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <StatusBadge status={app.applicationStatus} />
                                    </td>
                                    <td className="p-5 text-sm font-bold text-gray-500">
                                        <div className="flex items-center">
                                            <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                                        </div>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <Link 
                                            to={`/app/staff/admissions/${app._id}`}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold text-xs shadow-sm group-hover:border-primary-200 group-hover:text-primary-600"
                                        >
                                            <Eye className="w-3.5 h-3.5 mr-2" /> View Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-5 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button type="button" 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button type="button" 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewQueuePage;
