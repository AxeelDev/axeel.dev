import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, getProjects } from "@/features/content/repository";
import { ProjectShot } from "@/features/projects/ProjectShot";
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
    <Link prefetch className="back-link" href="/projects"><ArrowLeft size={14} />Projects</Link>
    <header className="page-intro detail-intro"><h1>{project.title}<span>.</span></h1><p>{project.summary}</p></header>
    <figure className="detail-figure"><ProjectShot project={project} priority />{project.thumbnail_alt && <figcaption>{project.thumbnail_alt}</figcaption>}</figure>
    <dl className="spec-sheet">
      <div><dt>Status</dt><dd>{statusLabel[project.status]}</dd></div>
      <div><dt>What it is</dt><dd>{project.category}</dd></div>
      {project.period && <div><dt>When</dt><dd>{project.period}</dd></div>}
      {project.stack.length > 0 && <div><dt>Built with</dt><dd>{project.stack.join(", ")}</dd></div>}
      {(project.website_url || project.source_url) && <div><dt>Links</dt><dd className="spec-links">{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">{/steampowered/.test(project.website_url) ? "Steam" : /youtube/.test(project.website_url) ? "Video" : "Visit"}<ArrowUpRight size={13} aria-hidden="true" /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">Source<ArrowUpRight size={13} aria-hidden="true" /></a>}</dd></div>}
    </dl>
    <div className="article-body"><Markdown>{project.body}</Markdown></div>
    {next && <Link prefetch className="next-project" href={`/projects/${next.slug}`}><span>Next project</span><strong>{next.title}<ArrowRight size={22} aria-hidden="true" /></strong><em>{next.summary}</em></Link>}
  </article>;
}
