"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, ChromaticAberration, Scanline } from "@react-three/postprocessing";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import NeuralLattice from "./NeuralLattice";
import NeuroFluid from "./NeuroFluid";
import TimeDistortion from "./TimeDistortion";

function CameraRig() {
    const { camera } = useThree();
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const lastScrollY = useRef(0);

    useFrame((state, delta) => {
        // "The Lab" Feel: Static, rigid, slightly unnerving movement

        // Scroll Logic for "The Descent" (V2)
        // We need to re-enable descent because the fluid is lower down.
        const scrollY = window.scrollY;
        const speed = Math.abs(scrollY - lastScrollY.current);
        lastScrollY.current = scrollY;

        // Dampen speed for glitch effect
        setScrollSpeed(THREE.MathUtils.lerp(scrollSpeed, speed, 0.1));

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // V2 Descent:
        // 0.0: Lattice (y=0)
        // 0.5: Fluid (y=-10)
        // 1.0: Deep Void
        const targetY = -progress * 25;

        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

        // Mouse parallax
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.1);

        // Look slightly ahead/down
        camera.lookAt(0, camera.position.y - 2, 0);
    });

    // Pass scroll speed to global store or use direct Effect ref access if possible
    // For simplicity in this architecture, we will just use the CameraRig to drive the scene mood
    // But to affect PostProcessing, we need a ref exposed or a shared state.
    // Let's use a simple global variable override for the shader if we want to be "raw"
    // Or just accept the static glitch for now as requested "Glitch transitions" might be complex to wire without context.
    // actually, let's keep it static for stability as "Scroll Speed" wiring in R3F needs a store.

    return null;
}

function SoundManager() {
    // Simple ambient drone
    const audioRef = useRef<HTMLAudioElement>(null);

    // Auto-play attempt on mount (often blocked, but good to try)
    useEffect(() => {
        const play = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.2;
                audioRef.current.play().catch(() => { });
            }
        };
        document.addEventListener('click', play, { once: true });
        return () => document.removeEventListener('click', play);
    }, []);

    return (
        <audio ref={audioRef} loop>
            {/* <source src="..." type="audio/mpeg" /> */}
        </audio>
    );
}

export default function Scene() {
    // Ref for Chromatic Aberration
    const chromaticRef = useRef<any>(null);

    // We can drive this via a simple scroll listener component inside Canvas
    function GlitchController() {
        useFrame(() => {
            const speed = Math.abs(window.scrollY - (window as any).lastScrollY || 0);
            (window as any).lastScrollY = window.scrollY;

            if (chromaticRef.current) {
                // Base offset + speed multiplier
                const terrorLevel = Math.min(speed * 0.002, 0.05);
                chromaticRef.current.offset.set(0.002 + terrorLevel, 0.002 + terrorLevel);
            }
        });
        return null;
    }

    return (
        <div className="absolute inset-0 z-0 fixed mix-blend-exclusion pointer-events-none">
            <SoundManager />
            <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}>
                <GlitchController />
                <PerspectiveCamera makeDefault position={[0, 4, 8]} rotation={[-0.5, 0, 0]} />
                <CameraRig />

                {/* Cold, Clinical Lighting */}
                <ambientLight intensity={0.1} />
                <spotLight position={[10, 15, 10]} intensity={2} color="#ffffff" angle={0.5} penumbra={1} />
                <spotLight position={[-10, 5, -10]} intensity={5} color="#00ff00" distance={20} /> {/* Lab Green accent */}

                <Suspense fallback={null}>
                    {/* Hero Layer */}
                    <NeuralLattice />

                    {/* The Soup Layer */}
                    <NeuroFluid />

                    {/* The Clock Layer */}
                    <TimeDistortion />

                    <Environment preset="studio" />
                </Suspense>

                {/* "Broken Monitor" Post-Processing */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.8}
                        mipmapBlur
                        intensity={0.4} // Subtle, not neon
                        radius={0.2}
                    />
                    <Noise opacity={0.1} />
                    <ChromaticAberration
                        ref={chromaticRef}
                        offset={[0.002, 0.002]} // Constant low-level distortion
                    />
                    <Scanline density={1.5} opacity={0.05} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
