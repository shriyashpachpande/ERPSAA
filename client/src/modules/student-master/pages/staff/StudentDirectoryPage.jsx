import React, { useState, useEffect, useRef } from 'react';
import { getAllStudents } from '../../services/studentMasterService';
import { Search, Filter, ChevronRight, User, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const StudentDirectoryPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const tableRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && students.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('.stagger-row');
      gsap.fromTo(rows, 
        { autoAlpha: 0, y: 15 }, 
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, students]);

  const filteredStudents = students.filter(s => 
    s.personalDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Directory</h1>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Unified Master Records</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm">
             <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Base</th>
                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Modules</th>
                <th className="text-right py-4 px-6 font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 text-sm font-bold animate-pulse">
                    Loading Unified Records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                     <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     <p className="font-bold">No records found</p>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student._id} className="stagger-row hover:bg-gray-50/50 transition-colors group opacity-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {student.personalDetails?.profilePhotoUrl ? (
                          <img src={student.personalDetails.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-extrabold text-indigo-700 text-xs">
                             {student.personalDetails?.fullName?.substring(0,2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 tracking-tight">{student.personalDetails?.fullName}</p>
                        <p className="text-xs text-gray-500 font-medium">{student.contactDetails?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                     <p className="font-black text-indigo-600 text-xs mb-1">{student.studentId}</p>
                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {student.enrollmentStatus}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                     <p className="font-bold text-gray-900 text-sm">{student.academicProfile?.course}</p>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{student.academicProfile?.department}</p>
                  </td>
                  <td className="py-4 px-6">
                     <div className="flex -space-x-1">
                        {Object.entries(student.modules || {}).slice(0,3).map(([key, mod], idx) => (
                          <div key={key} className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center shadow-sm" title={`${key}: ${mod.status}`}>
                             <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        ))}
                        {Object.keys(student.modules || {}).length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                             <span className="text-[9px] font-black text-gray-600">+{Object.keys(student.modules).length - 3}</span>
                          </div>
                        )}
                     </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/app/staff/student-directory/${student._id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
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

export default StudentDirectoryPage;
