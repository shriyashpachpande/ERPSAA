import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Blob = ({ position, color, speed, distort, radius }) => {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[radius, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={radius}
          roughness={0}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
};

const LoginBackground3D = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#F0F4FF]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={40} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#3B5BF6" />
        
        <Blob position={[-10, 5, -5]} color="#3B5BF6" speed={2} distort={0.4} radius={4} />
        <Blob position={[10, -5, -8]} color="#6941C6" speed={1.5} distort={0.5} radius={5} />
        <Blob position={[0, 8, -12]} color="#00FF99" speed={3} distort={0.3} radius={3} />
        <Blob position={[-5, -8, -10]} color="#F43F5E" speed={2.5} distort={0.6} radius={4} />

        <ContactShadows 
          opacity={0.4} 
          scale={40} 
          blur={1} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />
        
        <Environment preset="city" />
      </Canvas>
      
      {/* Soft Overlays */}
      <div className="absolute inset-0 backdrop-blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 pointer-events-none" />
    </div>
  );
};

export default LoginBackground3D;
