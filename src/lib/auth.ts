import "server-only";
import { cache } from "react";
import { sessionClient } from "@/lib/supabase/server";

export const getAdmin = cache(async () => {
  const supabase = await sessionClient();
  // Contact Auth rather than trusting a session decoded from a cookie.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data, error: membershipError } = await supabase.from("portfolio_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (membershipError || !data) return null;
  return { user, supabase };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Your editor session is missing or you do not have access. Sign in again.");
  return admin;
}
