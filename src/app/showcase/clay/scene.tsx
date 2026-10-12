"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { stillPreferred } from "@/showcase/lib/gsap";
import { useMeasureNudge } from "@/showcase/lib/nudge";

/*
  Six milestones in clay.

  The brand mark, extruded: a flat-bottomed stone with an arched cap, in matte
  clay with the cap in ink. The six stand along a curve on a stone floor, and
  an orange thread runs past them for the road. As the page is scrolled the
  camera comes round and the stones stand up one after another.
*/

const CLAY = "#d9d1c7";
const FLOOR = "#f3efeb";
const INK = "#111111";
const THREAD = "#ff9900";

/** Where each stone stands: a gentle arc, nearest on the left. */
const SPOTS = Array.from({ length: 6 }, (_, i) => {
  const t = i / 5;
  return new THREE.Vector3(-3.2 + t * 6.4, 0, 1.4 - Math.sin(t * Math.PI) * 2.2);
});

function useStoneGeometry() {
  return useMemo(() => {
    const w = 0.9;
    const bodyH = 0.78;
    const r = w / 2;
    const depth = 0.5;
    const bevel = { bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 4, steps: 1 };
    const body = new THREE.Shape();
    body.moveTo(-r, 0);
    body.lineTo(r, 0);
    body.lineTo(r, bodyH);
    body.lineTo(-r, bodyH);
    body.closePath();
    const cap = new THREE.Shape();
    cap.moveTo(-r, bodyH);
    cap.absarc(0, bodyH, r, Math.PI, 0, true);
    cap.lineTo(-r, bodyH);
    const bodyGeo = new THREE.ExtrudeGeometry(body, { depth, ...bevel });
    const capGeo = new THREE.ExtrudeGeometry(cap, { depth, ...bevel });
    bodyGeo.translate(0, 0, -depth / 2);
    capGeo.translate(0, 0, -depth / 2);
    return { bodyGeo, capGeo };
  }, []);
}

function Stone({ i, progress, geo }: { i: number; progress: RefObject<number>; geo: ReturnType<typeof useStoneGeometry> }) {
  const group = useRef<THREE.Group>(null);
  const still = useMemo(() => stillPreferred(), []);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    // stone i stands up as the reader passes its share of the scroll
    const raw = still ? 1 : Math.min(1, Math.max(0, ((progress.current ?? 0) - 0.08 - i * 0.12) / 0.16));
    const t = 1 - Math.pow(1 - raw, 3);
    const target = 0.08 + t * 0.92;
    g.scale.y += (target - g.scale.y) * (1 - Math.exp(-dt * 8));
  });
  const spot = SPOTS[i];
  return (
    <group ref={group} position={[spot.x, 0, spot.z]} rotation={[0, (i - 2.5) * -0.18, 0]} scale={[1, 0.08, 1]}>
      <mesh geometry={geo.bodyGeo}>
        <meshStandardMaterial color={CLAY} roughness={0.95} metalness={0} />
      </mesh>
      <mesh geometry={geo.capGeo}>
        <meshStandardMaterial color={INK} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

function Thread() {
  const geometry = useMemo(() => {
    const pts = SPOTS.map((s, i) => new THREE.Vector3(s.x, 0.015, s.z + 0.75 + (i % 2) * 0.25));
    pts.unshift(new THREE.Vector3(-6, 0.015, 3.2));
    pts.push(new THREE.Vector3(6.5, 0.015, 3.6));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.6);
    return new THREE.TubeGeometry(curve, 160, 0.016, 6, false);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={THREAD} toneMapped={false} />
    </mesh>
  );
}

function Rig({ progress, pointer }: { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const soft = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3(0, 0.5, 0));
  const still = useMemo(() => stillPreferred(), []);
  useFrame(({ clock }, dt) => {
    const p = still ? 0.6 : (progress.current ?? 0);
    const k = 1 - Math.exp(-dt * 4);
    soft.current.x += ((pointer.current?.x ?? 0) - soft.current.x) * k;
    soft.current.y += ((pointer.current?.y ?? 0) - soft.current.y) * k;
    // the camera comes round from the front to a raised three-quarter view
    const angle = -0.55 + p * 1.1 + soft.current.x * 0.25 + (still ? 0 : Math.sin(clock.elapsedTime * 0.2) * 0.04);
    const radius = 8.2 - p * 1.2;
    const height = 1.6 + p * 2.6 - soft.current.y * 0.6;
    const target = new THREE.Vector3(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    camera.position.lerp(target, 1 - Math.exp(-dt * 5));
    look.current.lerp(new THREE.Vector3(0.2, 0.55, 0.2), 1 - Math.exp(-dt * 5));
    camera.lookAt(look.current);
  });
  return null;
}

function Stones({ progress }: { progress: RefObject<number> }) {
  const geo = useStoneGeometry();
  useEffect(() => () => {
    geo.bodyGeo.dispose();
    geo.capGeo.dispose();
  }, [geo]);
  return (
    <group>
      {SPOTS.map((_, i) => (
        <Stone key={i} i={i} progress={progress} geo={geo} />
      ))}
    </group>
  );
}

export default function ClayScene({ progress, pointer }: { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }) {
  const wrapper = useMeasureNudge<HTMLDivElement>();
  const still = stillPreferred();
  return (
    <div ref={wrapper} className="cl-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        resize={{ scroll: false, debounce: 0 }}
        frameloop={still ? "demand" : "always"}
        camera={{ fov: 30, near: 0.1, far: 60, position: [-4, 1.6, 7] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <hemisphereLight args={["#ffffff", "#cfc6ba", 0.9]} />
        <directionalLight position={[4, 7, 3]} intensity={1.6} />
        <directionalLight position={[-6, 3, -2]} intensity={0.35} />
        <Stones progress={progress} />
        <Thread />
        <Rig progress={progress} pointer={pointer} />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.38} scale={22} blur={2.6} far={3} color="#6b6158" />
        {/* The floor is the cushion itself: unlit, in the exact stone colour, so no edge shows. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
          <circleGeometry args={[400, 64]} />
          <meshBasicMaterial color={FLOOR} toneMapped={false} />
        </mesh>
      </Canvas>
    </div>
  );
}
