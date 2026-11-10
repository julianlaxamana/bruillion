// Tiny helpers for building crisp pixel art as SVG.

export const PX = 4; // CSS pixels per art pixel

export type Grid = (string | null)[][];

export function makeGrid(w: number, h: number): Grid {
  return Array.from({ length: h }, () => Array(w).fill(null));
}

/** Deterministic PRNG so art is identical on server and client. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/** Grid → SVG markup, merging horizontal runs of one color into single rects. */
export function gridToSvg(grid: Grid): string {
  const h = grid.length;
  const w = grid[0].length;
  let rects = "";
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const c = grid[y][x];
      let end = x + 1;
      while (end < w && grid[y][end] === c) end++;
      if (c) rects += `<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${c}"/>`;
      x = end;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * PX}" height="${h * PX}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
}

export function svgUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
