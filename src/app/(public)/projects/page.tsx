import type { Metadata } from "next";
import { getProjects } from "@/features/content/repository";
import { ProjectGrid } from "@/features/projects/ProjectGrid";
export const metadata: Metadata = { title: "Projects" };
export default async function ProjectsPage() {
  return <><header className="page-intro"><p className="eyebrow">Selected work & experiments</p><h1>Things I’m making<span>.</span></h1><p>Some useful, some curious. All a reason to keep building.</p></header><ProjectGrid projects={await getProjects()} /></>;
}
