"use client";

import { useEffect, useState } from "react";
import type { ContactMessage, ChatMessage } from "@/lib/generated/prisma/client";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);

  function load() {
    fetch("/api/contact").then((r) => r.json()).then((d) => setMessages(d.messages ?? []));
    fetch("/api/chat").then((r) => r.json()).then((d) => setChat(d.messages ?? []));
  }

  useEffect(load, []);

  async function markRead(id: string, isRead: boolean) {
    await fetch(`/api/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    load();
  }

  async function deleteMessage(id: string) {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-white">Messages</h1>

      <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-dim">
        Contact Form ({messages.length})
      </h2>
      <div className="mb-8 space-y-2">
        {messages.length === 0 && (
          <div className="font-mono text-sm text-text-muted">{"// No messages yet"}</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`card p-3 ${m.isRead ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-text">
                {m.name} <span className="text-text-dim">— {m.email}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markRead(m.id, !m.isRead)}
                  className="text-xs text-cyan2"
                >
                  {m.isRead ? "Mark unread" : "Mark read"}
                </button>
                <button onClick={() => deleteMessage(m.id)} className="text-xs text-red">
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-1 text-sm text-text-muted">{m.message}</div>
            <div className="mt-1 font-mono text-[0.6rem] text-text-dim">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 font-mono text-xs uppercase tracking-wider text-text-dim">
        Live Chat History ({chat.length})
      </h2>
      <div className="card max-h-96 space-y-1.5 overflow-y-auto p-3">
        {chat.length === 0 && (
          <div className="font-mono text-sm text-text-muted">{"// No chat messages yet"}</div>
        )}
        {chat.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="font-mono text-xs text-violet2">{c.authorName}</span>{" "}
            <span className="text-text-muted">{c.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
