"use client";

import { Canvas } from "@react-three/fiber";
import { SceneContent } from "./SceneContent";
import { SoundManager } from "./SoundManager";
import * as THREE from "three";

export function LighthouseCanvas() {
    return (
        <div className="absolute inset-0 z-0 fixed mix-blend-exclusion pointer-events-none">
            <SoundManager />
            <Canvas
                gl={{
                    antialias: true,
                    // Using integer value directly to avoid circular reference in prop passing
                    toneMapping: 3, // THREE.ReinhardToneMapping
                }}
                dpr={[1, 2]}
            >
                <SceneContent />
            </Canvas>
        </div>
    );
}
