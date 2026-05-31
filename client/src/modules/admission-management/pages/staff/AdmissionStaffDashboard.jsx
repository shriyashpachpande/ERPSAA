import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Calendar, RefreshCw, Download, Search, Settings, Bell, User } from 'lucide-react';
import KpiCards from '../../components/dashboard/KpiCards';
import StatusOverview from '../../components/dashboard/StatusOverview';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentApplications from '../../components/dashboard/RecentApplications';
import AdmissionFunnel from '../../components/dashboard/AdmissionFunnel';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import TrendChart from '../../components/dashboard/TrendChart';

const AdmissionStaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { fullName: 'Admission Officer' };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, trendRes, recentRes, activityRes, funnelRes] = await Promise.all([
        axios.get('/api/admissions/dashboard/stats', config),
        axios.get('/api/admissions/dashboard/trend', config),
        axios.get('/api/admissions/dashboard/recent', config),
        axios.get('/api/admissions/dashboard/activity', config),
        axios.get('/api/admissions/dashboard/funnel', config)
      ]);

      setData({
        kpis: statsRes.data.data.kpis,
        statusBreakdown: statsRes.data.data.statusBreakdown,
        trends: trendRes.data.data,
        recentApplications: recentRes.data.data,
        activity: activityRes.data.data,
        funnel: funnelRes.data.data
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to sync dashboard intelligence. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 animate-spin text-primary-600 absolute top-0 left-0" />
        </div>
        <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Synchronizing Live Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-red-50 rounded-3xl border border-red-100 shadow-sm">
        <div className="bg-red-100 p-4 rounded-full mb-4">
           <RefreshCw className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error}</p>
        <button type="button" 
          onClick={fetchDashboardData}
          className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-widest mb-1">
             <Calendar className="w-3.5 h-3.5" />
             <span>{formattedDate} • {formattedTime}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
             Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">{(user?.fullName || 'User').split(' ')[0]}!</span> 👋
          </h1>
          <p className="text-gray-500 font-medium mt-1">Here’s what’s happening with admissions today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center -space-x-2 mr-4 hidden sm:flex">
             {[1,2,3].map(id => (
                 <div key={id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                    <User className="w-4 h-4 text-gray-400" />
                 </div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">+12</div>
          </div>
          <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <button type="button" className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm">
             <Bell className="w-5 h-5" />
          </button>
          <button type="button" className="flex items-center space-x-2 px-4 py-2.5 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 hover:-translate-y-0.5">
             <Download className="w-4 h-4" />
             <span className="text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <KpiCards data={data?.kpis} />

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Priority Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions */}
          <QuickActions kpis={data?.kpis} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Status Donut */}
             <StatusOverview data={data?.statusBreakdown} />
             {/* Funnel Visual */}
             <AdmissionFunnel data={data?.funnel} />
          </div>

          {/* Recent Applications Table */}
          <RecentApplications applications={data?.recentApplications} />
        </div>

        {/* Right Column - Secondary/Live Items */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trend Area Chart */}
          <TrendChart data={data?.trends} />
          
          {/* Real-time Activity Feed */}
          <ActivityFeed activities={data?.activity} />

          {/* Mini Insights Bar */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Settings className="w-16 h-16" />
             </div>
             <h4 className="font-bold text-lg mb-1">Weekly Pulse</h4>
             <p className="text-white/80 text-xs mb-4">You've cleared 85% of re-upload requests faster than last week. Great job!</p>
             <button type="button" className="text-[10px] font-bold uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                View Efficiency
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionStaffDashboard;
