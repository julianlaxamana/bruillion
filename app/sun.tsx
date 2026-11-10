// Pixel sun with stubby rays, sitting high in the sky behind the clouds.

import { PX, gridToSvg, makeGrid, svgUrl } from "@/lib/pixel";

const S = 32; // art pixels square
const R = 9; // disc radius

function buildSun(): string {
  const g = makeGrid(S, S);
  const c = S / 2;
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = x + 0.5 - c;
      const dy = y + 0.5 - c;
      const d = Math.hypot(dx, dy);
      if (d <= R) {
        // Rim, body, and a highlight toward the top-left.
        g[y][x] = d > R - 1.2 ? "#ffb627" : dx + dy < -R * 0.7 ? "#fff3b0" : "#ffd75e";
        continue;
      }
      // Eight rays: short blocky dashes at 45° steps, a gap away from the disc.
      const f = Math.atan2(dy, dx) / (Math.PI / 4);
      const onRay = Math.abs(f - Math.round(f)) < 0.12;
      if (onRay && d >= R + 2 && d <= R + 5.5) g[y][x] = "#ffc94a";
    }
  return svgUrl(gridToSvg(g));
}

const IMAGE = buildSun();

export default function Sun() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-6 right-[8%] -z-20 sm:top-10 sm:right-[12%]"
      style={{
        width: `min(${S * PX}px, 26vw)`,
        aspectRatio: "1",
        backgroundImage: IMAGE,
        backgroundSize: "100% 100%",
      }}
    />
  );
}
