"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function BeaconMesh() {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.2;
        }
        if (lightRef.current) {
            lightRef.current.intensity = 2 + Math.sin(t * 2) * 1.5; // Pulsing effect
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group>
                {/* Core Crystal - The Lighthouse Light */}
                <mesh ref={meshRef} position={[0, 0, 0]}>
                    <octahedronGeometry args={[1.5, 0]} />
                    <MeshDistortMaterial
                        color="#00f0ff"
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.4}
                        speed={2}
                    />
                </mesh>

                {/* The Beam / Glow */}
                <pointLight ref={lightRef} distance={20} decay={2} color="#00f0ff" />

                {/* Outer Rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.5, 0.02, 16, 100]} />
                    <meshStandardMaterial color="#7000ff" emissive="#7000ff" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                    <torusGeometry args={[3.2, 0.01, 16, 100]} />
                    <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} toneMapped={false} />
                </mesh>
            </group>
        </Float>
    );
}

function StarField() {
    return (
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    )
}

export default function TheBeacon() {
    return (
        <div className="w-full h-full absolute inset-0 -z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                {/* Fill light from bottom for drama */}
                <spotLight position={[0, -10, 0]} angle={0.5} penumbra={1} intensity={5} color="#7000ff" />

                <BeaconMesh />
                <StarField />

                {/* Post-processing or fog could be added here for more depth */}
                <fog attach="fog" args={['#030512', 5, 20]} />
            </Canvas>
        </div>
    );
}
