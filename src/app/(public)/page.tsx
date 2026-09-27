import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPosts, getProjects, getSettings, getToolGroups } from "@/features/content/repository";
import { ProjectGrid } from "@/features/projects/ProjectGrid";
import { PostList } from "@/features/blog/PostList";
import { ToolGroups } from "@/features/tools/ToolGroups";
import { Markdown } from "@/components/Markdown";

export default async function Home() {
  const [settings, projects, posts, groups] = await Promise.all([getSettings(), getProjects(), getPosts(1, 2), getToolGroups()]);
  return <>
    <section className="intro" aria-labelledby="intro-title"><p className="eyebrow">A developer in {settings.location}</p><h1 id="intro-title">Hi, I’m {settings.first_name}<span>.</span></h1><p className="lead">{settings.headline}</p><p>{settings.introduction}</p></section>
    <section className="home-section" aria-labelledby="projects-title"><div className="section-heading"><h2 id="projects-title">Things I’m making</h2><Link href="/projects">All projects<ArrowRight size={14} aria-hidden="true" /></Link></div><ProjectGrid projects={projects.slice(0, 3)} /></section>
    <section className="home-section" aria-labelledby="writing-title"><div className="section-heading"><h2 id="writing-title">From the notebook</h2><Link href="/blog">All writing<ArrowRight size={14} aria-hidden="true" /></Link></div><PostList posts={posts.items} /></section>
    <section className="home-section" aria-labelledby="tools-title"><div className="section-heading"><h2 id="tools-title">A few things I use</h2><Link href="/uses">The full list<ArrowRight size={14} aria-hidden="true" /></Link></div><ToolGroups groups={groups} /></section>
    <section className="home-section about-section" aria-labelledby="about-title"><div className="section-heading"><h2 id="about-title">Away from the screen</h2></div><Markdown>{settings.about}</Markdown></section>
  </>;
}
