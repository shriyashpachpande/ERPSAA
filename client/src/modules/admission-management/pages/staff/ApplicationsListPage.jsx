import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Loader2, Eye, Filter, CheckCircle, ShieldAlert, FileText, Clock } from 'lucide-react';
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

const ApplicationsListPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const tbodyRef = useRef(null);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    useEffect(() => {
        if (!loading && applications.length > 0 && tbodyRef.current) {
            gsap.fromTo(
                tbodyRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [applications, loading, searchTerm]); // re-run animation on search filter

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = statusFilter 
                ? `/api/admissions?status=${statusFilter}`
                : '/api/admissions';
            
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setApplications(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching applications', err);
        } finally {
            setLoading(false);
        }
    };


    const filteredApps = applications.filter(app => {
        const matchesSearch = 
            (app.applicationId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.linkedUserId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.personalDetails?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admissions Queue</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Review and process comprehensive student applications.</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search by ID, Name or Email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer appearance-none font-medium text-gray-700"
                        >
                            <option value="">All Statuses</option>
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="reupload_requested">Re-upload Requested</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border md:rounded-3xl shadow-sm border-gray-100 overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6">Application ID</th>
                                <th className="p-4">Applicant Profile</th>
                                <th className="p-4">Desired Course</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Submitted Date</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody ref={tbodyRef} className="divide-y divide-gray-50 text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
                                        <p className="text-gray-500 font-medium">Loading records securely from database...</p>
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Applications Found</h3>
                                        <p className="text-gray-500">There are no records matching your current active filters.</p>
                                    </td>
                                </tr>
                            ) : filteredApps.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-4 pl-6 font-mono font-medium text-gray-900">{app.applicationId}</td>
                                    <td className="p-4">
                                        <p className="font-bold tracking-tight text-gray-900">{app.personalDetails?.fullName || app.linkedUserId?.fullName || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{app.personalDetails?.email || app.linkedUserId?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium">{app.courseSelection?.course || 'Not Selected'}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{app.courseSelection?.programType}</p>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={app.applicationStatus} />
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-500 flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft Only'}
                                    </td>
                                    <td className="p-4 pr-6 text-right space-x-2">
                                        <Link 
                                            to={`/app/staff/admissions/${app._id}`}
                                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm shadow-sm"
                                        >
                                            <Eye className="w-4 h-4 mr-1.5 text-gray-400" /> View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsListPage;
