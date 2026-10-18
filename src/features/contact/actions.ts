"use server";
import { headers } from "next/headers";
import { contentSource } from "@/lib/env";
import { publicClient } from "@/lib/supabase/server";
import { contactSchema } from "@/features/content/validation";
import { getDictionary } from "@/lib/i18n/server";

// On an error the submitted text comes back, because React clears the form after every action.
export type ContactState = { status: "idle" | "sent" | "error"; message: string; values?: { email: string; message: string } };

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
  const t = (await getDictionary()).contact;
  const startedAt = Number(form.get("started"));
  if (form.get("website") || !startedAt || Date.now() - startedAt < 2500) return { status: "sent", message: t.thanks };
  const values = { email: String(form.get("email") ?? ""), message: String(form.get("message") ?? "") };
  const failed = (message: string): ContactState => ({ status: "error", message, values });
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    // The schema's messages are English; show the visitor's language instead.
    const issue = parsed.error.issues[0];
    return failed(issue?.path[0] === "email" ? t.needEmail : issue?.code === "too_big" ? t.tooLong : issue?.path[0] === "message" ? t.needMessage : t.checkForm);
  }
  const ip = (await headers()).get("cf-connecting-ip") ?? "local";
  if (limited(ip)) return failed(t.rateLimited);
  if (contentSource() === "demo") return failed(t.demo);
  const { error } = await publicClient().from("contact_messages").insert(parsed.data);
  if (error) { console.error("Contact message failed", error.message); return failed(t.failed); }
  return { status: "sent", message: t.thanks };
}
