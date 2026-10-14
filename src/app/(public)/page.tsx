import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { getPosts, getProjects, getSettings, getToolGroups } from "@/features/content/repository";
import { ProjectGrid, splitProjects } from "@/features/projects/ProjectGrid";
import { ContourArt } from "@/features/projects/art/ContourArt";
import { PostList } from "@/features/blog/PostList";
import { ToolGroups } from "@/features/tools/ToolGroups";
import { Markdown } from "@/components/Markdown";

function SectionHeading({ no, id, title, href, label }: { no: string; id: string; title: string; href?: string; label?: string }) {
  return <div className="section-heading"><span className="section-no" aria-hidden="true">{no}</span><h2 id={id}>{title}</h2><span className="section-rule" aria-hidden="true" />{href && <Link prefetch href={href}>{label}<ArrowRight size={14} aria-hidden="true" /></Link>}</div>;
}

export default async function Home() {
  const [settings, projects, posts, groups] = await Promise.all([getSettings(), getProjects(), getPosts(1, 3), getToolGroups()]);
  const { selected, small } = splitProjects(projects);
  return <>
    <section className="intro" aria-labelledby="intro-title">
      <ContourArt seed={settings.name} levels={9} className="intro-contours" />
      <h1 id="intro-title">Hi, I’m <em>{settings.first_name}</em><span>.</span></h1>
      <p className="lead">{settings.headline}</p>
      <p>{settings.introduction}</p>
      <div className="intro-links">
        <Link className="button button-primary" href="/projects" prefetch>See what I’ve made<ArrowRight size={15} aria-hidden="true" /></Link>
        <a className="text-link" href="#contact">Get in touch<ArrowDown size={14} aria-hidden="true" /></a>
      </div>
    </section>
    <section className="home-section" aria-labelledby="projects-title"><SectionHeading no="01" id="projects-title" title="Things I’ve made" href="/projects" label="All projects" /><ProjectGrid projects={selected} />{small.length > 0 && <Link prefetch className="more-projects" href="/projects#small-title"><span>+ {small.length} smaller things</span>One-day builds, experiments, and things I made to learn something<ArrowRight size={14} aria-hidden="true" /></Link>}</section>
    <section className="home-section" aria-labelledby="writing-title"><SectionHeading no="02" id="writing-title" title="From the notebook" href="/blog" label="All writing" /><PostList posts={posts.items} /></section>
    <section className="home-section" aria-labelledby="tools-title"><SectionHeading no="03" id="tools-title" title="What I build with" href="/uses" label="The full list" /><ToolGroups groups={groups} /></section>
    <section className="home-section about-section" aria-labelledby="about-title"><SectionHeading no="04" id="about-title" title="Away from the screen" /><Markdown>{settings.about}</Markdown></section>
  </>;
}
