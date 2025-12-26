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
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
    // First corner
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

    // Permutations
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
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
