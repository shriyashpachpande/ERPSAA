import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import ModuleAssembly3D from '../animations/ModuleAssembly3D';

/* ─────────────────────────────────────────────
   3D COMPONENTS WITH SCROLL PARALLAX
   ───────────────────────────────────────────── */

const HeroKnot = ({ targetX, targetY }) => {
  const knotRef = useRef();
  const matRef = useRef();

  const gradientTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
    grad.addColorStop(0.33, 'rgba(239, 68, 68, 0.4)');
    grad.addColorStop(0.66, 'rgba(16, 185, 129, 0.4)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (!knotRef.current || !matRef.current) return;
    const scrollY = window.scrollY;

    // Rotation logic
    knotRef.current.rotation.x += (0.0035 + targetY.current * 0.02) * (delta * 60);
    knotRef.current.rotation.y += (0.005 + targetX.current * 0.02) * (delta * 60);

    // Parallax descend: Move knot down slowly as we scroll
    knotRef.current.position.y = -scrollY * 0.005;

    // Fade out knot as we scroll down (fully hidden by 450px)
    matRef.current.opacity = Math.max(0, 0.9 * (1 - scrollY / 450));

    // Continuous Gradient Animation
    gradientTex.offset.x += 0.002 * (delta * 60);
  });

  return (
    <mesh ref={knotRef}>
      <torusKnotGeometry args={[1.4, 0.35, 180, 32, 2, 3]} />
      <meshPhysicalMaterial
        ref={matRef}
        map={gradientTex}
        emissiveMap={gradientTex}
        emissive="#ffffff"
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.4}
        thickness={2}
        opacity={0.9}
        transparent={true}
        iridescence={1}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[100, 800]}
      />
    </mesh>
  );
};

const FloatingSphere = ({ data }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;

    data.theta += data.speed * (delta * 60);

    const x = data.r * Math.sin(data.phi) * Math.cos(data.theta);
    const z = data.r * Math.sin(data.phi) * Math.sin(data.theta);

    // Parallax logic: Spheres descend faster to create depth
    const parallaxOffset = -scrollY * data.parallaxFactor;
    const baseOrbitY = data.r * Math.cos(data.phi) + Math.sin(t * 1.0 + data.phi) * 0.5;

    meshRef.current.position.set(x, baseOrbitY + parallaxOffset, z);

    const s = THREE.MathUtils.mapLinear(z, -data.r, data.r, 0.7, 1.5);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshPhysicalMaterial
        color={data.color}
        roughness={0.1}
        metalness={0.3}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
};

const FloatingSpheres = () => {
  const count = 48; // Increased for a much denser feel
  const spheresData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      color: ['#3B5BF6', '#6941C6', '#0EA472', '#F7A325'][i % 4],
      r: 3.0 + Math.random() * 8.0, // Expanded spread
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      speed: 0.005 + Math.random() * 0.012,
      parallaxFactor: 0.01 + Math.random() * 0.025,
    }));
  }, []);

  return (
    <group>
      {spheresData.map((s, i) => (
        <FloatingSphere key={i} data={s} />
      ))}
    </group>
  );
};

const ParticleField = () => {
  const points = useMemo(() => {
    const pCount = 800;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
    return pPos;
  }, []);

  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01 * (delta * 60);
      ref.current.position.y = -window.scrollY * 0.003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#8EA8FF" size={0.04} transparent opacity={0.3} />
    </points>
  );
};

const CameraRig = ({ targetX, targetY }) => {
  const { camera } = useThree();
  useFrame((state, delta) => {
    camera.position.x += (targetX.current * 0.8 - camera.position.x) * 0.05 * (delta * 60);
    camera.position.y += (targetY.current * 0.5 - camera.position.y) * 0.05 * (delta * 60);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const GlobalBackground3D = () => {
  const targetX = useRef(0);
  const targetY = useRef(0);
  const [assemblyProgress, setAssemblyProgress] = React.useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    const handleProgress = (e) => {
      setAssemblyProgress(e.detail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('assembly-progress', handleProgress);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('assembly-progress', handleProgress);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={2.8} color="#4466FF" />
        <directionalLight position={[-5, -3, 2]} intensity={2.2} color="#9966FF" />
        <pointLight position={[0, 4, -2]} intensity={1.2} color="#00FF99" />
        <Environment preset="city" />

        <HeroKnot targetX={targetX} targetY={targetY} />
        
        {/* Background spheres stay visible */}
        <FloatingSpheres />

        <ParticleField />
        <CameraRig targetX={targetX} targetY={targetY} />
      </Canvas>
    </div>
  );
};

export default GlobalBackground3D;
