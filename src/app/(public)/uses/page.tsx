import type { Metadata } from "next";
import { getToolGroups } from "@/features/content/repository";
import { ToolGroups } from "@/features/tools/ToolGroups";
export const metadata: Metadata = { title: "Uses" };
export default async function UsesPage() {
  return <><header className="page-intro"><p className="eyebrow">The everyday setup</p><h1>Things I use<span>.</span></h1><p>The tools and applications that find their way into my work.</p></header><ToolGroups groups={await getToolGroups()} detailed /></>;
}
