"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Instance, Instances, OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useBioStore } from "@/lib/store";

// Particles: Adenosine (Red), Caffeine (Blue)
function Molecules({ count = 100, type = "adenosine", blockage = 0 }: { count: number, type: "adenosine" | "caffeine", blockage?: number }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree(); // Use local reference inside Canvas if needed, but Instances handles it.

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Random positions
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            scale: Math.random() * 0.2 + 0.1
        }));
    }, [count]);

    useFrame(() => {
        if (!mesh.current) return;

        particles.forEach((p, i) => {
            // Movement
            p.position.add(p.velocity);

            // Boundary bounce
            if (Math.abs(p.position.x) > 4) p.velocity.x *= -1;
            if (Math.abs(p.position.y) > 4) p.velocity.y *= -1;
            if (Math.abs(p.position.z) > 4) p.velocity.z *= -1;

            // Docking Logic (If Caffeine, move towards center "Receptor")
            if (type === "caffeine") {
                const dist = p.position.distanceTo(new THREE.Vector3(0, 0, 0));
                if (dist < 1 && blockage > 0) {
                    // It's docked. Stop moving.
                    p.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
                }
            }

            dummy.position.copy(p.position);
            dummy.scale.set(p.scale, p.scale, p.scale);
            dummy.updateMatrix();
            if (mesh.current) mesh.current.setMatrixAt(i, dummy.matrix);
        });
        if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
                color={type === "adenosine" ? "#ff0040" : "#00f0ff"}
                emissive={type === "adenosine" ? "#550000" : "#005555"}
                roughness={0.2}
                metalness={0.8}
            />
        </instancedMesh>
    );
}

function Receptor() {
    return (
        <group>
            {/* The Synaptic Wall */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[5, 64]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} transparent opacity={0.5} wireframe />
            </mesh>

            {/* The Receptor Site */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <torusGeometry args={[1, 0.2, 16, 100]} />
                    <meshStandardMaterial color="#333" emissive="#111" />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1, 0.2, 16, 100]} />
                    <meshStandardMaterial color="#333" emissive="#111" />
                </mesh>
            </Float>
        </group>
    )
}

import { useThree } from "@react-three/fiber";

export default function SynapseSimulator() {
    const { caffeineLevel, receptorBlockage, ingestCaffeine } = useBioStore();

    // Use store value
    const blockage = receptorBlockage;
    // Molecules count
    const caffeineCount = Math.floor(caffeineLevel / 2); // Scale down
    const adenosineCount = 50; // Constant generation

    return (
        <div className="w-full h-full relative bg-black border border-white/10 group overflow-hidden">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-white font-display uppercase tracking-widest text-lg">Synaptic Viewer</h3>
                <div className="text-[10px] font-mono text-white/50">
                    RECEPTOR OCCUPANCY: <span className="text-neon-blue">{(blockage * 100).toFixed(1)}%</span>
                </div>
            </div>

            <Canvas camera={{ position: [0, 5, 10] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Receptor />
                <Molecules count={adenosineCount} type="adenosine" />
                <Molecules count={caffeineCount} type="caffeine" blockage={blockage} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <Environment preset="city" />
            </Canvas>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                <button
                    onClick={() => ingestCaffeine(50)}
                    className="bg-neon-blue/10 border border-neon-blue/50 text-neon-blue text-xs font-mono uppercase px-4 py-2 hover:bg-neon-blue/20 transition-all"
                >
                    +50mg Caffeine
                </button>
                <button
                    onClick={() => ingestCaffeine(100)}
                    className="bg-neon-blue/10 border border-neon-blue/50 text-neon-blue text-xs font-mono uppercase px-4 py-2 hover:bg-neon-blue/20 transition-all"
                >
                    +100mg Caffeine
                </button>
            </div>

            {/* Warning Overlay */}
            {blockage > 0.8 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-red font-mono text-xs uppercase bg-black/80 p-2 border border-neon-red animate-pulse pointer-events-none">
                    Receptors Saturated
                </div>
            )}
        </div>
    );
}
