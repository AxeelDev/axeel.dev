"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="standalone-message"><p className="eyebrow">A small interruption</p><h1>This page couldn’t load.</h1><p>Please try again in a moment.</p><button type="button" className="button" onClick={reset}>Try again</button><a href="/">Go home</a></main>;
}
