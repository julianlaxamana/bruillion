// Two seamless strips of pixel clouds drifting slowly behind the skyline.
// The far strip is smaller, fainter and slower for a bit of parallax.

import { gridToSvg, makeGrid, rng, svgUrl } from "@/lib/pixel";

const TW = 240; // tile width in art pixels
const TH = 48;

function buildClouds(seed: number, count: number): string {
  const g = makeGrid(TW, TH);
  const rand = rng(seed);
  const put = (x: number, y: number, c: string) => {
    if (y >= 0 && y < TH) g[y][((x % TW) + TW) % TW] = c; // wrap so the strip tiles
  };

  for (let n = 0; n < count; n++) {
    const cx = Math.floor((n + rand() * 0.6) * (TW / count));
    const base = 14 + Math.floor(rand() * (TH - 18)); // flat bottom row
    const len = 14 + Math.floor(rand() * 14);
    // A row of bumps (circles) sitting on a flat base.
    const bumps: [number, number, number][] = [];
    for (let x = 0; x < len; x += 4 + Math.floor(rand() * 3)) {
      const r = 3 + Math.floor(rand() * 4) + (x > len * 0.2 && x < len * 0.7 ? 2 : 0);
      bumps.push([cx + x, base - r + 2, r]);
    }
    for (let y = base - 14; y <= base; y++)
      for (let x = cx - 8; x < cx + len + 8; x++) {
        const inside = bumps.some(([bx, by, r]) => (x - bx) ** 2 + (y - by) ** 2 <= r * r);
        if (!inside) continue;
        put(x, y, y >= base - 1 ? "#cfe3f5" : y >= base - 3 ? "#e8f2fb" : "#ffffff");
      }
  }
  return svgUrl(gridToSvg(g));
}

const NEAR = buildClouds(5, 4);
const FAR = buildClouds(11, 3);

function Strip({ image, px, top, seconds, opacity }: { image: string; px: number; top: string; seconds: number; opacity: number }) {
  const w = TW * px;
  return (
    <div
      className="absolute inset-x-0 motion-safe:animate-[drift_var(--drift-time)_linear_infinite]"
      style={
        {
          top,
          height: TH * px,
          opacity,
          backgroundImage: image,
          backgroundRepeat: "repeat-x",
          backgroundSize: `${w}px ${TH * px}px`,
          "--drift-w": `${w}px`,
          "--drift-time": `${seconds}s`,
        } as React.CSSProperties
      }
    />
  );
}

export default function Clouds() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <Strip image={FAR} px={2} top="30%" seconds={300} opacity={0.75} />
      <Strip image={NEAR} px={4} top="2%" seconds={180} opacity={1} />
    </div>
  );
}
