// Tool names as they appear in project stacks, mapped to the locally generated Simple Icons.
const icons: Record<string, string> = {
  "Next.js": "nextdotjs", React: "react", TypeScript: "typescript", Astro: "astro", "Tailwind CSS": "tailwindcss",
  Supabase: "supabase", PostgreSQL: "postgresql", Postgres: "postgresql", Drizzle: "drizzle", "Better Auth": "betterauth",
  Stripe: "stripe", Cloudflare: "cloudflare", Vercel: "vercel", Resend: "resend", Godot: "godotengine",
  "Unreal Engine 5": "unrealengine", "Unreal Engine": "unrealengine", "C++": "cplusplus",
  HTML: "html5", CSS: "css", JavaScript: "javascript", Python: "python",
};

export function StackChips({ items }: { items: string[] }) {
  return <ul className="stack-chips">{items.map((item) => {
    const icon = icons[item];
    return <li key={item}><span className="tool-icon" aria-hidden="true">{icon ? <img src={`/icons/${icon}.svg`} alt="" width={15} height={15} loading="lazy" /> : <span>{item.slice(0, 1)}</span>}</span>{item}</li>;
  })}</ul>;
}
