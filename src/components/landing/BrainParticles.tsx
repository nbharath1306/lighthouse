"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BrainParticles({ count = 1000 }) {
    const points = useRef<THREE.Points>(null);

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Generates a rough brain/sphere shape
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Randomize radius to create volume
            const distance = 1.5 + Math.random() * 0.5;

            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi) * 0.6; // Flatten slightly for brain shape
            const z = distance * Math.cos(theta);

            positions.set([x, y, z], i * 3);
        }

        return positions;
    }, [count]);

    useFrame((state, delta) => {
        if (points.current) {
            points.current.rotation.y += delta * 0.05;
            points.current.rotation.z += delta * 0.01;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                    args={[particlesPosition, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#00f3ff"
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                transparent={true}
                opacity={0.6}
            />
        </points>
    );
}
