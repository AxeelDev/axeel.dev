import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "@/features/content/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ProjectShot } from "./ProjectShot";

const linkLabel = (url: string, t: Dictionary["projects"]) => /steampowered/.test(url) ? t.onSteam : /youtube/.test(url) ? t.watch : t.visit;

// Selected work. Every entry opens with its own numbered rule, so the list reads like a contents page.
export function ProjectGrid({ projects, t }: { projects: Project[]; t: Dictionary["projects"] }) {
  if (!projects.length) return <p className="empty-note">{t.empty}</p>;
  let side = 0;
  return <div className="entries">{projects.map((project, index) => {
    const layout = project.featured ? "wide" : side++ % 2 ? "right" : "left";
    const href = `/projects/${project.slug}`;
    return <article className="entry" data-layout={layout} data-status={project.status} key={project.id} aria-labelledby={`entry-${project.slug}`}>
      <div className="entry-rule" aria-hidden="true"><span className="entry-no">{String(index + 1).padStart(2, "0")}<span>/{String(projects.length).padStart(2, "0")}</span></span><span className="entry-line" /><span className="entry-meta">{[project.category, project.period].filter(Boolean).join(" · ")}</span></div>
      <div className="entry-grid">
        <Link prefetch className="entry-figure" href={href} tabIndex={-1} aria-hidden="true"><ProjectShot project={project} placeholderLabel={t.placeholderArt} priority={index === 0} /></Link>
        <div className="entry-text">
          <div className="entry-head">
            <h3 id={`entry-${project.slug}`}><Link prefetch href={href}>{project.title}</Link></h3>
          </div>
          <div className="entry-body">
            <p>{project.summary}</p>
            <ul className="project-stack" aria-label={t.builtWith}>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="project-actions"><Link prefetch href={href}>{t.readMore}<ArrowRight size={14} aria-hidden="true" /></Link>{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">{linkLabel(project.website_url, t)}<ArrowUpRight size={14} aria-hidden="true" /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">{t.source}<ArrowUpRight size={14} aria-hidden="true" /></a>}</div>
          </div>
        </div>
      </div>
    </article>;
  })}</div>;
}

// Smaller things, in a compact index: year, name, what it is, and a small screenshot.
export function ProjectIndex({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return <ol className="index-list">{projects.map((project) => <li key={project.id}>
    <Link prefetch className="index-row" href={`/projects/${project.slug}`}>
      <span className="index-year">{project.period.split(/\s/)[0] || "–"}</span>
      <span className="index-main"><strong>{project.title}</strong><span>{project.summary}</span></span>
      <span className="index-kind">{project.category}</span>
      <span className="index-thumb" aria-hidden="true">{project.thumbnail_url ? <img src={project.thumbnail_url} alt="" loading="lazy" decoding="async" /> : <span>{project.title.slice(0, 1)}</span>}</span>
    </Link>
  </li>)}</ol>;
}

export const splitProjects = (projects: Project[]) => ({
  selected: projects.filter((project) => project.listing !== "small"),
  small: projects.filter((project) => project.listing === "small"),
});
