import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { deleteMessage } from "@/features/admin/actions";

const format = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Tallinn" });

export default async function MessagesPage() {
  if (!isSupabaseConfigured()) return null;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error("The editor could not load messages.");
  return <>
    <div className="admin-title"><div><h1>Messages</h1><p>{data.length} {data.length === 1 ? "message" : "messages"} from the contact form.</p></div></div>
    <div className="admin-list">{data.map((item) => <article className="message-item" key={item.id}>
      <header><a href={`mailto:${item.email}`}>{item.email}</a><span className="admin-status">{format.format(new Date(item.created_at))}</span></header>
      <p>{item.message}</p>
      <form action={deleteMessage}><input type="hidden" name="id" value={item.id} /><button className="button danger-button" type="submit">Delete</button></form>
    </article>)}</div>
    {!data.length && <p className="empty-note">No messages yet.</p>}
  </>;
}
