import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/features/content/types";
import { formatDate, readingTime } from "@/lib/format";

export function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p className="empty-note">Nothing published here yet. More soon.</p>;
  return <div className="post-list">{posts.map((post) => <article className="post-row" key={post.id}>
    <span className="post-margin"><time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time><span>{readingTime(post.body)}</span></span>
    <div>
      <h3><Link prefetch href={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={17} aria-hidden="true" /></Link></h3><p>{post.excerpt}</p>
    </div>{post.cover_url && <Link prefetch className="post-thumb" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><img src={post.cover_url} alt="" loading="lazy" /></Link>}
  </article>)}</div>;
}
