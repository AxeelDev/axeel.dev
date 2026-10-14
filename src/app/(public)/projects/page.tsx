import type { Metadata } from "next";
import { getProjects } from "@/features/content/repository";
import { ProjectGrid, ProjectIndex, splitProjects } from "@/features/projects/ProjectGrid";
export const metadata: Metadata = { title: "Projects" };
export default async function ProjectsPage() {
  const { selected, small } = splitProjects(await getProjects());
  return <>
    <header className="page-intro"><h1>Things I’ve made<span>.</span></h1><p>The bigger projects first. Further down are the smaller ones: one-day builds, experiments, and things I made just to learn something.</p></header>
    <ProjectGrid projects={selected} />
    {small.length > 0 && <section className="home-section" aria-labelledby="small-title"><div className="section-heading"><span className="section-no" aria-hidden="true">+</span><h2 id="small-title">Smaller things</h2><span className="section-rule" aria-hidden="true" /></div><ProjectIndex projects={small} /></section>}
  </>;
}
