"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import BrainParticles from "./BrainParticles";
import MoleculeField from "./MoleculeField";

function CameraRig() {
    const { camera } = useThree();

    useFrame((state) => {
        // Calculate scroll progress (0 to 1)
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // "The Descent" logic:
        // 0.0 -> 0.3: Hero (Brain View) -> Camera at [0, 0, 6]
        // 0.3 -> 0.6: Descent into Molecules -> Camera moves to [0, -15, 4]
        // 0.6 -> 1.0: Deep Core -> Camera moves to [0, -20, 2]

        const targetY = -progress * 20;
        const targetZ = 6 - (progress * 4); // Zoom in slightly as we go down

        // Smooth interpolation
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

        // Add subtle mouse parallax on top
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.05);

        camera.lookAt(0, camera.position.y, 0);
    });
    return null;
}

export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 fixed">
            <Canvas gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <CameraRig />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#bd00ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f3ff" />

                <Suspense fallback={null}>
                    <group position={[0, 0, 0]}>
                        <BrainParticles count={3000} />
                    </group>

                    {/* The Descent: Molecules are lower */}
                    <group position={[0, -15, 0]}>
                        <MoleculeField count={100} />
                    </group>

                    <Environment preset="city" />
                </Suspense>

                {/* Cinematic Post-Processing */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.5}
                        mipmapBlur
                        intensity={1.2}
                        radius={0.6}
                    />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}


