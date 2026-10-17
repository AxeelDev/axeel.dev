import { getDictionary } from "@/lib/i18n/server";

export default async function Loading() {
  const label = (await getDictionary()).loading;
  return <div className="route-loading" role="status" aria-label={label}><span className="wordmark" aria-hidden="true">ax.</span><span className="loading-rule" /><span className="sr-only">{label}…</span></div>;
}
