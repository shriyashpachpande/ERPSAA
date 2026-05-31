import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentById } from '../../services/studentMasterService';
import { ArrowLeft, User, Activity, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { getFileUrl } from '../../../../utils/fileUrlResolver';

const StudentMasterDetailPanel = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const res = await getStudentById(studentId);
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetail();
  }, [studentId]);

  if (loading) return (
     <div className="flex justify-center py-20 animate-pulse">
        <h3 className="font-bold text-gray-400 tracking-widest uppercase">Fetching Master Record...</h3>
     </div>
  );

  if (!student) return <div className="text-center py-10 text-gray-500 font-bold">Record not found</div>;

  const { personalDetails, moduleStatus, academicProfile, history } = student;

  return (
    <div className="max-w-7xl mx-auto pb-10">
       <Link 
         to="/app/staff/student-directory" 
         className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest mb-6 transition-colors"
       >
         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
       </Link>

       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10 mb-6 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

          <div className="w-32 h-32 rounded-3xl border-4 border-gray-50 flex-shrink-0 bg-white overflow-hidden shadow-xl z-10 flex items-center justify-center">
             {getFileUrl(personalDetails?.profilePhotoUrl) ? (
                <img src={getFileUrl(personalDetails.profilePhotoUrl)} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <User className="w-20 h-20 text-gray-300" />
             )}
          </div>

          <div className="flex-1 z-10">
             <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{personalDetails?.fullName}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200 tracking-wider">
                   {student.enrollmentStatus}
                </span>
             </div>
             
             <p className="text-indigo-600 font-black tracking-widest text-lg mb-6">{student.studentId}</p>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                   <p className="text-sm font-bold text-gray-900">{student.contactDetails?.email}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                   <p className="text-sm font-bold text-gray-900">{student.contactDetails?.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</p>
                   <p className="text-sm font-bold text-gray-900">{academicProfile?.department}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Course</p>
                   <p className="text-sm font-bold text-gray-900">{academicProfile?.course}</p>
                </div>
             </div>
          </div>
       </div>

       {/* Module Integrations Viewer */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-6 tracking-tight flex items-center">
                   <Activity className="w-5 h-5 mr-3 text-indigo-500" /> Connected ERP Modules
                </h2>
                <div className="space-y-4">
                   {Object.entries(student.modules || {}).map(([modName, modData], idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                               {modData.status.includes('pending') ? <AlertCircle className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                            <span className="font-bold text-gray-700 capitalize group-hover:text-indigo-900 transition-colors">{modName}</span>
                         </div>
                         <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-600 transition-colors">
                                {modData.status.replace('_', ' ')}
                             </span>
                             <button type="button" className="text-[10px] font-bold text-indigo-600 px-3 py-1.5 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                Manage
                             </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             {/* Audit Log Stub */}
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
                <h2 className="text-base font-black text-gray-900 mb-6 tracking-tight flex items-center">
                   <FileText className="w-4 h-4 mr-2 text-gray-400" /> Timeline & Audit
                </h2>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                   {student.history?.map((event, idx) => (
                     <div key={idx} className="pl-6 relative">
                        <div className="absolute w-3 h-3 bg-indigo-500 border-2 border-white rounded-full -left-[7px] top-1"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{new Date(event.timestamp).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{event.action.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">{event.details?.note}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StudentMasterDetailPanel;
