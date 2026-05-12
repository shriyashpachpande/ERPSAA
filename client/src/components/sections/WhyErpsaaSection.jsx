import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Layers, Fingerprint, Cloud } from 'lucide-react';
import { WordByWord } from '../animations/TextAnimations';

const features = [
  { icon: Layers, title: 'Unified Architecture', desc: 'Eliminate fragmented data. Admissions, finance, and academics run on a single synchronized source of truth.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized microservices built for maximum performance, ensuring zero lag during peak admission seasons.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'State-of-the-art encryption, rigorous compliance, and comprehensive infrastructure audit logs.' },
  { icon: Fingerprint, title: 'Granular Access', desc: 'Advanced Role-Based Access Control (RBAC) guarantees personnel only see what their clearance allows.' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Real-time actionable dashboards empowering the Principal and Admins to gauge institutional health instantly.' },
  { icon: Cloud, title: 'Cloud Scale', desc: 'Automated zero-downtime deployments and limitless scaling potential to support growing campuses globally.' }
];

const getInitial = (index) => {
  const p = index % 3;
  if (p === 0) return { opacity: 0, x: -90, y: 0 };
  if (p === 1) return { opacity: 0, x: 0, y: 90 };
  return { opacity: 0, x: 90, y: 0 };
};

const WhyErpsaaSection = () => {
  return (
    <section
      id="features"
      className="pt-0 pb-8 relative overflow-hidden"
    >
      <style>{`
        /* ── Background gradient (Inherited from LandingPage) ── */

        /* ── Card glow ring on hover ── */
        .feat-card {
          position: relative;
        }
        .feat-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 2.5rem;
          background: linear-gradient(
            135deg,
            var(--glow-color, rgba(59,91,246,0.2)),
            transparent
          );
          opacity: 0;
          transition: opacity 0.45s ease;
          z-index: 0;
        }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:hover {
          box-shadow: 0 0 20px 0px var(--glow-color);
        }
        .feat-card > * { position: relative; z-index: 1; }

        /* ── Shimmer underline that grows on hover ── */
        .icon-wrap::after {
          content: '';
          display: block;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, #3B5BF6, #7B4FF6);
          border-radius: 2px;
          margin-top: 8px;
          transition: width 0.45s ease;
        }
        .feat-card:hover .icon-wrap::after { width: 56px; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* ── Header (100 % unchanged markup) ── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-[#3B5BF6] tracking-[2px] uppercase mb-4 overflow-hidden">
              <WordByWord text="Enterprise Foundation" />
            </h2>
            <h3 className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-[#07090F] leading-[1.1] font-['Geist',sans-serif]">
              <WordByWord text="Engineered for the future of education." delay={0.3} />
            </h3>
          </div>
          <p className="text-[#6C7589] mt-6 md:mt-0 text-lg max-w-sm font-medium leading-relaxed">
            <WordByWord
              text="Everything you need to digitize, automate, and scale your campus operations securely."
              delay={1.2}
            />
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feat, i) => {
            const glowPalette = [
              'rgba(59, 130, 246, 0.5)',
              'rgba(239, 68, 68, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(139, 92, 246, 0.5)',
              'rgba(245, 158, 11, 0.5)',
            ];
            const glowColor = glowPalette[i % glowPalette.length];

            return (
              <motion.div
                key={i}
                style={{ '--glow-color': glowColor }}
                /* ── Entry animation ── */
                initial={getInitial(i)}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: (i % 3) * 0.12 + Math.floor(i / 3) * 0.18,
                  ease: [0.22, 1, 0.36, 1]
                }}
                /* ── Hover lift ── */
                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                className="feat-card group p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-[rgba(255,255,255,0.5)] hover:bg-white transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Icon */}
                <div className="icon-wrap w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#07090F] group-hover:border-[#07090F] transition-all duration-500">
                  <feat.icon className="w-7 h-7 text-[#07090F] group-hover:text-white transition-colors duration-500" />
                </div>

                <h4 className="text-2xl font-bold text-[#07090F] mb-4 font-['Syne',sans-serif] tracking-tight">
                  {feat.title}
                </h4>
                <p className="text-[#6C7589] leading-relaxed font-medium text-[15px]">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyErpsaaSection;




