"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || "Anonymous", email, message }),
    });
    setSending(false);
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  const inputClass =
    "w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet";

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-5">
      <h3 className="font-display text-lg font-bold text-white">Send a Message</h3>
      <input
        placeholder="Name (or leave blank for anonymous)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <textarea
        required
        rows={4}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-r8 bg-gradient-to-br from-violet to-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {sending ? "Sending..." : sent ? "Sent ✓" : "Send Message"}
      </button>
    </form>
  );
}
