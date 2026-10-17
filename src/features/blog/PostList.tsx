import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/features/content/types";
import { formatDate, readingTime } from "@/lib/format";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export async function PostList({ posts }: { posts: Post[] }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  if (!posts.length) return <p className="empty-note">{t.blog.empty}</p>;
  return <div className="post-list">{posts.map((post) => <article className="post-row" key={post.id}>
    <span className="post-margin"><time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at, locale, t.blog.draft)}</time><span>{readingTime(post.body, t.blog.readingTime)}</span></span>
    <div>
      <h3><Link prefetch href={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={17} aria-hidden="true" /></Link></h3><p>{post.excerpt}</p>
    </div>{post.cover_url && <Link prefetch className="post-thumb" href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><img src={post.cover_url} alt="" loading="lazy" /></Link>}
  </article>)}</div>;
}
