"use client";

import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

export const NeuralLatticeMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(1.0, 1.0, 1.0), // Clinical White
        uMouse: new THREE.Vector2(0, 0),
    },
    // Vertex Shader
    `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vDistortion;

    // Simplex noise function (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      return 42.0 * dot( m*m, vec3( dot(p.x,x0), dot(p.y,x12.xy), dot(p.z,x12.zw) ) );
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Organic breathing movement
      float noiseVal = snoise(vec2(pos.x * 0.5 + uTime * 0.2, pos.y * 0.5 + uTime * 0.1));
      
      // Mouse interaction distortion
      float dist = distance(uv, uMouse);
      float influence = smoothstep(0.5, 0.0, dist);
      
      pos.z += noiseVal * 1.5; // Breath
      pos.z += influence * 2.0 * sin(uTime * 5.0); // Glitch reaction to mouse

      vDistortion = pos.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColor;
    varying float vDistortion;
    varying vec2 vUv;

    void main() {
      // Wireframe-like grid effect calculated in shader
      float gridX = step(0.98, mod(vUv.x * 20.0, 1.0));
      float gridY = step(0.98, mod(vUv.y * 20.0, 1.0));
      float grid = max(gridX, gridY);

      // Pulse color based on distortion
      vec3 finalColor = uColor;
      finalColor += vec3(0.1, 0.0, 0.0) * vDistortion; // Slight red shift on distortion

      // Alpha based on grid
      float alpha = grid * 0.8 + 0.05; // Base glow + grid lines
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ NeuralLatticeMaterial });
