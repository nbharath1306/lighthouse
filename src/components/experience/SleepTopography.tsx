"use client";

import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function TerrainMesh() {
    // Generate a jagged terrain representing sleep stages
    const points = [];
    const width = 10;
    const stages = [0, -1, -2, -3, -2, 0, -1, -3, -4, -2, 0]; // Awake to Deep Sleep

    for (let i = 0; i < stages.length; i++) {
        points.push(new THREE.Vector3((i - 5) * 1.5, stages[i], 0));
    }

    // Create a smooth curve
    const curve = new THREE.CatmullRomCurve3(points);
    const smoothPoints = curve.getPoints(100);

    return (
        <group>
            {/* The Line */}
            <Line points={smoothPoints} color="white" lineWidth={2} dashed={false} />

            {/* Grid for reference */}
            <gridHelper args={[20, 20, 0x333333, 0x111111]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]} />
        </group>
    )
}

export default function SleepTopography() {
    const [wakeTime, setWakeTime] = useState(7); // 7 AM

    return (
        <div className="w-full h-full relative bg-gray-950 flex flex-col md:flex-row">
            {/* The Visualizer */}
            <div className="flex-1 h-[50vh] md:h-full relative">
                <Canvas camera={{ position: [0, 0, 10] }}>
                    <TerrainMesh />
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
                </Canvas>
            </div>

            {/* The Controls */}
            <div className="p-12 flex flex-col justify-center space-y-8 bg-black/50 backdrop-blur-md w-full md:w-[400px] border-l border-white/5">
                <div>
                    <h3 className="text-4xl uppercase font-bold mb-2">The Drift</h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                        Sleep is a landscape to be traversed. Mapping the valleys of deep recovery.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-xs font-mono uppercase opacity-50">
                        <span>Bedtime: 11:00 PM</span>
                        <span>Wage: {wakeTime}:00 AM</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="10"
                        step="0.5"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer thumb-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="text-2xl font-light">4</div>
                        <div className="text-[10px] uppercase opacity-50 tracking-widest mt-1">Deep Cycles</div>
                    </div>
                    <div className="p-4 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="text-2xl font-light">92%</div>
                        <div className="text-[10px] uppercase opacity-50 tracking-widest mt-1">Efficiency</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
