import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, getProjects } from "@/features/content/repository";
import { ProjectArt } from "@/features/projects/art/ProjectArt";
import { statusLabel } from "@/features/projects/status";
import { Markdown } from "@/components/Markdown";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : { title: "Project not found" };
}
export default async function ProjectPage({ params }: Props) {
  const slug = (await params).slug;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]); if (!project) notFound();
  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  return <article>
    <Link className="back-link" href="/projects"><ArrowLeft size={14} />Projects</Link>
    <header className="page-intro detail-intro"><p className="specimen-kicker" data-status={project.status}><span className="status-dot" />{statusLabel[project.status]}<span className="kicker-sep">/</span>{project.category}</p><h1>{project.title}<span>.</span></h1><p>{project.summary}</p></header>
    <div className="detail-figure"><ProjectArt project={project} number={Math.max(index, 0) + 1} preferImage priority /></div>
    <dl className="spec-sheet">
      <div><dt>Status</dt><dd>{statusLabel[project.status]}</dd></div>
      <div><dt>What it is</dt><dd>{project.category}</dd></div>
      {project.stack.length > 0 && <div><dt>Built with</dt><dd>{project.stack.join(", ")}</dd></div>}
      {(project.website_url || project.source_url) && <div><dt>Links</dt><dd className="spec-links">{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">Visit<ArrowUpRight size={13} aria-hidden="true" /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">Source<ArrowUpRight size={13} aria-hidden="true" /></a>}</dd></div>}
    </dl>
    <div className="article-body"><Markdown>{project.body}</Markdown></div>
    {next && <Link className="next-project" href={`/projects/${next.slug}`}><span>Next project</span><strong>{next.title}<ArrowRight size={22} aria-hidden="true" /></strong><em>{next.summary}</em></Link>}
  </article>;
}
