import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getPosts, getProjects, getSettings, getToolGroups } from "@/features/content/repository";
import { ProjectGrid } from "@/features/projects/ProjectGrid";
import { ContourArt } from "@/features/projects/art/ContourArt";
import { PostList } from "@/features/blog/PostList";
import { ToolGroups } from "@/features/tools/ToolGroups";
import { Markdown } from "@/components/Markdown";
import { LocalTime } from "@/components/LocalTime";

function SectionHeading({ no, id, title, href, label }: { no: string; id: string; title: string; href?: string; label?: string }) {
  return <div className="section-heading"><span className="section-no" aria-hidden="true">{no}</span><h2 id={id}>{title}</h2><span className="section-rule" aria-hidden="true" />{href && <Link href={href}>{label}<ArrowRight size={14} aria-hidden="true" /></Link>}</div>;
}

export default async function Home() {
  const [settings, projects, posts, groups] = await Promise.all([getSettings(), getProjects(), getPosts(1, 3), getToolGroups()]);
  const focus = projects.find((project) => project.featured) ?? projects[0];
  return <>
    <section className="intro" aria-labelledby="intro-title">
      <ContourArt seed={settings.name} levels={9} className="intro-contours" />
      <p className="intro-status">
        <span className="status-dot" />
        {focus ? <>Building <Link href={`/projects/${focus.slug}`}>{focus.title}</Link></> : "Building things"}
        <span className="kicker-sep">/</span><LocalTime /> in {settings.location}
      </p>
      <h1 id="intro-title">Hi, I’m <em>{settings.first_name}</em><span>.</span></h1>
      <p className="lead">{settings.headline}</p>
      <p>{settings.introduction}</p>
      <div className="intro-links">
        <Link className="button button-primary" href="/projects">See what I’m making<ArrowRight size={15} aria-hidden="true" /></Link>
        {settings.github_url && <a className="text-link" href={settings.github_url} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} aria-hidden="true" /></a>}
      </div>
    </section>
    <section className="home-section" aria-labelledby="projects-title"><SectionHeading no="01" id="projects-title" title="Things I’m making" href="/projects" label="All projects" /><ProjectGrid projects={projects.slice(0, 3)} /></section>
    <section className="home-section" aria-labelledby="writing-title"><SectionHeading no="02" id="writing-title" title="From the notebook" href="/blog" label="All writing" /><PostList posts={posts.items} /></section>
    <section className="home-section" aria-labelledby="tools-title"><SectionHeading no="03" id="tools-title" title="What I build with" href="/uses" label="The full list" /><ToolGroups groups={groups} /></section>
    <section className="home-section about-section" aria-labelledby="about-title"><SectionHeading no="04" id="about-title" title="Away from the screen" /><Markdown>{settings.about}</Markdown></section>
  </>;
}
