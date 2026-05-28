import { useState, useEffect } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';
import { Check, X, Clock, CheckCircle, XCircle, Sparkles, Inbox, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffBonafideDashboardPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  const [rejectionId, setRejectionId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, processedRes] = await Promise.all([
        axiosInstance.get('/academic/bonafide/staff/pending'),
        axiosInstance.get('/academic/bonafide/staff/processed')
      ]);

      if (pendingRes.data.success) {
        setPendingRequests(pendingRes.data.data);
      }
      if (processedRes.data.success) {
        setProcessedRequests(processedRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      toast.error('Could not load request queues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    setSubmittingAction(true);
    try {
      const res = await axiosInstance.post(`/academic/bonafide/staff/approve/${id}`, {});
      if (res.data.success) {
        toast.success('Certificate request approved and generated!');
        fetchData();
      }
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error(err.response?.data?.error || 'Failed to approve request.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Please specify a rejection reason.');
      return;
    }
    setSubmittingAction(true);
    try {
      const res = await axiosInstance.post(`/academic/bonafide/staff/reject/${rejectionId}`, { rejectionReason });
      if (res.data.success) {
        toast.success('Certificate request rejected successfully.');
        setRejectionId(null);
        setRejectionReason('');
        fetchData();
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      toast.error(err.response?.data?.error || 'Failed to reject request.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getReasonLabel = (r) => {
    switch (r) {
      case 'bank_account': return 'Opening Bank Account';
      case 'passport': return 'Passport Application';
      case 'scholarship': return 'Scholarship Claim';
      case 'bus_pass': return 'Institution Bus Pass';
      default: return 'Other / Custom Purpose';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Bonafide Approvals</h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-1">Review queue and issue official bonafide certificates</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all shrink-0 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Sync Queue
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-gray-100 space-x-8">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-colors ${
            activeTab === 'pending' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Pending Queue ({pendingRequests.length})
          {activeTab === 'pending' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('processed')}
          className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-colors ${
            activeTab === 'processed' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Processed History ({processedRequests.length})
          {activeTab === 'processed' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded-full" />}
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col justify-center items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing certificate channels...</p>
          </div>
        ) : activeTab === 'pending' ? (
          pendingRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-6">Date</th>
                    <th className="p-6">Student Information</th>
                    <th className="p-6">Requested Purpose</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {pendingRequests.map((req) => {
                    const student = req.studentId;
                    const fullName = student?.personalDetails?.fullName || "Student";
                    const rollNo = student?.studentId || "N/A";
                    const course = student?.academicProfile?.course || "N/A";
                    const semester = req.semester || `Sem ${student?.academicProfile?.currentSemester || 1}`;

                    return (
                      <tr key={req._id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-6 text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-gray-900">{fullName}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">
                            Roll: {rollNo} &bull; {course} &bull; Sem {semester}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-gray-800">{getReasonLabel(req.reason)}</div>
                          {req.customReason && (
                            <div className="text-[10px] text-gray-400 italic mt-0.5">"{req.customReason}"</div>
                          )}
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={submittingAction}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectionId(req._id)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col justify-center items-center gap-3 text-gray-400">
              <Inbox className="w-8 h-8 text-gray-300 animate-bounce" />
              <p className="text-xs font-black uppercase tracking-wider">All caught up! No pending applications inside queue</p>
            </div>
          )
        ) : (
          processedRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-6">Processed Date</th>
                    <th className="p-6">Student Information</th>
                    <th className="p-6">Purpose</th>
                    <th className="p-6">Status & Certificate Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {processedRequests.map((req) => {
                    const student = req.studentId;
                    const fullName = student?.personalDetails?.fullName || "Student";
                    const rollNo = student?.studentId || "N/A";
                    const course = student?.academicProfile?.course || "N/A";
                    const semester = req.semester || `Sem ${student?.academicProfile?.currentSemester || 1}`;
                    
                    return (
                      <tr key={req._id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-6 text-gray-400">
                          {new Date(req.approvedAt || req.updatedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-gray-900">{fullName}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">
                            Roll: {rollNo} &bull; {course} &bull; {semester}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-gray-800">{getReasonLabel(req.reason)}</div>
                          {req.customReason && (
                            <div className="text-[10px] text-gray-400 italic mt-0.5">"{req.customReason}"</div>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                              {req.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {req.status}
                            </span>
                            {req.status === 'approved' && (
                              <span className="font-mono text-xs text-gray-500 font-semibold">{req.certificateNumber}</span>
                            )}
                          </div>
                          {req.status === 'rejected' && req.rejectionReason && (
                            <div className="text-[9px] text-red-500 font-bold mt-1">Reason: {req.rejectionReason}</div>
                          )}
                          <div className="text-[9px] text-gray-400 font-semibold mt-1 uppercase tracking-widest">
                            Handled By: {req.approvedBy?.fullName || 'System Registrar'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col justify-center items-center gap-3 text-gray-400">
              <Sparkles className="w-8 h-8 text-gray-300" />
              <p className="text-xs font-black uppercase tracking-wider">No processed certificate entries logged in history</p>
            </div>
          )
        )}
      </div>

      {/* Rejection Cause Modal */}
      {rejectionId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[3rem] border border-gray-100 shadow-2xl p-8 space-y-6 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-gray-900 uppercase tracking-wider">Reject Request</h4>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Please provide formal reason for rejection</p>
              </div>
              <button 
                onClick={() => setRejectionId(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rejection Comment</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  placeholder="Specify why this bonafide request is being rejected (e.g. incorrect database roll number, pending documentation)..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary-500 min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectionId(null)}
                  className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all text-xs font-bold shadow-md shadow-red-600/10 flex items-center gap-1.5"
                >
                  {submittingAction ? 'Rejecting...' : 'Reject Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBonafideDashboardPage;
