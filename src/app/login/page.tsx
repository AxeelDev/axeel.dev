import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "@/features/admin/LoginForm";
import { SetupNotice } from "@/features/admin/SetupNotice";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default async function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  if (await getAdmin()) redirect("/admin/projects");
  return <main className="login-card"><Link className="wordmark" href="/" aria-label="Axel, home">ax.</Link><h1>Back to the editor.</h1><p>Sign in with your editor account.</p><LoginForm /></main>;
}
