import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/features/content/repository";
import { PostList } from "@/features/blog/PostList";
import { pageNumber } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
export async function generateMetadata(): Promise<Metadata> { return { title: (await getDictionary()).meta.writing }; }
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageNumber((await searchParams).page), size = 8;
  const [posts, t] = await Promise.all([getPosts(page, size), getDictionary()]);
  return <><header className="page-intro"><h1>{t.blog.title}<span>.</span></h1><p>{t.blog.intro}</p></header><PostList posts={posts.items} /><nav className="pagination" aria-label={t.blog.pages}>{page > 1 && <Link prefetch href={`/blog?page=${page - 1}`}>{t.blog.newer}</Link>}{posts.total > page * size && <Link prefetch href={`/blog?page=${page + 1}`}>{t.blog.older}</Link>}</nav></>;
}
