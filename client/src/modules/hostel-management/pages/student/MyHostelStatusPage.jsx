import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplication, getMyRoom } from '../../services/hostelService';
import { 
  Home, CheckCircle2, Clock, XCircle, AlertCircle, 
  ChevronRight, ArrowRight, MapPin, Bed, Info, MessageSquare, Wrench
} from 'lucide-react';
import gsap from 'gsap';

const StatusStep = ({ icon: Icon, title, status, isActive, isLast }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 text-white';
      case 'current': return 'bg-indigo-600 text-white shadow-lg shadow-indigo-200';
      case 'pending': return 'bg-gray-200 text-gray-400';
      case 'error': return 'bg-rose-500 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  const getLineColor = () => {
    return status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200';
  };

  return (
    <div className="flex items-start gap-4 flex-1 relative min-w-[150px]">
      {!isLast && (
        <div className={`absolute top-5 left-10 w-full h-[2px] ${getLineColor()} hidden md:block`} />
      )}
      <div className="relative z-10 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${getStatusColor()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className={`mt-3 text-xs font-black uppercase tracking-widest text-center ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

const MyHostelStatusPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, roomRes] = await Promise.all([
          getMyApplication(),
          getMyRoom()
        ]);
        setApplication(appRes.data.data);
        setAllocation(roomRes.data.data);
      } catch (err) {
        setError('Failed to fetch hostel status.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.stagger-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-12 bg-white rounded-3xl shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 text-center stagger-item">
        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
          <Home className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">No Active Application</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">You haven't applied for hostel accommodation yet. Apply now to track your status and get allocated.</p>
        <button 
          onClick={() => navigate('/app/student/hostel/apply')}
          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto uppercase tracking-widest text-xs"
        >
          Start Application <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const getStatusSteps = () => {
    const steps = [
      { id: 'Pending', title: 'Submitted', icon: CheckCircle2 },
      { id: 'Approved', title: 'Review', icon: Clock },
      { id: 'Allocated', title: 'Allotted', icon: Bed },
      { id: 'Fees', title: 'Fees', icon: Info },
      { id: 'CheckedIn', title: 'Checked-In', icon: MapPin }
    ];

    let currentStep = -1;
    if (application.status === 'Pending') currentStep = 0;
    else if (application.status === 'Approved') currentStep = 1;
    else if (application.status === 'Allocated') currentStep = 2;
    else if (application.status === 'CheckedIn') currentStep = 4;

    // Logic for Fees step (2.5 - 3)
    // If Allocated, but no check-in, we are effectively at step 2.5
    // We'll show Allotted as current until CheckedIn

    return steps.map((step, idx) => {
      let status = 'pending';
      if (idx < currentStep) status = 'completed';
      else if (idx === currentStep) status = 'current';
      
      if (application.status === 'Rejected' && idx === 1) status = 'error';
      if (application.status === 'Waitlisted' && idx === 1) status = 'current';

      return { ...step, status };
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20" ref={containerRef}>
      <div className="stagger-item mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Hostel Portal</h1>
        <p className="text-gray-500">Track your application, view room details, and manage services.</p>
      </div>

      {/* Application Status Tracker */}
      <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 mb-8 overflow-x-auto">
        <h2 className="text-lg font-black text-gray-900 mb-10 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Application Process Flow
        </h2>
        <div className="flex justify-between items-start min-w-[600px] px-4">
          {getStatusSteps().map((step, idx) => (
            <StatusStep 
              key={step.id} 
              {...step} 
              isLast={idx === getStatusSteps().length - 1} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Allocation Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100 h-full">
            <h2 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
              <Bed className="w-5 h-5 text-indigo-500" />
              Room Allocation Overview
            </h2>
            
            {allocation ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Current Residence</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">Hostel</span>
                      <span className="text-sm font-black text-gray-900">{allocation.hostelId.name} ({allocation.hostelId.type})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">Block / Floor</span>
                      <span className="text-sm font-black text-gray-900">{allocation.blockId.name} / Floor {allocation.floorId.floorNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">Room Number</span>
                      <span className="text-sm font-black text-indigo-600 px-3 py-1 bg-white rounded-lg border border-indigo-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">{allocation.roomId.roomNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">Bed Identification</span>
                      <span className="text-sm font-black text-gray-900">Bed {allocation.bedId.bedNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Room Type</p>
                    <p className="text-base font-black text-gray-900">{allocation.roomId.roomType}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Allocation Date</p>
                    <p className="text-base font-black text-gray-900">{new Date(allocation.allocationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 col-span-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-in Status</p>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${application.status === 'CheckedIn' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                       <p className="text-base font-black text-gray-900">{application.status === 'CheckedIn' ? 'Checked In' : 'Arrival Expected'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-white text-gray-300 rounded-2xl flex items-center justify-center shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] mb-4">
                   <Info className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Allocation In Progress</h3>
                <p className="text-gray-500 text-sm text-center">Once your application is approved, the warden will allocate a room and bed for you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Contact */}
        <div className="space-y-8">
          <div className="stagger-item bg-brand-dark text-white rounded-3xl p-8 shadow-xl shadow-gray-200">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-400" />
              Quick Support
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/app/student/hostel/complaints')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">Raise Complaint</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </button>

              <button 
                onClick={() => navigate('/app/student/hostel/maintenance')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">Maintenance Request</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </button>
            </div>
          </div>

          <div className="stagger-item bg-white rounded-3xl p-8 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              Essential Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                <p className="text-xs text-gray-500 font-medium">Keep your ID card ready during check-in.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                <p className="text-xs text-gray-500 font-medium">Hostel fees must be cleared within 7 days of allotment.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                <p className="text-xs text-gray-500 font-medium">Emergency contacts are available 24/7 on the dashboard.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyHostelStatusPage;
