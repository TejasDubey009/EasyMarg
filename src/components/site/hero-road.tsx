"use client";

import { useEffect, useRef } from "react";

/*
  The road, in three dimensions.

  A line-drawn landscape rendered with WebGL: a road (marg) running to the
  horizon through contoured hills, with milestone stones on its left shoulder,
  the side they stand on in India. The camera travels the road slowly.

  Nothing here adds a colour. Lines are white on a transparent canvas, so the
  brand blue behind them is the page's own. Stones take their blue from the
  --color-blue token. Solid lane edges and a dashed centre line mean what they
  mean everywhere else on the site: the dashes are the road ahead.
*/

const CELL_X = 0.8;
const CELL_Z = 0.6;
const COLS = 181;
const ROWS = 261;
const HALF_WIDTH = ((COLS - 1) * CELL_X) / 2;
const STONE_GAP = 26;
const SPEED = 2.4;

const ROAD = /* glsl */ `
float roadX(float z) {
  return 5.5 * sin(z * 0.028) + 2.5 * sin(z * 0.011 + 1.3);
}
`;

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
  m = m * m;
  m = m * m;
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
`;

const TERRAIN_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCell;
uniform mat4 uViewProj;
uniform vec2 uOrigin;
uniform vec2 uShift;
out float vHeight;
out vec2 vWorld;
out float vDepth;
${NOISE}
${ROAD}
// Flat where the road runs, rising into hills on either side of it.
float terrain(vec2 p) {
  float d = abs(p.x - roadX(p.y));
  float away = smoothstep(2.6, 20.0, d);
  float n = 0.5 * snoise(p * 0.035) + 0.28 * snoise(p * 0.08 + 7.1) + 0.12 * snoise(p * 0.19 + 3.7);
  float h = (n * 0.55 + 0.55) * 12.0 * away;
  h += 0.25 * snoise(p * 0.12) * smoothstep(2.6, 6.0, d);
  return h;
}
void main() {
  vec2 world = vec2(uOrigin.x + aCell.x, uOrigin.y - aCell.y);
  float h = terrain(world);
  vHeight = h;
  vWorld = world;
  vec4 clip = uViewProj * vec4(world.x, h, world.y, 1.0);
  vDepth = clip.w;
  clip.xy += uShift * clip.w;
  gl_Position = clip;
}
`;

const TERRAIN_FS = /* glsl */ `#version 300 es
precision highp float;
in float vHeight;
in vec2 vWorld;
in float vDepth;
uniform vec2 uResolution;
uniform vec4 uMask;
out vec4 outColor;
${ROAD}
// A line wherever v crosses a whole number, a fixed number of pixels wide.
float contour(float v, float halfPx) {
  float fw = fwidth(v);
  float px = abs(fract(v - 0.5) - 0.5) / max(fw, 1e-5);
  float a = 1.0 - smoothstep(halfPx - 0.5, halfPx + 0.5, px);
  return a * (1.0 - smoothstep(0.3, 0.65, fw));
}
// A painted line of a real width on the ground, never thinner than a pixel.
float painted(float dist, float halfWidth, float fw) {
  float px = dist / max(fw, 1e-5);
  float half_px = max(halfWidth / max(fw, 1e-5), 0.65);
  return 1.0 - smoothstep(half_px - 0.5, half_px + 0.5, px);
}
void main() {
  float d = vWorld.x - roadX(vWorld.y);
  float ad = abs(d);
  float fd = fwidth(d);

  float hills = contour(vHeight / 0.8, 0.6) * smoothstep(2.5, 4.2, ad);
  float edge = painted(abs(ad - 2.3), 0.05, fd);

  float along = vWorld.y / 6.0;
  float fz = fwidth(along);
  float dash = 1.0 - smoothstep(0.25 - fz, 0.25 + fz, abs(fract(along) - 0.5));
  float centre = painted(ad, 0.07, fd) * dash * (1.0 - smoothstep(0.25, 0.5, fz));

  float fog = exp(-vDepth * 0.02);
  float a = (hills * 0.5 + edge * 0.92 + centre * 0.95) * fog;

  float sx = gl_FragCoord.x / uResolution.x;
  a *= mix(uMask.z, 1.0, smoothstep(uMask.x, uMask.y, sx)) * uMask.w;

  // Premultiplied white. Empty ground still writes depth, so a hill hides what is behind it.
  outColor = vec4(a);
}
`;

const STONE_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
layout(location = 2) in float aFade;
uniform mat4 uViewProj;
uniform vec2 uShift;
out vec2 vUv;
out float vFade;
void main() {
  vUv = aUv;
  vFade = aFade;
  vec4 clip = uViewProj * vec4(aPosition, 1.0);
  clip.xy += uShift * clip.w;
  gl_Position = clip;
}
`;

const STONE_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
in float vFade;
uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform vec4 uMask;
out vec4 outColor;
void main() {
  vec4 texel = texture(uAtlas, vUv);
  if (texel.a < 0.02) discard;
  // The same quiet zone as the ground: nothing competes with the headline.
  float sx = gl_FragCoord.x / uResolution.x;
  outColor = texel * vFade * mix(uMask.z, 1.0, smoothstep(uMask.x, uMask.y, sx));
}
`;

