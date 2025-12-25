"use client";

import { useRef } from "react";
import { useFrame, ThreeElements, extend } from "@react-three/fiber";
import * as THREE from "three";
import { NeuroFluidMaterial } from "@/components/shaders/NeuroFluidMaterial";

extend({ NeuroFluidMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        neuroFluidMaterial: any;
    }
}

export default function NeuroFluid() {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
            <planeGeometry args={[15, 15, 32, 32]} />
            <neuroFluidMaterial
                ref={materialRef}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
