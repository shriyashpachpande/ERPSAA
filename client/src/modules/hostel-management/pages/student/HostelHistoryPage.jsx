import React, { useState, useEffect } from 'react';
import { getMyApplication } from '../../services/hostelService';
import { History, Calendar, Home, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import gsap from 'gsap';

const HistoryItem = ({ date, action, details, status }) => (
  <div className="flex gap-6 stagger-item relative pb-10 last:pb-0">
    <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-gray-100 last:hidden"></div>
    <div className="relative z-10 w-10 h-10 bg-white border-2 border-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
    </div>
    <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h3 className="font-black text-gray-900">{action}</h3>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{date}</span>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-4">{details}</p>
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Clock className="w-3 h-3" />
        {status}
      </div>
    </div>
  </div>
);

const HostelHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // For now using application info as history base, 
        // real ERP would have a dedicated history log endpoint
        const res = await getMyApplication();
        if (res.success && res.data) {
          // Dummy history for demonstration of the timeline
          const mockHistory = [
            {
              id: 1,
              date: new Date(res.data.createdAt).toLocaleDateString(),
              action: 'Hostel Application Submitted',
              details: `Applied for ${res.data.hostelType} Hostel, ${res.data.preferredRoomType} room.`,
              status: 'Completed'
            }
          ];
          
          if (res.data.status !== 'Pending') {
             mockHistory.unshift({
               id: 2,
               date: new Date(res.data.updatedAt).toLocaleDateString(),
               action: `Application ${res.data.status}`,
               details: res.data.adminRemarks || 'Processed by hostel administration.',
               status: 'Finalized'
             });
          }

          setHistory(mockHistory);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stagger-item', 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="stagger-item mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Hostel History</h1>
        <p className="text-gray-500 font-medium text-sm">Chronological record of your hostel applications and stays.</p>
      </div>

      {history.length === 0 ? (
        <div className="stagger-item bg-gray-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No history record</h3>
            <p className="text-gray-500 font-medium">Your hostel journey is just beginning.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {history.map(item => (
            <HistoryItem key={item.id} {...item} />
          ))}
        </div>
      )}
      
      <div className="stagger-item mt-12 bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-indigo-900">Need a room change?</h3>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Contact Warden Office</p>
          </div>
        </div>
        <ArrowRight className="w-6 h-6 text-indigo-400" />
      </div>
    </div>
  );
};

export default HostelHistoryPage;
