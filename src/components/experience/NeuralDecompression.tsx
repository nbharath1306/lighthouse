"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function BreathingSphere({ active }: { active: boolean }) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (mesh.current) {
            // "Breathing" animation
            const t = state.clock.getElapsedTime();
            const scale = 1 + Math.sin(t * 0.8) * 0.2; // 0.8 speed = slow breath

            // If active (holding spacebar), sync tighter and glow
            if (active) {
                mesh.current.scale.lerp(new THREE.Vector3(scale * 1.2, scale * 1.2, scale * 1.2), 0.1);
                // Rotate faster when synced
                mesh.current.rotation.y += 0.01;
            } else {
                mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
                mesh.current.rotation.y += 0.002;
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={mesh}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color={active ? "#e1e1e1" : "#333"}
                    emissive={active ? "#ffffff" : "#000000"}
                    emissiveIntensity={active ? 0.5 : 0}
                    roughness={0.1}
                    metalness={0.9}
                    distort={0.3}
                    speed={1.5}
                />
            </mesh>
        </Float>
    )
}

export default function NeuralDecompression() {
    const [active, setActive] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setActive(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setActive(false);
                setProgress(0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (active) {
            interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 1, 100));
            }, 50); // 5 seconds to fill
        }
        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="w-full h-full relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <BreathingSphere active={active} />
                </Canvas>
            </div>

            <div className="z-10 text-center pointer-events-none mix-blend-difference text-white">
                <h3 className="text-xl uppercase tracking-[0.5em] mb-4 opacity-50">Neural Decompression</h3>
                <p className="text-sm font-mono opacity-40 mb-12">
                    Hold [SPACEBAR] to Synchronize
                </p>

                <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <AnimatePresence>
                    {progress === 100 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-xs uppercase font-bold tracking-widest text-white"
                        >
                            Sync Complete
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
