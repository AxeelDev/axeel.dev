import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";
export default async function NotFound() {
  const t = (await getDictionary()).notFound;
  return <main className="standalone-message"><h1>{t.title}</h1><p>{t.text}</p><Link className="button" href="/">{t.back}</Link></main>;
}
