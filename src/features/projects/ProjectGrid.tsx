import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "@/features/content/types";
import { ProjectThumbnail } from "./ProjectThumbnail";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="empty-note">There are no published projects yet.</p>;
  return <div className="project-grid">{projects.map((project, index) => <article className={`project-card ${project.featured ? "project-featured" : ""}`} key={project.id}>
    <Link className="project-cover-link" href={`/projects/${project.slug}`} aria-label={`Read about ${project.title}`}><ProjectThumbnail project={project} priority={index === 0} /></Link>
    <div className="project-copy"><div className="project-heading"><h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>{project.featured && <span className="meta">Current focus</span>}</div>
      <p>{project.summary}</p><div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="project-actions"><Link href={`/projects/${project.slug}`}>About the project<ArrowRight size={14} aria-hidden="true" /></Link>{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">Visit<ArrowUpRight size={14} aria-hidden="true" /></a>}</div>
    </div>
  </article>)}</div>;
}
