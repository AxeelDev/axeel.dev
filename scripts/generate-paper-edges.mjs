// Draws the sheet's paper edges as mask tiles: a torn edge for the top and bottom on phones, a finer deckle edge for the sides on wider screens.
// Each edge gets a mask (solid paper, a see-through fringe, loose fibres) and a rim mask for the lighter core a tear exposes.
// Run with `node scripts/generate-paper-edges.mjs`; the output is committed, so this only runs when the edges change.
import { writeFile } from "node:fs/promises";

const LENGTH = 640; // tile length along the edge; every wave fits a whole number of times, so tiles repeat seamlessly
const STEP = 2;

function random(seed) {
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Sum of sines whose amplitude falls off as 1/k^beta, like a real tear: big wobbles, quieter jags, faint burrs.
// A higher beta gives a smoother edge; the fringe and fibres supply the fine fuzz instead of sharp teeth.
function noise(rand, { from = 1, to = 128, beta }) {
  const waves = Array.from({ length: to - from + 1 }, (_, i) => {
    const k = from + i;
    return { k, phase: rand() * Math.PI * 2, amplitude: (0.5 + rand() * 0.5) / k ** beta };
  });
  const raw = Array.from({ length: LENGTH + 1 }, (_, x) => waves.reduce((sum, w) => sum + w.amplitude * Math.sin((x / LENGTH) * w.k * Math.PI * 2 + w.phase), 0));
  const min = Math.min(...raw), max = Math.max(...raw);
  return raw.map((v) => (v - min) / (max - min));
}

const scale = (values, from, to) => values.map((v) => from + v * (to - from));
const n = (v) => Math.round(v * 10) / 10;

function edge({ seed, depth, contour: [c0, c1], fringe: [f0, f1], rim: [r0, r1], shape, fibres: [count, l0, l1] }) {
  const rand = random(seed);
  const contour = scale(noise(rand, shape), c0, c1); // where solid paper starts, measured in from the outside
  const fringe = scale(noise(rand, { from: 3, beta: 0.7 }), f0, f1); // thin, translucent paper past the contour
  const rim = scale(noise(rand, { from: 2, beta: 1 }), r0, r1); // exposed lighter core inside the contour
  const line = (ys) => ys.flatMap((y, x) => (x % STEP ? [] : [[x, y]])); // every STEP px is plenty once the fibres add the fine detail
  const outer = line(contour.map((y, x) => Math.max(0.2, y - fringe[x])));
  const body = line(contour);
  const rimMid = line(contour.map((y, x) => y + rim[x] * 0.55));
  const rimIn = line(contour.map((y, x) => y + rim[x]));
  const band = (a, b) => [...a, ...[...b].reverse()];
  const toDepth = (a) => [...a, [LENGTH, depth], [0, depth]];
  // Fibres share three opacity levels, so each level is a single path instead of one element per fibre.
  const fibres = [[], [], []];
  for (let i = 0; i < count; i++) {
    const x = 4 + rand() * (LENGTH - 8), y = Math.max(0.2, contour[Math.round(x)] - fringe[Math.round(x)]) + 0.3;
    const length = l0 + rand() ** 2 * (l1 - l0), lean = (rand() - 0.5) * length * 1.4;
    fibres[Math.floor(rand() * 3)].push([[x, y], [x + lean * 0.3 + (rand() - 0.5), y - length * 0.6], [x + lean, y - length]]);
  }
  return {
    // The fringe runs to the paper side too; the solid body covers it there, so only the strip past the contour stays see-through.
    mask: [{ points: toDepth(outer), opacity: 0.42 }, { points: toDepth(body), opacity: 1 }, ...fibres.map((curves, i) => ({ curves, opacity: 0.35 + i * 0.15 }))],
    rim: [{ points: band(body, rimIn), opacity: 0.45 }, { points: band(body, rimMid), opacity: 0.6 }],
  };
}

// Shapes are drawn as a top edge (paper below); other sides are the same drawing turned around.
const turns = {
  top: (x, y) => [x, y],
  bottom: (x, y, depth) => [x, depth - y],
  left: (x, y) => [y, x],
  right: (x, y, depth) => [depth - y, x],
};

function svg(shapes, side, depth) {
  const turn = (p) => turns[side](p[0], p[1], depth).map(n).join(",");
  const [width, height] = side === "top" || side === "bottom" ? [LENGTH, depth] : [depth, LENGTH];
  const opacity = (attribute, value) => (value < 1 ? ` ${attribute}="${Math.round(value * 100) / 100}"` : "");
  const body = shapes.map((s) => s.points
    ? `<path d="M${turn(s.points[0])}L${s.points.slice(1).map(turn).join(" ")}Z"${opacity("fill-opacity", s.opacity)}/>`
    : `<path d="${s.curves.map((c) => `M${turn(c[0])}Q${turn(c[1])} ${turn(c[2])}`).join("")}" fill="none" stroke="#fff" stroke-linecap="round" stroke-width=".35"${opacity("stroke-opacity", s.opacity)}/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="#fff">${body}</svg>`;
}

const torn = { depth: 14, contour: [2.2, 9.6], fringe: [0.3, 1.8], rim: [1.1, 3.4], shape: { beta: 1.05 }, fibres: [150, 0.8, 3.4] };
const deckle = { depth: 12, contour: [2, 6.8], fringe: [0.2, 1.2], rim: [0.6, 1.8], shape: { from: 2, beta: 1.35 }, fibres: [190, 0.5, 2] };
const edges = { top: { ...torn, seed: 11 }, bottom: { ...torn, seed: 29 }, left: { ...deckle, seed: 47 }, right: { ...deckle, seed: 83 } };

for (const [side, options] of Object.entries(edges)) {
  const { mask, rim } = edge(options);
  await writeFile(new URL(`../public/paper-edge-${side}.svg`, import.meta.url), svg(mask, side, options.depth));
  await writeFile(new URL(`../public/paper-rim-${side}.svg`, import.meta.url), svg(rim, side, options.depth));
}
console.log("Drew the paper edges.");
