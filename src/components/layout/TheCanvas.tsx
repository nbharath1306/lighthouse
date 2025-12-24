"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useBioStore } from "@/lib/store";

// Custom Shader for the "Bio-Grid"
const GridMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#00ff41") }, // Matrix/Medical Green default
        uMouse: { value: new THREE.Vector2(0, 0) },
        uStress: { value: 0 },
    },
    vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uStress;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Calculate distance from mouse for distortion
      // We assume standard plane mapping where uv (0-1) maps to world space roughly
      float dist = distance(uv, uMouse);
      
      // Ripple effect
      float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.05 * uStress;
      pos.z += ripple;
      
      // Grid distortion near mouse
      float distortion = exp(-dist * 4.0) * 0.2;
      pos.z += distortion * uStress;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uTime;

    void main() {
      // Create a grid pattern
      float gridX = step(0.98, fract(vUv.x * 40.0));
      float gridY = step(0.98, fract(vUv.y * 40.0));
      float grid = max(gridX, gridY);
      
      // Scanline
      float scanline = step(0.95, fract(vUv.y * 5.0 - uTime * 0.2));
      
      float alpha = grid * 0.3 + scanline * 0.1;
      
      // Vignette
      float vignette = 1.0 - distance(vUv, vec2(0.5)) * 1.5;
      
      vec3 finalColor = uColor * (alpha + 0.1); // Base glow
      
      gl_FragColor = vec4(finalColor, alpha * vignette);
    }
  `
};

function BioGrid() {
    const mesh = useRef<THREE.Mesh>(null);
    const { pointer, viewport } = useThree();

    // We use state to track velocity for "Stress"
    const stress = useRef(0);
    const lastPos = useRef(new THREE.Vector2(0, 0));

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#333") }, // Subtle dark grid
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uStress: { value: 0 },
    }), []);

    useFrame((state) => {
        if (mesh.current) {
            const material = mesh.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();

            // Normalize pointer to UV space (0-1)
            // R3F pointer is -1 to 1.
            const uvX = (pointer.x + 1) / 2;
            const uvY = (pointer.y + 1) / 2;
            material.uniforms.uMouse.value.set(uvX, uvY);

            // Calculate velocity (Stress)
            const vel = Math.sqrt(Math.pow(uvX - lastPos.current.x, 2) + Math.pow(uvY - lastPos.current.y, 2));
            lastPos.current.set(uvX, uvY);

            // Smoothly interpolate stress based on velocity
            stress.current = THREE.MathUtils.lerp(stress.current, vel * 20, 0.1); // Amplified velocity
            material.uniforms.uStress.value = stress.current;
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={GridMaterial.vertexShader}
                fragmentShader={GridMaterial.fragmentShader}
                transparent
                depthWrite={false}
            />
        </mesh>
    )
}

export default function TheCanvas() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <BioGrid />
            </Canvas>
        </div>
    );
}
