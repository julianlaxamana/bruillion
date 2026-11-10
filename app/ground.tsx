// Pixel-art cross-section of the ground: grass, soil, clay, stone, deep rock.
// Built once as a seamless SVG tile that repeats horizontally.

import { PX, gridToSvg, makeGrid, rng, svgUrl } from "@/lib/pixel";

const W = 64; // tile width in art pixels (wobble periods are based on this so it wraps)
const H = 160; // tile height in art pixels

type Layer = { top: number; base: string; dark: string; light: string; wobble: number; phase: number };

// `top` is the row where each layer starts; boundaries wobble so they look dug, not ruled.
const LAYERS: Layer[] = [
  { top: 3, base: "#5fbf3a", dark: "#3f8f2a", light: "#8ee05a", wobble: 0, phase: 0 }, // grass
  { top: 7, base: "#7a4b2a", dark: "#5e3920", light: "#94603a", wobble: 1, phase: 0.3 }, // soil
  { top: 42, base: "#9c5b34", dark: "#7f4828", light: "#b56d40", wobble: 2, phase: 1.7 }, // clay
  { top: 84, base: "#66667a", dark: "#4f4f60", light: "#85859a", wobble: 2, phase: 3.1 }, // stone
  { top: 132, base: "#3b3346", dark: "#2b2534", light: "#4a4158", wobble: 2, phase: 4.4 }, // deep
];

export const GROUND_TILE_H = H * PX;
export const DEEP = LAYERS[LAYERS.length - 1].base;

function buildTile(): string {
  const rand = rng(7);
  const grid = makeGrid(W, H);

  // Which layer a cell belongs to, with periodic wobble so the tile wraps cleanly.
  const layerAt = (x: number, y: number) => {
    let idx = -1;
    LAYERS.forEach((l, i) => {
      const off = Math.round(l.wobble * Math.sin((2 * Math.PI * x) / W + l.phase) + (l.wobble / 2) * Math.sin((4 * Math.PI * x) / W));
      if (y >= l.top + off) idx = i;
    });
    return idx;
  };

  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = layerAt(x, y);
      if (i < 0) continue;
      const l = LAYERS[i];
      const r = rand();
      grid[y][x] = r < 0.1 ? l.dark : r < 0.16 ? l.light : l.base;
    }

  // Grass: bright top edge and tufts poking into the sky.
  for (let x = 0; x < W; x++) {
    grid[3][x] = LAYERS[0].light;
    if (rand() < 0.35) grid[2][x] = LAYERS[0].base;
    if (rand() < 0.12) {
      grid[2][x] = LAYERS[0].base;
      grid[1][x] = LAYERS[0].light;
    }
  }

  // Rocks in the stone layer.
  for (let n = 0; n < 18; n++) {
    const x = Math.floor(rand() * (W - 3));
    const y = 88 + Math.floor(rand() * 40);
    const w = 2 + Math.floor(rand() * 2);
    for (let dy = 0; dy < 2; dy++)
      for (let dx = 0; dx < w; dx++) grid[y + dy][x + dx] = dy === 0 ? "#9a9ab0" : "#85859a";
  }

  // Pebbles in the soil and clay.
  for (let n = 0; n < 20; n++) {
    const x = Math.floor(rand() * W);
    const y = 10 + Math.floor(rand() * 70);
    grid[y][x] = "#b8a48a";
  }

  // Rare gems deep down — the further you dig, the rarer the find.
  for (let n = 0; n < 2; n++) {
    const x = Math.floor(rand() * W);
    const y = 136 + Math.floor(rand() * 20);
    grid[y][x] = n % 2 ? "#fe2c55" : "#25f4ee";
  }

  return svgUrl(gridToSvg(grid));
}

const TILE = buildTile();

export default function Ground({ children }: { children?: React.ReactNode }) {
  return (
    <section
      // Below the scanline canvas (-z-10) so the lines cover the ground too.
      className="relative -z-20 flex-1"
      style={{
        minHeight: `calc(${H * PX}px + 100svh)`, // room for the camera to follow a deep dig
        // Tile on top; a solid deep-rock fill continues below it (not behind the grass tufts).
        backgroundImage: `${TILE}, linear-gradient(${DEEP}, ${DEEP})`,
        backgroundRepeat: "repeat-x, no-repeat",
        backgroundSize: `${W * PX}px ${H * PX}px, 100% 100%`,
        backgroundPosition: `top left, 0 ${H * PX - PX}px`,
      }}
    >
      {children}
    </section>
  );
}
