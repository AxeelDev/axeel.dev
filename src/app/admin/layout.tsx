import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminNav } from "@/features/admin/AdminNav";
import { SetupNotice } from "@/features/admin/SetupNotice";
import { signOut } from "@/features/admin/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Editor", robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  if (!await getAdmin()) redirect("/login");
  return <div className="admin-shell"><header className="admin-header"><Link className="wordmark" href="/">ax.</Link><div><Link href="/" target="_blank">View site ↗</Link><ThemeToggle /><form action={signOut}><button className="button" type="submit">Sign out</button></form></div></header><AdminNav /><main>{children}</main></div>;
}
