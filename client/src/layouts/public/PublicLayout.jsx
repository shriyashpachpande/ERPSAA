import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TopNavbar from '../../components/navigation/TopNavbar';
import Footer from '../../components/sections/Footer';

const PublicLayout = () => {
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      mainRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-light overflow-x-hidden">
      <TopNavbar />
      <main ref={mainRef} className="flex-grow w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
