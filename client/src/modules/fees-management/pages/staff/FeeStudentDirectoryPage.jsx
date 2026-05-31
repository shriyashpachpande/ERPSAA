import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, ChevronRight, AlertCircle, CreditCard, Download, Loader2 } from 'lucide-react';
import gsap from 'gsap';

const FeeStudentDirectoryPage = () => {
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [availableStructures, setAvailableStructures] = useState([]);
    const [assigningLoading, setAssigningLoading] = useState(false);
    const [selectedStructureId, setSelectedStructureId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, [searchTerm, filterDept, filterStatus]);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    const fetchAccounts = async () => {
        try {
            const res = await axiosInstance.get('/fees/staff/students', {
                params: { search: searchTerm, department: filterDept, status: filterStatus }
            });
            setAccounts(res.data.data); // data is now a list of students with .feeAccount property

            if (tableRef.current) {
                gsap.fromTo(tableRef.current.querySelectorAll('tr'),
                    { opacity: 0, x: -10 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
                );
            }
        } catch (err) {
            console.error('Failed to load accounts', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStructures = async (course) => {
        try {
            const res = await axiosInstance.get('/fees/staff/fee-structures', {
                params: { course }
            });
            setAvailableStructures(res.data.data);
        } catch (err) {
            console.error('Failed to load structures', err);
        }
    };

    const handleAssignFee = async () => {
        if (!selectedStructureId) return;
        try {
            setAssigningLoading(true);
            await axiosInstance.post(`/fees/staff/students/${selectedStudent._id}/init-account`,
                { feeStructureId: selectedStructureId }
            );
            setShowAssignModal(false);
            setSelectedStudent(null);
            fetchAccounts();
        } catch (err) {
            alert(err.response?.data?.error || 'Assignment failed');
        } finally {
            setAssigningLoading(false);
        }
    };

    const openAssignModal = (student) => {
        setSelectedStudent(student);
        fetchStructures(student.academicProfile.course);
        setShowAssignModal(true);
        setSelectedStructureId('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'partial': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'unpaid': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900">Student Fee Records</h1>
                <p className="text-gray-500 font-medium tracking-tight">Manage and track fee accounts for all active students.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search student name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-sm shadow-sm"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-xs uppercase tracking-widest text-gray-600"
                    >
                        <option value="">All Departments</option>
                        <option value="Computer Science Engineering">CSE</option>
                        <option value="Information Technology">IT</option>
                        <option value="Mechanical Engineering">Mechanical</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 font-bold text-xs uppercase tracking-widest text-gray-600"
                    >
                        <option value="">All Statuses</option>
                        <option value="paid">Fully Paid</option>
                        <option value="partial">Partial</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            {/* Directory Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying database...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Information</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic Context</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fee Summary</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody ref={tableRef} className="divide-y divide-gray-50">
                                {accounts.length > 0 ? accounts.map((acc) => (
                                    <tr key={acc._id} className="group hover:bg-primary-50/20 hover:translate-x-1.5 transition-all duration-300 ease-out transform-gpu">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary-600 border-2 border-primary-200 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-115 group-hover:border-primary-400 group-hover:shadow-primary-500/20 transition-all duration-300 relative overflow-hidden flex-shrink-0">
                                                    {acc.personalDetails?.profilePhotoUrl ? (
                                                        <img src={acc.personalDetails.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        acc.personalDetails?.fullName?.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 leading-tight mb-0.5">{acc.personalDetails?.fullName}</p>
                                                    <p className="text-xs font-bold text-gray-400">{acc.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-500 whitespace-nowrap">
                                            {acc.academicProfile.course} • {acc.academicProfile.department}
                                        </td>
                                        <td className="px-8 py-6">
                                            {acc.feeAccount ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-end gap-6 max-w-[150px]">
                                                        <p className="text-xs font-bold text-gray-400 uppercase">Balance</p>
                                                        <p className="text-lg font-black text-gray-900 leading-none">₹{acc.feeAccount.balance.toLocaleString()}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(acc.feeAccount.status)}`}>
                                                        {acc.feeAccount.status}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    Not Initialized
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {acc.feeAccount ? (
                                                <button type="button"
                                                    onClick={() => navigate(`/app/staff/fees/students/${acc.feeAccount._id}`)}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-xs hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
                                                >
                                                    View Account <ChevronRight className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <button type="button"
                                                    onClick={() => openAssignModal(acc)}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 border border-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                                                >
                                                    <CreditCard className="w-3 h-3" /> Assign Fees
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-6 bg-gray-50 rounded-full">
                                                    <Users className="w-12 h-12 text-gray-300" />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-400 uppercase tracking-widest">No matching student records</h4>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assign Fee Modal */}
            {showAssignModal && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                            <CreditCard className="w-32 h-32 text-primary-600" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900 italic">Initialize Ledger.</h2>
                            <p className="text-sm font-medium text-gray-500">
                                Assigning fee structure for <span className="text-primary-600 font-bold">{selectedStudent?.personalDetails.fullName}</span> ({selectedStudent?.academicProfile.course}).
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Target Year Structure</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {availableStructures.length > 0 ? availableStructures.map(s => (
                                        <button type="button"
                                            key={s._id}
                                            onClick={() => setSelectedStructureId(s._id)}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all ${selectedStructureId === s._id
                                                    ? 'border-primary-600 bg-primary-50/50 shadow-lg'
                                                    : 'border-gray-100 hover:border-primary-200 bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-lg font-black text-gray-900">Year {s.yearNumber}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{s.academicYear}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-primary-600">₹{s.totalAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </button>
                                    )) : (
                                        <div className="p-8 text-center bg-amber-50 rounded-3xl border border-amber-100">
                                            <p className="text-amber-700 font-bold text-sm italic">No structures found for {selectedStudent?.academicProfile.course}. Please create one in Management first.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button"
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button type="button"
                                disabled={!selectedStructureId || assigningLoading}
                                onClick={handleAssignFee}
                                className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 disabled:opacity-50 disabled:grayscale transition-all shadow-xl shadow-primary-500/20"
                            >
                                {assigningLoading ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FeeStudentDirectoryPage;
