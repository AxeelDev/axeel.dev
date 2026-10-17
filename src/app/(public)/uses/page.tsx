import type { Metadata } from "next";
import { getToolGroups } from "@/features/content/repository";
import { ToolGroups } from "@/features/tools/ToolGroups";
import { getDictionary } from "@/lib/i18n/server";
export async function generateMetadata(): Promise<Metadata> { return { title: (await getDictionary()).meta.uses }; }
export default async function UsesPage() {
  const [groups, t] = await Promise.all([getToolGroups(), getDictionary()]);
  return <><header className="page-intro"><h1>{t.uses.title}<span>.</span></h1><p>{t.uses.intro}</p></header><ToolGroups groups={groups} empty={t.uses.empty} detailed /></>;
}
