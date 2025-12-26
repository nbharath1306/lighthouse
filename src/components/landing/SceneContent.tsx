"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, ChromaticAberration, Scanline } from "@react-three/postprocessing";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import NeuralLattice from "./NeuralLattice";
import NeuroFluid from "./NeuroFluid";
import TimeDistortion from "./TimeDistortion";

function CameraRig() {
    const { camera } = useThree();
    const lastScrollY = useRef(0);
    const scrollSpeedRef = useRef(0);

    useFrame((state) => {
        const scrollY = window.scrollY;
        const speed = Math.abs(scrollY - lastScrollY.current);
        lastScrollY.current = scrollY;

        scrollSpeedRef.current = THREE.MathUtils.lerp(scrollSpeedRef.current, speed, 0.1);

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        const targetY = -progress * 25;
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.1);
        camera.lookAt(0, camera.position.y - 2, 0);

        (window as any).lighthouseScrollSpeed = scrollSpeedRef.current;
    });

    return null;
}

export function SceneContent() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 4, 8]} rotation={[-0.5, 0, 0]} />
            <CameraRig />

            <ambientLight intensity={0.1} />
            <spotLight position={[10, 15, 10]} intensity={2} color="#ffffff" angle={0.5} penumbra={1} />
            <spotLight position={[-10, 5, -10]} intensity={5} color="#00ff00" distance={20} />

            <Suspense fallback={null}>
                <NeuralLattice />
                <NeuroFluid />
                <TimeDistortion />
                <Environment preset="studio" />
            </Suspense>

            <EffectComposer>
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.4} radius={0.2} />
                <Noise opacity={0.1} />
                <ChromaticAberration offset={[0.002, 0.002]} />
                <Scanline density={1.5} opacity={0.05} />
            </EffectComposer>
        </>
    );
}
