"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { sessionClient } from "@/lib/supabase/server";
import { collectionSchema, loginSchema, schemas, recordIdSchema } from "@/features/content/validation";
import { resourceConfig } from "./config";

export type SaveResult = { ok: true; id: string; updatedAt: string } | { ok: false; message: string; errors?: Record<string, string> };

function refreshContent() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}
function databaseMessage(error: { code?: string; message: string }) {
  if (error.code === "23505") return "That URL slug is already in use. Choose another one.";
  if (error.code === "23503") return "This group still contains tools. Move or delete those tools first.";
  if (error.code === "42501") return "Your account does not have permission to make this change.";
  console.error("Editor write failed", error.code, error.message);
  return "The change could not be saved. Please try again.";
}

export async function saveContent(collectionInput: string, id: string | null, values: unknown, expectedVersion: string | null): Promise<SaveResult> {
  try {
    const { supabase } = await requireAdmin();
    const collection = collectionSchema.parse(collectionInput);
    const parsed = schemas[collection].safeParse(values);
    if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", errors: Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])) };
    const table = resourceConfig[collection].table;
    const key = collection === "settings" ? 1 : id ? recordIdSchema.parse(id) : null;
    if (id || collection === "settings") {
      if (!expectedVersion || !z.iso.datetime({ offset: true }).safeParse(expectedVersion).success) return { ok: false, message: "Reload this item before saving." };
      const { data, error } = await supabase.from(table).update(parsed.data).eq("id", key!).eq("updated_at", expectedVersion).select("id, updated_at").maybeSingle();
      if (error) return { ok: false, message: databaseMessage(error) };
      if (!data) return { ok: false, message: "This item changed elsewhere or was removed. Reload before saving so you don’t overwrite newer work." };
      refreshContent(); return { ok: true, id: String(data.id), updatedAt: data.updated_at };
    }
    // Each branch retains the table's TypeScript insert shape.
    const inserted = collection === "projects" ? await supabase.from("projects").insert(schemas.projects.parse(values)).select("id, updated_at").single()
      : collection === "posts" ? await supabase.from("posts").insert(schemas.posts.parse(values)).select("id, updated_at").single()
      : collection === "tools" ? await supabase.from("tools").insert(schemas.tools.parse(values)).select("id, updated_at").single()
      : await supabase.from("tool_groups").insert(schemas["tool-groups"].parse(values)).select("id, updated_at").single();
    if (inserted.error || !inserted.data) return { ok: false, message: databaseMessage(inserted.error ?? { message: "No record returned" }) };
    refreshContent(); return { ok: true, id: inserted.data.id, updatedAt: inserted.data.updated_at };
  } catch (error) {
    return { ok: false, message: error instanceof z.ZodError ? "The submitted item is invalid." : "Your session may have expired. Sign in again, then retry." };
  }
}

export async function deleteContent(collectionInput: string, id: string, expectedVersion: string): Promise<{ ok: boolean; message: string }> {
  try {
    const { supabase } = await requireAdmin();
    const collection = collectionSchema.parse(collectionInput);
    if (collection === "settings") return { ok: false, message: "The site profile cannot be deleted." };
    recordIdSchema.parse(id); z.iso.datetime({ offset: true }).parse(expectedVersion);
    const { data, error } = await supabase.from(resourceConfig[collection].table).delete().eq("id", id).eq("updated_at", expectedVersion).select("id");
    if (error) return { ok: false, message: databaseMessage(error) };
    if (!data?.length) return { ok: false, message: "This item changed. Reload before deleting it." };
    refreshContent(); return { ok: true, message: "Deleted." };
  } catch { return { ok: false, message: "Your session may have expired. Sign in again." }; }
}

export async function signIn(_: { error: string }, form: FormData): Promise<{ error: string }> {
  const input = loginSchema.safeParse({ email: String(form.get("email") ?? "").trim(), password: String(form.get("password") ?? "") });
  if (!input.success) return { error: "Enter a valid email address and password." };
  const client = await sessionClient();
  const { data, error } = await client.auth.signInWithPassword(input.data);
  if (error || !data.user) return { error: "Sign-in failed. Check your details and try again." };
  const { data: membership, error: membershipError } = await client.from("portfolio_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (membershipError || !membership) { await client.auth.signOut(); return { error: "This account does not have access to the editor." }; }
  redirect("/admin/projects");
}

export async function signOut() {
  const client = await sessionClient(); await client.auth.signOut(); redirect("/login");
}
