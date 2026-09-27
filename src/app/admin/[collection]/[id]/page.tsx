import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { collectionSchema, recordIdSchema } from "@/features/content/validation";
import { resourceConfig } from "@/features/admin/config";
import { ContentEditor } from "@/features/admin/ContentEditor";
export default async function EditorPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  if (!isSupabaseConfigured()) return null;
  const route = await params, parsed = collectionSchema.safeParse(route.collection); if (!parsed.success) notFound();
  const collection = parsed.data, config = resourceConfig[collection];
  if (collection === "settings") redirect("/admin/settings");
  const fresh = route.id === "new"; if (!fresh && !recordIdSchema.safeParse(route.id).success) notFound();
  const { supabase } = await requireAdmin();
  const groups = collection === "tools" ? await supabase.from("tool_groups").select("id,label").order("sort_order") : { data: [], error: null };
  if (groups.error) throw new Error("Tool groups could not be loaded.");
  let initial = config.defaults, updatedAt: string | null = null;
  if (!fresh) {
    const { data, error } = await supabase.from(config.table).select("*").eq("id", route.id).maybeSingle();
    if (error) throw new Error("This item could not be loaded."); if (!data) notFound();
    initial = Object.fromEntries(config.fields.map((field) => [field.key, data[field.key as keyof typeof data]])); updatedAt = data.updated_at;
  }
  return <><Link className="back-link" href={`/admin/${collection}`}>← {config.title}</Link><div className="admin-title"><div><h1>{fresh ? "New" : "Edit"} {config.singular}</h1><p>Save as a draft, or publish when it’s ready.</p></div></div><ContentEditor key={route.id} collection={collection} id={fresh ? null : route.id} initial={initial} updatedAt={updatedAt} groups={groups.data ?? []} /></>;
}
