import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, BookOpen, Clock, AlertTriangle, FileText, Bell, Shield } from 'lucide-react';



const coreModules = [
  { title: 'Admissions Engine', icon: Users, desc: 'Frictionless digital onboarding and smart verification workflows.' },
  { title: 'Student Identity', icon: GraduationCap, desc: 'Centralized 360° academic and personal record management.' },
  { title: 'Treasury & Fees', icon: DollarSign, desc: 'Automated invoices, split payments, and financial reconciliation.' },
  { title: 'Hostel Matrix', icon: Shield, desc: 'Digital room mapping, allocation engine, and warden oversight.' },
  { title: 'Library Catalog', icon: BookOpen, desc: 'Barcode-integrated issuing and digital asset tracking system.' },
  { title: 'Grievance Desk', icon: AlertTriangle, desc: 'Transparent ticketing system with automated escalation paths.' },
  { title: 'Leave Registry', icon: Clock, desc: 'Hierarchical approval chains for faculty and algorithmic student quotas.' },
  { title: 'Data Insights', icon: FileText, desc: 'Visual analytics engine generating board-ready exportable reports.' },
  { title: 'Notification Hub', icon: Bell, desc: 'Omnichannel routing for SMS, Email, and Push critical alerts.' },
];

const getCardVariants = (i) => {
  const directions = [
    { x: -60, y: 0 },  // Left
    { x: 0, y: 60 },   // Bottom
    { x: 60, y: 0 }    // Right
  ];
  const { x, y } = directions[i % 3];

  return {
    hidden: {
      opacity: 0,
      x: x,
      y: y,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 260,
        delay: i * 0.02
      }
    }
  };
};

const BackgroundSpheres = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          x: [0, 150, -100, 0],
          y: [0, 200, 400, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#4466FF]/30 to-[#4466FF]/5 blur-[60px]"
      />
      <motion.div
        animate={{
          x: [0, -200, 150, 0],
          y: [0, 300, -150, 0],
          scale: [1, 0.7, 1.2, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#9966FF]/25 to-[#9966FF]/5 blur-[80px]"
      />
      <motion.div
        animate={{
          x: [0, 200, -150, 0],
          y: [0, -150, 300, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] left-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#00FF99]/25 to-[#00FF99]/5 blur-[50px]"
      />
      <motion.div
        animate={{
          x: [0, 300, 0],
          y: [0, -200, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#3B5BF6]/20 blur-[100px]"
      />
    </div>
  );
};

const ModulesShowcase = () => {
  return (
    <section
      id="modules"
      className="relative z-10 w-full pt-16 pb-32 bg-transparent overflow-hidden"
    >
      <BackgroundSpheres />
      <style>{`
        /* ─── perspective wrapper ─── */
        .modules-grid {
          perspective: 1800px;
          perspective-origin: 50% 40%;
        }

        /* ─── card base ─── */
        .feat-card {
          position: relative;
          transform-style: preserve-3d;
          will-change: transform, opacity;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        /* ─── glow ring ─── */
        .feat-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 2.5rem;
          background: linear-gradient(
            135deg,
            var(--glow-color, rgba(59,91,246,0.22)),
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

        /* ─── shimmer underline ─── */
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

        /* ─── card number badge ─── */
        .card-badge {
          position: absolute;
          top: 1.2rem;
          right: 1.4rem;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: rgba(59,91,246,0.25);
          transition: color 0.3s;
        }
        .feat-card:hover .card-badge { color: rgba(59,91,246,0.65); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mb-16">

        {/* ── Header (100% unchanged) ── */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl text-left">
            <h2 className="text-sm font-bold text-[#3B5BF6] tracking-[2px] uppercase mb-4 overflow-hidden">
              System Architecture
            </h2>
            <h3 className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-[#07090F] leading-[1.1] font-['Geist',sans-serif]">
              Modular by design.
            </h3>
          </div>
          <p className="text-[#6C7589] text-lg max-w-sm font-medium leading-relaxed text-left md:text-right">
            Deploy exactly what you need. Our modules snap together, creating a flawlessly synchronized ecosystem.
          </p>
        </div>

        {/* ── Modules Grid ── */}
        <div className="modules-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {coreModules.map((module, i) => {
            const glowPalette = [
              'rgba(59, 130, 246, 0.5)',
              'rgba(239, 68, 68, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(139, 92, 246, 0.5)',
              'rgba(245, 158, 11, 0.5)',
            ];
            const glowColor = glowPalette[i % glowPalette.length];
            const variants = getCardVariants(i);
            return (
              <motion.div
                key={i}
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                style={{ '--glow-color': glowColor }}
                className="feat-card group p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-[rgba(255,255,255,0.5)] hover:bg-white transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Card number */}
                <span className="card-badge">0{i + 1}</span>

                {/* Icon */}
                <div className="icon-wrap w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#07090F] group-hover:border-[#07090F] transition-all duration-500">
                  <module.icon className="w-7 h-7 text-[#07090F] group-hover:text-white transition-colors duration-500" />
                </div>

                <h4 className="text-2xl font-bold text-[#07090F] mb-4 font-['Syne',sans-serif] tracking-tight">
                  {module.title}
                </h4>
                <p className="text-[#6C7589] leading-relaxed font-medium text-[15px]">
                  {module.desc}
                </p>

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3B5BF6] to-[#7B4FF6] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ModulesShowcase;
