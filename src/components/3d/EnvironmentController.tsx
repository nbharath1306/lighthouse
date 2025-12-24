"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";

export default function EnvironmentController() {
    const { scene } = useThree();
    const dirLight = useRef<THREE.DirectionalLight>(null);

    const { redShift } = useControls({
        redShift: false,
    });

    useEffect(() => {
        // Transition fog
        const targetColor = redShift ? new THREE.Color("#2a0a0a") : new THREE.Color("#050515");
        // Simple instant switch for now, could tween
        if (scene.fog) {
            scene.fog.color.lerp(targetColor, 0.1); // Will run every render if in useFrame, but here in useEffect it runs once? No, need useFrame for smooth transition.
        }
    }, [redShift, scene]);

    useFrame(() => {
        if (!scene.fog) return;
        const targetFog = redShift ? new THREE.Color("#2a0a0a") : new THREE.Color("#050515");
        if ('color' in scene.fog) {
            (scene.fog as THREE.Fog).color.lerp(targetFog, 0.05);
        }

        if (dirLight.current) {
            const targetLight = redShift ? new THREE.Color("#ff0000") : new THREE.Color("#ccccff");
            dirLight.current.color.lerp(targetLight, 0.05);
        }
    });

    return (
        <>
            <ambientLight intensity={redShift ? 0.1 : 0.2} color={redShift ? "#500" : "#fff"} />
            <directionalLight
                ref={dirLight}
                position={[-10, 20, 5]}
                intensity={redShift ? 0.5 : 2}
                castShadow
            />
        </>
    );
}
