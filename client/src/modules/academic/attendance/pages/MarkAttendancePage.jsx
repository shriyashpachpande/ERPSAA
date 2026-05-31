import { useState, useEffect, useMemo } from 'react';
import {
  Users, Calendar, Clock, BookOpen, CheckCircle, XCircle,
  HelpCircle, MoreHorizontal, Save, Send, AlertCircle, Info,
  ChevronRight, Filter, Layout
} from 'lucide-react';
import AcademicPageHeader from '../../components/shared/AcademicPageHeader';
import { useSections } from '../../hooks/useSections';
import { useAcademicYears } from '../../hooks/useAcademicYears';
import * as attendanceApi from '../services/attendanceApi';
import { toast } from 'react-hot-toast';

const MarkAttendancePage = () => {
  const { years } = useAcademicYears();
  const [filters, setFilters] = useState({
    academicYearId: '',
    semesterId: '',
    sectionId: '',
    subjectId: ''
  });

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('Scheduled');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [remarks, setRemarks] = useState('');

  const { sections, loading: sectionsLoading } = useSections({
    academicYearId: filters.academicYearId,
    semesterId: filters.semesterId
  });

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: status }
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Auto-resolve years/semesters if needed or just use selection
  // In a real app, we might get these from active context

  useEffect(() => {
    if (filters.sectionId) {
      fetchSubjects(filters.sectionId);
      fetchStudents(filters.sectionId);
    } else {
      setSubjects([]);
      setStudents([]);
    }
  }, [filters.sectionId]);

  const fetchSubjects = async (sectionId) => {
    setSubjectsLoading(true);
    try {
      const resp = await attendanceApi.getSubjectsForSection(sectionId);
      setSubjects(resp.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchStudents = async (sectionId) => {
    setStudentsLoading(true);
    try {
      const resp = await attendanceApi.getStudentsForSection(sectionId);
      const studentList = resp.data.data;
      setStudents(studentList);

      // Initialize all as Present
      const initial = {};
      studentList.forEach(s => {
        initial[s.studentMasterId._id] = 'Present';
      });
      setAttendanceData(initial);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.studentMasterId._id] = status;
    });
    setAttendanceData(updated);
  };

  const handleSubmit = async (statusOverride = 'Submitted') => {
    if (!filters.sectionId || !filters.subjectId || !attendanceDate || !startTime || !endTime) {
      toast.error('Please complete all required fields (Section, Subject, Date, Start & End Time)');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be later than start time');
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        academicYearId: filters.academicYearId,
        semesterId: filters.semesterId,
        sectionId: filters.sectionId,
        subjectId: filters.subjectId,
        date: attendanceDate,
        startTime,
        endTime,
        room,
        remarks,
        sessionType,
        submissionStatus: statusOverride
      };

      const entriesData = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status
      }));

      await attendanceApi.markAttendance({ sessionData, entriesData });
      toast.success(`Attendance ${statusOverride.toLowerCase()} successfully!`);

      // Reset after success if submitted
      if (statusOverride === 'Submitted') {
        // Option: Redirect to report or clear form
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const present = Object.values(attendanceData).filter(s => s === 'Present').length;
    const absent = total - present;
    return { total, present, absent, percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0 };
  }, [students, attendanceData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AcademicPageHeader
        title="Mark Attendance"
        subtitle="Manage daily student presence and extra session logging"
      />

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Selection Context
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2 block ml-1">Section / Class</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  value={filters.sectionId}
                  onChange={(e) => {
                    const secId = e.target.value;
                    const selectedSec = sections.find(s => s._id === secId);
                    setFilters({
                      ...filters,
                      sectionId: secId,
                      academicYearId: selectedSec?.academicYearId?._id || selectedSec?.academicYearId || '',
                      semesterId: selectedSec?.semesterId?._id || selectedSec?.semesterId || ''
                    });
                  }}
                >
                  <option value="">Select Section</option>
                  {years.map(y => {
                    const yearSections = sections.filter(sec =>
                      (sec.academicYearId?._id || sec.academicYearId) === y._id
                    );
                    if (yearSections.length === 0) return null;

                    return (
                      <optgroup key={y._id} label={y.name}>
                        {yearSections.map(sec => (
                          <option key={sec._id} value={sec._id}>{sec.name}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Subject</label>
                <select
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all disabled:opacity-50"
                  value={filters.subjectId}
                  onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                  disabled={!filters.sectionId || subjectsLoading}
                >
                  <option value="">{subjectsLoading ? 'Loading...' : 'Select Subject'}</option>
                  {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.subjectName}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Session Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Session Type</label>
                <div className="flex gap-2">
                  {['Scheduled', 'Extra'].map(type => (
                    <button type="button"
                      key={type}
                      onClick={() => setSessionType(type)}
                      className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sessionType === type ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2 block ml-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2 block ml-1">End Time</label>
                  <input
                    type="time"
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Room / Lab (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Room 302, CS Lab"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">Remarks (Optional)</label>
                <textarea
                  placeholder="Additional session notes..."
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-600 transition-all resize-none h-20"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </div>

          {students.length > 0 && (
            <div className="bg-brand-dark p-8 rounded-[2.5rem] shadow-xl text-white space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-3xl">
                  <p className="text-2xl font-black">{stats.present}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">Present</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl">
                  <p className="text-2xl font-black">{stats.absent}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-red-400">Absent</p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span>Occupancy</span>
                  <span>{stats.percentage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${stats.percentage}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student List Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4 bg-gray-50/30">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-600" /> Student Manifest
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Review and Mark Attendance</p>
              </div>

              {students.length > 0 && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => markAll('Present')} className="px-4 py-2 bg-emerald-50 text-[#10B981] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all">All Present</button>
                  <button type="button" onClick={() => markAll('Absent')} className="px-4 py-2 bg-red-50 text-[#EF4444] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all">All Absent</button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              {!filters.sectionId ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center">
                    <Layout className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Please select a section to load student roster</p>
                </div>
              ) : studentsLoading ? (
                <div className="py-20 text-center animate-pulse space-y-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl mx-auto"></div>
                  <p className="text-xs font-black text-primary-600 uppercase tracking-widest">Enabling rosters...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <Info className="w-10 h-10 text-gray-200 mx-auto" />
                  <p className="text-sm font-bold text-gray-400 italic">No active enrollments found for this section</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {students.map((enrollment) => {
                    const student = enrollment.studentMasterId;
                    const status = attendanceData[student._id];

                    return (
                      <div
                        key={student._id}
                        className={`p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col justify-between h-full ${status === 'Present' ? 'bg-emerald-50/50 border-emerald-100' :
                            status === 'Absent' ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-100'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black ring-4 ring-white shadow-sm ${status === 'Present' ? 'bg-emerald-500 text-white' :
                                status === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'
                              }`}>
                              {student.personalDetails?.fullName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900 line-clamp-1">{student.personalDetails?.fullName}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{student.studentId}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button type="button"
                                onClick={() => handleStatusChange(student._id, 'Present')}
                                className={`p-2.5 rounded-xl transition-all ${status === 'Present' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-gray-300 hover:text-emerald-500 border border-gray-100'}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button type="button"
                                onClick={() => handleStatusChange(student._id, 'Absent')}
                                className={`p-2.5 rounded-xl transition-all ${status === 'Absent' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-300 hover:text-red-500 border border-gray-100'}`}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => handleStatusChange(student._id, 'Late')} className={`flex-1 py-1 px-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${status === 'Late' ? 'bg-amber-500 text-white' : 'bg-white text-gray-300 border border-gray-100'}`}>Late</button>
                              <button type="button" onClick={() => handleStatusChange(student._id, 'Excused')} className={`flex-1 py-1 px-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${status === 'Excused' ? 'bg-blue-500 text-white' : 'bg-white text-gray-300 border border-gray-100'}`}>Exc</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {students.length > 0 && (
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-4 overflow-x-auto">
                <button type="button"
                  disabled={loading}
                  onClick={() => handleSubmit('Draft')}
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-gray-200 transition-all flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
                <button type="button"
                  disabled={loading}
                  onClick={() => handleSubmit('Submitted')}
                  className="px-10 py-4 bg-brand-dark text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                >
                  <Send className="w-3.5 h-3.5" /> {loading ? 'Submitting...' : 'Final Submission'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendancePage;
