"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Distance between scanlines in CSS pixels. */
  spacing?: number;
  /** How strong the scanlines are, 0–1. */
  intensity?: number;
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Draws the line color with varying alpha over the page background.
const FRAG = `
precision mediump float;
uniform vec2 uRes;      // canvas size in device pixels
uniform float uDpr;
uniform float uTime;
uniform float uSpacing;
uniform float uIntensity;
uniform vec3 uColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float y = gl_FragCoord.y / uDpr;

  // Smooth sine scanlines.
  float line = 0.5 + 0.5 * cos(y * 6.2831853 / uSpacing);
  float a = uIntensity * line;

  // Slow band rolling down the screen, like an unsynced CRT.
  float roll = fract(uv.y + uTime * 0.08);
  a *= 1.0 - 0.35 * smoothstep(0.0, 0.08, roll) * smoothstep(0.16, 0.08, roll);

  gl_FragColor = vec4(uColor, clamp(a, 0.0, 1.0));
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
  return s;
}

export default function Scanlines({ spacing = 3, intensity = 0.35 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const params = useRef({ spacing, intensity });
  useEffect(() => {
    params.current = { spacing, intensity };
  }, [spacing, intensity]);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // One triangle covering the whole viewport.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uDpr = u("uDpr"), uTime = u("uTime");
    const uSpacing = u("uSpacing"), uIntensity = u("uIntensity"), uColor = u("uColor");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Dark lines on a light background, light lines on a dark one.
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    const frame = () => {
      const p = params.current;
      const dark = darkMode.matches;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, window.devicePixelRatio || 1);
      gl.uniform1f(uTime, reduceMotion ? 0 : (performance.now() - start) / 1000);
      gl.uniform1f(uSpacing, p.spacing);
      gl.uniform1f(uIntensity, dark ? p.intensity * 0.5 : p.intensity);
      gl.uniform3f(uColor, dark ? 1 : 0, dark ? 1 : 0, dark ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Sits behind all page content; only shows where content is transparent.
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
    />
  );
}
