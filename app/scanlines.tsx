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
uniform float uDpr;
uniform float uSpacing;
uniform float uIntensity;
uniform vec3 uColor;

void main() {
  float y = gl_FragCoord.y / uDpr;
  // Smooth sine scanlines.
  float line = 0.5 + 0.5 * cos(y * 6.2831853 / uSpacing);
  gl_FragColor = vec4(uColor, clamp(uIntensity * line, 0.0, 1.0));
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
    gl.uniform1f(u("uSpacing"), spacing);
    gl.uniform1f(u("uIntensity"), intensity);
    // Deep navy lines read as part of the sky rather than gray stripes.
    gl.uniform3f(u("uColor"), 0.04, 0.15, 0.35);
    const uDpr = u("uDpr");

    // Static image: draw once, and again whenever the size changes.
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [spacing, intensity]);

  // Sits behind all page content; only shows where content is transparent.
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
    />
  );
}
