"use server";
import { headers } from "next/headers";
import { contentSource } from "@/lib/env";
import { publicClient } from "@/lib/supabase/server";
import { contactSchema } from "@/features/content/validation";

export type ContactState = { status: "idle" | "sent" | "error"; message: string };

// A light per-isolate limit; the honeypot and timing check stop most automated posts.
const recent = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), windowStart = now - 10 * 60_000;
  const hits = (recent.get(ip) ?? []).filter((time) => time > windowStart);
  if (hits.length >= 5) return true;
  recent.set(ip, [...hits, now]);
  if (recent.size > 5000) recent.clear();
  return false;
}

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  // Bots fill every field and submit instantly; people don't.
  const startedAt = Number(form.get("started"));
  if (form.get("website") || !startedAt || Date.now() - startedAt < 2500) return { status: "sent", message: "Thanks, I’ll get back to you soon." };
  const parsed = contactSchema.safeParse({ email: form.get("email"), message: form.get("message") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  const ip = (await headers()).get("cf-connecting-ip") ?? "local";
  if (limited(ip)) return { status: "error", message: "That’s a few messages in a row. Try again in a little while." };
  if (contentSource() === "demo") return { status: "error", message: "The form isn’t connected to a database in demo mode." };
  const { error } = await publicClient().from("contact_messages").insert(parsed.data);
  if (error) { console.error("Contact message failed", error.message); return { status: "error", message: "Something went wrong on my side. Please try again." }; }
  return { status: "sent", message: "Thanks, I’ll get back to you soon." };
}
