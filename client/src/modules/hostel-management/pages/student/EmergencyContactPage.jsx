import React, { useState, useEffect } from 'react';
import { getMyMasterProfile } from '../../../student-master/services/studentMasterService';
import { Phone, User, HeartPulse, ShieldAlert, MapPin, Mail, Home } from 'lucide-react';
import gsap from 'gsap';

const ContactCard = ({ label, name, phone, relation, icon: Icon, color = 'indigo' }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] stagger-item">
    <div className={`w-14 h-14 bg-${color}-50 rounded-2xl flex items-center justify-center text-${color}-600 mb-6`}>
      {Icon && <Icon className="w-8 h-8" />}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{label}</p>
    <h3 className="text-2xl font-black text-gray-900 mb-1">{name || 'Not Provided'}</h3>
    {relation && <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-6">{relation}</p>}
    <div className="space-y-4 pt-6 border-t border-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          <Phone className="w-4 h-4" />
        </div>
        <p className="text-lg font-bold text-gray-800">{phone || 'N/A'}</p>
      </div>
    </div>
  </div>
);

const EmergencyContactPage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyMasterProfile();
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stagger-item', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  const gd = profile?.admissionId?.guardianDetails || {};
  const cd = profile?.contactDetails || {};
  const pd = profile?.personalDetails || {};

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="stagger-item mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Emergency Contacts</h1>
        <p className="text-gray-500 font-medium text-sm">Critical contact information for hostel safety and protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ContactCard 
          label="Primary Guardian" 
          name={gd.guardianName} 
          phone={gd.guardianPhone} 
          relation={gd.guardianRelation} 
          icon={User} 
          color="indigo" 
        />
        <ContactCard 
          label="Emergency Contact" 
          name={gd.emergencyContactName} 
          phone={gd.emergencyContactPhone} 
          relation={gd.emergencyContactRelation} 
          icon={ShieldAlert} 
          color="rose" 
        />
      </div>

      <div className="stagger-item bg-gray-900 text-white p-10 rounded-[3rem] shadow-[0px_0px_10px_2px_rgba(59,130,246,0.2),0px_0px_20px_8px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-rose-500" />
            Medical Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Blood Group</p>
              <p className="text-3xl font-black text-rose-500">{pd.bloodGroup || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Department Contact</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-100">{profile?.academicProfile?.department} Office</p>
                  <p className="text-sm font-medium text-gray-400 cursor-copy hover:text-white transition-colors">Ext: 4032 / +91 000 000 0000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactPage;
