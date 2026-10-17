import type { Metadata } from "next";
import { getProjects } from "@/features/content/repository";
import { ProjectGrid, ProjectIndex, splitProjects } from "@/features/projects/ProjectGrid";
import { getDictionary } from "@/lib/i18n/server";
export async function generateMetadata(): Promise<Metadata> { return { title: (await getDictionary()).meta.projects }; }
export default async function ProjectsPage() {
  const [projects, t] = await Promise.all([getProjects(), getDictionary()]);
  const { selected, small } = splitProjects(projects);
  return <>
    <header className="page-intro"><h1>{t.projects.title}<span>.</span></h1><p>{t.projects.intro}</p></header>
    <ProjectGrid projects={selected} t={t.projects} />
    {small.length > 0 && <section className="home-section" aria-labelledby="small-title"><div className="section-heading"><span className="section-no" aria-hidden="true">+</span><h2 id="small-title">{t.projects.smallerTitle}</h2><span className="section-rule" aria-hidden="true" /></div><ProjectIndex projects={small} /></section>}
  </>;
}
