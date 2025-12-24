"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

function Beacon() {
    const groupRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!groupRef.current || !ring1Ref.current || !ring2Ref.current || !ring3Ref.current) return;

        // Slow rotation of the entire group
        groupRef.current.rotation.y += delta * 0.05;

        // Individual ring rotations
        ring1Ref.current.rotation.x += delta * 0.2;
        ring1Ref.current.rotation.y += delta * 0.1;

        ring2Ref.current.rotation.x -= delta * 0.15;
        ring2Ref.current.rotation.z += delta * 0.1;

        ring3Ref.current.rotation.y -= delta * 0.25;
        ring3Ref.current.rotation.x += delta * 0.1;
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Core Glow */}
                <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshBasicMaterial color="#00f0ff" toneMapped={false} />
                    <pointLight color="#00f0ff" intensity={2} distance={10} decay={2} />
                </mesh>

                {/* Outer Glow Halo */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} toneMapped={false} side={THREE.BackSide} />
                </mesh>

                {/* Rotating Rings */}
                <group rotation={[Math.PI / 6, 0, 0]}>
                    <mesh ref={ring1Ref}>
                        <torusGeometry args={[1.8, 0.02, 16, 100]} />
                        <meshStandardMaterial color="#ffffff" emissive="#00f0ff" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
                    </mesh>
                </group>

                <group rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
                    <mesh ref={ring2Ref}>
                        <torusGeometry args={[2.4, 0.015, 16, 100]} />
                        <meshStandardMaterial color="#ffffff" emissive="#00ff41" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
                    </mesh>
                </group>

                <group rotation={[0, -Math.PI / 3, Math.PI / 6]}>
                    <mesh ref={ring3Ref}>
                        <torusGeometry args={[3.0, 0.01, 16, 100]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ff0040" emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
                    </mesh>
                </group>
            </Float>

            {/* Ambient Particles */}
            <Sparkles
                count={200}
                scale={10}
                size={2}
                speed={0.4}
                opacity={0.4}
                color="#00f0ff"
            />
            <Sparkles
                count={100}
                scale={15}
                size={3}
                speed={0.2}
                opacity={0.2}
                color="#ffffff"
            />
        </group>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <Environment preset="city" />
                <fog attach="fog" args={['#050505', 5, 20]} />

                <Beacon />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} intensity={1} angle={0.3} penumbra={1} />
                <spotLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />
            </Canvas>

            {/* Vignette & Grain Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-10 pointer-events-none" />
        </div>
    );
}
