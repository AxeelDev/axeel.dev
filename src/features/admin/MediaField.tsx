"use client";
import { useRef, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { validateUpload } from "@/features/content/validation";

export function MediaField({ id, value, onChange }: { id: string; value: string | null; onChange: (value: string | null) => void }) {
  const [uploading, setUploading] = useState(false), [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(file: File) {
    const invalid = validateUpload(file); if (invalid) { setError(invalid); return; }
    setError(""); setUploading(true);
    try {
      const client = browserClient();
      const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
      const path = `images/${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage.from("portfolio-media").upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (error) throw error;
      onChange(client.storage.from("portfolio-media").getPublicUrl(path).data.publicUrl);
    } catch { setError("Upload failed. Check your connection, editor access, and Storage setup."); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  }
  return <div className="media-field"><input id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value || null)} placeholder="https://… or /image.webp" aria-describedby={`${id}-upload-help`} />
    {value && <img className="media-preview" src={value} alt="Selected image preview" />}
    <div className="media-actions"><input ref={input} type="file" aria-label="Upload image" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />{value && <button type="button" className="button" onClick={() => onChange(null)}>Clear image</button>}</div>
    <small id={`${id}-upload-help`}>{uploading ? "Uploading…" : "JPEG, PNG, WebP, or AVIF · up to 5 MB. Save the item to keep its image link."}</small>{error && <p className="feedback feedback-error" role="alert">{error}</p>}
  </div>;
}
