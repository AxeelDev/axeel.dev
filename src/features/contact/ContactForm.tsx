"use client";
import { useActionState, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { sendMessage, type ContactState } from "./actions";

export type ContactLabels = { message: string; placeholder: string; email: string; send: string; sending: string };

export function ContactForm({ labels }: { labels: ContactLabels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle", message: "" });
  const [started, setStarted] = useState(0);
  useEffect(() => setStarted(Date.now()), []);
  if (state.status === "sent") return <p className="contact-done" role="status">{state.message}</p>;
  return <form className="contact-form" action={action}>
    <div className="contact-field">
      <label htmlFor="contact-email">{labels.email}</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required defaultValue={state.values?.email} />
    </div>
    <div className="contact-field">
      <label htmlFor="contact-message">{labels.message}</label>
      <textarea id="contact-message" name="message" placeholder={labels.placeholder} rows={4} maxLength={5000} required defaultValue={state.values?.message} />
    </div>
    <div className="contact-foot">
      {state.status === "error" ? <p className="contact-error" role="alert">{state.message}</p> : <span />}
      <button className="button button-primary" type="submit" disabled={pending}>{pending ? labels.sending : labels.send}<ArrowRight size={15} aria-hidden="true" /></button>
    </div>
    <input className="contact-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <input type="hidden" name="started" value={started} />
  </form>;
}
