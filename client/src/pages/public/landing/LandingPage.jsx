import HeroSection from '../../../components/sections/HeroSection';
import ModulesShowcase from '../../../components/sections/ModulesShowcase';
import RoleBasedAccessSection from '../../../components/sections/RoleBasedAccessSection';
import WorkflowSection from '../../../components/sections/WorkflowSection';
import DashboardPreviewSection from '../../../components/sections/DashboardPreviewSection';
import WhyErpsaaSection from '../../../components/sections/WhyErpsaaSection';
import CtaSection from '../../../components/sections/CtaSection';

import GlobalBackground3D from '../../../components/background/GlobalBackground3D';

const LandingPage = () => {
  return (
    <div className="w-full relative overflow-x-hidden font-sans antialiased text-brand-dark">

      <GlobalBackground3D />

      <main className="w-full relative z-10">
        <HeroSection />
        <WhyErpsaaSection />
        <ModulesShowcase />
        <RoleBasedAccessSection />
        <WorkflowSection />
        <CtaSection />
      </main>

      <style>{`
        .animate-faint-gradient {
          background: linear-gradient(-45deg, rgba(240, 244, 255, 0.15), rgba(245, 240, 255, 0.15), rgba(240, 255, 249, 0.15));
          background-size: 400% 400%;
          animation: faint-bg-gradient 15s ease infinite;
        }
        @keyframes faint-bg-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
