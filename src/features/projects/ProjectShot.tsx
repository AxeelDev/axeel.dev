import type { Project } from "@/features/content/types";
import { fill } from "@/lib/i18n/config";
import { ContourArt } from "./art/ContourArt";

const host = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; } };

// The real screenshot, in a thin frame. Websites get a small address bar so the domain is visible at a glance.
export function ProjectShot({ project, placeholderLabel = "A contour map standing in for a {title} screenshot", priority = false }: { project: Project; placeholderLabel?: string; priority?: boolean }) {
  if (!project.thumbnail_url) return <div className="shot shot-empty"><ContourArt seed={project.slug} label={fill(placeholderLabel, { title: project.title })} /></div>;
  const domain = project.website_url && !/steampowered|youtube/.test(project.website_url) ? host(project.website_url) : null;
  return <div className="shot" data-kind={domain ? "site" : "plain"}>
    {domain && <div className="shot-bar" aria-hidden="true"><span className="shot-dots"><i /><i /><i /></span><span className="shot-url">{domain}</span></div>}
    <img src={project.thumbnail_url} alt={project.thumbnail_alt || project.title} loading={priority ? "eager" : "lazy"} decoding="async" />
  </div>;
}
