"use client";

import { useRef } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { NeuralLatticeMaterial } from "@/components/shaders/NeuralLatticeMaterial";

// Add to Three elements
declare module "@react-three/fiber" {
    interface ThreeElements {
        neuralLatticeMaterial: any;
    }
}

export default function NeuralLattice() {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.getElapsedTime();

            // Normalize pointer to UV space (0 to 1) roughly
            const uvMouse = new THREE.Vector2(
                (state.pointer.x + 1) / 2,
                (state.pointer.y + 1) / 2
            );
            materialRef.current.uMouse = uvMouse;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            {/* High segment plane for smooth vertex displacement */}
            <planeGeometry args={[20, 20, 64, 64]} />
            <neuralLatticeMaterial
                ref={materialRef}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
