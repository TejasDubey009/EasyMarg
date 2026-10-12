"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { stillPreferred } from "@/showcase/lib/gsap";
import { useMeasureNudge } from "@/showcase/lib/nudge";

/*
  The night road.

  A contour-line terrain, a lit route threading six milestones, and a camera
  that travels the route as the page is scrolled. Terrain and route share one
  formula for where the road runs, so the valley always sits under the line.
*/

const BG = "#06080f";
const SIGNAL = "#5b8cff";
const BONE = "#f2f2ee";

const ROUTE_START = 14;
const ROUTE_END = -150;
const MARKERS = [-14, -36, -58, -80, -102, -124];

const roadX = (z: number) => 6 * Math.sin(z * 0.03) + 3 * Math.sin(z * 0.012 + 1.1);

const NOISE = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float roadX(float z) { return 6.0 * sin(z * 0.03) + 3.0 * sin(z * 0.012 + 1.1); }
float terrain(vec2 p) {
  float d = abs(p.x - roadX(p.y));
  float away = smoothstep(3.0, 22.0, d);
  float n = 0.5 * snoise(p * 0.03) + 0.3 * snoise(p * 0.07 + 5.0) + 0.14 * snoise(p * 0.16 + 2.0);
  return (n * 0.55 + 0.55) * 11.0 * away + 0.25 * snoise(p * 0.1) * smoothstep(3.0, 7.0, d);
}
`;

const VERT = /* glsl */ `
varying float vH;
varying vec2 vW;
varying float vDepth;
${NOISE}
void main() {
  vec3 p = position;
  vec2 world = (modelMatrix * vec4(p, 1.0)).xz;
  float h = terrain(world);
  vH = h;
  vW = world;
  vec4 mv = modelViewMatrix * vec4(p.x, p.y, p.z, 1.0);
  mv = viewMatrix * vec4(world.x, h, world.y, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying float vH;
varying vec2 vW;
varying float vDepth;
uniform vec3 uBone;
uniform vec3 uSignal;
uniform vec3 uBg;
uniform float uTime;
float roadX(float z) { return 6.0 * sin(z * 0.03) + 3.0 * sin(z * 0.012 + 1.1); }
float contour(float v, float halfPx) {
  float fw = fwidth(v);
  float px = abs(fract(v - 0.5) - 0.5) / max(fw, 1e-5);
  return (1.0 - smoothstep(halfPx - 0.5, halfPx + 0.5, px)) * (1.0 - smoothstep(0.35, 0.7, fw));
}
void main() {
  float d = abs(vW.x - roadX(vW.y));
  float lines = contour(vH / 0.7, 0.55) * smoothstep(2.4, 4.5, d);
  // the valley floor carries a faint grain, so it is not an empty black field
  float floorGrain = 0.012 * smoothstep(4.5, 2.4, d);
  float fog = exp(-vDepth * 0.02);
  float a = (lines * 0.5 + floorGrain) * fog;
  vec3 col = mix(uBone, uSignal, 0.15);
  gl_FragColor = vec4(mix(uBg, col, a), 1.0);
}
`;

type Progress = RefObject<number>;

function Terrain() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uBone: { value: new THREE.Color(BONE) },
          uSignal: { value: new THREE.Color(SIGNAL) },
          uBg: { value: new THREE.Color(BG) },
          uTime: { value: 0 },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(220, 240, 260, 300), []);
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  return <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -68]} />;
}

function Route() {
  const { curve, tube, halo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let z = ROUTE_START; z >= ROUTE_END; z -= 2) pts.push(new THREE.Vector3(roadX(z), 0.05, z));
    const curve = new THREE.CatmullRomCurve3(pts);
    return {
      curve,
      tube: new THREE.TubeGeometry(curve, 300, 0.055, 6, false),
      halo: new THREE.TubeGeometry(curve, 300, 0.5, 8, false),
    };
  }, []);
  useEffect(() => () => {
    tube.dispose();
    halo.dispose();
  }, [tube, halo]);
  void curve;
  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={SIGNAL} toneMapped={false} />
      </mesh>
      <mesh geometry={halo}>
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Markers({ progress }: { progress: Progress }) {
  const rings = useRef<THREE.Mesh[]>([]);
  const ring = useMemo(() => new THREE.RingGeometry(0.9, 0.96, 64), []);
  const post = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 1.4, 6), []);
  const lamp = useMemo(() => new THREE.SphereGeometry(0.1, 16, 16), []);
  useEffect(() => () => {
    ring.dispose();
    post.dispose();
    lamp.dispose();
  }, [ring, post, lamp]);

  useFrame(({ clock }) => {
    // the stone the camera is nearest to breathes
    const camZ = 6 - Math.max(0, (progress.current ?? 0) - 0.1) / 0.9 * 128;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const dist = Math.abs(MARKERS[i] - (camZ - 16));
      const near = Math.max(0, 1 - dist / 14);
      const pulse = 1 + near * 0.12 * Math.sin(clock.elapsedTime * 2.2);
      m.scale.setScalar(pulse);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.25 + near * 0.6;
    });
  });

  return (
    <group>
      {MARKERS.map((z, i) => {
        const x = roadX(z) - 2.2;
        return (
          <group key={z} position={[x, 0, z]}>
            <mesh
              ref={(m) => {
                if (m) rings.current[i] = m;
              }}
              geometry={ring}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.03, 0]}
            >
              <meshBasicMaterial color={SIGNAL} transparent opacity={0.3} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <mesh geometry={post} position={[0, 0.7, 0]}>
              <meshBasicMaterial color={BONE} transparent opacity={0.5} />
            </mesh>
            <mesh geometry={lamp} position={[0, 1.45, 0]}>
              <meshBasicMaterial color={BONE} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* A fixed scatter of stars. The positions are a hash, not a random draw, so every visit sees the same sky. */
function starField(n: number): Float32Array {
  const arr = new Float32Array(n * 3);
  let seed = 7;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < n; i++) {
    arr[i * 3] = (next() - 0.5) * 400;
    arr[i * 3 + 1] = 20 + next() * 80;
    arr[i * 3 + 2] = -40 - next() * 260;
  }
  return arr;
}

function Stars() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(starField(700), 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry}>
      <pointsMaterial color={BONE} size={0.9} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function Rig({ progress, pointer }: { progress: Progress; pointer: RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const soft = useRef({ x: 0, y: 0 });
  const still = useMemo(() => stillPreferred(), []);

  useFrame(({ clock }, dt) => {
    const p = still ? 0.35 : (progress.current ?? 0);
    // the first tenth of the scroll is the hero: the camera waits
    const travel = Math.max(0, p - 0.1) / 0.9;
    const z = 6 - travel * 128;
    const k = 1 - Math.exp(-dt * 4);
    soft.current.x += ((pointer.current?.x ?? 0) - soft.current.x) * k * 0.8;
    soft.current.y += ((pointer.current?.y ?? 0) - soft.current.y) * k * 0.8;
    const drift = still ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.15;
    const target = new THREE.Vector3(roadX(z) + 1.9 + soft.current.x * 1.2 + drift, 2.4 + soft.current.y * 0.4, z);
    camera.position.lerp(target, 1 - Math.exp(-dt * 5));
    look.current.lerp(new THREE.Vector3(roadX(z - 16) + soft.current.x * 2.5, 0.5 - soft.current.y * 0.6, z - 16), 1 - Math.exp(-dt * 5));
    camera.lookAt(look.current);
  });
  return null;
}

export default function NightlineScene({ progress, pointer }: { progress: Progress; pointer: RefObject<{ x: number; y: number }> }) {
  const wrapper = useMeasureNudge<HTMLDivElement>();
  const still = stillPreferred();
  return (
    <div ref={wrapper} className="nl-canvas" aria-hidden="true">
    <Canvas
      dpr={[1, 1.75]}
      resize={{ scroll: false, debounce: 0 }}
      frameloop={still ? "demand" : "always"}
      camera={{ fov: 52, near: 0.3, far: 240, position: [roadX(6) + 1.9, 2.4, 6] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(BG, 1);
        scene.fog = new THREE.Fog(BG, 18, 120);
      }}
    >
      <Terrain />
      <Route />
      <Markers progress={progress} />
      <Stars />
      <Rig progress={progress} pointer={pointer} />
    </Canvas>
    </div>
  );
}
