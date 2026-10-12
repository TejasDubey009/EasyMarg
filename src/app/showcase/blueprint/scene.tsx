"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { stillPreferred } from "@/showcase/lib/gsap";
import { useMeasureNudge } from "@/showcase/lib/nudge";

/*
  Six sheets of paper, drawn as line art.

  Loose and scattered at the top of the page, they square up into one numbered
  file as it is scrolled. The green is Blueprint's one highlight colour, and
  here it draws the edges; the paper itself is white with a faint rule.
*/

const GREEN = "#8afc8e";
const INK = "#121412";
const W = 1.5;
const H = 2.0;

type Pose = { p: [number, number, number]; r: [number, number, number] };

const LOOSE: Pose[] = [
  { p: [-2.1, 1.1, -1.6], r: [0.5, -0.5, 0.3] },
  { p: [1.9, 1.5, -2.2], r: [-0.4, 0.4, -0.2] },
  { p: [-1.3, -1.2, -0.4], r: [0.3, 0.6, 0.5] },
  { p: [2.3, -0.9, -1.0], r: [0.7, -0.2, -0.4] },
  { p: [0.2, 1.9, -3.0], r: [-0.6, 0.1, 0.2] },
  { p: [0.5, -1.8, -1.8], r: [0.2, -0.8, -0.1] },
];

const STACKED: Pose[] = Array.from({ length: 6 }, (_, i) => ({
  p: [0, (i - 2.5) * 0.11, i * 0.02],
  r: [-0.05, 0, (i - 2.5) * 0.012],
}));

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function useLines() {
  return useMemo(() => {
    // the ruled lines of a form: six rules and a small box for a stamp
    const pts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const y = H / 2 - 0.42 - i * 0.24;
      pts.push(-W / 2 + 0.18, y, 0.001, W / 2 - 0.18, y, 0.001);
    }
    const bx = W / 2 - 0.5;
    const by = -H / 2 + 0.2;
    pts.push(bx, by, 0.001, bx + 0.32, by, 0.001, bx + 0.32, by, 0.001, bx + 0.32, by + 0.22, 0.001, bx + 0.32, by + 0.22, 0.001, bx, by + 0.22, 0.001, bx, by + 0.22, 0.001, bx, by, 0.001);
    const rules = new THREE.BufferGeometry();
    rules.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const plane = new THREE.PlaneGeometry(W, H);
    const edges = new THREE.EdgesGeometry(plane);
    return { rules, plane, edges };
  }, []);
}

function Sheet({ i, progress, geo }: { i: number; progress: RefObject<number>; geo: ReturnType<typeof useLines> }) {
  const group = useRef<THREE.Group>(null);
  const still = useMemo(() => stillPreferred(), []);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    // each sheet settles a little after the one before it
    const raw = still ? 1 : Math.min(1, Math.max(0, ((progress.current ?? 0) - i * 0.06) / 0.62));
    const t = ease(raw);
    const a = LOOSE[i];
    const b = STACKED[i];
    const bob = still ? 0 : (1 - t) * Math.sin(clock.elapsedTime * 0.8 + i) * 0.06;
    g.position.set(a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t + bob, a.p[2] + (b.p[2] - a.p[2]) * t);
    g.rotation.set(a.r[0] + (b.r[0] - a.r[0]) * t, a.r[1] + (b.r[1] - a.r[1]) * t, a.r[2] + (b.r[2] - a.r[2]) * t);
  });
  return (
    <group ref={group}>
      <mesh geometry={geo.plane}>
        <meshBasicMaterial color="#f7f7f5" transparent opacity={0.94} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={geo.edges}>
        <lineBasicMaterial color={GREEN} toneMapped={false} />
      </lineSegments>
      <lineSegments geometry={geo.rules}>
        <lineBasicMaterial color={INK} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

function File({ progress, pointer }: { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }) {
  const geo = useLines();
  const group = useRef<THREE.Group>(null);
  const soft = useRef({ x: 0, y: 0 });
  useEffect(() => () => {
    geo.rules.dispose();
    geo.plane.dispose();
    geo.edges.dispose();
  }, [geo]);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-dt * 4);
    soft.current.x += ((pointer.current?.x ?? 0) - soft.current.x) * k;
    soft.current.y += ((pointer.current?.y ?? 0) - soft.current.y) * k;
    const t = progress.current ?? 0;
    // the finished file turns to face the reader
    g.rotation.y = soft.current.x * 0.5 + (1 - t) * 0.1;
    g.rotation.x = soft.current.y * 0.3 + t * 0.35;
  });
  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {LOOSE.map((_, i) => (
        <Sheet key={i} i={i} progress={progress} geo={geo} />
      ))}
    </group>
  );
}

export default function BlueprintScene({ progress, pointer }: { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }) {
  const wrapper = useMeasureNudge<HTMLDivElement>();
  const still = stillPreferred();
  return (
    <div ref={wrapper} className="bp-scene" aria-hidden="true">
    <Canvas
      dpr={[1, 2]}
      resize={{ scroll: false, debounce: 0 }}
      frameloop={still ? "demand" : "always"}
      camera={{ fov: 30, near: 0.1, far: 50, position: [0, 0.2, 10.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <File progress={progress} pointer={pointer} />
    </Canvas>
    </div>
  );
}
