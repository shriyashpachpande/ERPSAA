import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

import { Users, GraduationCap, DollarSign, BookOpen, Clock, AlertTriangle, FileText, Bell, Shield } from 'lucide-react';

const coreModules = [
  { title: 'Admissions Engine', icon: Users, color: '#3B5BF6', desc: 'Frictionless digital onboarding and smart verification workflows.' },
  { title: 'Student Identity', icon: GraduationCap, color: '#6941C6', desc: 'Centralized 360° academic and personal record management.' },
  { title: 'Treasury & Fees', icon: DollarSign, color: '#0EA472', desc: 'Automated invoices, split payments, and financial reconciliation.' },
  { title: 'Hostel Matrix', icon: Shield, color: '#F7A325', desc: 'Digital room mapping, allocation engine, and warden oversight.' },
  { title: 'Library Catalog', icon: BookOpen, color: '#3B5BF6', desc: 'Barcode-integrated issuing and digital asset tracking system.' },
  { title: 'Grievance Desk', icon: AlertTriangle, color: '#6941C6', desc: 'Transparent ticketing system with automated escalation paths.' },
  { title: 'Leave Registry', icon: Clock, color: '#0EA472', desc: 'Hierarchical approval chains for faculty and algorithmic student quotas.' },
  { title: 'Data Insights', icon: FileText, color: '#F7A325', desc: 'Visual analytics engine generating board-ready exportable reports.' },
  { title: 'Notification Hub', icon: Bell, color: '#3B5BF6', desc: 'Omnichannel routing for SMS, Email, and Push critical alerts.' },
];

const ModuleAssembly3D = ({ scrollProgress }) => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const spacingX = isMobile ? viewport.width / 3.4 : 2.5;
  const spacingY = isMobile ? viewport.height / 5 : 3.0;

  // Grid positioning helper: 3x3 layout
  const getGridPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [
      (col - 1) * spacingX,
      (1 - row) * spacingY - 0.5, // Shifted down slightly to clear header
      0
    ];
  };

  // scrollProgress expected 0 to 1 for the whole section
  const assemblyProgress = scrollProgress * 10;

  return (
    <group position={[0, -1, 0]}>
      {coreModules.map((mod, i) => (
        <AssemblyCard 
          key={i} 
          index={i} 
          module={mod} 
          progress={assemblyProgress} 
          targetPos={getGridPosition(i)}
        />
      ))}
    </group>
  );
};

const AssemblyCard = ({ index, module, progress, targetPos }) => {
  const meshRef = useRef();
  
  // Animation state for this specific card
  const cardProgress = Math.min(1, Math.max(0, progress - index));
  
  // Starting position (floating in background)
  const sphereData = useMemo(() => ({
    r: 10 + Math.random() * 8, // Intense roaming
    phi: Math.random() * Math.PI,
    theta: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 0.4
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() + index * 0.5;
    
    // Roaming motion (intense floating)
    const roamX = sphereData.r * Math.sin(t * 0.8) * Math.cos(t * 0.4);
    const roamY = sphereData.r * Math.cos(t * 0.6) + Math.sin(t * 2.0) * 2;
    const roamZ = sphereData.r * Math.sin(t * 0.5) * Math.sin(t * 0.7) - 15;

    // Interpolate position from roaming to grid
    const targetX = THREE.MathUtils.lerp(roamX, targetPos[0], cardProgress);
    const targetY = THREE.MathUtils.lerp(roamY, targetPos[1], cardProgress);
    const targetZ = THREE.MathUtils.lerp(roamZ, targetPos[2], cardProgress);

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.15 * (delta * 60));
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.15 * (delta * 60));
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.15 * (delta * 60));
    
    // Rotation: Settle into flat card
    if (cardProgress > 0.1) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1 * (delta * 60));
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1 * (delta * 60));
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1 * (delta * 60));
    } else {
      meshRef.current.rotation.y += 0.03 * (delta * 60);
      meshRef.current.rotation.x += 0.02 * (delta * 60);
    }
  });

  const Icon = module.icon;

  return (
    <group ref={meshRef}>
      {/* Morphing Geometry: Starts as Sphere, becomes Box */}
      <mesh>
        {cardProgress < 0.6 ? (
          <sphereGeometry args={[0.5, 32, 32]} />
        ) : (
          <boxGeometry args={[2.1, 2.8, 0.05]} />
        )}
        <meshStandardMaterial 
          color={cardProgress < 0.6 ? module.color || "#3B5BF6" : "#ffffff"}
          transparent 
          opacity={0.8} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Content overlay using Html - Exact replica of WhyErpsaa card shape */}
      {cardProgress > 0.9 && (
        <Html transform distanceFactor={5} position={[0, 0, 0.04]} occlude="blending">
          <div className="w-[210px] h-[280px] p-6 flex flex-col items-start bg-white/40 backdrop-blur-md border border-white/40 rounded-[2.5rem] pointer-events-none select-none shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
              <Icon className="w-5 h-5 text-[#07090F]" />
            </div>
            
            <h4 className="text-lg font-bold text-[#07090F] mb-2 font-['Syne',sans-serif] tracking-tight">{module.title}</h4>
            <p className="text-[12px] text-[#6C7589] font-medium leading-snug text-left">{module.desc}</p>

            <div className="mt-auto w-full h-0.5 bg-gradient-to-r from-[#3B5BF6] to-[#7B4FF6] opacity-20 rounded-full" />
          </div>
        </Html>
      )}
    </group>
  );
};

export default ModuleAssembly3D;
