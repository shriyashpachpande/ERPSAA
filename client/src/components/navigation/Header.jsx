import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, Clock, User } from 'lucide-react';
import gsap from 'gsap';
import { getFileUrl } from '../../utils/fileUrlResolver';
import axios from 'axios';

const Header = ({ toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPhoto, setUserPhoto] = useState(null);
  const secondsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      if (newTime.getSeconds() !== currentTime.getSeconds()) {
        setCurrentTime(newTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTime]);

  useEffect(() => {
    if (secondsRef.current) {
      gsap.fromTo(secondsRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentTime.getSeconds()]);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  // Fetch specialized profile photo if not in local storage or if we want latest from master
  useEffect(() => {
    const fetchFullProfile = async () => {
      if (user.role === 'student') {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('/api/student-master/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data?.success && res.data?.data) {
            const profile = res.data.data;
            const photo = profile?.admissionId?.uploadedDocuments?.passportPhoto?.filePath || 
                          profile?.admissionId?.personalDetails?.profilePhotoUrl ||
                          profile?.personalDetails?.profilePhotoUrl;
            if (photo) setUserPhoto(photo);
          }
        } catch (err) {
          console.log("Header info: Profile photo fetch failed");
        }
      }
    };
    fetchFullProfile();
  }, [user.role]);

  const formatMainTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatSeconds = (date) => {
    return date.getSeconds().toString().padStart(2, '0');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const profilePhoto = userPhoto || user.profilePhotoUrl;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm shrink-0 w-full">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Time and Date Section */}
        <div className="flex items-center gap-3 text-slate-600">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-100">
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {formatMainTime(currentTime).split(' ')[0]}
              </span>
              <span ref={secondsRef} className="text-[11px] font-black text-indigo-600 w-4 inline-block">
                {formatSeconds(currentTime)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {formatMainTime(currentTime).split(' ')[1]}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden xs:block">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              {user.fullName || 'User'}
            </span>
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
              {user.role?.replace('_', ' ') || 'Member'}
            </span>
          </div>
          
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-100 p-0.5 bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            {profilePhoto ? (
              <img 
                src={getFileUrl(profilePhoto)} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
