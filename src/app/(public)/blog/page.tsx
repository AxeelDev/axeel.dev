import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/features/content/repository";
import { PostList } from "@/features/blog/PostList";
import { pageNumber } from "@/lib/format";
export const metadata: Metadata = { title: "Writing" };
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageNumber((await searchParams).page), size = 8;
  const posts = await getPosts(page, size);
  return <><header className="page-intro"><p className="eyebrow">Notes along the way</p><h1>The notebook<span>.</span></h1><p>Things I’m working on, figuring out, or just want to remember.</p></header><PostList posts={posts.items} /><nav className="pagination" aria-label="Blog pages">{page > 1 && <Link href={`/blog?page=${page - 1}`}>← Newer</Link>}{posts.total > page * size && <Link href={`/blog?page=${page + 1}`}>Older →</Link>}</nav></>;
}
