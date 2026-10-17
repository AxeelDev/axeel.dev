// Tool names as they appear in project stacks, mapped to the locally generated Simple Icons.
export const stackIcons: Record<string, string> = {
  "Next.js": "nextdotjs", React: "react", TypeScript: "typescript", Astro: "astro", "Tailwind CSS": "tailwindcss",
  Supabase: "supabase", PostgreSQL: "postgresql", Postgres: "postgresql", Drizzle: "drizzle", "Better Auth": "betterauth",
  Stripe: "stripe", Cloudflare: "cloudflare", Vercel: "vercel", Resend: "resend", Godot: "godotengine",
  "Unreal Engine 5": "unrealengine", "Unreal Engine": "unrealengine", "C++": "cplusplus",
  HTML: "html5", CSS: "css", JavaScript: "javascript", Python: "python",
};

// A project stack item's match in your own tool list.
export type StackTool = { icon?: string; url?: string };
