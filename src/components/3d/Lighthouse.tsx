"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Lighthouse() {
    const lightRef = useRef<THREE.SpotLight>(null);
    const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
    const { scene, pointer, camera, raycaster } = useThree();

    // Add target to scene so the light can track it
    if (targetRef.current.parent !== scene) {
        scene.add(targetRef.current);
        if (lightRef.current) {
            lightRef.current.target = targetRef.current;
        }
    }

    useFrame((state) => {
        // Simple logic: Cast ray to plane y=0 to find look target
        raycaster.setFromCamera(pointer, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const targetVec = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, targetVec);

        if (targetVec) {
            // Smoothly interpolate current target to new target
            targetRef.current.position.lerp(targetVec, 0.1);
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Island Base */}
            <mesh position={[0, -0.5, 0]} receiveShadow>
                <cylinderGeometry args={[4, 5, 2, 8]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>

            {/* Rock platform */}
            <mesh position={[0, 1, 0]} receiveShadow>
                <cylinderGeometry args={[3, 3.8, 1.5, 6]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            {/* Lighthouse Tower (Brutalist) */}
            <mesh position={[0, 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.8, 1.2, 6, 8]} />
                <meshStandardMaterial color="#eeeeee" roughness={0.2} metalness={0.1} />
            </mesh>

            {/* Light Housing */}
            <mesh position={[0, 7.5, 0]}>
                <cylinderGeometry args={[1, 1, 1, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* The BEAM */}
            <group position={[0, 7.5, 0]}>
                <spotLight
                    ref={lightRef}
                    position={[0, 0, 0]}
                    angle={0.4}
                    penumbra={0.2}
                    intensity={500}
                    distance={100}
                    castShadow
                    color="#ffffff"
                />
                {/* Volumetric Fake Beam (Mesh) could go here but skipping for simplicity first */}
            </group>
        </group>
    );
}
