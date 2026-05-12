import React, { useState, useEffect, useRef } from 'react';
import { 
  getAllocationHostels,
  getHostelHierarchy,
  getRoomBeds,
  getAllocationReadyStudents,
  assignBed
} from '../../services/hostelAllocationService';
import { 
  Bed, Home, Check, ChevronRight, 
  Search, ArrowLeft, CreditCard, Info, AlertCircle,
  Layout, Layers, DoorOpen, UserCheck, Users
} from 'lucide-react';

const RoomAllocationPage = () => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Hostel, 2: Location (Block/Floor/Room), 3: Student, 4: Bed, 5: Summary
  
  // Data State
  const [hostels, setHostels] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [beds, setBeds] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  
  // Selection State
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Form State
  const [feeAmount, setFeeAmount] = useState(25000); 
  const [feeDescription, setFeeDescription] = useState('Hostel Accommodation Fee (Annual)');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initial Load
  useEffect(() => {
    const initFetch = async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          getAllocationHostels(),
          getAllocationReadyStudents()
        ]);
        setHostels(hRes.data || []);
        setStudents(sRes.data || []);
      } catch (err) {
        setError('Failed to initialize allocation data.');
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Handlers
  const handleSelectHostel = async (hostel) => {
    setLoading(true);
    setSelectedHostel(hostel);
    try {
      const res = await getHostelHierarchy(hostel._id);
      setHierarchy(res.data || []);
      setStep(2);
    } catch (err) {
      setError('Failed to load hostel hierarchy.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = async (block, floor, room) => {
    setSelectedBlock(block);
    setSelectedFloor(floor);
    setSelectedRoom(room);
    setStep(3); // Move to student selection after picking room
  };

  const handleSelectStudent = (app) => {
    setSelectedApp(app);
    // Load beds for the previously selected room
    fetchBeds(selectedRoom._id);
  };

  const fetchBeds = async (roomId) => {
    setLoading(true);
    try {
      const res = await getRoomBeds(roomId);
      setBeds(res.data || []);
      setStep(4);
    } catch (err) {
      setError('Failed to load beds for the selected room.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalAssign = async () => {
    setSubmitting(true);
    setError('');
    try {
      await assignBed({
        applicationId: selectedApp._id,
        studentId: selectedApp.studentId?._id,
        hostelId: selectedHostel._id,
        roomId: selectedRoom._id,
        bedId: selectedBed._id,
        hostelFeeAmount: feeAmount,
        feeDescription
      });
      setSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Assignment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
      {[
        { n: 1, label: 'Hostel' },
        { n: 2, label: 'Location' },
        { n: 3, label: 'Student' },
        { n: 4, label: 'Bed' },
        { n: 5, label: 'Review' }
      ].map((s) => (
        <div key={s.n} className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
            step === s.n ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
            step > s.n ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > s.n ? <Check className="w-4 h-4" /> : s.n}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.n ? 'text-indigo-600' : 'text-gray-400'}`}>
            {s.label}
          </span>
          {s.n < 5 && <div className="w-4 h-px bg-gray-200 mx-2" />}
        </div>
      ))}
    </div>
  );

  if (loading && step === 1) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Manual Room Allocation</h1>
          <p className="text-gray-500 italic">Securely assigning approved residents to verified facilities.</p>
        </div>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-indigo-600 transition-all uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      {renderStepIndicator()}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-black">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
          <Check className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-black">Success! Beds updated and fee triggered.</p>
        </div>
      )}

      {/* Step 1: Hostel */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {hostels.map(h => (
            <div key={h._id} onClick={() => handleSelectHostel(h)} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group">
              <Home className="w-12 h-12 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">{h.name}</h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{h.type} Residency</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Select Facility</span>
                <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Location Hierarchy */}
      {step === 2 && selectedHostel && (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Selected Hostel:</span>
              <span className="text-sm font-black text-indigo-600">{selectedHostel.name}</span>
           </div>

           {hierarchy.map(block => (
             <div key={block._id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center"><Layout className="w-5 h-5 text-indigo-600" /></div>
                   <h2 className="text-2xl font-black text-gray-900">{block.name}</h2>
                </div>

                <div className="space-y-12">
                   {block.floors.map(floor => (
                     <div key={floor._id} className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                           <Layers className="w-4 h-4 text-gray-400" />
                           <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Floor {floor.floorNumber} — {floor.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {floor.rooms.map(room => (
                             <button 
                               key={room._id} 
                               onClick={() => handleSelectRoom(block, floor, room)}
                               className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-indigo-600 hover:bg-white transition-all text-left flex items-start justify-between group"
                             >
                                <div>
                                   <p className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600">Room {room.roomNumber}</p>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{room.roomType}</p>
                                </div>
                                <DoorOpen className="w-5 h-5 text-gray-200 group-hover:text-indigo-400" />
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Step 3: Student Selection */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6"><Users className="w-10 h-10 text-indigo-600" /></div>
              <h2 className="text-3xl font-black text-gray-900">Select Resident</h2>
              <p className="text-gray-400 mt-2">Displaying students with approved hostel applications.</p>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-100/10">
              <div className="relative mb-8">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search by name, ID or application reference..."
                   value={studentSearch}
                   onChange={(e) => setStudentSearch(e.target.value)}
                   className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 text-lg font-bold"
                 />
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto px-2 custom-scrollbar">
                 {students
                  .filter(s => 
                     s.studentId?.personalDetails?.fullName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
                     s.studentId?.studentId?.toLowerCase().includes(studentSearch.toLowerCase())
                  )
                  .map(app => (
                    <div 
                      key={app._id}
                      onClick={() => handleSelectStudent(app)}
                      className="p-6 rounded-[2rem] border border-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer flex items-center gap-6 transition-all group"
                    >
                       <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-indigo-600 rounded-[1.2rem] flex items-center justify-center text-xl font-black uppercase">
                          {app.studentId?.personalDetails?.fullName?.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <p className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{app.studentId?.personalDetails?.fullName}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.studentId?.studentId}</span>
                             <div className="w-1 h-1 bg-gray-200 rounded-full" />
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{app.preferredRoomType} Seater Preferred</span>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                 {students.length === 0 && <div className="py-20 text-center"><Info className="w-10 h-10 text-gray-200 mx-auto mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No approved applicants found</p></div>}
              </div>
           </div>
        </div>
      )}

      {/* Step 4: Bed Selection */}
      {step === 4 && selectedRoom && (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center"><UserCheck className="w-8 h-8 text-emerald-600" /></div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Resident</p>
                    <h3 className="text-xl font-black text-gray-900">{selectedApp.studentId?.personalDetails?.fullName}</h3>
                 </div>
              </div>
              <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center"><DoorOpen className="w-8 h-8 text-indigo-600" /></div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Location</p>
                    <h3 className="text-xl font-black text-gray-900">Room {selectedRoom.roomNumber}</h3>
                 </div>
              </div>
           </div>

           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-10">Choose a Vacant Bed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {beds.map(bed => (
                   <button 
                     key={bed._id}
                     disabled={bed.status !== 'Vacant'}
                     onClick={() => { setSelectedBed(bed); setStep(5); }}
                     className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${
                       bed.status === 'Vacant' 
                       ? 'border-emerald-50 bg-emerald-50/30 hover:border-emerald-500 hover:bg-white text-emerald-600' 
                       : 'border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed'
                     }`}
                   >
                      <Bed className={`w-8 h-8 ${bed.status === 'Vacant' ? 'text-emerald-500' : 'text-gray-200'}`} />
                      <span className="text-sm font-black uppercase tracking-widest">Bed {bed.bedNumber}</span>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                         bed.status === 'Vacant' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                         {bed.status}
                      </span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Step 5: Final Review */}
      {step === 5 && selectedApp && selectedBed && (
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/30 border border-gray-100 overflow-hidden">
              <div className="p-12 bg-gray-50/50 border-b border-gray-100">
                 <h2 className="text-2xl font-black text-gray-900 mb-10">Final Allocation Review</h2>
                 
                 <div className="space-y-8">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">1</div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Resident Identity</p>
                          <p className="text-lg font-black text-gray-900">{selectedApp.studentId?.personalDetails?.fullName}</p>
                          <p className="text-xs font-bold text-gray-500">{selectedApp.studentId?.studentId}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">2</div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Facility Target</p>
                          <p className="text-lg font-black text-gray-900">{selectedHostel.name}</p>
                          <p className="text-xs font-bold text-indigo-500">{selectedBlock.name} &gt; Floor {selectedFloor.floorNumber} &gt; Room {selectedRoom.roomNumber} &gt; Bed {selectedBed.bedNumber}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 space-y-10">
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Allocation Charge (PKR)</label>
                       <div className="relative">
                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input 
                            type="number" 
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-50 text-3xl font-black text-gray-900"
                          />
                       </div>
                    </div>
                    <input 
                      type="text" 
                      value={feeDescription}
                      onChange={(e) => setFeeDescription(e.target.value)}
                      placeholder="Charge description..."
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-600"
                    />
                 </div>

                 <button 
                   disabled={submitting}
                   onClick={handleFinalAssign}
                   className="w-full py-8 bg-indigo-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-black transition-all transform active:scale-95 disabled:opacity-50"
                 >
                    {submitting ? 'Updating System...' : 'Initiate Allocation'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllocationPage;
