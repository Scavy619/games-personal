"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/generated/prisma/client";

export function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [author, setAuthor] = useState("Anonymous");
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  function load() {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    if (!text.trim()) return;
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: author || "Anonymous", message: text }),
    });
    setText("");
    load();
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">Anonymous Chat</h3>
        <span className="badge badge-green">● LIVE</span>
      </div>
      <div
        ref={scrollRef}
        className="mb-3 flex h-[340px] flex-col gap-2 overflow-y-auto rounded-r8 border border-border bg-surface2 p-3"
      >
        {messages.length === 0 && (
          <span className="font-mono text-xs text-text-dim">{"// say hi!"}</span>
        )}
        {messages.map((m) => (
          <div key={m.id}>
            <div className="font-mono text-[0.6rem] text-violet2">{m.authorName}</div>
            <div className="text-sm text-text">{m.message}</div>
            <div className="text-right font-mono text-[0.55rem] text-text-dim">
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-24 rounded-r8 border border-border bg-surface2 px-2 py-2 text-xs text-text outline-none focus:border-violet"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message..."
          className="flex-1 rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet"
        />
        <button
          onClick={send}
          className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-4 text-sm font-semibold text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
