import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/features/content/repository";
import { Markdown } from "@/components/Markdown";
import { formatDate, readingTime } from "@/lib/format";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Post not found" };
}
export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug); if (!post) notFound();
  return <article><Link className="back-link" href="/blog"><ArrowLeft size={14} />All writing</Link><header className="page-intro detail-intro"><p className="post-meta">{formatDate(post.published_at)}<span>{readingTime(post.body)}</span></p><h1>{post.title}</h1><p>{post.excerpt}</p>{post.tags.length > 0 && <div className="project-stack">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</header>{post.cover_url && <img className="article-cover" src={post.cover_url} alt={post.cover_alt} />}<div className="article-body"><Markdown>{post.body}</Markdown></div></article>;
}
