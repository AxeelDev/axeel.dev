import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { getPosts, getProjects, getSettings, getToolGroups } from "@/features/content/repository";
import { ProjectGrid, splitProjects } from "@/features/projects/ProjectGrid";
import { ContourArt } from "@/features/projects/art/ContourArt";
import { PostList } from "@/features/blog/PostList";
import { ToolGroups } from "@/features/tools/ToolGroups";
import { Markdown } from "@/components/Markdown";
import { getDictionary } from "@/lib/i18n/server";
import { fill } from "@/lib/i18n/config";

function SectionHeading({ no, id, title, href, label }: { no: string; id: string; title: string; href?: string; label?: string }) {
  return <div className="section-heading"><span className="section-no" aria-hidden="true">{no}</span><h2 id={id}>{title}</h2><span className="section-rule" aria-hidden="true" />{href && <Link prefetch href={href}>{label}<ArrowRight size={14} aria-hidden="true" /></Link>}</div>;
}

export default async function Home() {
  const [settings, projects, posts, groups, t] = await Promise.all([getSettings(), getProjects(), getPosts(1, 3), getToolGroups(), getDictionary()]);
  const { selected, small } = splitProjects(projects);
  const [greetingBefore, greetingAfter] = t.home.greeting.split("{name}");
  return <>
    <section className="intro" aria-labelledby="intro-title">
      <ContourArt seed={settings.name} levels={9} className="intro-contours" />
      <h1 id="intro-title">{greetingBefore}<em>{settings.first_name}</em>{greetingAfter}<span>.</span></h1>
      <p className="lead">{settings.headline}</p>
      <p>{settings.introduction}</p>
      <div className="intro-links">
        <Link className="button button-primary" href="/projects" prefetch>{t.home.seeWork}<ArrowRight size={15} aria-hidden="true" /></Link>
        <a className="text-link" href="#contact">{t.home.getInTouch}<ArrowDown size={14} aria-hidden="true" /></a>
      </div>
    </section>
    <section className="home-section" aria-labelledby="projects-title"><SectionHeading no="01" id="projects-title" title={t.home.madeTitle} href="/projects" label={t.home.allProjects} /><ProjectGrid projects={selected} t={t.projects} />{small.length > 0 && <Link prefetch className="more-projects" href="/projects#small-title"><span>{small.length === 1 ? t.home.smallerOne : fill(t.home.smallerOther, { count: small.length })}</span>{t.home.smallerNote}<ArrowRight size={14} aria-hidden="true" /></Link>}</section>
    <section className="home-section" aria-labelledby="writing-title"><SectionHeading no="02" id="writing-title" title={t.home.writingTitle} href="/blog" label={t.home.allWriting} /><PostList posts={posts.items} /></section>
    <section className="home-section" aria-labelledby="tools-title"><SectionHeading no="03" id="tools-title" title={t.home.toolsTitle} href="/uses" label={t.home.fullList} /><ToolGroups groups={groups} empty={t.uses.empty} /></section>
    <section className="home-section about-section" aria-labelledby="about-title"><SectionHeading no="04" id="about-title" title={t.home.aboutTitle} /><Markdown>{settings.about}</Markdown></section>
  </>;
}
