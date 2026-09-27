import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProject } from "@/features/content/repository";
import { ProjectThumbnail } from "@/features/projects/ProjectThumbnail";
import { Markdown } from "@/components/Markdown";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : { title: "Project not found" };
}
export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug); if (!project) notFound();
  return <article><Link className="back-link" href="/projects"><ArrowLeft size={14} />Projects</Link><header className="page-intro detail-intro"><p className="eyebrow">{project.category}</p><h1>{project.title}<span>.</span></h1><p>{project.summary}</p><div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></header><ProjectThumbnail project={project} priority /><div className="article-body"><Markdown>{project.body}</Markdown></div><div className="detail-links">{project.website_url && <a className="button" href={project.website_url} target="_blank" rel="noreferrer">Visit {project.title}<ArrowUpRight size={15} /></a>}{project.source_url && <a href={project.source_url} target="_blank" rel="noreferrer">Source code<ArrowUpRight size={15} /></a>}</div></article>;
}
