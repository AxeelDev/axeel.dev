import { hashString, round, seeded } from "./random";

// A small topographic map, unique to whatever seed it's given.
export function ContourArt({ seed, levels = 8, label, className = "" }: { seed: string; levels?: number; label?: string; className?: string }) {
  const random = seeded(hashString(seed));
  const waves = Array.from({ length: 4 }, (_, i) => ({ k: i + 2, a: (0.16 - i * 0.03) * (0.6 + random()), phase: random() * Math.PI * 2 }));
  const cx = 200 + (random() - 0.5) * 60, cy = 150 + (random() - 0.5) * 40;
  const lines = Array.from({ length: levels }, (_, level) => {
    const r = 16 + level * (118 / levels);
    const drift = level * 2.2;
    const points = Array.from({ length: 96 }, (_, step) => {
      const t = (step / 96) * Math.PI * 2;
      const wobble = waves.reduce((sum, w) => sum + w.a * Math.sin(w.k * t + w.phase + level * 0.18), 0);
      const radius = r * (1 + wobble);
      return `${round(cx + drift + Math.cos(t) * radius * 1.35)},${round(cy - drift * 0.5 + Math.sin(t) * radius)}`;
    });
    return <polygon key={level} className={level % 4 === 3 ? "contour contour-index" : "contour"} points={points.join(" ")} />;
  });
  return <svg className={`art art-contour ${className}`} viewBox="0 0 400 300" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    {lines}
    <path className="contour-summit" d={`M${round(cx)} ${round(cy - 6)} l5 9 h-10 z`} />
  </svg>;
}
