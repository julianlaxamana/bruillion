// Pixel-art brown bear, standing on all fours, facing right.
// Built from simple shapes (body, shoulder hump, head, snout, legs), then shaded
// and given a 1px outline automatically so edges stay clean.

import { gridToSvg, makeGrid, svgUrl } from "@/lib/pixel";

const W = 40;
const H = 24;

const C = {
  outline: "#2a1a12",
  fur: "#8b5a2b",
  light: "#a8733f",
  shade: "#6b4220",
  far: "#5a3719", // legs on the far side
  snout: "#d9b38c",
  dark: "#1a100a",
};

type Part = "far" | "fur" | "snout";

function buildBear(): string {
  const part: (Part | null)[][] = Array.from({ length: H }, () => Array(W).fill(null));
  const fill = (test: (x: number, y: number) => boolean, p: Part) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (test(x + 0.5, y + 0.5)) part[y][x] = p;
  };
  const ellipse = (cx: number, cy: number, rx: number, ry: number) => (x: number, y: number) =>
    ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const box = (x0: number, y0: number, x1: number, y1: number) => (x: number, y: number) =>
    x >= x0 && x < x1 && y >= y0 && y < y1;

  // Far-side legs first so the body overlaps them.
  fill(box(10, 14, 14, 22), "far");
  fill(box(25, 14, 29, 22), "far");
  // Body: rump, belly, shoulder hump.
  fill(ellipse(8, 12, 6, 5.5), "fur");
  fill(ellipse(17, 12.5, 12, 6), "fur");
  fill(ellipse(22, 8.5, 6.5, 4.5), "fur");
  // Head and ears.
  fill(ellipse(30, 10, 5, 4.5), "fur");
  fill(ellipse(27.5, 5.5, 1.8, 1.8), "fur");
  fill(ellipse(31.5, 5.5, 1.8, 1.8), "fur");
  // Near-side legs.
  fill(box(4, 14, 9, 22), "fur");
  fill(box(19, 14, 24, 22), "fur");
  // Snout pokes out front.
  fill(ellipse(35.5, 11.5, 3, 2.2), "snout");

  const g = makeGrid(W, H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = part[y][x];
      if (!p) continue;
      if (p === "far") g[y][x] = C.far;
      else if (p === "snout") g[y][x] = C.snout;
      else if (!part[y - 1]?.[x]) g[y][x] = C.light; // sunlit top edge
      else if (y >= 15) g[y][x] = C.shade; // belly and legs in shadow
      else g[y][x] = C.fur;
    }

  // Ear insides, eye, nose, mouth.
  g[5][27] = C.shade;
  g[5][31] = C.shade;
  g[9][32] = C.dark;
  g[10][38] = C.dark;
  g[11][38] = C.dark;
  g[13][35] = C.shade;
  g[13][36] = C.shade;
  // Toe gaps.
  for (const x of [5, 7, 20, 22]) g[21][x] = C.shade;

  // 1px outline around everything.
  const filled = (x: number, y: number) => !!g[y]?.[x] && g[y][x] !== C.outline;
  const outline: [number, number][] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (!g[y][x] && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) outline.push([x, y]);
  for (const [x, y] of outline) g[y][x] = C.outline;
  // Outline between the far legs and the body so they read as separate.
  for (let y = 15; y < 22; y++) for (const x of [9, 14, 24, 29]) if (part[y][x] === null && g[y][x] === null) g[y][x] = C.outline;

  return svgUrl(gridToSvg(g));
}

const IMAGE = buildBear();

export default function Bear({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="A brown pixel-art bear"
      className={className}
      // 3px per art pixel on desktop, smaller on narrow screens.
      style={{
        width: `min(${W * 3}px, 22vw)`,
        aspectRatio: `${W} / ${H}`,
        backgroundImage: IMAGE,
        backgroundSize: "100% 100%",
      }}
    />
  );
}
