import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { resourceConfig } from "@/features/admin/config";
import { collectionSchema } from "@/features/content/validation";
import { ContentEditor } from "@/features/admin/ContentEditor";
import { pageNumber } from "@/lib/format";
export default async function CollectionPage({ params, searchParams }: { params: Promise<{ collection: string }>; searchParams: Promise<{ page?: string }> }) {
  if (!isSupabaseConfigured()) return null;
  const parsed = collectionSchema.safeParse((await params).collection); if (!parsed.success) notFound();
  const collection = parsed.data, config = resourceConfig[collection];
  const { supabase } = await requireAdmin();
  if (collection === "settings") {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error || !data) throw new Error("The profile is missing. Apply supabase/seed.sql.");
    const initial = Object.fromEntries(config.fields.map((field) => [field.key, data[field.key as keyof typeof data]]));
    return <><div className="admin-title"><div><h1>Profile</h1><p>The introduction, personal details, and social links on your site.</p></div></div><ContentEditor collection="settings" id="1" initial={initial} updatedAt={data.updated_at} groups={[]} /></>;
  }
  const page = pageNumber((await searchParams).page), size = 20;
  const query = supabase.from(config.table).select("*", { count: "exact" });
  const { data, error, count } = await (collection === "posts" ? query.order("created_at", { ascending: false }) : query.order("sort_order")).order("id").range((page - 1) * size, page * size - 1);
  if (error) throw new Error("The editor could not load this collection.");
  return <><div className="admin-title"><div><h1>{config.title}</h1><p>{count ?? 0} {(count ?? 0) === 1 ? "item" : "items"}. Drafts are visible only in the editor.</p></div><Link className="button button-primary" href={`/admin/${collection}/new`}>Add {config.singular}</Link></div><div className="admin-list">{(data ?? []).map((item) => <Link className="admin-list-item" href={`/admin/${collection}/${item.id}`} key={item.id}><div><strong>{"title" in item ? item.title : "name" in item ? item.name : "label" in item ? item.label : "Profile"}</strong>{"summary" in item && <span>{item.summary}</span>}{"excerpt" in item && <span>{item.excerpt}</span>}{"notes" in item && <span>{item.notes}</span>}</div><span className="admin-status">{"published" in item && item.published ? "published_at" in item && item.published_at && new Date(item.published_at) > new Date() ? "Scheduled" : "Published" : "Draft"} ↗</span></Link>)}</div>{!data?.length && <p className="empty-note">No items here yet.</p>}<nav className="pagination" aria-label="Editor pages">{page > 1 && <Link href={`/admin/${collection}?page=${page - 1}`}>← Previous</Link>}{(count ?? 0) > page * size && <Link href={`/admin/${collection}?page=${page + 1}`}>Next →</Link>}</nav></>;
}
