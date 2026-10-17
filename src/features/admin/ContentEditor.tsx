"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Collection } from "@/features/content/types";
import { resourceConfig } from "./config";
import { deleteContent, saveContent } from "./actions";
import { MediaField } from "./MediaField";
import { IconPicker } from "./IconPicker";
import { MarkdownField } from "./MarkdownField";
import { isTranslatable, type Translations } from "@/features/content/translations";
import { localeNames, translatedLocales, type Locale, type TranslatedLocale } from "@/lib/i18n/config";

function dateInput(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value); if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function ContentEditor({ collection, id, initial, updatedAt, groups }: {
  collection: Collection; id: string | null; initial: Record<string, unknown>; updatedAt: string | null; groups: { id: string; label: string }[];
}) {
  const config = resourceConfig[collection], router = useRouter();
  const [values, setValues] = useState(initial), [version, setVersion] = useState(updatedAt);
  const [dirty, setDirty] = useState(false), [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({}), [failed, setFailed] = useState(false), [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false), [lang, setLang] = useState<Locale>("en");
  const translations = (values.translations ?? {}) as Translations;
  const translationKey = (key: string) => key === "gallery" ? "gallery_alts" : key;
  const translatable = config.fields.filter((field) => isTranslatable(collection, translationKey(field.key)));
  useEffect(() => { if (!dirty) return; const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  function change(key: string, value: unknown) { setValues((old) => ({ ...old, [key]: value })); setDirty(true); setMessage(""); setErrors((old) => ({ ...old, [key]: "" })); }
  function changeTranslation(locale: TranslatedLocale, key: string, value: string) {
    setValues((old) => { const current = (old.translations ?? {}) as Translations; return { ...old, translations: { ...current, [locale]: { ...current[locale], [key]: value } } }; });
    setDirty(true); setMessage(""); setErrors((old) => ({ ...old, [`translations.${locale}.${key}`]: "" }));
  }
  // Estonian and German versions of the text fields. Everything else is shared by all languages.
  function translationField(locale: TranslatedLocale, field: (typeof config.fields)[number]) {
    const key = translationKey(field.key), fieldId = `field-${locale}-${key}`, errorKey = `translations.${locale}.${key}`, value = translations[locale]?.[key] ?? "";
    const english = field.key === "gallery" ? (Array.isArray(values.gallery) ? (values.gallery as { alt: string }[]).map((image) => image.alt).join("\n") : "") : String(values[field.key] ?? "");
    const shared = { id: fieldId, lang: locale, "aria-invalid": Boolean(errors[errorKey]), "aria-describedby": errors[errorKey] ? `${fieldId}-error` : undefined };
    return <div className={`field ${field.wide || field.type === "gallery" ? "field-wide" : ""}`} key={fieldId}>
      <label htmlFor={fieldId}>{field.key === "gallery" ? "Screenshot descriptions" : field.label}</label>
      {field.type === "markdown" ? <MarkdownField id={fieldId} value={value} onChange={(text) => changeTranslation(locale, key, text)} />
        : field.type === "textarea" || field.type === "gallery" ? <textarea {...shared} rows={field.type === "gallery" ? 4 : undefined} maxLength={field.maxLength} placeholder={english} value={value} onChange={(event) => changeTranslation(locale, key, event.target.value)} />
        : <input {...shared} maxLength={field.maxLength} placeholder={english} value={value} onChange={(event) => changeTranslation(locale, key, event.target.value)} />}
      <small>{field.key === "gallery" ? "One per line, in the same order as the screenshots. " : ""}{english ? `English: ${english.length > 160 ? `${english.slice(0, 160)}…` : english}` : "The English field is empty."}</small>
      {errors[errorKey] && <small id={`${fieldId}-error`} role="alert" style={{ color: "var(--danger)" }}>{errors[errorKey]}</small>}
    </div>;
  }
  return <form className="editor-form" onSubmit={(event) => {
    event.preventDefault(); setMessage(""); setErrors({}); setFailed(false);
    startTransition(async () => {
      const result = await saveContent(collection, id, values, version);
      if (!result.ok) { setMessage(result.message); setErrors(result.errors ?? {}); setFailed(true); return; }
      setDirty(false); setVersion(result.updatedAt); setMessage("Saved.");
      if (!id && collection !== "settings") router.replace(`/admin/${collection}/${result.id}`);
      else router.refresh();
    });
  }}>
    {translatable.length > 0 && <div className="field field-wide editor-languages" role="group" aria-label="Language">
      {(["en", ...translatedLocales] as Locale[]).map((locale) => <button key={locale} type="button" className="button" aria-pressed={lang === locale} onClick={() => setLang(locale)}>{localeNames[locale]}{locale !== "en" && Object.keys(errors).some((key) => key.startsWith(`translations.${locale}.`) && errors[key]) ? " •" : ""}</button>)}
      <small>{lang === "en" ? "Estonian and German versions are optional. Empty fields show the English text." : `Only text is translated. Leave a field empty to show the English version. Everything else is shared by all languages.`}</small>
    </div>}
    {lang !== "en" && translatable.map((field) => translationField(lang as TranslatedLocale, field))}
    {lang === "en" && config.fields.map((field) => {
      const fieldId = `field-${field.key}`, value = values[field.key];
      const shared = { id: fieldId, required: field.required, "aria-invalid": Boolean(errors[field.key]), "aria-describedby": errors[field.key] ? `${fieldId}-error` : undefined };
      return <div className={`field ${field.wide ? "field-wide" : ""} ${field.type === "checkbox" ? "field-checkbox" : ""}`} key={field.key}>
        {field.type !== "checkbox" && <label htmlFor={fieldId}>{field.label}{field.required ? " *" : ""}</label>}
        {field.type === "image" ? <MediaField id={fieldId} value={value as string | null} onChange={(value) => change(field.key, value)} />
          : field.type === "icon" ? <IconPicker id={fieldId} value={value as string | null} onChange={(value) => change(field.key, value)} />
          : field.type === "markdown" ? <MarkdownField id={fieldId} value={String(value ?? "")} onChange={(value) => change(field.key, value)} />
          : field.type === "textarea" ? <textarea {...shared} maxLength={field.maxLength} value={String(value ?? "")} onChange={(event) => change(field.key, event.target.value)} />
          : field.type === "checkbox" ? <><input {...shared} type="checkbox" checked={Boolean(value)} onChange={(event) => change(field.key, event.target.checked)} /><label htmlFor={fieldId}>{field.label}</label></>
          : field.type === "group" ? <select {...shared} value={String(value ?? "")} onChange={(event) => change(field.key, event.target.value)}><option value="">Choose a group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}</select>
          : field.type === "select" ? <select {...shared} value={String(value ?? "")} onChange={(event) => change(field.key, event.target.value)}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          : field.type === "datetime" ? <input {...shared} type="datetime-local" value={dateInput(value)} onChange={(event) => change(field.key, event.target.value ? new Date(event.target.value).toISOString() : null)} />
          : field.type === "gallery" ? <textarea {...shared} rows={5} className="markdown-input" placeholder="/projects/example-2.jpg | The settings page" defaultValue={Array.isArray(value) ? (value as { src: string; alt: string }[]).map((image) => `${image.src} | ${image.alt}`).join("\n") : ""} onChange={(event) => change(field.key, event.target.value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [src, ...alt] = line.split("|"); return { src: src.trim(), alt: alt.join("|").trim() }; }))} />
          : field.type === "list" ? <input {...shared} value={Array.isArray(value) ? value.join(", ") : ""} onChange={(event) => change(field.key, event.target.value.split(",").map((s) => s.trimStart()))} onBlur={() => change(field.key, Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [])} />
          : <input {...shared} type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"} min={field.type === "number" ? 0 : undefined} max={field.type === "number" ? 100000 : undefined} maxLength={field.maxLength} value={String(value ?? "")} onChange={(event) => change(field.key, field.type === "number" ? Number(event.target.value) : field.type === "url" ? event.target.value || null : event.target.value)} />}
        {field.help && <small>{field.help}</small>}{errors[field.key] && <small id={`${fieldId}-error`} role="alert" style={{ color: "var(--danger)" }}>{errors[field.key]}</small>}
      </div>;
    })}
    {message && <p className={`feedback ${failed ? "feedback-error" : ""}`} role={failed ? "alert" : "status"}>{message}</p>}
    <div className="editor-actions"><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button><Link className="button" href={`/admin/${collection}`}>Back to list</Link>
      {id && collection !== "settings" && <button className="button danger-button" type="button" disabled={pending} onClick={() => setConfirmDelete(!confirmDelete)}>{confirmDelete ? "Keep this item" : "Delete item"}</button>}
    </div>
    {confirmDelete && <div className="feedback field-wide"><p>Delete this {config.singular}? This removes its database record. Uploaded images remain in Storage.</p><button className="button danger-button" type="button" disabled={pending} onClick={() => startTransition(async () => { if (!id || !version) return; const result = await deleteContent(collection, id, version); if (!result.ok) { setMessage(result.message); setFailed(true); return; } setDirty(false); router.push(`/admin/${collection}`); router.refresh(); })}>Yes, delete this {config.singular}</button></div>}
  </form>;
}
