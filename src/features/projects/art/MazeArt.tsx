import { hashString, seeded } from "./random";

const W = 17, H = 10, C = 26, PAD = 14;

function buildMaze(seed: string) {
  const random = seeded(hashString(seed));
  const right = Array.from({ length: H }, () => Array<boolean>(W).fill(true));
  const bottom = Array.from({ length: H }, () => Array<boolean>(W).fill(true));
  const seen = Array.from({ length: H }, () => Array<boolean>(W).fill(false));
  const stack: [number, number][] = [[0, 0]];
  seen[0][0] = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const next = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
      .map(([dx, dy]) => [x + dx, y + dy] as const)
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < W && ny < H && !seen[ny][nx]);
    if (!next.length) { stack.pop(); continue; }
    const [nx, ny] = next[Math.floor(random() * next.length)];
    if (nx > x) right[y][x] = false; else if (nx < x) right[y][nx] = false;
    else if (ny > y) bottom[y][x] = false; else bottom[ny][x] = false;
    seen[ny][nx] = true;
    stack.push([nx, ny]);
  }
  // Breadth-first search for the one route through.
  const parent = new Map<number, number>([[0, -1]]);
  const queue = [0];
  while (queue.length) {
    const id = queue.shift()!, x = id % W, y = Math.floor(id / W);
    const moves = [
      x < W - 1 && !right[y][x] ? id + 1 : -1, x > 0 && !right[y][x - 1] ? id - 1 : -1,
      y < H - 1 && !bottom[y][x] ? id + W : -1, y > 0 && !bottom[y - 1][x] ? id - W : -1,
    ];
    for (const move of moves) if (move >= 0 && !parent.has(move)) { parent.set(move, id); queue.push(move); }
  }
  const route: number[] = [];
  for (let id = W * H - 1; id !== -1; id = parent.get(id)!) route.unshift(id);
  return { right, bottom, route };
}

export function MazeArt({ seed }: { seed: string }) {
  const { right, bottom, route } = buildMaze(seed);
  const walls: string[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const px = PAD + x * C, py = PAD + y * C;
    if (right[y][x] && x < W - 1) walls.push(`M${px + C} ${py}v${C}`);
    if (bottom[y][x] && y < H - 1) walls.push(`M${px} ${py + C}h${C}`);
  }
  const w = W * C, h = H * C;
  const frame = `M${PAD} ${PAD + C}V${PAD + h}H${PAD + w}M${PAD + w} ${PAD + h - C}V${PAD}H${PAD}`;
  const centre = (id: number) => `${PAD + (id % W) * C + C / 2} ${PAD + Math.floor(id / W) * C + C / 2}`;
  const routePath = `M${PAD - 10} ${PAD + C / 2}L${route.map(centre).join("L")}L${PAD + w + 10} ${PAD + h - C / 2}`;
  return <svg className="art art-maze" viewBox={`0 0 ${w + PAD * 2} ${h + PAD * 2}`} role="img" aria-label="A generated maze with its single route traced through it">
    <path className="maze-route-ghost" d={routePath} />
    <path className="maze-walls" d={walls.join("") + frame} />
    <path className="maze-route" d={routePath} pathLength={1} />
    <circle className="maze-start" cx={PAD - 10} cy={PAD + C / 2} r={4} />
    <circle className="maze-end" cx={PAD + w + 10} cy={PAD + h - C / 2} r={4} />
  </svg>;
}
