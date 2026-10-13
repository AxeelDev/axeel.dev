import { round } from "./random";

// A small floating island, built one block at a time. `.` is empty air, digits are column heights, `~` is water.
const ISLAND = [
  "..1221..",
  ".123321.",
  "1234~321",
  "234~~332",
  "12343321",
  ".123321.",
  "..1221..",
  "...11...",
];
const TREE = { x: 2, y: 4 };
const TX = 15, TY = 7.5, TZ = 17;

type Kind = "grass" | "dirt" | "stone" | "water" | "wood" | "leaves";
type Block = { x: number; y: number; z: number; kind: Kind };

function buildIsland() {
  const blocks: Block[] = [];
  const heights = ISLAND.map((row) => [...row].map((c) => (c === "." ? 0 : c === "~" ? 1 : Number(c))));
  ISLAND.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === ".") return;
    if (cell === "~") { blocks.push({ x, y, z: 0, kind: "stone" }, { x, y, z: 1, kind: "water" }); return; }
    const top = Number(cell);
    // Floating islands taper into stone underneath.
    for (let z = Math.max(0, 1 - top); z <= top; z++) blocks.push({ x, y, z, kind: z === top ? "grass" : z < top - 1 ? "stone" : "dirt" });
  }));
  const base = heights[TREE.y][TREE.x] + 1;
  for (let z = base; z < base + 3; z++) blocks.push({ ...TREE, z, kind: "wood" });
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    blocks.push({ x: TREE.x + dx, y: TREE.y + dy, z: base + 3, kind: "leaves" });
    if (!dx || !dy) if (dx || dy) blocks.push({ x: TREE.x + dx, y: TREE.y + dy, z: base + 4, kind: "leaves" });
  }
  blocks.push({ ...TREE, z: base + 4, kind: "leaves" });
  return blocks;
}

export function VoxelArt() {
  const blocks = buildIsland().sort((a, b) => a.x + a.y - (b.x + b.y) || a.z - b.z);
  const filled = new Set(blocks.map(({ x, y, z }) => `${x},${y},${z}`));
  const has = (x: number, y: number, z: number) => filled.has(`${x},${y},${z}`);
  const ox = 8 * TX + 20, oy = 6 * TZ + 26;
  const p = (x: number, y: number, z: number) => `${round(ox + (x - y) * TX)},${round(oy + (x + y) * TY - z * TZ)}`;
  const faces = blocks.flatMap(({ x, y, z, kind }, i) => {
    const lift = kind === "water" ? 0.2 : 0;
    const out = [];
    if (!has(x, y, z + 1)) out.push(<polygon key={`${i}t`} className={`vx-${kind} vx-top`} points={[p(x, y, z + 1 - lift), p(x + 1, y, z + 1 - lift), p(x + 1, y + 1, z + 1 - lift), p(x, y + 1, z + 1 - lift)].join(" ")} />);
    if (!has(x + 1, y, z)) out.push(<polygon key={`${i}r`} className={`vx-${kind} vx-right`} points={[p(x + 1, y, z + 1 - lift), p(x + 1, y + 1, z + 1 - lift), p(x + 1, y + 1, z), p(x + 1, y, z)].join(" ")} />);
    if (!has(x, y + 1, z)) out.push(<polygon key={`${i}l`} className={`vx-${kind} vx-left`} points={[p(x, y + 1, z + 1 - lift), p(x + 1, y + 1, z + 1 - lift), p(x + 1, y + 1, z), p(x, y + 1, z)].join(" ")} />);
    return out;
  });
  const cloud = [[0, 0], [1, 0], [2, 0], [1, 1], [2, 1], [3, 1]].map(([x, y], i) => <polygon key={i} className="vx-cloud" points={[p(x - 3, y - 2, 11), p(x - 2, y - 2, 11), p(x - 2, y - 1, 11), p(x - 3, y - 1, 11)].join(" ")} />);
  return <svg className="art art-voxel" viewBox="0 0 280 300" role="img" aria-label="An isometric floating island made of blocks, with a tree and a small pond">
    <g className="vx-cloud-drift">{cloud}</g>
    <g className="vx-island">{faces}</g>
    <ellipse className="vx-shadow" cx={ox + 4} cy={286} rx={70} ry={6} />
  </svg>;
}
