import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, CheckCircle, Activity, Info, Users, ShieldAlert, Navigation, DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const StudentFacilityDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    classroom: '',
    lab: ''
  });

  // Classroom rooms — shown only when slug === 'classrooms'
  const isClassroomFacility = slug === 'classrooms';
  const GROUND_FLOOR = Array.from({ length: 20 }, (_, i) => `G${i + 1}`);
  const FIRST_FLOOR  = Array.from({ length: 20 }, (_, i) => `F${i + 1}`);

  // Computer lab rooms — shown only when slug === 'computer-labs'
  const isComputerLabFacility = slug === 'computer-labs';
  const COMPUTER_LABS = ['Lab A', 'Lab B', 'Lab C', 'Lab D', 'PG Lab', 'CCC'];

  useEffect(() => {
    fetchFacility();
  }, [slug]);

  useEffect(() => {
    if (!loading && facility && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [loading, facility]);

  const fetchFacility = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/eventsFacilities/catalog/facilities/${slug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFacility(data.data);
      } else {
        toast.error('Facility not found.');
        navigate('/app/student/events/home');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Compute today's date in YYYY-MM-DD (local time) for the min attribute
  const todayStr = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard: reject past dates (in case the browser allowed a manual entry)
    if (formData.date < todayStr) {
      toast.error('Please select today or a future date.');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End Time must be strictly after Start Time.');
      return;
    }

    if (isClassroomFacility && !formData.classroom) {
      toast.error('Please select a classroom before submitting.');
      return;
    }

    if (isComputerLabFacility && !formData.lab) {
      toast.error('Please select a lab before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/eventsFacilities/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          facilitySlug: slug,
          ...formData
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success("Facility successfully scheduled for approval.");
        setTimeout(() => {
          navigate('/app/student/events/requests');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to submit booking Request.');
      }
    } catch (err) {
      toast.error('Network error during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Activity className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (success) {
     return (
      <div className="min-h-screen p-6 lg:p-10 bg-slate-50 text-slate-800 flex items-center justify-center border-l border-slate-200">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-md w-full text-center flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex flex-col items-center justify-center text-emerald-600 mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-900">Request Queued</h2>
          <p className="text-slate-500 mb-8 font-medium">Your request for {facility.name} is now pending admin/staff approval.</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:p-10 bg-slate-50 text-slate-900 relative overflow-hidden rounded-tl-2xl border-l border-slate-200"
      style={{ boxShadow: "0 0 20px 0px rgba(59, 130, 246, 0.2)" }}>
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none -mt-20 -mr-20"></div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col lg:flex-row gap-10">
        
        {/* Detail Panel */}
        <div className="lg:w-1/3 space-y-6">
           <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 backdrop-blur-sm">
                <Navigation className="w-3.5 h-3.5" />
                <span>{facility.categoryId?.name || 'Facility'}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2 leading-tight">{facility.name}</h1>
              
              <div className="flex items-center gap-2 mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                 <Users className="w-5 h-5 text-blue-200" />
                 <div>
                    <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest">Max Capacity</p>
                    <p className="font-bold">{facility.capacity} Persons</p>
                 </div>
              </div>
           </div>

           {facility.rules?.length > 0 && (
             <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center">
                   <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" /> Operating Guidelines
                </h3>
                <ul className="space-y-3">
                   {facility.rules.map((rule, idx) => (
                     <li key={idx} className="flex gap-3 text-sm font-medium text-slate-600">
                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        {rule}
                     </li>
                   ))}
                </ul>
             </div>
           )}
        </div>

        {/* Form Panel */}
        <div className="lg:w-2/3">
           <form onSubmit={handleSubmit} ref={formRef} className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-8 lg:p-12 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
             <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
               Request Booking <Info className="w-5 h-5 text-blue-500" />
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Date Required</label>
                  <div className="relative flex items-center group">
                    <Calendar className="w-4 h-4 absolute left-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="date"
                      name="date"
                      required
                      min={todayStr}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Start Time</label>
                  <div className="relative flex items-center group">
                    <Clock className="w-4 h-4 absolute left-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">End Time</label>
                  <div className="relative flex items-center group">
                    <Clock className="w-4 h-4 absolute left-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 group-hover:border-blue-300 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                 {/* Classroom Selector — only for the Classrooms facility */}
                 {isClassroomFacility && (
                   <div className="space-y-5 md:col-span-2">
                     <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                       <DoorOpen className="w-3.5 h-3.5 text-blue-500" /> Select Classroom
                       {formData.classroom && (
                         <span className="ml-2 px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-widest">
                           {formData.classroom} Selected
                         </span>
                       )}
                     </label>

                     {/* Ground Floor */}
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Ground Floor</p>
                       <div className="flex flex-wrap gap-2">
                         {GROUND_FLOOR.map(room => (
                           <button
                             key={room}
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, classroom: prev.classroom === room ? '' : room }))}
                             className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all duration-150 ${
                               formData.classroom === room
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105'
                                 : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                             }`}
                           >
                             {room}
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* First Floor */}
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">First Floor</p>
                       <div className="flex flex-wrap gap-2">
                         {FIRST_FLOOR.map(room => (
                           <button
                             key={room}
                             type="button"
                             onClick={() => setFormData(prev => ({ ...prev, classroom: prev.classroom === room ? '' : room }))}
                             className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all duration-150 ${
                               formData.classroom === room
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105'
                                 : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                             }`}
                           >
                             {room}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Computer Lab Selector — only for the Computer Labs facility */}
                 {isComputerLabFacility && (
                   <div className="space-y-4 md:col-span-2">
                     <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                       <DoorOpen className="w-3.5 h-3.5 text-blue-500" /> Select Lab
                       {formData.lab && (
                         <span className="ml-2 px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-widest">
                           {formData.lab} Selected
                         </span>
                       )}
                     </label>
                     <div className="flex flex-wrap gap-3">
                       {COMPUTER_LABS.map(lab => (
                         <button
                           key={lab}
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, lab: prev.lab === lab ? '' : lab }))}
                           className={`px-5 py-2.5 rounded-xl text-xs font-black border transition-all duration-150 ${
                             formData.lab === lab
                               ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105'
                               : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                           }`}
                         >
                           {lab}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Detailed Purpose / Event Name</label>
                  <textarea
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide full description of the event to help authorities approve quickly..."
                    className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 resize-none text-sm font-semibold shadow-sm leading-relaxed placeholder-slate-400"
                  ></textarea>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black tracking-wide py-5 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 uppercase text-sm"
                  >
                    {submitting ? (
                      <Activity className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Submit Booking Authorization <ChevronRight className="w-5 h-5 ml-3" /></>
                    )}
                  </button>
                </div>

             </div>
           </form>
        </div>

      </div>
    </div>
  );
};

export default StudentFacilityDetailPage;
