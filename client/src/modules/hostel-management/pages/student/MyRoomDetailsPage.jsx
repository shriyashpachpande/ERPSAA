import React, { useState, useEffect } from 'react';
import { getMyRoom } from '../../services/hostelService';
import { Home, MapPin, Layers, Hash, Bed, CheckCircle2, Info, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

const DetailCard = ({ label, value, icon: Icon, color = 'indigo' }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] flex items-start gap-4 stagger-item">
    <div className={`p-3 bg-${color}-50 rounded-2xl text-${color}-600`}>
      {Icon && <Icon className="w-6 h-6" />}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value || 'Not Assigned'}</p>
    </div>
  </div>
);

const MyRoomDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getMyRoom();
        if (res.success) {
          setRoomData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch room details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, []);

  useEffect(() => {
    if (!loading && roomData) {
      gsap.fromTo('.stagger-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading, roomData]);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  if (error || !roomData) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="bg-indigo-50 border border-indigo-100 p-10 rounded-[3rem] max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
            <Bed className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No Active Allotment</h2>
          <p className="text-gray-500 mb-8 font-medium">You don't have an active hostel room allotment yet. If you have already applied, please check your application status.</p>
          <button 
            onClick={() => window.location.href = '/app/student/hostel/status'}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Check Status
          </button>
        </div>
      </div>
    );
  }

  const { bedId: bed, roomId: room, hostelId: hostel, blockId: block, floorId: floor, checkInStatus } = roomData;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="stagger-item mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active Allotment
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-bold text-gray-500">Academic Year 2026-27</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Room Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DetailCard label="Hostel Name" value={hostel?.name} icon={Home} color="indigo" />
        <DetailCard label="Block" value={block?.name} icon={MapPin} color="sky" />
        <DetailCard label="Floor" value={floor?.name} icon={Layers} color="purple" />
        <DetailCard label="Room Number" value={room?.roomNumber} icon={Hash} color="orange" />
        <DetailCard label="Bed Number" value={bed?.bedNumber} icon={Bed} color="emerald" />
        <DetailCard label="Room Type" value={room?.roomType} icon={Info} color="rose" />
      </div>

      <div className="stagger-item bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Stay Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Check-in Status</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                checkInStatus === 'Checked-In' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  checkInStatus === 'Checked-In' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                {checkInStatus}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Allotment Date</p>
              <p className="text-lg font-bold text-gray-800">{new Date(roomData.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              Guidelines
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 flex-shrink-0"></div>
                Maintain cleanliness in the room and common areas.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 flex-shrink-0"></div>
                Register complaints promptly through the ERP portal.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 flex-shrink-0"></div>
                Adhere to the hostel timing and gate pass rules.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoomDetailsPage;
