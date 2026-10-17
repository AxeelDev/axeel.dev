import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, getProjects, getStackTools } from "@/features/content/repository";
import { ProjectShot } from "@/features/projects/ProjectShot";
import { ProjectGallery } from "@/features/projects/ProjectGallery";
import { StackChips } from "@/features/projects/StackChips";
import { getDictionary } from "@/lib/i18n/server";
import { Markdown } from "@/components/Markdown";
type Props = { params: Promise<{ slug: string }> };
// The first sentence of a lesson reads as its headline.
function lessonParts(lesson: string) {
  const split = lesson.search(/[.!?]\s/);
  if (split < 0) return <strong>{lesson}</strong>;
  return <><strong>{lesson.slice(0, split + 1)}</strong> {lesson.slice(split + 2)}</>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : { title: (await getDictionary()).meta.projectNotFound };
}
export default async function ProjectPage({ params }: Props) {
  const slug = (await params).slug;
  const [project, projects, t] = await Promise.all([getProject(slug), getProjects(), getDictionary()]); if (!project) notFound();
  const tools = await getStackTools(project.stack);
  const index = projects.findIndex((item) => item.id === project.id);
  const lessons = project.lessons.split("\n").map((line) => line.trim()).filter(Boolean);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  return <article>
    <Link prefetch className="back-link" href="/projects"><ArrowLeft size={14} />{t.projects.back}</Link>
    <header className="page-intro detail-intro"><h1>{project.title}<span>.</span></h1><p>{project.summary}</p></header>
    <figure className="detail-figure"><ProjectGallery labels={t.gallery} main={<ProjectShot project={project} placeholderLabel={t.projects.placeholderArt} priority />} images={[...(project.thumbnail_url ? [{ src: project.thumbnail_url, alt: project.thumbnail_alt || project.title }] : []), ...project.gallery]} caption={project.thumbnail_alt} /></figure>
    <dl className="spec-sheet">
      <div><dt>{t.projects.status}</dt><dd>{t.projects.statuses[project.status]}</dd></div>
      <div><dt>{t.projects.whatItIs}</dt><dd>{project.category}</dd></div>
      {project.period && <div><dt>{t.projects.when}</dt><dd>{project.period}</dd></div>}
      {project.stack.length > 0 && <div className="spec-wide"><dt>{t.projects.builtWith}</dt><dd><StackChips items={project.stack} tools={tools} /></dd></div>}
      {(project.website_url || project.source_url) && <div><dt>{t.projects.links}</dt><dd className="spec-links">{project.website_url && <a href={project.website_url} target="_blank" rel="noreferrer">{/steampowered/.test(project.website_url) ? t.projects.steam : /youtube/.test(project.website_url) ? t.projects.video : t.projects.visit}<ArrowUpRight size={13} aria-hidden="true" /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">{t.projects.source}<ArrowUpRight size={13} aria-hidden="true" /></a>}</dd></div>}
    </dl>
    <div className="article-body"><Markdown>{project.body}</Markdown></div>
    {lessons.length > 0 && <section className="lessons" aria-labelledby="lessons-title"><h2 id="lessons-title">{t.projects.learned}</h2><ol>{lessons.map((lesson, i) => <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{lessonParts(lesson)}</p></li>)}</ol></section>}
    {next && <Link prefetch className="next-project" href={`/projects/${next.slug}`}><span>{t.projects.next}</span><strong>{next.title}<ArrowRight size={22} aria-hidden="true" /></strong><em>{next.summary}</em></Link>}
  </article>;
}
