import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-12 relative overflow-hidden bg-transparent">
      {/* SaaS Gradient Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-r from-primary-400/30 to-brand-accent/30 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass-panel p-12 md:p-20 text-center relative overflow-hidden bg-brand-dark/5 border-gray-200/60 shadow-2xl rounded-[3rem]">
          {/* Inner dark glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/5"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 inline-flex items-center justify-center p-4 rounded-full bg-white shadow-md shadow-primary-500/10 mb-6">
              <Sparkles className="w-8 h-8 text-primary-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark mb-6 leading-tight">
              Ready to modernize <br className="hidden md:block"/> your institution?
            </h2>
            
            <p className="text-xl text-gray-500 mb-10 max-w-2xl font-medium">
              Join leading universities operating on ERPSAA. Deploy the most advanced campus management system today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/login" className="px-8 py-4 rounded-xl font-semibold bg-brand-dark text-white hover:bg-black transition-all shadow-[0_8px_30px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.2)] flex items-center justify-center group text-lg">
                Access ERPSAA Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
