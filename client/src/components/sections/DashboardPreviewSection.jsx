import { Search, Bell, LayoutDashboard, Users, CreditCard, Home, FileText, Settings, Command, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DashboardPreviewSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mockup-window', 
        { y: 100, opacity: 0, rotateX: 5 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: 'power3.out', scrollTrigger: {
            trigger: '.mockup-window',
            start: 'top 80%'
        }}
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="preview" className="py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5" ref={containerRef}>
      {/* Dark mode glowing background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary-600/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-semibold text-primary-400 tracking-widest uppercase mb-3">The Interface</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Enterprise grade. Consumer feel.</h3>
          <p className="text-gray-400 text-lg md:text-xl font-medium">A meticulously crafted workspace designed for focus, speed, and absolute clarity.</p>
        </div>

        {/* Mac OS style Window Container */}
        <div className="mockup-window relative mx-auto max-w-[1200px] rounded-[2rem] bg-black border border-white/10 shadow-[0_0_100px_rgba(14,165,233,0.15)] ring-1 ring-white/10 overflow-hidden flex flex-col h-[700px]">
          
          {/* Top Mac Bar */}
          <div className="h-12 bg-[#1A1A1A] border-b border-white/5 flex items-center px-4 shrink-0">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto flex items-center justify-center w-64 h-7 bg-black rounded-md border border-white/5 text-xs text-gray-500 font-mono">
              erpsaa.edu/app/admissions
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden bg-[#0A0A0A]">
            {/* Sidebar Dark Mode */}
            <div className="w-64 border-r border-white/5 flex flex-col shrink-0 bg-[#111111]">
              <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mr-3 shadow-lg"></div>
                <span className="font-bold tracking-tight text-white text-lg">ERPSAA</span>
              </div>
              
              <div className="p-4 flex-1 overflow-hidden">
                <div className="mb-6">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-gray-400 hover:text-white rounded-lg group cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-3" /> <span className="text-sm font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-primary-500/10 text-primary-400 rounded-lg group border border-primary-500/20">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-3" /> <span className="text-sm font-medium">Admissions</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">3</div>
                    </div>
                    <div className="flex items-center px-3 py-2 text-gray-400 hover:text-white rounded-lg group cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-3" /> <span className="text-sm font-medium">Finance Center</span>
                    </div>
                    <div className="flex items-center px-3 py-2 text-gray-400 hover:text-white rounded-lg group cursor-pointer">
                      <Home className="w-4 h-4 mr-3" /> <span className="text-sm font-medium">Hostel Maps</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/5 shrink-0">
                <div className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/10">SA</div>
                  <div className="ml-3">
                     <p className="text-xs font-semibold text-white">System Admin</p>
                     <p className="text-[10px] text-gray-500">super@erpsaa.edu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Dark Mode */}
            <div className="flex-1 flex flex-col bg-[#0A0A0A]">
              {/* Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0A]/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center bg-[#1A1A1A] rounded-lg px-3 py-2 border border-white/5 w-96 shadow-inner">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500 font-medium">Search records, students...</span>
                  <div className="ml-auto flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-gray-400 font-mono border border-zinc-700">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-gray-400 font-mono border border-zinc-700">K</kbd>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>

              {/* Page Content */}
              <div className="flex-1 p-8 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Admissions Overview</h1>
                    <p className="text-sm text-gray-500">Real-time cohort processing and verification.</p>
                  </div>
                  <div className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer">
                    Export Report
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8 shrink-0">
                  <div className="bg-[#111111] p-5 rounded-xl border border-white/5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Total Received</p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-white">4,821</span>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+12.5%</span>
                    </div>
                  </div>
                  <div className="bg-[#111111] p-5 rounded-xl border border-white/5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Verified Forms</p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-white">3,105</span>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+5.2%</span>
                    </div>
                  </div>
                  <div className="bg-[#111111] p-5 rounded-xl border border-white/5 ring-1 ring-primary-500/30">
                    <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-2">Action Required</p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-white">142</span>
                      <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded">Urgent</span>
                    </div>
                  </div>
                </div>

                {/* Table Data */}
                <div className="flex-1 bg-[#111111] rounded-xl border border-white/5 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-12 gap-4 border-b border-white/5 bg-[#1A1A1A] p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-3">Applicant Name</div>
                    <div className="col-span-3">Program</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Progress</div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {[
                      { n: 'Rahul Sharma', c: 'B.Tech Computer Science', d: 'Today, 09:41 AM', s: 'Verified', color: 'text-green-400 bg-green-400/10 ring-1 ring-green-400/20', pc: 100 },
                      { n: 'Priya Patel', c: 'MBA Marketing', d: 'Today, 08:30 AM', s: 'Pending Review', color: 'text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/20', pc: 65 },
                      { n: 'Vikram Singh', c: 'B.Tech IT', d: 'Yesterday, 14:20 PM', s: 'Documents Missing', color: 'text-rose-400 bg-rose-400/10 ring-1 ring-rose-400/20', pc: 45 },
                      { n: 'Anita Desai', c: 'B.Arch', d: 'Yesterday, 11:15 AM', s: 'Verified', color: 'text-green-400 bg-green-400/10 ring-1 ring-green-400/20', pc: 100 },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] cursor-pointer transition-colors">
                        <div className="col-span-3">
                          <span className="text-sm font-medium text-gray-200">{row.n}</span>
                        </div>
                        <div className="col-span-3 text-sm text-gray-500">{row.c}</div>
                        <div className="col-span-2 text-xs text-gray-600 font-mono">{row.d}</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.color}`}>
                            {row.s}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                           <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden mr-3">
                              <div className="h-full bg-white rounded-full" style={{width: `${row.pc}%`}}></div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardPreviewSection;
