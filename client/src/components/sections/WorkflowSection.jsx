import { CheckSquare, Upload, Search, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  { num: "01", title: 'Initiate', desc: 'Staff generates secure cryptographic credentials.', icon: Search },
  { num: "02", title: 'Capture', desc: 'Student inputs dynamic multi-step application.', icon: CheckSquare },
  { num: "03", title: 'Verify', desc: 'Secure document upload & automated scanning.', icon: Upload },
  { num: "04", title: 'Activate', desc: 'Instant conversion to official academic record.', icon: CheckCircle },
];

const WorkflowSection = () => {

  return (
    <section id="workflow" className="py-12 bg-[#07090F]/80 text-white relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Zero Paperwork Workflow.</h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium">From applicant to enrolled student in minutes. A purely digital, immutable, and automated sequence.</p>
        </div>

        <div className="relative">
          {/* Main Connector Line */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          
          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-gray-800/80 backdrop-blur-md border border-gray-700 flex flex-col items-center justify-center font-bold relative group-hover:bg-gray-800 group-hover:border-primary-500/50 transition-all duration-300 shadow-xl mb-6">
                  <step.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-400 transition-colors mb-2" />
                  <span className="text-sm text-gray-500 font-mono">{step.num}</span>
                  
                  {/* Glowing dot on connector */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:shadow-[0_0_10px_2px_rgba(14,165,233,0.5)] transition-shadow"></div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-100">{step.title}</h3>
                <p className="text-sm text-gray-400 px-4 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Live State Tracking <ArrowRight className="w-4 h-4 ml-2 opacity-50" /> Pending → Review → Approved
            </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
