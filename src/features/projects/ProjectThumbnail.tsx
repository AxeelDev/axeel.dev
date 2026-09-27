import type { Project } from "@/features/content/types";

export function ProjectThumbnail({ project, priority = false }: { project: Project; priority?: boolean }) {
  return <div className="project-thumbnail" data-tone={project.sort_order % 3}>
    {project.thumbnail_url ? <img src={project.thumbnail_url} alt={project.thumbnail_alt || project.title} loading={priority ? "eager" : "lazy"} decoding="async" /> :
      <div className="thumbnail-placeholder" aria-label={`${project.title} thumbnail placeholder`}>
        <span className="cover-category">{project.category}</span>
        <span className="cover-name">{project.title}<span>.</span></span>
        <span className="cover-note">{project.featured ? "Currently building" : "An ongoing experiment"}<span>↗</span></span>
      </div>}
  </div>;
}
