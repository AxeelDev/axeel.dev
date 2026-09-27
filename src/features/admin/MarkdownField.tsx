"use client";
import { useState } from "react";
import { Markdown } from "@/components/Markdown";

export function MarkdownField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [preview, setPreview] = useState(false);
  return <div><div className="markdown-toolbar"><button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>Write</button><button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>Preview</button></div>
    {preview ? <div className="markdown-preview"><Markdown>{value || "Nothing written yet."}</Markdown></div> : <textarea id={id} className="markdown-input" value={value} onChange={(event) => onChange(event.target.value)} spellCheck />}
  </div>;
}
