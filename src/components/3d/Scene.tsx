"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import Lighthouse from "./Lighthouse";
import Ocean from "./Ocean";
import EnvironmentController from "./EnvironmentController";

export default function Scene() {
    const [target, setTarget] = useState<[number, number, number]>([0, 0, 0]);

    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas
                shadows
                camera={{ position: [20, 10, 20], fov: 45 }}
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <color attach="background" args={["#000000"]} />
                    <fog attach="fog" args={["#050515", 10, 50]} />

                    <EnvironmentController />

                    <Lighthouse />
                    <Ocean />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        maxPolarAngle={Math.PI / 2 - 0.05} // Don't go below water
                        minDistance={10}
                        maxDistance={50}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
