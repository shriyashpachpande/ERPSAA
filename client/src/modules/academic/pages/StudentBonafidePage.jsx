import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import AcademicPageHeader from '../components/shared/AcademicPageHeader';
import { FileText, Plus, Sparkles, Clock, CheckCircle, XCircle, Download, BookOpen, User, Calendar, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentBonafidePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('bank_account');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/academic/bonafide/my-requests');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      toast.error('Could not load certificate history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        reason,
        customReason: reason === 'other' ? customReason : undefined
      };

      const res = await axiosInstance.post('/academic/bonafide/request', payload);

      if (res.data.success) {
        toast.success('Bonafide request submitted successfully!');
        setModalOpen(false);
        setCustomReason('');
        setReason('bank_account');
        fetchRequests();
      }
    } catch (err) {
      console.error('Request failed:', err);
      toast.error(err.response?.data?.error || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintCertificate = (reqItem) => {
    const student = reqItem.studentId;
    const fullName = student?.personalDetails?.fullName || "Student Name";
    const rollNo = student?.studentId || "N/A";
    const course = student?.academicProfile?.course || "Course";
    const semester = reqItem.semester || `Sem ${student?.academicProfile?.currentSemester || 1}`;
    const certNo = reqItem.certificateNumber || "BONA-TEMP";
    const issueDate = new Date(reqItem.approvedAt || reqItem.updatedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow pop-ups to print your certificate.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bonafide Certificate - ${fullName}</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
          }
          .certificate-border {
            max-width: 800px;
            margin: 40px auto;
            border: 6px double #1e3a8a;
            padding: 50px;
            position: relative;
            background: #fff;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 70px;
            color: rgba(30, 58, 138, 0.03);
            font-weight: 900;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
            z-index: 0;
            font-family: sans-serif;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #1e3a8a;
            padding-bottom: 20px;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
          }
          .header h1 {
            margin: 0;
            font-size: 30px;
            color: #1e3a8a;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
            color: #475569;
            letter-spacing: 2px;
          }
          .cert-title {
            text-align: center;
            font-size: 26px;
            font-weight: bold;
            text-decoration: underline;
            color: #0f172a;
            letter-spacing: 2px;
            margin-bottom: 40px;
            text-transform: uppercase;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 40px;
            font-weight: bold;
          }
          .cert-content {
            font-size: 18px;
            line-height: 1.8;
            text-align: justify;
            text-justify: inter-word;
            margin-bottom: 60px;
            z-index: 1;
            position: relative;
          }
          .highlight {
            font-weight: bold;
            color: #1e3a8a;
          }
          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 80px;
            position: relative;
            z-index: 1;
          }
          .seal-box {
            text-align: center;
            font-size: 11px;
            color: #64748b;
          }
          .seal-circle {
            width: 90px;
            height: 90px;
            border: 2px dashed #1e3a8a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0 auto 10px auto;
            font-size: 10px;
            text-transform: uppercase;
          }
          .signature-box {
            text-align: center;
            width: 220px;
          }
          .signature-line {
            border-top: 1px solid #1e293b;
            margin-top: 60px;
            padding-top: 8px;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .actions {
            max-width: 800px;
            margin: 20px auto 0 auto;
            text-align: right;
          }
          .btn-print {
            background-color: #1e3a8a;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
            transition: all 0.2s;
          }
          .btn-print:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="certificate-border">
          <div class="watermark">MGM CERTIFIED</div>
          
          <div class="header">
            <h1>MGM's College of Engineering</h1>
            <p>Approved by AICTE New Delhi &bull; Affiliated to SRTMU Nanded</p>
          </div>
          
          <div class="cert-title">Bonafide Certificate</div>
          
          <div class="meta-info">
            <div>Ref No: <span style="font-family: monospace;">${certNo}</span></div>
            <div>Date: <span>${issueDate}</span></div>
          </div>
          
          <div class="cert-content">
            This is to certify that Mr. / Ms. &nbsp;<span class="highlight">${fullName}</span>&nbsp; 
            Std Id &nbsp;<span class="highlight" style="font-family: monospace;">${rollNo}</span>&nbsp; is a bonafide student of this 
            institution, studying in the course &nbsp;<span class="highlight">${course}</span>&nbsp; 
            Semester &nbsp;<span class="highlight">${semester}</span>&nbsp; during the academic session 
            <span class="highlight">${new Date().getFullYear()}-${new Date().getFullYear() + 1}</span>.
            <br/><br/>
            To the best of our knowledge, his / her character and conduct during the study in this college 
            have been found to be exemplary. This certificate is being issued upon his / her request to be 
            submitted for the purpose of &nbsp;<span class="highlight" style="text-transform: uppercase; font-size: 16px;">${reqItem.reason.replace('_', ' ')}</span>.
          </div>
          
          <div class="footer-section">
            <div class="seal-box" style="text-align: left;">
              <div style="border: 2px solid #10b981; color: #10b981; border-radius: 8px; width: 140px; padding: 8px; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <div style="font-size: 10px; font-weight: bold; letter-spacing: 1px;">DIGITALLY SIGNED</div>
                <div style="font-size: 16px; font-weight: 900; color: #10b981;">✓ VERIFIED</div>
                <div style="font-size: 8px; color: #64748b; font-weight: bold; text-align: center; text-transform: uppercase;">SECURED BY ERPSAA</div>
              </div>
            </div>
            
            <div class="signature-box" style="text-align: center; width: 250px;">
              <img src="/director_signature.jpeg" alt="Director Signature" style="width: 220px; height: auto; mix-blend-mode: multiply; filter: contrast(3) brightness(1.3); display: block; margin: 0 auto;" />
            </div>
          </div>
        </div>
        
        <div class="actions no-print">
          <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
      <AcademicPageHeader
        title="Bonafide Certificate"
        subtitle="Request, track, and download official college bonafide letters"
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-3xl">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {requests.filter(r => r.status === 'pending').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Certificates</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {requests.filter(r => r.status === 'approved').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-brand-dark text-white rounded-3xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setModalOpen(true)}>
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Action Hub</p>
            <button onClick={() => setModalOpen(true)} className="text-sm font-black text-primary-600 hover:text-primary-700 uppercase tracking-wider mt-0.5">
              Apply New Bonafide
            </button>
          </div>
        </div>
      </div>

      {/* Certificate History */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Application Ledger</h3>
            <p className="text-[9px] font-black text-gray-400 mt-0.5 uppercase tracking-widest">Track status of submitted request channels</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-2xl hover:bg-brand-dark/95 transition-all text-xs font-bold shadow-md shadow-brand-dark/10"
          >
            <Plus className="w-4 h-4" /> Apply Request
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col justify-center items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading ledger...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="p-6">Submission Date</th>
                  <th className="p-6">Reason / Purpose</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Certificate No</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6 text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-800">{getReasonLabel(req.reason)}</div>
                      {req.customReason && <div className="text-[10px] text-gray-400 italic mt-0.5">"{req.customReason}"</div>}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${req.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                        {req.status === 'pending' && <Clock className="w-3 h-3" />}
                        {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                      {req.status === 'rejected' && req.rejectionReason && (
                        <div className="text-[9px] text-red-500 font-bold mt-1">Comment: {req.rejectionReason}</div>
                      )}
                    </td>
                    <td className="p-6 font-mono text-gray-800">
                      {req.certificateNumber || <span className="text-gray-300">Generating on Approval...</span>}
                    </td>
                    <td className="p-6 text-center">
                      {req.status === 'approved' ? (
                        <button
                          onClick={() => handlePrintCertificate(req)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider"
                        >
                          <Download className="w-3.5 h-3.5" /> Print Certificate
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col justify-center items-center gap-3 text-gray-400">
            <Sparkles className="w-8 h-8 text-gray-300" />
            <p className="text-xs font-black uppercase tracking-wider">No active requests logged in application history</p>
          </div>
        )}
      </div>

      {/* Application Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[3rem] border border-gray-100 shadow-2xl p-8 space-y-6 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-gray-900 uppercase tracking-wider">Bonafide Request</h4>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Submit details for registrar review</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Purpose of Certificate</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary-500"
                >
                  <option value="bank_account">Opening a Bank Account</option>
                  <option value="passport">Passport Application</option>
                  <option value="scholarship">Scholarship Application / Claim</option>
                  <option value="bus_pass">Institutional / Transport Bus Pass</option>
                  <option value="other">Other / Custom Purpose</option>
                </select>
              </div>

              {reason === 'other' && (
                <div className="space-y-2 animate-in slide-in-from-top duration-200">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Custom Purpose Detail</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                    placeholder="Describe the reason for requesting the bonafide..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary-500 min-h-[80px]"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-brand-dark text-white rounded-2xl hover:bg-brand-dark/95 transition-all text-xs font-bold shadow-md shadow-brand-dark/10 flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting...' : 'Submit Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBonafidePage;
