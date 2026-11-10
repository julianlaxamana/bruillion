// Skyline that stands on the grass: a repeating pixel forest, with a campus
// in front inspired by Royce Hall's twin towers and Powell Library's dome.

import { PX, type Grid, gridToSvg, makeGrid, rng, svgUrl } from "@/lib/pixel";

/* ---------------- Forest (seamless horizontal tile) ---------------- */

const FW = 64;
const FH = 30;

function buildForest(): string {
  const g = makeGrid(FW, FH);
  const rand = rng(21);
  const put = (x: number, y: number, c: string) => {
    if (y >= 0 && y < FH) g[y][((x % FW) + FW) % FW] = c; // wrap so the tile tiles
  };

  // Back row: tall pines.
  for (let cx = 2; cx < FW; cx += 7 + Math.floor(rand() * 4)) {
    const top = 2 + Math.floor(rand() * 8);
    for (let y = top; y < FH - 2; y++) {
      const d = y - top;
      const hw = Math.floor(d * 0.4) - (d % 6 === 0 && d > 0 ? 1 : 0); // tiered edge
      for (let dx = -hw; dx <= hw; dx++) put(cx + dx, y, dx < 0 && rand() < 0.5 ? "#356e3f" : "#2c5e37");
    }
    put(cx, FH - 2, "#4a2f1c");
    put(cx, FH - 1, "#4a2f1c");
  }

  // Front row: round leafy trees.
  for (let cx = 5; cx < FW; cx += 9 + Math.floor(rand() * 5)) {
    const r = 4 + Math.floor(rand() * 3);
    const cy = FH - 4 - r;
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r + 1) continue;
        const lit = dx + dy < -r * 0.6;
        put(cx + dx, cy + dy, lit ? "#5aa65a" : rand() < 0.12 ? "#336f39" : "#3d8a44");
      }
    for (let y = cy + r; y < FH; y++) put(cx, y, "#5e3920");
  }
  return svgUrl(gridToSvg(g));
}

const FOREST = buildForest();

/* ---------------- Campus (single centered piece) ---------------- */

const CW = 150;
const CH = 80;

const BRICK = "#b5523b";
const BRICK_D = "#933f2d";
const STONE = "#ecd9a8";
const ROOF = "#c0603a";
const ROOF_D = "#9c4a2c";
const DARK = "#3b2320";

function buildCampus(): string {
  const g: Grid = makeGrid(CW, CH);
  const rect = (x: number, y: number, w: number, h: number, c: string) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (j >= 0 && j < CH && i >= 0 && i < CW) g[j][i] = c;
  };
  // Arch: rectangle with rounded (cut) top corners.
  const arch = (x: number, y: number, w: number, h: number, c: string) => {
    if (w >= 7) {
      rect(x, y + 2, w, h - 2, c);
      rect(x + 1, y + 1, w - 2, 1, c);
      rect(x + 2, y, w - 4, 1, c);
    } else {
      rect(x, y + 1, w, h - 1, c);
      rect(x + 1, y, w - 2, 1, c);
    }
  };
  const framedArch = (x: number, y: number, w: number, h: number) => {
    arch(x - 1, y - 1, w + 2, h + 1, STONE);
    arch(x, y, w, h, DARK);
  };
  // Stepped pyramid roof sitting on baseY, centered on cx.
  const pyramid = (cx: number, baseY: number, baseW: number) => {
    let y = baseY;
    for (let w = baseW; w >= 2; w -= 2) {
      rect(cx - w / 2, y - 2, w, 2, ROOF);
      rect(cx + w / 2 - 1, y - 2, 1, 2, ROOF_D);
      y -= 2;
    }
    rect(cx - 1, y - 2, 2, 2, STONE);
  };

  /* Royce-inspired hall (left) */
  rect(2, 52, 72, 28, BRICK);
  rect(2, 50, 72, 2, ROOF);
  rect(2, 52, 72, 1, STONE);
  rect(2, 66, 72, 1, STONE);
  for (let i = 0; i < 8; i++) {
    const x = 5 + i * 9;
    if (x > 29 && x < 45) continue; // leave room for the main entrance
    framedArch(x, 69, 5, 11);
    arch(x + 1, 56, 3, 6, DARK);
  }
  // Central gable with rose window and grand entrance.
  rect(28, 40, 20, 12, BRICK);
  for (let k = 0; k < 4; k++) rect(28 + k * 2, 40 - (k + 1) * 2, 20 - k * 4, 2, ROOF);
  rect(35, 42, 6, 6, STONE);
  rect(36, 43, 4, 4, DARK);
  rect(37, 44, 2, 2, STONE);
  framedArch(33, 58, 10, 22);
  // Twin towers.
  for (const tx of [14, 48]) {
    rect(tx, 20, 14, 32, BRICK);
    rect(tx + 12, 20, 2, 32, BRICK_D);
    rect(tx - 1, 20, 16, 1, STONE);
    rect(tx - 1, 34, 16, 1, STONE);
    arch(tx + 3, 24, 3, 8, DARK);
    arch(tx + 8, 24, 3, 8, DARK);
    arch(tx + 5, 38, 4, 7, DARK);
    pyramid(tx + 7, 20, 16);
  }

  /* Powell-inspired library (right) */
  rect(82, 56, 66, 24, BRICK);
  rect(82, 54, 66, 2, ROOF);
  rect(82, 56, 66, 1, STONE);
  for (let i = 0; i < 8; i++) {
    const x = 86 + i * 8;
    if (x > 100 && x < 126) continue;
    framedArch(x, 62, 4, 12);
  }
  // Central block, entrance and octagonal drum.
  rect(103, 44, 24, 36, BRICK);
  rect(125, 44, 2, 36, BRICK_D);
  rect(102, 44, 26, 1, STONE);
  framedArch(109, 62, 12, 18);
  arch(106, 50, 3, 7, DARK);
  arch(121, 50, 3, 7, DARK);
  rect(106, 30, 18, 14, BRICK);
  rect(122, 30, 2, 14, BRICK_D);
  rect(105, 30, 20, 1, STONE);
  rect(105, 43, 20, 1, STONE);
  for (const x of [108, 113, 118]) arch(x, 34, 3, 7, DARK);
  // Stepped dome with ribs and a lantern on top.
  const dome: [number, number][] = [[20, 28], [18, 26], [16, 24], [12, 22], [8, 20]];
  for (const [w, y] of dome) {
    rect(115 - w / 2, y, w, 2, ROOF);
    rect(115 + w / 2 - 2, y, 2, 2, ROOF_D);
    rect(114, y, 1, 2, ROOF_D);
  }
  rect(113, 14, 4, 6, STONE);
  rect(114, 15, 2, 3, DARK);
  rect(114, 12, 2, 2, ROOF);

  // Steps between the buildings.
  for (let k = 0; k < 4; k++) rect(74 - k, 72 + k * 2, 8 + k * 2, 2, k % 2 ? STONE : "#d8c08a");

  return gridToSvg(g);
}

const CAMPUS = svgUrl(buildCampus());

export default function Scenery() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-3 -z-20">
      {/* Bottom sits on the grass line (ground tile row 3 = 12px). */}
      {/* Forest runs the full width behind everything. */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: FH * PX,
          backgroundImage: FOREST,
          backgroundRepeat: "repeat-x",
          backgroundSize: `${FW * PX}px ${FH * PX}px`,
          backgroundPosition: "bottom center",
        }}
      />
      {/* Campus centered in front; shrinks on narrow screens. */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: `min(${CW * PX}px, 100vw)`,
          aspectRatio: `${CW} / ${CH}`,
          backgroundImage: CAMPUS,
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
}
