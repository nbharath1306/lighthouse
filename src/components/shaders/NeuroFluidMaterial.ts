"use client";

import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

export const NeuroFluidMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color("#00ff00"), // Lab Green base
        uColor2: new THREE.Color("#000000"), // Void Black
        uMouse: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying float vPattern;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;
    varying vec2 vUv;

    // FBM Implementation
    float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    #define OCTAVES 6
    float fbm (in vec2 st) {
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        for (int i = 0; i < OCTAVES; i++) {
            value += amplitude * noise(st);
            st *= 2.;
            amplitude *= .5;
        }
        return value;
    }

    void main() {
        vec2 st = vUv * 3.0;
        
        // Domain Warping for Fluid Feel
        vec2 q = vec2(0.);
        q.x = fbm( st + 0.00*uTime);
        q.y = fbm( st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

        float f = fbm(st+r);

        // Mixing colors based on noise
        vec3 color = mix(uColor2, uColor, clamp((f*f)*4.0, 0.0, 1.0));
        
        // Add "Chemical Burn" edge
        color = mix(color, vec3(1.0, 1.0, 1.0), smoothstep(0.9, 1.0, f*f*f));
        
        // High contrast alpha for "blob" look
        float alpha = smoothstep(0.1, 0.9, f);

        gl_FragColor = vec4(color, alpha * 0.8);
    }
  `
);

extend({ NeuroFluidMaterial });
