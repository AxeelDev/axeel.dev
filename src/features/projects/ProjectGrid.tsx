import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "@/features/content/types";
import { ProjectArt } from "./art/ProjectArt";
import { statusLabel } from "./status";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="empty-note">There are no published projects yet.</p>;
  let side = 0;
  return <div className="specimens">{projects.map((project, index) => {
    const layout = project.featured ? "wide" : side++ % 2 ? "right" : "left";
    const href = `/projects/${project.slug}`;
    return <article className="specimen" data-layout={layout} data-status={project.status} key={project.id}>
      <span className="specimen-no" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Link className="specimen-figure" href={href} tabIndex={-1} aria-hidden="true"><ProjectArt project={project} number={index + 1} priority={index === 0} /></Link>
      <div className="specimen-text">
        <div className="specimen-head">
          <p className="specimen-kicker"><span className="status-dot" />{statusLabel[project.status]}<span className="kicker-sep">/</span>{project.category}</p>
          <h3><Link href={href}>{project.title}</Link></h3>
        </div>
        <div className="specimen-body">
          <p>{project.summary}</p>
          <ul className="project-stack" aria-label="Built with">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="project-actions"><Link href={href}>Read the notes<ArrowRight size={14} aria-hidden="true" /></Link>{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">Visit {project.title}<ArrowUpRight size={14} aria-hidden="true" /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">Source<ArrowUpRight size={14} aria-hidden="true" /></a>}</div>
        </div>
      </div>
    </article>;
  })}</div>;
}
