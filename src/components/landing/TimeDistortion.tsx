"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TimeDistortion() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.getElapsedTime();
            // Constant spiral rotation
            groupRef.current.rotation.z = -t * 0.2;

            // Wobble
            groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={[0, -25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            {/* The "Event Horizon" Ring */}
            <mesh>
                <torusGeometry args={[4, 0.1, 16, 100]} />
                <meshStandardMaterial color="#ff3300" emissive="#ff3300" emissiveIntensity={2} />
            </mesh>

            {/* Floating Time Fragments */}
            {Array.from({ length: 12 }).map((_, i) => (
                <mesh key={i} position={[Math.cos(i / 12 * Math.PI * 2) * 3, Math.sin(i / 12 * Math.PI * 2) * 3, 0]}>
                    <boxGeometry args={[0.1, 0.5, 0.1]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            ))}

            {/* Temporal Distortion Center */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhysicalMaterial
                    roughness={0}
                    transmission={1}
                    thickness={2}
                    ior={1.5}
                />
            </mesh>
        </group>
    );
}
