import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // GSAP Entrance Timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' }
    });

    // Reset initial states to ensure clean entrance
    gsap.set(['.hero-eyebrow', '.hero-line', '.hero-sub', '.hero-ctas'], {
      opacity: 0,
      y: 40
    });
    gsap.set('.hero-line', { skewY: 7, scale: 1.1 });
    gsap.set('.hero-eyebrow', { scale: 0.9, filter: 'blur(10px)' });

    tl.to('.hero-eyebrow', {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      delay: 0.4
    })
      .to('.hero-line', {
        opacity: 1,
        y: 0,
        skewY: 0,
        scale: 1,
        duration: 1.4,
        stagger: 0.15,
        ease: 'expo.out'
      }, '-=0.8')
      .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 1,
        filter: 'blur(0px)'
      }, '-=1')
      .to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
      }, '-=0.7');

    // Mouse Parallax Effect
    const handleMouseMove = (e) => {
      if (!contentRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 50;
      const moveY = (clientY - window.innerHeight / 2) / 50;

      gsap.to(contentRef.current, {
        x: moveX,
        y: moveY,
        duration: 1.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 md:px-12 pt-20 pb-12 overflow-hidden font-['DM_Sans',sans-serif]"
    >
      {/* ── CONTENT WRAPPER (For Parallax) ── */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center max-w-7xl mx-auto">

        {/* EYEBROW */}
        <div className="hero-eyebrow flex items-center gap-5 bg-white/80 backdrop-blur-md border border-[rgba(59,91,246,0.18)] rounded-full px-5 py-2 text-[13px] font-bold text-[#1C2033] mb-0 shadow-[0_4px_24px_rgba(59,91,246,0.12)] uppercase tracking-wider">
          <div className="w-[18px] h-[18px] bg-gradient-to-br from-[#3B5BF6] to-[#6941C6] rounded-[4px] grid place-items-center">
            <svg viewBox="0 0 10 10" className="w-[10px] h-[10px] fill-white">
              <path d="M5 1l1.2 2.4L9 3.8 7 5.7l.5 2.8L5 7l-2.5 1.5L3 5.7 1 3.8l2.8-.4z" />
            </svg>
          </div>
          The Operating System for Modern Education
        </div>

        {/* HEADLINE WITH MASK REVEAL */}
        <h1 className="hero-headline font-['Instrument_Serif',serif] text-[clamp(48px,8vw,96px)] leading-[1.02] tracking-[-0.03em] text-center text-[#07090F] max-w-[1000px] mb-8">
          <div className="overflow-hidden py-1">
            <span className="hero-line block">Unify your campus.</span>
          </div>
          <div className="overflow-hidden py-1">
            <span className="hero-line block italic bg-gradient-to-br from-[#3B5BF6] to-[#6941C6] bg-clip-text text-transparent">
              Empower everyone.
            </span>
          </div>
        </h1>

        {/* SUBHEADING */}
        <p className="hero-sub text-[clamp(16px,1.5vw,20px)] text-[#475467] leading-relaxed text-center max-w-[600px] mb-12 font-['Geist',sans-serif] font-medium px-4">
          A precision-engineered ERP platform that eliminates operational silos — uniting admissions, curriculum, and campus management into one seamlessly synchronized intelligence layer.
        </p>

        {/* CTAS */}
        <div className="hero-ctas flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6">
          <Link
            to="/login"
            className="cta-primary inline-flex items-center justify-center gap-2 bg-[#07090F] text-white px-10 py-4 rounded-2xl text-[16px] font-bold font-['Syne',sans-serif] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_40px_rgba(7,9,15,0.15)] hover:bg-[#3B5BF6] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,91,246,0.3)] active:scale-95 group"
          >
            Access Platform
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="#modules"
            className="cta-secondary inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm text-[#07090F] px-10 py-4 rounded-2xl text-[16px] font-bold font-['Syne',sans-serif] border-[1.5px] border-[rgba(7,9,15,0.1)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#3B5BF6] hover:text-[#3B5BF6] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(59,91,246,0.1)] active:scale-95 group"
          >
            Explore Interface
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        .hero-line {
          display: block;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