const roadX = (z: number) => 5.5 * Math.sin(z * 0.028) + 2.5 * Math.sin(z * 0.011 + 1.3);

type Mat4 = Float32Array;

function perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

function lookAt(eye: number[], target: number[]): Mat4 {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  const zl = Math.hypot(zx, zy, zz);
  zx /= zl;
  zy /= zl;
  zz /= zl;
  // right = up × z, with up = (0, 1, 0)
  let xx = zz;
  let xz = -zx;
  const xl = Math.hypot(xx, xz);
  xx /= xl;
  xz /= xl;
  const yx = zy * xz;
  const yy = zz * xx - zx * xz;
  const yz = -zy * xx;
  const m = new Float32Array(16);
  m[0] = xx;
  m[1] = yx;
  m[2] = zx;
  m[4] = 0;
  m[5] = yy;
  m[6] = zy;
  m[8] = xz;
  m[9] = yz;
  m[10] = zz;
  m[12] = -(xx * eye[0] + xz * eye[2]);
  m[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  m[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  m[15] = 1;
  return m;
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const m = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      m[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
  }
  return m;
}

function compile(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("EasyMarg hero:", gl.getShaderInfoLog(shader));
      return null;
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** Six milestone stones, numbered 1 to 6, drawn once and used as a texture. */
function drawStones(blue: string, font: string): HTMLCanvasElement {
  const W = 128;
  const H = 156;
  const canvas = document.createElement("canvas");
  canvas.width = W * 6;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  for (let i = 0; i < 6; i++) {
    const x0 = i * W + 10;
    const x1 = (i + 1) * W - 10;
    const r = (x1 - x0) / 2;
    const shoulder = 8 + r;
    const y1 = H - 6;
    const outline = () => {
      ctx.beginPath();
      ctx.moveTo(x0, y1);
      ctx.lineTo(x0, shoulder);
      ctx.arc(x0 + r, shoulder, r, Math.PI, 0);
      ctx.lineTo(x1, y1);
      ctx.closePath();
    };
    outline();
    ctx.fillStyle = blue;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x0 + r, shoulder, r, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    outline();
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = `500 52px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), x0 + r, shoulder + (y1 - shoulder) / 2 + 3);
  }
  return canvas;
}

export function HeroRoad({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return;

    const terrain = compile(gl, TERRAIN_VS, TERRAIN_FS);
    const stones = compile(gl, STONE_VS, STONE_FS);
    if (!terrain || !stones) return;

    // The ground: a sheet of cells, ordered nearest row first so near hills are drawn before far ones.
    const cells = new Float32Array(COLS * ROWS * 2);
    for (let r = 0, i = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        cells[i++] = c * CELL_X - HALF_WIDTH;
        cells[i++] = r * CELL_Z;
      }
    }
    const indices = new Uint16Array((COLS - 1) * (ROWS - 1) * 6);
    for (let r = 0, i = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const a = r * COLS + c;
        const b = a + COLS;
        indices[i++] = a;
        indices[i++] = a + 1;
        indices[i++] = b;
        indices[i++] = a + 1;
        indices[i++] = b + 1;
        indices[i++] = b;
      }
    }

    const groundVao = gl.createVertexArray();
    gl.bindVertexArray(groundVao);
    const cellBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cellBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cells, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const MAX_STONES = 8;
    const stoneData = new Float32Array(MAX_STONES * 6 * 6);
    const stoneVao = gl.createVertexArray();
    gl.bindVertexArray(stoneVao);
    const stoneBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stoneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, stoneData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 24, 20);
    gl.bindVertexArray(null);

    let disposed = false;
    const atlas = gl.createTexture();
    const paintAtlas = () => {
      const root = getComputedStyle(document.documentElement);
      const blue = root.getPropertyValue("--color-blue").trim() || "#153a9c";
      const font = root.getPropertyValue("--font-mono").trim() || "monospace";
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawStones(blue, font));
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    paintAtlas();
    // The numbers are set in the site's mono face; repaint once it has loaded.
    document.fonts?.ready.then(() => !disposed && paintAtlas());

    const uni = {
      tViewProj: gl.getUniformLocation(terrain, "uViewProj"),
      tOrigin: gl.getUniformLocation(terrain, "uOrigin"),
      tShift: gl.getUniformLocation(terrain, "uShift"),
      tResolution: gl.getUniformLocation(terrain, "uResolution"),
      tMask: gl.getUniformLocation(terrain, "uMask"),
      sViewProj: gl.getUniformLocation(stones, "uViewProj"),
      sShift: gl.getUniformLocation(stones, "uShift"),
      sAtlas: gl.getUniformLocation(stones, "uAtlas"),
      sResolution: gl.getUniformLocation(stones, "uResolution"),
      sMask: gl.getUniformLocation(stones, "uMask"),
    };

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let travelled = 60;
    let last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      let scale = Math.min(window.devicePixelRatio || 1, 2);
      // Keep the pixel count sane on very large or very dense screens.
      const budget = 2_400_000;
      if (rect.width * rect.height * scale * scale > budget) scale = Math.sqrt(budget / (rect.width * rect.height));
      const w = Math.max(1, Math.round(rect.width * scale));
      const h = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const aspect = w / h;
      const wide = aspect > 1.15;
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      const camZ = -travelled;
      const camX = roadX(camZ) * 0.92 + pointer.x * 0.7;
      const eye = [camX, 2.4 + pointer.y * 0.25, camZ];
      const target = [roadX(camZ - 24) + pointer.x * 1.6, 1.4, camZ - 24];
      const viewProj = multiply(perspective(((wide ? 46 : 64) * Math.PI) / 180, aspect, 0.3, 240), lookAt(eye, target));

      // On a wide screen the road runs up the right-hand side, clear of the headline.
      const shift: [number, number] = wide ? [0.4, 0.2] : [0.16, -0.46];
      const mask: [number, number, number, number] = wide ? [0.36, 0.64, 0.1, 1] : [0, 0, 1, 0.62];

      gl.useProgram(terrain);
      gl.uniformMatrix4fv(uni.tViewProj, false, viewProj);
      gl.uniform2f(uni.tOrigin, Math.floor(camX / CELL_X) * CELL_X, Math.floor(camZ / CELL_Z) * CELL_Z);
      gl.uniform2f(uni.tShift, shift[0], shift[1]);
      gl.uniform2f(uni.tResolution, w, h);
      gl.uniform4f(uni.tMask, mask[0], mask[1], mask[2], mask[3]);
      gl.bindVertexArray(groundVao);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      // Milestones on the left shoulder, one every STONE_GAP along the road.
      let count = 0;
      const first = Math.ceil(travelled / STONE_GAP);
      for (let k = first; k < first + MAX_STONES; k++) {
        const z = -k * STONE_GAP;
        const dist = camZ - z;
        if (dist > 150) break;
        // A stone fades as it draws level, so it never looms over the page's own matter.
        const fade = Math.exp(-dist * 0.02) * Math.min(1, Math.max(0, (dist - 7) / 9)) * Math.min(1, (150 - dist) / 30) * mask[3];
        const x = roadX(z) - 3.4;
        const n = ((k % 6) + 6) % 6;
        const u0 = n / 6;
        const u1 = (n + 1) / 6;
        const quad = [
          [x - 0.5, 0.04, u0, 0],
          [x + 0.5, 0.04, u1, 0],
          [x + 0.5, 1.26, u1, 1],
          [x - 0.5, 0.04, u0, 0],
          [x + 0.5, 1.26, u1, 1],
          [x - 0.5, 1.26, u0, 1],
        ];
        for (const [px, py, u, v] of quad) {
          stoneData.set([px, py, z, u, v, fade], count * 6);
          count++;
        }
      }
      gl.useProgram(stones);
      gl.uniformMatrix4fv(uni.sViewProj, false, viewProj);
      gl.uniform2f(uni.sShift, shift[0], shift[1]);
      gl.uniform2f(uni.sResolution, w, h);
      gl.uniform4f(uni.sMask, mask[0], mask[1], mask[2], mask[3]);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.uniform1i(uni.sAtlas, 0);
      gl.bindVertexArray(stoneVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, stoneBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, stoneData, 0, count * 6);
      gl.drawArrays(gl.TRIANGLES, 0, count);
      gl.bindVertexArray(null);
    };

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      travelled += dt * SPEED;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (still || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onPointer = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = event.clientY / window.innerHeight - 0.5;
    };

    const sizeWatcher = new ResizeObserver(() => {
      resize();
      draw();
    });
    sizeWatcher.observe(canvas);
    // Stop drawing when the hero is off screen or the tab is in the background.
    const viewWatcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewWatcher.observe(canvas);
    document.addEventListener("visibilitychange", start);
    if (!still) window.addEventListener("pointermove", onPointer, { passive: true });
    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    resize();
    draw();
    canvas.dataset.ready = "true";
    start();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      viewWatcher.disconnect();
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(cellBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(stoneBuffer);
      gl.deleteVertexArray(groundVao);
      gl.deleteVertexArray(stoneVao);
      gl.deleteTexture(atlas);
      gl.deleteProgram(terrain);
      gl.deleteProgram(stones);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={["pointer-events-none opacity-0 transition-opacity duration-[1400ms] ease-out data-[ready=true]:opacity-100", className].filter(Boolean).join(" ")}
    />
  );
}
